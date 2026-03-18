/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * ChannelMessageActionAdapter for the Feishu/Lark channel plugin.
 *
 * Implements the standard message-action interface so the framework's
 * built-in `message` tool can route send, react, delete and other
 * actions to Feishu.
 *
 * The `send` action is the unified entry-point for text, card, media,
 * reply and attachment delivery — matching the Telegram/Discord pattern
 * where a single action handles all outbound message types.
 */
import { extractToolSend, jsonResult, readStringParam, readReactionParams, } from "openclaw/plugin-sdk";
import { addReactionFeishu, removeReactionFeishu, listReactionsFeishu, } from "./reactions.js";
import { sendTextLark, sendCardLark } from "./deliver.js";
import { uploadAndSendMediaLark } from "./media.js";
import { listChatMembersFeishu } from "./chat-manage.js";
import { LarkClient } from "../../core/lark-client.js";
import { getEnabledLarkAccounts } from "../../core/accounts.js";
import { trace } from "../../core/trace.js";
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Assert that a Lark SDK response has code === 0 (or no code field). */
function assertLarkOk(res, context) {
    const code = res?.code;
    if (code !== undefined && code !== 0) {
        const msg = res?.msg ?? "unknown error";
        throw new Error(`[feishu-actions] ${context}: code=${code}, msg=${msg}`);
    }
}
// ---------------------------------------------------------------------------
// Supported actions
// ---------------------------------------------------------------------------
const SUPPORTED_ACTIONS = new Set([
    "send",
    "react",
    "reactions",
    "delete",
    "unsend",
    // "member-info",
]);
/**
 * Extract and normalise all send-related parameters from the raw action
 * params.  Mirrors the Telegram plugin's `readTelegramSendParams()` pattern
 * for clean, single-point param extraction.
 *
 * When `toolContext` is provided and the send target is the current chat
 * (or omitted), thread context is inherited from the SDK so that
 * tool-initiated messages are routed to the correct thread.
 */
function readFeishuSendParams(params, toolContext) {
    const to = readStringParam(params, "to") ?? "";
    const text = readStringParam(params, "message", { allowEmpty: true }) ??
        readStringParam(params, "text", { allowEmpty: true }) ??
        "";
    const mediaUrl = readStringParam(params, "media") ??
        readStringParam(params, "path") ??
        readStringParam(params, "filePath") ??
        readStringParam(params, "url");
    const fileName = readStringParam(params, "fileName") ??
        readStringParam(params, "name");
    // Thread routing: when targeting the current chat (or unspecified),
    // inherit thread context from SDK toolContext.
    const sameChat = !to || to === toolContext?.currentChannelId;
    const replyInThread = sameChat && Boolean(toolContext?.currentThreadTs);
    const replyToMessageId = readStringParam(params, "replyTo")
        ?? (replyInThread && toolContext?.currentMessageId
            ? String(toolContext.currentMessageId)
            : undefined);
    const card = params.card != null && typeof params.card === "object" && !Array.isArray(params.card)
        ? params.card
        : undefined;
    return {
        to,
        text,
        mediaUrl: mediaUrl ?? undefined,
        fileName: fileName ?? undefined,
        replyToMessageId: replyToMessageId ?? undefined,
        replyInThread,
        card,
    };
}
// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------
export const feishuMessageActions = {
    listActions: ({ cfg }) => {
        const accounts = getEnabledLarkAccounts(cfg);
        if (accounts.length === 0)
            return [];
        return Array.from(SUPPORTED_ACTIONS);
    },
    supportsAction: ({ action }) => SUPPORTED_ACTIONS.has(action),
    supportsButtons: ({ cfg }) => getEnabledLarkAccounts(cfg).length > 0,
    supportsCards: ({ cfg }) => getEnabledLarkAccounts(cfg).length > 0,
    extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
    handleAction: async (ctx) => {
        const { action, params, cfg, accountId, toolContext } = ctx;
        const aid = accountId ?? undefined;
        trace.info(`[feishu-actions] handleAction: action=${action}, accountId=${aid ?? "default"}`);
        try {
            switch (action) {
                case "send":
                    return await deliverMessage(cfg, readFeishuSendParams(params, toolContext), aid, ctx.mediaLocalRoots);
                case "react":
                    return await handleReact(cfg, params, aid);
                case "reactions":
                    return await handleReactions(cfg, params, aid);
                case "delete":
                case "unsend":
                    return await handleDelete(cfg, params, aid);
                default:
                    throw new Error(`Action "${action}" is not supported for Feishu. ` +
                        `Supported actions: ${Array.from(SUPPORTED_ACTIONS).join(", ")}.`);
            }
        }
        catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);
            trace.error(`[feishu-actions] handleAction failed: action=${action}, error=${errMsg}`);
            throw err;
        }
    },
};
// ---------------------------------------------------------------------------
// Unified message delivery
// ---------------------------------------------------------------------------
/**
 * Unified message delivery — handles text, card, and media payloads with
 * optional reply-to and thread routing.
 *
 * Supports `fileName` for named file uploads via `uploadAndSendMediaLark`.
 * On media upload failure, falls back to sending the URL as a text link.
 */
