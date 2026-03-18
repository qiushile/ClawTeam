/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Reaction event handler for the Feishu/Lark channel plugin.
 *
 * Converts `im.message.reaction.created_v1` events into synthetic
 * {@link FeishuMessageEvent} objects so the AI can contextually decide
 * how to respond (text reply, emoji reaction, or nothing at all).
 *
 * Controlled by `reactionNotifications` (default: "own"):
 *   - `"off"`  — reaction events are silently ignored.
 *   - `"own"`  — only reactions on the bot's own messages are dispatched.
 *   - `"all"`  — reactions on any message in the chat are dispatched.
 */
import * as crypto from "node:crypto";
import { getLarkAccount } from "../../core/accounts.js";
import { getMessageFeishu, getChatTypeFeishu } from "../outbound/fetch.js";
import { isThreadCapableGroup } from "../../core/chat-info-cache.js";
import { handleFeishuMessage } from "./handler.js";
import { trace } from "../../core/trace.js";
const REACTION_VERIFY_TIMEOUT_MS = 3_000;
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function handleFeishuReaction(params) {
    const { cfg, event, botOpenId, runtime, chatHistories, accountId } = params;
    const log = runtime?.log ?? console.log;
    const error = runtime?.error ?? console.error;
    const account = getLarkAccount(cfg, accountId);
    const reactionMode = account.config?.reactionNotifications ?? "own";
    if (reactionMode === "off") {
        return;
    }
    const threadSessionEnabled = account.config?.threadSession === true;
    const emojiType = event.reaction_type?.emoji_type;
    const messageId = event.message_id;
    const operatorOpenId = event.user_id?.open_id ?? "";
    if (!emojiType || !messageId || !operatorOpenId) {
        return;
    }
    // ---- Safety filters (aligned with official) ----
    if (event.operator_type === "app" || operatorOpenId === botOpenId) {
        log(`feishu[${accountId}]: ignoring app/self reaction on ${messageId}`);
        return;
    }
    if (emojiType === "Typing") {
        return;
    }
    // "own" mode requires botOpenId to verify message ownership
    if (reactionMode === "own" && !botOpenId) {
        log(`feishu[${accountId}]: bot open_id unavailable, skipping reaction on ${messageId}`);
        return;
    }
    // ---- Fetch original message with timeout (fail-closed) ----
    const msg = await Promise.race([
        getMessageFeishu({ cfg, messageId, accountId }),
        new Promise((resolve) => setTimeout(() => resolve(null), REACTION_VERIFY_TIMEOUT_MS)),
    ]).catch(() => null);
    if (!msg) {
        log(`feishu[${accountId}]: reacted message ${messageId} not found or timed out, skipping`);
        return;
    }
    const isBotMessage = msg.senderType === "app" || msg.senderId === botOpenId;
    if (reactionMode === "own" && !isBotMessage) {
        log(`feishu[${accountId}]: reaction on non-bot message ${messageId}, skipping`);
        return;
    }
    // ---- Resolve chat context ----
    // im.message.reaction.created_v1 does NOT include chat_id or chat_type
    // (confirmed from Feishu docs). The message GET API returns chat_id but
    // NOT chat_type. So we must determine chat_type via im.chat.get.
    const chatId = event.chat_id?.trim() || msg.chatId?.trim() || "";
    // Determine chat type: event payload → fetched message → im.chat.get API.
    // The first two sources are almost always empty for reaction events, so
    // getChatTypeFeishu is the primary path.
    let chatType = event.chat_type === "group" ? "group"
        : event.chat_type === "p2p" || event.chat_type === "private" ? "p2p"
            : (msg.chatType === "group" || msg.chatType === "p2p") ? msg.chatType
                : "p2p"; // tentative default, overridden below when chatId is available
    // When we have a real chat_id (from event or message API), query the
    // authoritative chat type via im.chat.get. This is the only reliable
    // source for reaction events.
    if (chatId && chatType === "p2p" && !event.chat_type && !msg.chatType) {
        try {
            chatType = await getChatTypeFeishu({ cfg, chatId, accountId });
        }
        catch {
            // getChatTypeFeishu already logs errors and defaults to "p2p"
        }
    }
    // If we still have no chatId, synthesise one for the session key.
    const effectiveChatId = chatId || `p2p:${operatorOpenId}`;
    // ---- Thread session: skip for thread-capable groups ----
    // The mget API does not return thread_id, so we cannot route the
    // synthetic event to the correct thread session. Skip reaction handling
    // only for thread-capable groups (topic / thread-mode); p2p and regular
    // groups are unaffected since they have no threads.
    if (threadSessionEnabled && chatId) {
        const threadCapable = await isThreadCapableGroup({ cfg, chatId, accountId });
        if (threadCapable) {
            log(`feishu[${accountId}]: reaction on thread-capable group ${chatId}, skipping (threadSession enabled)`);
            return;
        }
    }
    // ---- Build synthetic event ----
    log(`feishu[${accountId}]: reaction "${emojiType}" by ${operatorOpenId} on ${messageId} (chatId=${effectiveChatId}, chatType=${chatType}${msg.threadId ? `, thread=${msg.threadId}` : ""}), dispatching to AI`);
    trace.info(`reaction "${emojiType}" by ${operatorOpenId} on ${messageId} (chatType=${chatType})`);
    // Include original content excerpt for richer AI context (our addition over official).
    // Format as a natural action description so the AI treats it as user intent
    // rather than a passive system notification.
    const excerpt = msg.content.length > 200 ? msg.content.slice(0, 200) + "…" : msg.content;
    const syntheticText = excerpt
        ? `[reacted with ${emojiType} to message ${messageId}: "${excerpt}"]`
        : `[reacted with ${emojiType} to message ${messageId}]`;
    const syntheticEvent = {
        sender: {
            sender_id: {
                open_id: operatorOpenId,
                user_id: event.user_id?.user_id,
                union_id: event.user_id?.union_id,
            },
            sender_type: "user",
        },
        message: {
            message_id: `${messageId}:reaction:${emojiType}:${crypto.randomUUID()}`,
            chat_id: effectiveChatId,
            chat_type: chatType,
            message_type: "text",
            content: JSON.stringify({ text: syntheticText }),
            create_time: event.action_time ?? String(Date.now()),
            thread_id: msg.threadId,
        },
    };
    try {
        await handleFeishuMessage({
            cfg,
            event: syntheticEvent,
            botOpenId,
            runtime,
            chatHistories,
            accountId,
            replyToMessageId: messageId,
            forceMention: true,
            skipTyping: true,
        });
    }
    catch (err) {
        error(`feishu[${accountId}]: error dispatching reaction event: ${String(err)}`);
    }
}
//# sourceMappingURL=reaction-handler.js.map