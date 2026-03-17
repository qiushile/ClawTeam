/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
  * Reply dispatcher factory for the Feishu/Lark channel plugin.
 *
  * Creates a reply dispatcher that integrates typing-indicator reactions,
  * markdown card rendering, and text chunking to deliver
  * agent responses back to the user.
 */
import { createReplyPrefixContext, createTypingCallbacks, logTypingFailure, SILENT_REPLY_TOKEN, } from "openclaw/plugin-sdk";
import { getLarkAccount } from "../core/accounts.js";
import { resolveFooterConfig } from "../core/footer-config.js";
import { LarkClient } from "../core/lark-client.js";
import { trace } from "../core/trace.js";
import { sendMessageFeishu, sendMarkdownCardFeishu, sendCardFeishu, updateCardFeishu, } from "../messaging/outbound/send.js";
import { createCardEntity, sendCardByCardId, streamCardContent, updateCardKitCard, setCardStreamingMode, } from "./cardkit.js";
import { buildCardContent, splitReasoningText, stripReasoningTags, STREAMING_ELEMENT_ID, toCardKit2, } from "./builder.js";
import { addTypingIndicator, removeTypingIndicator, } from "../messaging/outbound/typing.js";
import { optimizeMarkdownStyle } from "./markdown-style.js";
import { extractLarkApiCode, getMessageUnavailableState, isMessageUnavailable, isMessageUnavailableError, isTerminalMessageApiCode, markMessageUnavailable, } from "../messaging/message-unavailable.js";
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * Resolve the effective reply mode based on configuration and chat type.
 *
 * Priority: replyMode.{scene} > replyMode.default > replyMode (string) > "auto"
 */
function resolveReplyMode(params) {
    const { feishuCfg, chatType } = params;
    // streaming 布尔总开关：仅 true 时允许流式，未设置或 false 一律 static
    const streamingFlag = feishuCfg?.streaming;
    if (streamingFlag !== true)
        return "static";
    const replyMode = feishuCfg?.replyMode;
    if (!replyMode)
        return "auto";
    if (typeof replyMode === "string")
        return replyMode;
    // Object form: pick scene-specific value
    const sceneMode = chatType === "group"
        ? replyMode.group
        : chatType === "p2p"
            ? replyMode.direct
            : undefined;
    return sceneMode ?? replyMode.default ?? "auto";
}
/**
 * Detect whether the text contains markdown elements that benefit from
 * being rendered inside a Feishu interactive card (fenced code blocks or
 * markdown tables).
 */
