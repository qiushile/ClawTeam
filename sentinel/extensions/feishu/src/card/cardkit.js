/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * CardKit streaming APIs for Feishu/Lark.
 */
import { LarkClient } from "../core/lark-client.js";
import { normalizeFeishuTarget, resolveReceiveIdType } from "../core/targets.js";
import { trace } from "../core/trace.js";
import { runWithMessageUnavailableGuard } from "../messaging/message-unavailable.js";
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * 规范化 message_id，处理合成的 ID（如 "om_xxx:auth-complete"）
 * 提取真实的飞书 message_id 部分
 */
function normalizeMessageId(messageId) {
    if (!messageId)
        return messageId;
    // 如果包含冒号，说明是合成的 ID（如 "om_xxx:suffix"），提取真实部分
    if (messageId.includes(':')) {
        return messageId.split(':')[0];
    }
    return messageId;
}
// ---------------------------------------------------------------------------
// CardKit streaming APIs
// ---------------------------------------------------------------------------
/**
 * Create a card entity via the CardKit API.
 *
 * Returns the card_id directly, bypassing the idConvert step.
 * The card can then be sent via IM API and streamed via CardKit.
 */
export async function createCardEntity(params) {
    const { cfg, card, accountId } = params;
    const client = LarkClient.fromCfg(cfg, accountId).sdk;
    const response = await client.cardkit.v1.card.create({
        data: {
            type: "card_json",
            data: JSON.stringify(card),
        },
    });
    const cardId = response?.data?.card_id
        ?? response?.card_id
        ?? null;
    trace.info(`cardkit card.create: code=${response?.code}, card_id=${cardId}`);
    return cardId;
}
/**
 * Stream text content to a specific card element using the CardKit API.
 *
 * The card automatically diffs the new content against the previous
 * content and renders incremental changes with a typewriter animation.
 *
 * @param params.cardId    - CardKit card ID (from `convertMessageToCardId`).
 * @param params.elementId - The element ID to update (e.g. `STREAMING_ELEMENT_ID`).
 * @param params.content   - The full cumulative text (not a delta).
 * @param params.sequence  - Monotonically increasing sequence number.
 */
export async function streamCardContent(params) {
    const { cfg, cardId, elementId, content, sequence, accountId } = params;
    const client = LarkClient.fromCfg(cfg, accountId).sdk;
    const resp = await client.cardkit.v1.cardElement.content({
        data: { content, sequence },
        path: { card_id: cardId, element_id: elementId },
    });
    const code = resp?.code;
    trace.debug(`cardkit cardElement.content: code=${code}, seq=${sequence}, contentLen=${content.length}`);
    if (code && code !== 0) {
        trace.warn(`cardkit cardElement.content FAILED: seq=${sequence}, fullResponse=${JSON.stringify(resp)}`);
    }
}
/**
 * Fully replace a card using the CardKit API.
 *
 * Used for the final "complete" state update (with action buttons, green
 * header, etc.) after streaming finishes.
 *
 * @param params.cardId   - CardKit card ID.
 * @param params.card     - The new card JSON content.
 * @param params.sequence - Monotonically increasing sequence number.
 */
export async function updateCardKitCard(params) {
    const { cfg, cardId, card, sequence, accountId } = params;
    const client = LarkClient.fromCfg(cfg, accountId).sdk;
    const resp = await client.cardkit.v1.card.update({
        data: {
            card: { type: "card_json", data: JSON.stringify(card) },
            sequence,
        },
        path: { card_id: cardId },
    });
    const code = resp?.code;
    trace.info(`cardkit card.update: code=${code}, msg=${resp?.msg}, seq=${sequence}`);
    if (code && code !== 0) {
        trace.warn(`cardkit card.update FAILED: seq=${sequence}, fullResponse=${JSON.stringify(resp)}`);
    }
}
export async function updateCardKitCardForAuth(params) {
    const { cfg, cardId, card, sequence, accountId } = params;
    const client = LarkClient.fromCfg(cfg, accountId).sdk;
    const resp = await client.cardkit.v1.card.update({
        data: {
            card: { type: "card_json", data: JSON.stringify(card) },
            sequence,
        },
        path: { card_id: cardId },
    });
    const code = resp?.code;
    trace.info(`cardkit card.update: code=${code}, msg=${resp?.msg}, seq=${sequence}, cardId=${cardId}`);
    if (code && code !== 0) {
        const msg = `cardkit card.update FAILED: seq=${sequence}, fullResponse=${JSON.stringify(resp)}`;
        trace.warn(msg);
        throw new Error(msg);
    }
}
/**
 * Send an interactive card message by referencing a CardKit card_id.
 *
 * The content format is: {"type":"card","data":{"card_id":"xxx"}}
 * This links the IM message to the CardKit card entity, enabling
 * streaming updates via cardElement.content().
 */
export async function sendCardByCardId(params) {
    const { cfg, to, cardId, replyToMessageId, replyInThread, accountId } = params;
    const client = LarkClient.fromCfg(cfg, accountId).sdk;
    const contentPayload = JSON.stringify({
        type: "card",
        data: { card_id: cardId },
    });
    if (replyToMessageId) {
        // 规范化 message_id，处理合成 ID（如 "om_xxx:auth-complete"）
        const normalizedId = normalizeMessageId(replyToMessageId);
        const response = await runWithMessageUnavailableGuard({
            messageId: normalizedId,
            operation: "im.message.reply(interactive.cardkit)",
            fn: () => client.im.message.reply({
                path: { message_id: normalizedId },
                data: { content: contentPayload, msg_type: "interactive", reply_in_thread: replyInThread },
            }),
        });
        return {
            messageId: response?.data?.message_id ?? "",
            chatId: response?.data?.chat_id ?? "",
        };
    }
    const target = normalizeFeishuTarget(to);
    if (!target) {
        throw new Error(`[feishu-send] Invalid target: "${to}"`);
    }
    const receiveIdType = resolveReceiveIdType(target);
    const response = await client.im.message.create({
        params: { receive_id_type: receiveIdType },
        data: {
            receive_id: target,
            msg_type: "interactive",
            content: contentPayload,
        },
    });
    return {
        messageId: response?.data?.message_id ?? "",
        chatId: response?.data?.chat_id ?? "",
    };
}
/**
 * Close (or open) the streaming mode on a CardKit card.
 *
 * Must be called after streaming is complete to restore normal card
 * behaviour (forwarding, interaction callbacks, etc.).
 */
export async function setCardStreamingMode(params) {
    const { cfg, cardId, streamingMode, sequence, accountId } = params;
    const client = LarkClient.fromCfg(cfg, accountId).sdk;
    const resp = await client.cardkit.v1.card.settings({
        data: {
            settings: JSON.stringify({ streaming_mode: streamingMode }),
            sequence,
        },
        path: { card_id: cardId },
    });
    const code = resp?.code;
    trace.info(`cardkit card.settings: code=${code}, msg=${resp?.msg}, seq=${sequence}, streaming_mode=${streamingMode}`);
    if (code && code !== 0) {
        trace.warn(`cardkit card.settings FAILED: seq=${sequence}, fullResponse=${JSON.stringify(resp)}`);
    }
}
//# sourceMappingURL=cardkit.js.map