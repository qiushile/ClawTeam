/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Event parsing for inbound Feishu messages.
 *
 * Converts a raw FeishuMessageEvent into a normalised MessageContext.
 * All mention information is captured in `mentions: MentionInfo[]`;
 * downstream logic derives `mentionedBot` and non-bot targets from it.
 *
 * When `expandCtx` is provided, `cfg` and `accountId` are passed into
 * the converter context so that async converters (e.g. merge_forward)
 * can make API calls during parsing.
 */
import { convertMessageContent } from "../converters/content-converter.js";
import { getUserNameCache, createBatchResolveNames } from "./user-name-cache.js";
import { getLarkAccount } from "../../core/accounts.js";
import { LarkClient } from "../../core/lark-client.js";
import { trace } from "../../core/trace.js";
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * 对 interactive 消息，通过 TAT 调用 API 获取完整 v2 卡片内容。
 * 事件推送的 content 可能不包含 json_card，API 调用可返回完整的 raw_card_content。
 * 失败时返回 undefined，调用方 fallback 到原始 content。
 */
async function fetchCardContent(messageId, larkClient) {
    try {
        const response = await larkClient.sdk.request({
            method: "GET",
            url: `/open-apis/im/v1/messages/${messageId}`,
            params: {
                user_id_type: "open_id",
                card_msg_content_type: "raw_card_content",
            },
        });
        return response?.data?.items?.[0]?.body?.content ?? undefined;
    }
    catch (err) {
        trace.warn(`fetchCardContent failed for ${messageId}: ${err instanceof Error ? err.message : String(err)}`);
        return undefined;
    }
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
/**
 * Parse a raw Feishu message event into a normalised MessageContext.
 *
 * @param expandCtx  When provided, cfg/accountId are used to create
 *                   callbacks for async converters (e.g. merge_forward)
 *                   to fetch sub-messages and resolve sender names.
 */
export async function parseMessageEvent(event, botOpenId, expandCtx) {
    // 1. Build MentionInfo list from event mentions
    const mentionMap = new Map();
    const mentionList = [];
    for (const m of event.message.mentions ?? []) {
        const openId = m.id?.open_id ?? "";
        if (!openId)
            continue;
        const info = {
            key: m.key,
            openId,
            name: m.name,
            isBot: Boolean(botOpenId && openId === botOpenId),
        };
        mentionMap.set(m.key, info);
        mentionList.push(info);
    }
    // Build reverse map for O(1) openId lookup
    const mentionsByOpenId = new Map();
    for (const info of mentionList) {
        mentionsByOpenId.set(info.openId, info);
    }
    // 2. Convert content via registered converter
    const acctId = expandCtx?.accountId;
    // Create larkClient once when expandCtx is available (used for merge_forward & card fetch)
    const larkClient = expandCtx
        ? LarkClient.fromCfg(expandCtx.cfg, acctId)
        : undefined;
    // Build merge_forward callbacks when expandCtx is provided
    let fetchSubMessages;
    let batchResolveNames;
    if (expandCtx) {
        const account = getLarkAccount(expandCtx.cfg, acctId);
        fetchSubMessages = async (msgId) => {
            const response = await larkClient.sdk.request({
                method: "GET",
                url: `/open-apis/im/v1/messages/${msgId}`,
                params: { user_id_type: "open_id", card_msg_content_type: "raw_card_content" },
            });
            if (response?.code !== 0) {
                throw new Error(`API error: code=${response?.code} msg=${response?.msg}`);
            }
            return response?.data?.items ?? [];
        };
        batchResolveNames = createBatchResolveNames(account, (...args) => trace.info(args.map(String).join(" ")));
    }
    // For interactive messages, fetch full v2 card content via API
    let effectiveContent = event.message.content;
    if (event.message.message_type === "interactive" && expandCtx) {
        const fullContent = await fetchCardContent(event.message.message_id, larkClient);
        if (fullContent) {
            effectiveContent = fullContent;
            trace.info("replaced interactive content with full v2 card data");
        }
    }
    const convertCtx = {
        mentions: mentionMap,
        mentionsByOpenId,
        messageId: event.message.message_id,
        botOpenId,
        cfg: expandCtx?.cfg,
        accountId: acctId,
        resolveUserName: acctId
            ? (openId) => getUserNameCache(acctId).get(openId)
            : undefined,
        fetchSubMessages,
        batchResolveNames,
        stripBotMentions: true,
    };
    const { content, resources } = await convertMessageContent(effectiveContent, event.message.message_type, convertCtx);
    const createTimeStr = event.message.create_time;
    const createTime = createTimeStr ? parseInt(createTimeStr, 10) : undefined;
    return {
        chatId: event.message.chat_id,
        messageId: event.message.message_id,
        senderId: event.sender.sender_id.open_id || "",
        chatType: event.message.chat_type,
        rootId: event.message.root_id || undefined,
        parentId: event.message.parent_id || undefined,
        threadId: event.message.thread_id || undefined,
        content,
        contentType: event.message.message_type,
        resources,
        mentions: mentionList,
        createTime: Number.isNaN(createTime) ? undefined : createTime,
        rawMessage: effectiveContent !== event.message.content
            ? { ...event.message, content: effectiveContent }
            : event.message,
        rawSender: event.sender,
    };
}
//# sourceMappingURL=parse.js.map