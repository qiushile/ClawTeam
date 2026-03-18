/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Inbound message handling pipeline for the Feishu/Lark channel plugin.
 *
 * Orchestrates a seven-stage pipeline:
 *   1. Account resolution
 *   2. Event parsing         → parse.ts (merge_forward expanded in-place)
 *   3. Sender enrichment     → enrich.ts (lightweight, before gate)
 *   4. Policy gate           → gate.ts
 *   5. User name prefetch    → enrich.ts (batch cache warm-up)
 *   6. Content resolution    → enrich.ts (media / quote, parallel)
 *   7. Agent dispatch        → dispatch.ts
 */
import { recordPendingHistoryEntryIfEnabled, DEFAULT_GROUP_HISTORY_LIMIT, resolveSenderCommandAuthorization, isNormalizedSenderAllowed, } from "openclaw/plugin-sdk";
import { getLarkAccount } from "../../core/accounts.js";
import { LarkClient } from "../../core/lark-client.js";
import { trace } from "../../core/trace.js";
import { parseMessageEvent } from "./parse.js";
import { resolveSenderInfo, prefetchUserNames, resolveMedia, resolveQuotedContent, substituteMediaPaths, } from "./enrich.js";
import { checkMessageGate, readFeishuAllowFromStore } from "./gate.js";
import { dispatchToAgent } from "./dispatch.js";
import { resolveFeishuGroupConfig } from "./policy.js";
import { threadScopedKey } from "../../channel/chat-queue.js";
// ---------------------------------------------------------------------------
// Backward-compat re-export
// ---------------------------------------------------------------------------
/** @deprecated Use {@link parseMessageEvent} from `./parse.js` instead. */
export { parseMessageEvent as parseFeishuMessageEvent } from "./parse.js";
// ---------------------------------------------------------------------------
// Public: handle inbound message
// ---------------------------------------------------------------------------
export async function handleFeishuMessage(params) {
    const { cfg, event, botOpenId, runtime, chatHistories, accountId, replyToMessageId, forceMention, skipTyping } = params;
    // 1. Account resolution
    const account = getLarkAccount(cfg, accountId);
    const feishuCfg = account.config;
    const log = runtime?.log ?? console.log;
    const error = runtime?.error ?? console.error;
    // 2. Parse event → MessageContext (merge_forward expanded in-place)
    let ctx = await parseMessageEvent(event, botOpenId, {
        cfg,
        accountId: account.accountId,
    });
    // 3. Enrich (lightweight): sender name + permission error tracking
    const { ctx: enrichedCtx, permissionError } = await resolveSenderInfo({
        ctx,
        account,
        log,
    });
    ctx = enrichedCtx;
    log(`feishu[${account.accountId}]: received message from ${ctx.senderId} in ${ctx.chatId} (${ctx.chatType})`);
    trace.info(`received from ${ctx.senderId} in ${ctx.chatId} (${ctx.chatType})`);
    const historyLimit = Math.max(0, feishuCfg?.historyLimit ??
        cfg.messages?.groupChat?.historyLimit ??
        DEFAULT_GROUP_HISTORY_LIMIT);
    // 4. Gate: policy / access-control checks (skipped for synthetic messages)
    const gate = forceMention
        ? { allowed: true }
        : await checkMessageGate({ ctx, feishuCfg, account, cfg, log });
    if (!gate.allowed) {
        if (gate.reason === "no_mention") {
            trace.info(`rejected: no bot mention in group ${ctx.chatId}`);
        }
        // Record history entry if the gate produced one (group no-mention case)
        if (gate.historyEntry && chatHistories) {
            const historyKey = threadScopedKey(ctx.chatId, ctx.threadId);
            recordPendingHistoryEntryIfEnabled({
                historyMap: chatHistories,
                historyKey,
                limit: historyLimit,
                entry: gate.historyEntry,
            });
        }
        return;
    }
    // 5. Batch pre-warm user name cache (sender + mentions)
    await prefetchUserNames({ ctx, account, log });
    // 6. Enrich (heavyweight, after gate — parallel where possible)
    const enrichParams = { ctx, cfg, account, log };
    const [mediaResult, quotedContent] = await Promise.all([
        resolveMedia(enrichParams),
        resolveQuotedContent(enrichParams),
    ]);
    // 6b. Replace Feishu file-key placeholders in content with local
    //     file paths so the SDK can detect images for native vision and
    //     the AI receives meaningful file references.
    if (mediaResult.mediaList.length > 0) {
        ctx = {
            ...ctx,
            content: substituteMediaPaths(ctx.content, mediaResult.mediaList),
        };
    }
    // 7. Compute commandAuthorized via SDK access group command gating
    const core = LarkClient.runtime;
    const isGroup = ctx.chatType === "group";
    const dmPolicy = feishuCfg?.dmPolicy ?? "pairing";
    // Resolve per-group config early — shared by both command authorization
    // and dispatch (step 8).
    const groupConfig = isGroup
        ? resolveFeishuGroupConfig({ cfg: feishuCfg, groupId: ctx.chatId })
        : undefined;
    const defaultGroupConfig = isGroup
        ? feishuCfg?.groups?.["*"]
        : undefined;
    // Build the sender allowlist for command authorization in group context.
    // Excludes legacy oc_xxx chat-id entries (group admission, not sender identity).
    //
    // When the explicit group sender policy is "open", pass ["*"] to align
    // command authorization with chat access (if you can chat, you can run
    // commands).  When no policy is configured (undefined fallback), default to
    // allowlist behaviour — only users in feishuCfg.allowFrom (owner list) or
    // an explicit groupAllowFrom/per-group allowFrom can run commands.
    const configuredGroupAllowFrom = (() => {
        if (!isGroup)
            return undefined;
        // Exclude legacy oc_xxx chat-id entries from groupAllowFrom (sender filter only).
        const senderGroupAllowFrom = (feishuCfg?.groupAllowFrom ?? [])
            .filter((e) => !String(e).startsWith("oc_"))
            .map(String);
        const perGroupAllowFrom = (groupConfig?.allowFrom ?? []).map(String);
        const defaultSenderAllowFrom = (!groupConfig && defaultGroupConfig?.allowFrom)
            ? defaultGroupConfig.allowFrom.map(String)
            : [];
        const combined = [...senderGroupAllowFrom, ...perGroupAllowFrom, ...defaultSenderAllowFrom];
        if (combined.length > 0)
            return combined;
        // No allowFrom list configured — check if sender policy is explicitly "open".
        // Do NOT fall back to "open" as a default: unset policy → allowlist behaviour.
        const explicitSenderPolicy = groupConfig?.groupPolicy ??
            defaultGroupConfig?.groupPolicy ??
            feishuCfg?.groupPolicy;
        return explicitSenderPolicy === "open" ? ["*"] : [];
    })();
    const { commandAuthorized } = await resolveSenderCommandAuthorization({
        rawBody: ctx.content,
        cfg,
        isGroup,
        dmPolicy,
        configuredAllowFrom: (feishuCfg?.allowFrom ?? []).map(String),
        configuredGroupAllowFrom,
        senderId: ctx.senderId,
        isSenderAllowed: (senderId, allowFrom) => isNormalizedSenderAllowed({ senderId, allowFrom }),
        readAllowFromStore: () => readFeishuAllowFromStore(account.accountId),
        shouldComputeCommandAuthorized: core.channel.commands.shouldComputeCommandAuthorized,
        resolveCommandAuthorizedFromAuthorizers: core.channel.commands.resolveCommandAuthorizedFromAuthorizers,
    });
    // 8. Dispatch to agent
    // groupConfig and defaultGroupConfig are already resolved above.
    try {
        await dispatchToAgent({
            ctx,
            permissionError,
            mediaPayload: mediaResult.payload,
            quotedContent,
            account,
            cfg,
            runtime,
            chatHistories,
            historyLimit,
            replyToMessageId,
            commandAuthorized,
            groupConfig,
            defaultGroupConfig,
            skipTyping,
        });
    }
    catch (err) {
        error(`feishu[${account.accountId}]: failed to dispatch message: ${String(err)}`);
        trace.error(`dispatch failed: ${String(err)} (elapsed=${trace.elapsed()}ms)`);
    }
}
//# sourceMappingURL=handler.js.map