async function deliverMessage(cfg, sp, accountId, mediaLocalRoots) {
    const { to, text, mediaUrl, fileName, replyToMessageId, replyInThread, card } = sp;
    const payloadType = card ? "card" : mediaUrl ? "media" : "text";
    const target = to || replyToMessageId || "unknown";
    trace.info(`[feishu-actions] deliverMessage: type=${payloadType}, target=${target}, ` +
        `isReply=${Boolean(replyToMessageId)}, replyInThread=${replyInThread}, ` +
        `textLen=${text.trim().length}, hasMedia=${Boolean(mediaUrl)}, ` +
        `fileName=${fileName ?? "(none)"}`);
    if (!text.trim() && !card && !mediaUrl) {
        trace.warn("[feishu-actions] deliverMessage: no payload, rejecting");
        throw new Error("send requires at least one of: message, card, or media.");
    }
    const sendCtx = { cfg, to, replyToMessageId, replyInThread, accountId };
    // Send text first if both text and card/media are present.
    if (text.trim() && (card || mediaUrl)) {
        trace.info(`[feishu-actions] deliverMessage: sending preceding text ` +
            `(${text.length} chars) before ${payloadType}`);
        await sendTextLark({ ...sendCtx, text });
    }
    // Card path.
    if (card) {
        const result = await sendCardLark({ ...sendCtx, card });
        trace.info(`[feishu-actions] deliverMessage: card sent, messageId=${result.messageId}`);
        return jsonResult({ ok: true, messageId: result.messageId, chatId: result.chatId });
    }
    // Media path — uses uploadAndSendMediaLark directly to support fileName.
    if (mediaUrl) {
        return await deliverMedia(cfg, sp, accountId, mediaLocalRoots);
    }
    // Text-only path.
    const result = await sendTextLark({ ...sendCtx, text });
    trace.info(`[feishu-actions] deliverMessage: text sent, messageId=${result.messageId}`);
    return jsonResult({ ok: true, messageId: result.messageId, chatId: result.chatId });
}
/**
 * Upload and send a media file with text-link fallback on failure.
 */
