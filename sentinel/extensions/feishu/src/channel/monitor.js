/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * WebSocket monitoring for the Feishu/Lark channel plugin.
 *
 * Manages per-account WSClient connections and routes inbound Feishu
 * events (messages, bot membership changes, read receipts) to the
 * appropriate handlers.
 */
import { getLarkAccount, getEnabledLarkAccounts } from "../core/accounts.js";
import { LarkClient } from "../core/lark-client.js";
import { handleFeishuMessage } from "../messaging/inbound/handler.js";
import { handleFeishuReaction } from "../messaging/inbound/reaction-handler.js";
import { MessageDedup, isMessageExpired } from "../messaging/inbound/dedup.js";
import { withTrace, trace, setTraceLogger } from "../core/trace.js";
import { handleCardAction } from "../tools/auto-auth.js";
import { enqueueFeishuChatTask, buildQueueKey, hasActiveTask, getActiveDispatcher, } from "./chat-queue.js";
import { extractRawTextFromEvent, isLikelyAbortText } from "./abort-detect.js";
// ---------------------------------------------------------------------------
// Single-account monitor
// ---------------------------------------------------------------------------
/**
 * Start monitoring a single Feishu account.
 *
 * Creates a LarkClient, probes bot identity, registers event handlers,
 * and starts a WebSocket connection. Returns a Promise that resolves
 * when the abort signal fires (or immediately if already aborted).
 */