function shouldUseCard(text) {
    // Fenced code blocks
    if (/```[\s\S]*?```/.test(text)) {
        return true;
    }
    // Markdown tables (header + separator rows separated by pipes)
    if (/\|.+\|[\r\n]+\|[-:| ]+\|/.test(text)) {
        return true;
    }
    return false;
}
export function createFeishuReplyDispatcher(params) {
    const core = LarkClient.runtime;
    const { cfg, agentId, chatId, replyToMessageId, accountId, replyInThread } = params;
    // Resolve account so we can read per-account config (e.g. replyMode)
    const account = getLarkAccount(cfg, accountId);
    const prefixContext = createReplyPrefixContext({ cfg, agentId });
    // ---- Typing indicator (reaction-based) ----
    let typingState = null;
    let typingStopped = false;
    const typingCallbacks = createTypingCallbacks({
        // Feishu emoji reactions are persistent (they stay until explicitly removed),
        // so there is no need for keepalive loops to re-add them periodically.
        // The SDK's outer createTypingController also has a 6s keepalive that
        // repeatedly calls onReplyStart → start(); guard against that here.
        keepaliveIntervalMs: 0,
        start: async () => {
            if (shouldSkipForUnavailable("typing.start.precheck")) {
                return;
            }
            if (!replyToMessageId || typingStopped || params.skipTyping) {
                return;
            }
            // Already have an active typing indicator — skip re-add.
            if (typingState?.reactionId) {
                return;
            }
            typingState = await addTypingIndicator({
                cfg,
                messageId: replyToMessageId,
                accountId,
            });
            if (shouldSkipForUnavailable("typing.start.postcheck")) {
                return;
            }
            // Guard against TOCTOU race: stop() may have been called while the
            // addTypingIndicator API call was in flight (e.g. AI returned NO_REPLY
            // instantly). In that case stop() found typingState===null and could not
            // remove the indicator. Clean it up here now that we have the state.
            if (typingStopped && typingState) {
                await removeTypingIndicator({ cfg, state: typingState, accountId });
                typingState = null;
                params.runtime.log?.(`feishu[${account.accountId}]: removed typing indicator (raced with stop)`);
                return;
            }
            params.runtime.log?.(`feishu[${account.accountId}]: added typing indicator reaction`);
        },
        stop: async () => {
            typingStopped = true;
            if (!typingState) {
                return;
            }
            await removeTypingIndicator({ cfg, state: typingState, accountId });
            typingState = null;
            params.runtime.log?.(`feishu[${account.accountId}]: removed typing indicator reaction`);
        },
        onStartError: (err) => {
            logTypingFailure({
                log: (message) => params.runtime.log?.(message),
                channel: "feishu",
                action: "start",
                error: err,
            });
        },
        onStopError: (err) => {
            logTypingFailure({
                log: (message) => params.runtime.log?.(message),
                channel: "feishu",
                action: "stop",
                error: err,
            });
        },
    });
    // ---- Chunk & render settings ----
    const textChunkLimit = core.channel.text.resolveTextChunkLimit(cfg, "feishu", accountId, { fallbackLimit: 4000 });
    const chunkMode = core.channel.text.resolveChunkMode(cfg, "feishu");
    const tableMode = core.channel.text.resolveMarkdownTableMode({
        cfg,
        channel: "feishu",
    });
    // ---- Reply mode resolution ----
    const feishuCfg = account.config;
    const resolvedFooter = resolveFooterConfig(feishuCfg?.footer);
    const chatType = params.chatType;
    const effectiveReplyMode = resolveReplyMode({ feishuCfg, chatType });
    // "auto" expands based on streaming flag:
    //   streaming === true  → group=static, direct=streaming (旧行为)
    //   streaming 未设置    → 全 static (新默认)
    const streamingFlag = feishuCfg?.streaming;
    const replyMode = effectiveReplyMode === "auto"
        ? streamingFlag === true
            ? chatType === "group"
                ? "static"
                : "streaming"
            : "static"
        : effectiveReplyMode;
    const useStreamingCards = replyMode === "streaming";
    // ---- Block streaming for static mode ----
    // 仅在静态模式下启用 blockStreaming，使工具调用期间的文字立即输出。
    // 流式卡片模式已有 onPartialReply 实时更新，不需要 blockStreaming。
    const blockStreamingConfig = feishuCfg?.blockStreaming;
    const enableBlockStreaming = blockStreamingConfig === true && !useStreamingCards;
    params.runtime.log?.(`feishu[${account.accountId}]: replyMode=${effectiveReplyMode} -> ${replyMode} (chatType=${chatType})`);
    let cardMessageId = null;
    let cardCreationFailed = false;
    let cardCreationPromise = null;
    let accumulatedText = "";
    let lastCardUpdateTime = 0;
    let dispatchFullyComplete = false; // markFullyComplete() 后才允许 onIdle 终态化
    let completedText = ""; // deliver() 累积的权威文本（用于最终卡片）
    let streamingPrefix = ""; // 前几段回复的已提交流式文本
    let lastPartialText = ""; // 当前回复的 onPartialReply 文本
    let flushInProgress = false; // mutex to prevent concurrent flushes
    let flushResolvers = []; // resolvers waiting for flush completion
    let cardCompleted = false; // guard against duplicate onIdle calls
    let aborted = false; // set ONLY by abortCard(), checked in deliver()
    // Reasoning / thinking state
    let accumulatedReasoningText = "";
    let reasoningStartTime = null;
    let reasoningElapsedMs = 0;
    let isReasoningPhase = false;
    // CardKit cardElement.content() is designed for streaming — low throttle.
    // im.message.patch has strict rate limits ("Update the single messages too
    // frequently" / code 230020) — needs a much higher interval.
    const CARDKIT_THROTTLE_MS = 100;
    const PATCH_THROTTLE_MS = 1500;
    /** After a long idle gap (tool call / LLM thinking), defer the first
     *  flush briefly so we accumulate enough chars for a meaningful update
     *  instead of sending only 1-2 characters. */
    const LONG_GAP_THRESHOLD_MS = 2000;
    const BATCH_AFTER_GAP_MS = 300;
    const EMPTY_REPLY_FALLBACK_TEXT = "Done.";
    // ---- CardKit streaming state ----
    // When available, the CardKit `cardElement.content()` API provides
    // native typewriter animation instead of full card replacement.
    let cardKitCardId = null;
    let originalCardKitCardId = null;
    let cardKitSequence = 0;
    let pendingFlushTimer = null;
    let terminatedByUnavailable = false;
    const dispatchStartTime = Date.now();
    const terminateDueToUnavailable = (source, err) => {
        if (terminatedByUnavailable)
            return true;
        const fromError = isMessageUnavailableError(err) ? err : undefined;
        const state = getMessageUnavailableState(replyToMessageId) ??
            getMessageUnavailableState(cardMessageId ?? undefined);
        let apiCode = fromError?.apiCode ?? state?.apiCode;
        if (!apiCode && err) {
            const detectedCode = extractLarkApiCode(err);
            if (isTerminalMessageApiCode(detectedCode)) {
                const fallbackMessageId = replyToMessageId ?? cardMessageId ?? undefined;
                if (fallbackMessageId) {
                    markMessageUnavailable({
                        messageId: fallbackMessageId,
                        apiCode: detectedCode,
                        operation: source,
                    });
                }
                apiCode = detectedCode;
            }
        }
        if (!apiCode)
            return false;
        terminatedByUnavailable = true;
        aborted = true;
        cardCompleted = true;
        if (pendingFlushTimer) {
            clearTimeout(pendingFlushTimer);
            pendingFlushTimer = null;
        }
        const affectedMessageId = fromError?.messageId ??
            replyToMessageId ??
            cardMessageId ??
            "unknown";
        params.runtime.log?.(`feishu[${account.accountId}]: stop reply pipeline due to unavailable message (source=${source}, code=${apiCode}, messageId=${affectedMessageId})`);
        trace.warn(`reply pipeline terminated by unavailable message (source=${source}, code=${apiCode}, messageId=${affectedMessageId})`);
        return true;
    };
    const shouldSkipForUnavailable = (source) => {
        if (terminatedByUnavailable)
            return true;
        if (!replyToMessageId)
            return false;
        if (!isMessageUnavailable(replyToMessageId))
            return false;
        return terminateDueToUnavailable(source);
    };
    const thinkingCardJson = {
        schema: "2.0",
        config: {
            streaming_mode: true,
            summary: { content: "思考中..." },
        },
        body: {
            elements: [
                {
                    tag: "markdown",
                    content: "",
                    text_align: "left",
                    text_size: "normal_v2",
                    margin: "0px 0px 0px 0px",
                    element_id: STREAMING_ELEMENT_ID,
                },
                {
                    tag: "markdown",
                    content: " ",
                    icon: {
                        tag: "custom_icon",
                        img_key: "img_v3_02vb_496bec09-4b43-4773-ad6b-0cdd103cd2bg",
                        size: "16px 16px",
                    },
                    element_id: "loading_icon",
                },
            ],
        },
    };
    /**
     * Lazily create the thinking card. Safe to call from any hook — the
     * first caller triggers creation, subsequent callers await the same
     * promise. This eliminates race conditions between onReplyStart,
     * deliver, and onPartialReply.
     */
    const ensureCardCreated = async () => {
        if (shouldSkipForUnavailable("ensureCardCreated.precheck"))
            return;
        if (!useStreamingCards || cardMessageId || cardCreationFailed || cardCompleted)
            return;
        if (cardCreationPromise) {
            await cardCreationPromise;
            return;
        }
        cardCreationPromise = (async () => {
            try {
                const thinkingCard = buildCardContent("thinking");
                // --- CardKit streaming flow (per official docs) ---
                // 1. Create card entity via cardkit API → get card_id
                // 2. Send IM message referencing card_id
                // 3. Stream via cardElement.content()
                try {
                    // Step 1: Create card entity
                    const cId = await createCardEntity({
                        cfg,
                        card: thinkingCardJson,
                        accountId,
                    });
                    if (cId) {
                        cardKitCardId = cId;
                        originalCardKitCardId = cId;
                        cardKitSequence = 1;
                        params.runtime.log?.(`feishu[${account.accountId}]: created CardKit entity (card_id=${cardKitCardId}, initial cardKitSequence=${cardKitSequence})`);
                        trace.info(`card entity created (card_id=${cardKitCardId}, initial cardKitSequence=${cardKitSequence})`);
                        // Step 2: Send IM message referencing card_id
                        const result = await sendCardByCardId({
                            cfg,
                            to: chatId,
                            cardId: cardKitCardId,
                            replyToMessageId,
                            replyInThread,
                            accountId,
                        });
                        cardMessageId = result.messageId;
                        params.runtime.log?.(`feishu[${account.accountId}]: sent CardKit card ${cardMessageId}`);
                        trace.info(`card message sent (msg_id=${cardMessageId})`);
                    }
                    else {
                        throw new Error("card.create returned empty card_id");
                    }
                }
                catch (cardKitErr) {
                    if (terminateDueToUnavailable("ensureCardCreated.cardkitFlow", cardKitErr)) {
                        return;
                    }
                    // CardKit flow failed — fall back to regular IM card
                    const apiDetail = cardKitErr?.response?.data
                        ? JSON.stringify(cardKitErr.response.data)
                        : String(cardKitErr);
                    params.runtime.log?.(`feishu[${account.accountId}]: CardKit flow failed, falling back to IM: ${apiDetail}`);
                    trace.warn(`card creation failed, fallback to IM: ${apiDetail}`);
                    cardKitCardId = null;
                    const fallbackCard = buildCardContent("thinking");
                    const result = await sendCardFeishu({
                        cfg,
                        to: chatId,
                        card: fallbackCard,
                        replyToMessageId,
                        replyInThread,
                        accountId,
                    });
                    cardMessageId = result.messageId;
                    params.runtime.log?.(`feishu[${account.accountId}]: sent fallback IM card ${cardMessageId}`);
                }
            }
            catch (err) {
                if (terminateDueToUnavailable("ensureCardCreated.outer", err)) {
                    return;
                }
                params.runtime.log?.(`feishu[${account.accountId}]: thinking card failed, falling back to static: ${String(err)}`);
                cardCreationFailed = true;
            }
        })();
        await cardCreationPromise;
    };
    /** Await completion of any in-progress flush (prevents sequence races). */
    const waitForFlush = () => {
        if (!flushInProgress)
            return Promise.resolve();
        return new Promise(resolve => flushResolvers.push(resolve));
    };
    /**
     * Push the current accumulated text to the streaming card.
     *
     * When a CardKit card_id is available, uses the `cardElement.content()`
     * API which provides native typewriter animation.  Otherwise falls back
     * to full card replacement via `im.message.patch`.
     */
    let needsReflush = false;
    const flushCardUpdate = async () => {
        if (!cardMessageId || flushInProgress || cardCompleted) {
            if (flushInProgress && !cardCompleted)
                needsReflush = true;
            return;
        }
        flushInProgress = true;
        needsReflush = false;
        trace.debug(`flushCardUpdate: enter, seq=${cardKitSequence}, isCardKit=${!!cardKitCardId}`);
        // Update timestamp BEFORE the API call to prevent concurrent callers
        // from also entering the flush (race condition fix).
        lastCardUpdateTime = Date.now();
        try {
            let displayText;
            if (isReasoningPhase && accumulatedReasoningText) {
                // Reasoning phase: show reasoning content with thinking header
                const reasoningDisplay = `💭 **Thinking...**\n\n${accumulatedReasoningText}`;
                displayText = accumulatedText
                    ? accumulatedText + "\n\n" + reasoningDisplay
                    : reasoningDisplay;
            }
            else {
                // Answer phase: show answer content
                displayText = accumulatedText;
            }
            if (cardKitCardId) {
                // CardKit streaming — typewriter effect
                const prevSeq = cardKitSequence;
                cardKitSequence += 1;
                trace.debug(`flushCardUpdate: seq ${prevSeq} -> ${cardKitSequence}`);
                await streamCardContent({
                    cfg,
                    cardId: cardKitCardId,
                    elementId: STREAMING_ELEMENT_ID,
                    content: optimizeMarkdownStyle(displayText),
                    sequence: cardKitSequence,
                    accountId,
                });
            }
            else {
                trace.debug(`flushCardUpdate: IM patch fallback`);
                // Fallback — full card replacement via im.message.patch
                const card = buildCardContent("streaming", {
                    text: isReasoningPhase ? "" : displayText,
                    reasoningText: isReasoningPhase
                        ? accumulatedReasoningText
                        : undefined,
                });
                await updateCardFeishu({
                    cfg,
                    messageId: cardMessageId,
                    card: card,
                    accountId,
                });
            }
            lastCardUpdateTime = Date.now();
        }
        catch (err) {
            if (terminateDueToUnavailable("flushCardUpdate", err)) {
                return;
            }
            const apiCode = err?.response?.data?.code;
            if (apiCode === 230020) {
                // Rate limited — silently skip this update; the next scheduled
                // flush will pick up the latest accumulatedText.
                trace.info(`flushCardUpdate: rate limited (230020), skipping, cardKitSequence=${cardKitSequence}`);
                return;
            }
            // Extract Feishu API error details from Axios response
            const apiDetail = err?.response?.data
                ? JSON.stringify(err.response.data)
                : String(err);
            params.runtime.log?.(`feishu[${account.accountId}]: streaming card update failed (apiCode=${apiCode}, cardKitSequence=${cardKitSequence}): ${apiDetail}`);
            trace.error(`card stream update failed (apiCode=${apiCode}, seq=${cardKitSequence}): ${apiDetail}`);
            // If CardKit streaming fails, disable it so subsequent updates
            // fall back to im.message.patch automatically.
            if (cardKitCardId) {
                params.runtime.log?.(`feishu[${account.accountId}]: disabling CardKit streaming, falling back to im.message.patch`);
                cardKitCardId = null;
            }
        }
        finally {
            flushInProgress = false;
            const resolvers = flushResolvers;
            flushResolvers = [];
            for (const resolve of resolvers)
                resolve();
            // If onPartialReply events arrived while the API call was in flight,
            // their flushCardUpdate() calls were no-ops (flushInProgress guard).
            // Schedule an immediate follow-up flush so the accumulated text is
            // not stuck showing only the first character until the next event.
            if (needsReflush && !pendingFlushTimer) {
                needsReflush = false;
                pendingFlushTimer = setTimeout(() => {
                    pendingFlushTimer = null;
                    flushCardUpdate();
                }, 0);
            }
        }
    };
    /**
     * Throttled card update with deferred flush. If called within the
     * throttle window, schedules a deferred update so the latest text
     * is always shown shortly after the window expires — no updates
     * are silently dropped.
     */
    const throttledCardUpdate = async () => {
        if (shouldSkipForUnavailable("throttledCardUpdate"))
            return;
        if (!cardMessageId)
            return;
        const throttleMs = cardKitCardId ? CARDKIT_THROTTLE_MS : PATCH_THROTTLE_MS;
        const now = Date.now();
        const elapsed = now - lastCardUpdateTime;
        if (elapsed >= throttleMs) {
            if (pendingFlushTimer) {
                clearTimeout(pendingFlushTimer);
                pendingFlushTimer = null;
            }
            if (elapsed > LONG_GAP_THRESHOLD_MS) {
                // After a long gap (tool call / LLM thinking), batch briefly so
                // the first visible update contains meaningful text rather than
                // just 1-2 characters.
                pendingFlushTimer = setTimeout(() => {
                    pendingFlushTimer = null;
                    flushCardUpdate();
                }, BATCH_AFTER_GAP_MS);
            }
            else {
                // Normal streaming — flush immediately
                await flushCardUpdate();
            }
        }
        else if (!pendingFlushTimer) {
            // Inside throttle window — schedule a deferred flush
            const delay = throttleMs - elapsed;
            pendingFlushTimer = setTimeout(() => {
                pendingFlushTimer = null;
                flushCardUpdate();
            }, delay);
        }
        // If a deferred flush is already scheduled, do nothing — it will
        // pick up the latest accumulatedText when it fires.
    };
    // ---- Build dispatcher ----
    const { dispatcher, replyOptions, markDispatchIdle } = core.channel.reply.createReplyDispatcherWithTyping({
        responsePrefix: prefixContext.responsePrefix,
        responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
        humanDelay: core.channel.reply.resolveHumanDelayConfig(cfg, agentId),
        onReplyStart: async () => {
            if (shouldSkipForUnavailable("onReplyStart")) {
                return;
            }
            // 流式模式也先用 typing indicator 反馈用户；
            // 卡片延迟到 onPartialReply 确认非 NO_REPLY 后再创建。
            await typingCallbacks.onReplyStart?.();
        },
        deliver: async (payload) => {
            params.runtime.log?.(`feishu[${account.accountId}] deliver called: text=${payload.text?.slice(0, 100)}`);
            if (shouldSkipForUnavailable("deliver.entry")) {
                return;
            }
            // ---- Abort guard ----
            // Only skip delivery when explicitly aborted. Do NOT check
            // cardCompleted here — it is also set by onIdle during normal
            // multi-deliver flows and would block legitimate late deliveries.
            if (aborted) {
                params.runtime.log?.(`feishu[${account.accountId}] deliver: skipped (aborted)`);
                return;
            }
            // ---- Post-dispatch guard ----
            // After dispatchReplyFromConfig() returns and markFullyComplete()
            // is called, the SDK may still drain queued deliver callbacks
            // (e.g. multi-profile timeout fallback). In static reply mode
            // each deliver() directly sends a message, so we must block
            // these stale calls to prevent duplicate messages.
            if (dispatchFullyComplete) {
                params.runtime.log?.(`feishu[${account.accountId}] deliver: skipped (dispatch already complete)`);
                return;
            }
            const text = payload.text ?? "";
            if (!text.trim()) {
                params.runtime.log?.(`feishu[${account.accountId}] deliver: empty text, skipping`);
                return;
            }
            // Ensure the streaming card exists (lazy init)
            if (useStreamingCards) {
                await ensureCardCreated();
                if (terminatedByUnavailable) {
                    return;
                }
            }
            // ---- Streaming card mode ----
            if (useStreamingCards && cardMessageId) {
                // Split payload into reasoning vs answer using the same logic as
                // the framework's splitTelegramReasoningText().
                // In "reasoning on" mode the framework sends two deliver calls:
                //   1. "Reasoning:\n_thinking content_"  → reasoningText only
                //   2. The actual answer text             → answerText only
                const split = splitReasoningText(text);
                if (split.reasoningText && !split.answerText) {
                    // Pure reasoning payload — capture it and show on screen
                    // immediately so the user sees the thinking content right away.
                    reasoningElapsedMs = reasoningStartTime
                        ? Date.now() - reasoningStartTime
                        : 0;
                    accumulatedReasoningText = split.reasoningText;
                    isReasoningPhase = true;
                    await throttledCardUpdate();
                    return;
                }
                // Answer payload (may also contain inline reasoning from tags)
                isReasoningPhase = false;
                if (split.reasoningText) {
                    accumulatedReasoningText = split.reasoningText;
                }
                const answerText = split.answerText ?? text;
                // 累积 deliver 文本用于最终卡片
                completedText += (completedText ? "\n\n" : "") + answerText;
                trace.debug(`deliver: completedTextLen=${completedText.length}`);
                // 没有流式数据时，用 deliver 文本显示在卡片上
                if (!lastPartialText && !streamingPrefix) {
                    accumulatedText += (accumulatedText ? "\n\n" : "") + answerText;
                    streamingPrefix = accumulatedText;
                    await throttledCardUpdate();
                }
                return;
            }
            // ---- Static delivery ----
            const useCard = shouldUseCard(text);
            if (useCard) {
                // Card mode: render markdown inside an interactive card
                const chunks = core.channel.text.chunkTextWithMode(text, textChunkLimit, chunkMode);
                params.runtime.log?.(`feishu[${account.accountId}] deliver: sending ${chunks.length} card chunks to ${chatId}`);
                for (const chunk of chunks) {
                    try {
                        await sendMarkdownCardFeishu({
                            cfg,
                            to: chatId,
                            text: chunk,
                            replyToMessageId,
                            replyInThread,
                            accountId,
                        });
                    }
                    catch (err) {
                        if (terminateDueToUnavailable("deliver.cardChunk", err)) {
                            return;
                        }
                        throw err;
                    }
                }
            }
            else {
                // Raw mode: convert markdown tables and send as plain text
                const converted = core.channel.text.convertMarkdownTables(text, tableMode);
                const chunks = core.channel.text.chunkTextWithMode(converted, textChunkLimit, chunkMode);
                params.runtime.log?.(`feishu[${account.accountId}] deliver: sending ${chunks.length} text chunks to ${chatId}`);
                for (const chunk of chunks) {
                    try {
                        await sendMessageFeishu({
                            cfg,
                            to: chatId,
                            text: chunk,
                            replyToMessageId,
                            replyInThread,
                            accountId,
                        });
                    }
                    catch (err) {
                        if (terminateDueToUnavailable("deliver.textChunk", err)) {
                            return;
                        }
                        throw err;
                    }
                }
            }
        },
        onError: async (err, info) => {
            if (terminateDueToUnavailable("onError", err)) {
                typingCallbacks.onIdle?.();
                return;
            }
            params.runtime.error?.(`feishu[${account.accountId}] ${info.kind} reply failed: ${String(err)}`);
            trace.error(`reply error (${info.kind}): ${String(err)}`);
            // Mark as completed to prevent onIdle/onCleanup from overwriting
            // the error card.
            cardCompleted = true;
            // Cancel any pending streaming flush before error update
            if (pendingFlushTimer) {
                clearTimeout(pendingFlushTimer);
                pendingFlushTimer = null;
            }
            // Wait for any in-progress flush to complete to avoid
            // concurrent CardKit API calls with out-of-order sequences.
            await waitForFlush();
            // Wait for card creation to complete (may still be pending)
            if (cardCreationPromise)
                await cardCreationPromise;
            // Update card to show error state if streaming card is active
            const errorEffectiveCardId = cardKitCardId ?? originalCardKitCardId;
            if (useStreamingCards && cardMessageId) {
                try {
                    const errorText = accumulatedText
                        ? `${accumulatedText}\n\n---\n**Error**: An error occurred while generating the response.`
                        : "**Error**: An error occurred while generating the response.";
                    const errorCard = buildCardContent("complete", {
                        text: errorText,
                        reasoningText: accumulatedReasoningText || undefined,
                        reasoningElapsedMs: reasoningElapsedMs || undefined,
                        elapsedMs: trace.elapsed(),
                        isError: true,
                        footer: resolvedFooter,
                    });
                    if (errorEffectiveCardId) {
                        // Close streaming mode first
                        const seqBeforeClose = cardKitSequence;
                        cardKitSequence += 1;
                        trace.info(`onError: closing streaming mode, seq ${seqBeforeClose} -> ${cardKitSequence}`);
                        await setCardStreamingMode({
                            cfg,
                            cardId: errorEffectiveCardId,
                            streamingMode: false,
                            sequence: cardKitSequence,
                            accountId,
                        });
                        const seqBeforeUpdate = cardKitSequence;
                        cardKitSequence += 1;
                        trace.info(`onError: updating error card, seq ${seqBeforeUpdate} -> ${cardKitSequence}`);
                        await updateCardKitCard({
                            cfg,
                            cardId: errorEffectiveCardId,
                            card: toCardKit2(errorCard),
                            sequence: cardKitSequence,
                            accountId,
                        });
                    }
                    else {
                        await updateCardFeishu({
                            cfg,
                            messageId: cardMessageId,
                            card: errorCard,
                            accountId,
                        });
                    }
                }
                catch {
                    // Ignore update failures during error handling
                }
            }
            typingCallbacks.onIdle?.();
        },
        onIdle: async () => {
            if (terminatedByUnavailable || shouldSkipForUnavailable("onIdle")) {
                typingCallbacks.onIdle?.();
                return;
            }
            // 在 dispatch 完全结束前，不允许 onIdle 终态化卡片
            if (!dispatchFullyComplete) {
                // dispatch 未完成时不做卡片终态化，但仍需清除 typing indicator。
                // 场景：agent 仅通过 tool call 回复（如发送图片），不产生文本，
                // deliver() 从未被调用，dispatchFullyComplete 保持 false。
                typingCallbacks.onIdle?.();
                return;
            }
            // Guard against duplicate onIdle calls
            if (cardCompleted) {
                typingCallbacks.onIdle?.();
                return;
            }
            cardCompleted = true;
            // Cancel any pending streaming flush before final update
            if (pendingFlushTimer) {
                clearTimeout(pendingFlushTimer);
                pendingFlushTimer = null;
            }
            // Wait for any in-progress flush to complete to avoid
            // concurrent CardKit API calls with out-of-order sequences.
            await waitForFlush();
            // 仅等待已开始的卡片创建完成，不主动触发新创建
            // （NO_REPLY 场景下 ensureCardCreated 从未被调用，cardCreationPromise 为 null）
            if (useStreamingCards && cardCreationPromise) {
                await cardCreationPromise;
                // cardCreationPromise resolve 会 unblock 所有 pending 的 onPartialReply，
                // 但它们的 continuation 在 microtask 队列中比 onIdle 晚一级
                // （经过 ensureCardCreated() 的 await 中转），所以此时 flushInProgress
                // 仍为 false。用 setTimeout(0) 让出到 macrotask 队列，确保所有
                // onPartialReply 的 microtask continuation 先执行完毕（包括触发 flush）。
                await new Promise(resolve => setTimeout(resolve, 0));
                if (pendingFlushTimer) {
                    clearTimeout(pendingFlushTimer);
                    pendingFlushTimer = null;
                }
                await waitForFlush();
            }
            // Update streaming card to "complete" state
            const idleEffectiveCardId = cardKitCardId ?? originalCardKitCardId;
            if (useStreamingCards && cardMessageId) {
                try {
                    if (idleEffectiveCardId) {
                        // Close streaming mode — required before card.update.
                        const seqBeforeClose = cardKitSequence;
                        cardKitSequence += 1;
                        trace.info(`onIdle: closing streaming mode, seq ${seqBeforeClose} -> ${cardKitSequence}`);
                        await setCardStreamingMode({
                            cfg,
                            cardId: idleEffectiveCardId,
                            streamingMode: false,
                            sequence: cardKitSequence,
                            accountId,
                        });
                    }
                    // 使用 completedText（deliver 累积的权威文本）作为最终内容
                    const isNoReplyLeak = !completedText && SILENT_REPLY_TOKEN.startsWith(accumulatedText.trim());
                    const displayText = completedText ||
                        (isNoReplyLeak ? "" : accumulatedText) ||
                        EMPTY_REPLY_FALLBACK_TEXT;
                    trace.debug(`onIdle: completedTextLen=${completedText.length}, accumulatedTextLen=${accumulatedText.length}, displayTextLen=${displayText.length}`);
                    if (!completedText && !accumulatedText) {
                        trace.warn("reply completed without visible text, using empty-reply fallback");
                    }
                    const completeCard = buildCardContent("complete", {
                        text: displayText,
                        reasoningText: accumulatedReasoningText || undefined,
                        reasoningElapsedMs: reasoningElapsedMs || undefined,
                        elapsedMs: trace.elapsed(),
                        footer: resolvedFooter,
                    });
                    if (idleEffectiveCardId) {
                        const seqBeforeUpdate = cardKitSequence;
                        cardKitSequence += 1;
                        trace.info(`onIdle: updating final card, seq ${seqBeforeUpdate} -> ${cardKitSequence}`);
                        await updateCardKitCard({
                            cfg,
                            cardId: idleEffectiveCardId,
                            card: toCardKit2(completeCard),
                            sequence: cardKitSequence,
                            accountId,
                        });
                    }
                    else {
                        await updateCardFeishu({
                            cfg,
                            messageId: cardMessageId,
                            card: completeCard,
                            accountId,
                        });
                    }
                    params.runtime.log?.(`feishu[${account.accountId}]: updated card to complete state${idleEffectiveCardId ? " (CardKit)" : ""}`);
                    trace.info(`reply completed, card finalized (elapsed=${trace.elapsed()}ms)`);
                }
                catch (err) {
                    params.runtime.log?.(`feishu[${account.accountId}]: final card update failed: ${String(err)}`);
                }
            }
            typingCallbacks.onIdle?.();
        },
        onCleanup: async () => {
            typingCallbacks.onCleanup?.();
        },
    });
    /**
     * Abort the current streaming card (best-effort).
     *
     * Called from the monitor abort fast-path — outside the normal
     * dispatch lifecycle — to immediately terminate the card UI
     * without waiting for the LLM response to finish.
     */
    const abortCard = async () => {
        try {
            aborted = true;
            cardCompleted = true;
            if (pendingFlushTimer) {
                clearTimeout(pendingFlushTimer);
                pendingFlushTimer = null;
            }
            await waitForFlush();
            if (cardCreationPromise)
                await cardCreationPromise;
            const effectiveCardId = cardKitCardId ?? originalCardKitCardId;
            if (effectiveCardId) {
                const elapsedMs = Date.now() - dispatchStartTime;
                const abortText = accumulatedText || "Aborted.";
                const abortCard = buildCardContent("complete", {
                    text: abortText,
                    reasoningText: accumulatedReasoningText || undefined,
                    reasoningElapsedMs: reasoningElapsedMs || undefined,
                    elapsedMs,
                    isAborted: true,
                    footer: resolvedFooter,
                });
                const seqBeforeClose = cardKitSequence;
                cardKitSequence += 1;
                trace.info(`abortCard: closing streaming mode, seq ${seqBeforeClose} -> ${cardKitSequence}`);
                await setCardStreamingMode({
                    cfg,
                    cardId: effectiveCardId,
                    streamingMode: false,
                    sequence: cardKitSequence,
                    accountId,
                });
                const seqBeforeUpdate = cardKitSequence;
                cardKitSequence += 1;
                trace.info(`abortCard: updating abort card, seq ${seqBeforeUpdate} -> ${cardKitSequence}`);
                await updateCardKitCard({
                    cfg,
                    cardId: effectiveCardId,
                    card: toCardKit2(abortCard),
                    sequence: cardKitSequence,
                    accountId,
                });
                params.runtime.log?.(`feishu[${account.accountId}]: abortCard completed (effectiveCardId=${effectiveCardId})`);
            }
        }
        catch (err) {
            // Best-effort — swallow errors
            params.runtime.log?.(`feishu[${account.accountId}]: abortCard failed: ${String(err)}`);
        }
    };
    return {
        dispatcher,
        replyOptions: {
            ...replyOptions,
            onModelSelected: prefixContext.onModelSelected,
            disableBlockStreaming: !enableBlockStreaming,
            // Streaming card updates via partial replies (token-level streaming)
            ...(useStreamingCards
                ? {
                    onReasoningStream: async (payload) => {
                        if (terminatedByUnavailable || shouldSkipForUnavailable("onReasoningStream"))
                            return;
                        if (cardCompleted)
                            return;
                        await ensureCardCreated();
                        if (terminatedByUnavailable)
                            return;
                        if (!cardMessageId)
                            return;
                        const rawText = payload.text ?? "";
                        if (!rawText)
                            return;
                        if (!reasoningStartTime)
                            reasoningStartTime = Date.now();
                        isReasoningPhase = true;
                        // Framework sends "Reasoning:\n_italic content_" — clean it
                        const split = splitReasoningText(rawText);
                        accumulatedReasoningText = split.reasoningText ?? rawText;
                        await throttledCardUpdate();
                    },
                    onPartialReply: async (payload) => {
                        if (terminatedByUnavailable || shouldSkipForUnavailable("onPartialReply"))
                            return;
                        if (cardCompleted)
                            return;
                        const text = stripReasoningTags(payload.text ?? "");
                        trace.debug(`onPartialReply: len=${text.length}`);
                        if (!text)
                            return;
                        if (!reasoningStartTime)
                            reasoningStartTime = Date.now();
                        if (isReasoningPhase) {
                            isReasoningPhase = false;
                            reasoningElapsedMs = reasoningStartTime
                                ? Date.now() - reasoningStartTime
                                : 0;
                        }
                        // 检测回复边界：文本长度缩短 → 新回复开始
                        if (lastPartialText && text.length < lastPartialText.length) {
                            streamingPrefix +=
                                (streamingPrefix ? "\n\n" : "") + lastPartialText;
                        }
                        lastPartialText = text;
                        accumulatedText = streamingPrefix
                            ? streamingPrefix + "\n\n" + text
                            : text;
                        // NO_REPLY 缓冲：累积文本是 "NO_REPLY" 前缀时，不创建卡片也不 flush
                        if (!streamingPrefix && SILENT_REPLY_TOKEN.startsWith(accumulatedText.trim())) {
                            trace.debug(`onPartialReply: buffering NO_REPLY prefix`);
                            return;
                        }
                        // 通过 NO_REPLY 检查 → 确保卡片已创建
                        await ensureCardCreated();
                        if (terminatedByUnavailable)
                            return;
                        if (!cardMessageId)
                            return;
                        await throttledCardUpdate();
                    },
                }
                : {}),
        },
        markDispatchIdle,
        markFullyComplete: () => {
            trace.debug(`markFullyComplete: completedTextLen=${completedText.length}, accumulatedTextLen=${accumulatedText.length}`);
            dispatchFullyComplete = true;
        },
        abortCard,
    };
}
//# sourceMappingURL=reply-dispatcher.js.map