async function deliverMedia(cfg, sp, accountId, mediaLocalRoots) {
    const { to, mediaUrl, fileName, replyToMessageId, replyInThread } = sp;
    trace.info(`[feishu-actions] deliverMedia: url=${mediaUrl}, fileName=${fileName ?? "(auto)"}`);
    try {
        const result = await uploadAndSendMediaLark({
            cfg,
            to,
            mediaUrl,
            fileName,
            replyToMessageId,
            replyInThread,
            accountId,
            mediaLocalRoots,
        });
        trace.info(`[feishu-actions] deliverMedia: sent, messageId=${result.messageId}`);
        return jsonResult({ ok: true, messageId: result.messageId, chatId: result.chatId });
    }
    catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        trace.error(`[feishu-actions] deliverMedia: upload failed for "${mediaUrl}": ${errMsg}`);
        // Fallback: send the URL with error reason as a quote above.
        trace.info("[feishu-actions] deliverMedia: falling back to text link");
        const fallback = await sendTextLark({
            cfg,
            to,
            text: `> ${errMsg}\n${mediaUrl}`,
            replyToMessageId,
            replyInThread,
            accountId,
        });
        return jsonResult({
            ok: true,
            messageId: fallback.messageId,
            chatId: fallback.chatId,
            warning: `Media upload failed (${errMsg}). A text link was sent instead.`,
        });
    }
}
// ---------------------------------------------------------------------------
// Reaction handlers
// ---------------------------------------------------------------------------
async function handleReact(cfg, params, accountId) {
    const messageId = readStringParam(params, "messageId", { required: true });
    const { emoji, remove, isEmpty } = readReactionParams(params, {
        removeErrorMessage: "Emoji is required to remove a Feishu reaction.",
    });
    if (remove || isEmpty) {
        trace.info(`[feishu-actions] react: removing emoji=${emoji || "all"} from messageId=${messageId}`);
        const reactions = await listReactionsFeishu({
            cfg,
            messageId,
            emojiType: emoji || undefined,
            accountId,
        });
        const botReactions = reactions.filter((r) => r.operatorType === "app");
        for (const r of botReactions) {
            await removeReactionFeishu({
                cfg,
                messageId,
                reactionId: r.reactionId,
                accountId,
            });
        }
        trace.info(`[feishu-actions] react: removed ${botReactions.length} bot reaction(s)`);
        return jsonResult({ ok: true, removed: botReactions.length });
    }
    trace.info(`[feishu-actions] react: adding emoji=${emoji} to messageId=${messageId}`);
    const { reactionId } = await addReactionFeishu({
        cfg,
        messageId,
        emojiType: emoji,
        accountId,
    });
    trace.info(`[feishu-actions] react: added reactionId=${reactionId}`);
    return jsonResult({ ok: true, reactionId });
}
async function handleReactions(cfg, params, accountId) {
    const messageId = readStringParam(params, "messageId", { required: true });
    const emojiType = readStringParam(params, "emoji");
    const reactions = await listReactionsFeishu({
        cfg,
        messageId,
        emojiType: emojiType || undefined,
        accountId,
    });
    return jsonResult({
        ok: true,
        reactions: reactions.map((r) => ({
            reactionId: r.reactionId,
            emoji: r.emojiType,
            operatorType: r.operatorType,
            operatorId: r.operatorId,
        })),
    });
}
// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------
async function handleDelete(cfg, params, accountId) {
    const messageId = readStringParam(params, "messageId", { required: true });
    trace.info(`[feishu-actions] delete: messageId=${messageId}`);
    const client = LarkClient.fromCfg(cfg, accountId).sdk;
    const res = await client.im.message.delete({
        path: { message_id: messageId },
    });
    assertLarkOk(res, `delete message ${messageId}`);
    trace.info(`[feishu-actions] delete: done, messageId=${messageId}`);
    return jsonResult({ ok: true, messageId, deleted: true });
}
// ---------------------------------------------------------------------------
// Member Info
// ---------------------------------------------------------------------------
async function handleMemberInfo(cfg, params, accountId, toolContext) {
    const chatId = readStringParam(params, "chatId")
        ?? readStringParam(params, "chat")
        ?? toolContext?.currentChannelId;
    if (!chatId) {
        throw new Error("Feishu member-info requires a 'chatId' parameter or must be called within a chat context.");
    }
    trace.info(`[feishu-actions] member-info: chatId=${chatId}`);
    const { members, hasMore } = await listChatMembersFeishu({ cfg, chatId, accountId });
    trace.info(`[feishu-actions] member-info: found ${members.length} member(s), hasMore=${hasMore}`);
    return jsonResult({
        ok: true,
        chatId,
        hasMore,
        members: members.map((m) => ({
            memberId: m.memberId,
            name: m.name,
            memberIdType: m.memberIdType,
        })),
    });
}
//# sourceMappingURL=actions.js.map