async function monitorSingleAccount(params) {
    const { cfg, account, runtime, abortSignal } = params;
    const { accountId } = account;
    const log = runtime?.log ?? console.log;
    const error = runtime?.error ?? console.error;
    // Route trace output to gateway.log (only needs to be done once, but
    // calling it again with the same functions is harmless).
    setTraceLogger(log, error);
    // Only websocket mode is supported in the monitor path.
    const connectionMode = account.config.connectionMode ?? "websocket";
    if (connectionMode !== "websocket") {
        log(`feishu[${accountId}]: webhook mode not implemented in monitor`);
        return;
    }
    // Message dedup — filters duplicate deliveries from WebSocket reconnects.
    const dedupCfg = account.config.dedup;
    const messageDedup = new MessageDedup({
        ttlMs: dedupCfg?.ttlMs,
        maxEntries: dedupCfg?.maxEntries,
    });
    log(`feishu[${accountId}]: message dedup enabled (ttl=${messageDedup["ttlMs"]}ms, max=${messageDedup["maxEntries"]})`);
    log(`feishu[${accountId}]: starting WebSocket connection...`);
    // Create LarkClient instance — manages SDK client, WS, and bot identity.
    const lark = LarkClient.fromAccount(account);
    /** Per-chat history maps (used for group-chat context window). */
    const chatHistories = new Map();
    await lark.startWS({
        handlers: {
            "im.message.receive_v1": async (data) => {
                try {
                    const event = data;
                    const msgId = event.message?.message_id ?? "unknown";
                    const chatId = event.message?.chat_id ?? "";
                    const threadId = event.message?.thread_id || undefined;
                    // Dedup — skip duplicate messages (e.g. from WebSocket reconnects).
                    if (!messageDedup.tryRecord(msgId, accountId)) {
                        log(`feishu[${accountId}]: duplicate message ${msgId}, skipping`);
                        return;
                    }
                    // Expiry — discard stale messages from reconnect replay.
                    if (isMessageExpired(event.message?.create_time)) {
                        log(`feishu[${accountId}]: message ${msgId} expired, discarding`);
                        return;
                    }
                    // ---- Abort fast-path ----
                    // If the message looks like an abort trigger and there is an active
                    // reply dispatcher for this chat, fire abortCard() immediately
                    // (before the message enters the serial queue) so the streaming
                    // card is terminated without waiting for the current task.
                    const abortText = extractRawTextFromEvent(event);
                    if (abortText && isLikelyAbortText(abortText)) {
                        const queueKey = buildQueueKey(accountId, chatId, threadId);
                        if (hasActiveTask(queueKey)) {
                            const active = getActiveDispatcher(queueKey);
                            if (active) {
                                log(`feishu[${accountId}]: abort fast-path triggered for chat ${chatId} (text="${abortText}")`);
                                active.abortController?.abort();
                                active.abortCard().catch((err) => {
                                    error(`feishu[${accountId}]: abort fast-path abortCard failed: ${String(err)}`);
                                });
                            }
                        }
                    }
                    const { status } = enqueueFeishuChatTask({
                        accountId,
                        chatId,
                        threadId,
                        task: async () => {
                            try {
                                await withTrace({
                                    messageId: msgId,
                                    chatId,
                                    accountId,
                                    startTime: Date.now(),
                                    senderOpenId: event.sender?.sender_id?.open_id || "",
                                    httpHeaders: account.extra?.httpHeaders,
                                    chatType: event.message?.chat_type || undefined,
                                    threadId,
                                }, () => handleFeishuMessage({
                                    cfg,
                                    event,
                                    botOpenId: lark.botOpenId,
                                    runtime,
                                    chatHistories,
                                    accountId,
                                }));
                            }
                            catch (err) {
                                error(`feishu[${accountId}]: error handling message: ${String(err)}`);
                            }
                        },
                    });
                    log(`feishu[${accountId}]: message ${msgId} in chat ${chatId}${threadId ? ` thread ${threadId}` : ""} — ${status}`);
                }
                catch (err) {
                    error(`feishu[${accountId}]: error handling message: ${String(err)}`);
                }
            },
            "im.message.message_read_v1": async () => {
                // Read receipts are intentionally ignored.
            },
            "im.message.reaction.created_v1": async (data) => {
                try {
                    const event = data;
                    const msgId = event.message_id ?? "unknown";
                    // Use real chat_id when present so reaction shares the same queue/session as the chat.
                    const chatId = event.chat_id?.trim() || msgId;
                    log(`feishu[${accountId}]: reaction event on message ${msgId}`);
                    const { status } = enqueueFeishuChatTask({
                        accountId,
                        chatId,
                        task: async () => {
                            try {
                                await handleFeishuReaction({
                                    cfg,
                                    event,
                                    botOpenId: lark.botOpenId,
                                    runtime,
                                    chatHistories,
                                    accountId,
                                });
                            }
                            catch (err) {
                                error(`feishu[${accountId}]: error handling reaction: ${String(err)}`);
                            }
                        },
                    });
                    log(`feishu[${accountId}]: reaction on ${msgId} — ${status}`);
                }
                catch (err) {
                    error(`feishu[${accountId}]: error handling reaction event: ${String(err)}`);
                }
            },
            "im.chat.member.bot.added_v1": async (data) => {
                try {
                    const event = data;
                    log(`feishu[${accountId}]: bot added to chat ${event.chat_id}`);
                }
                catch (err) {
                    error(`feishu[${accountId}]: error handling bot added event: ${String(err)}`);
                }
            },
            "im.chat.member.bot.deleted_v1": async (data) => {
                try {
                    const event = data;
                    log(`feishu[${accountId}]: bot removed from chat ${event.chat_id}`);
                }
                catch (err) {
                    error(`feishu[${accountId}]: error handling bot removed event: ${String(err)}`);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            "card.action.trigger": (async (data) => {
                try {
                    return await handleCardAction(data, cfg, accountId);
                }
                catch (err) {
                    trace.warn(`card.action.trigger handler error: ${err}`);
                }
            }),
        },
        abortSignal,
    });
    // startWS resolves when abortSignal fires — probe result is logged inside startWS.
    log(`feishu[${accountId}]: bot open_id resolved: ${lark.botOpenId ?? "unknown"}`);
    log(`feishu[${accountId}]: WebSocket client started`);
    trace.info(`websocket started for account ${accountId}`);
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
/**
 * Start monitoring for all enabled Feishu accounts (or a single
 * account when `opts.accountId` is specified).
 */
export async function monitorFeishuProvider(opts = {}) {
    const cfg = opts.config;
    if (!cfg) {
        throw new Error("Config is required for Feishu monitor");
    }
    const log = opts.runtime?.log ?? console.log;
    // Single-account mode.
    if (opts.accountId) {
        const account = getLarkAccount(cfg, opts.accountId);
        if (!account.enabled || !account.configured) {
            throw new Error(`Feishu account "${opts.accountId}" not configured or disabled`);
        }
        return monitorSingleAccount({
            cfg,
            account,
            runtime: opts.runtime,
            abortSignal: opts.abortSignal,
        });
    }
    // Multi-account mode: start all enabled accounts in parallel.
    const accounts = getEnabledLarkAccounts(cfg);
    if (accounts.length === 0) {
        throw new Error("No enabled Feishu accounts configured");
    }
    log(`feishu: starting ${accounts.length} account(s): ${accounts.map((a) => a.accountId).join(", ")}`);
    await Promise.all(accounts.map((account) => monitorSingleAccount({
        cfg,
        account,
        runtime: opts.runtime,
        abortSignal: opts.abortSignal,
    })));
}
/**
 * Stop monitoring for a specific account or all accounts.
 *
 * Disconnects WebSocket clients and clears cached bot identity.
 */
export function stopFeishuMonitor(accountId) {
    if (accountId) {
        LarkClient.get(accountId)?.disconnect();
    }
    else {
        LarkClient.clearCache();
    }
}
//# sourceMappingURL=monitor.js.map