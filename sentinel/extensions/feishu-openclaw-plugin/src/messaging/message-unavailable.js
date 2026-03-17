/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * 消息不可用（已撤回/已删除）状态管理。
 *
 * 目标：
 * 1) 当命中飞书终止错误码（230011/231003）时，按 message_id 标记不可用；
 * 2) 后续针对该 message_id 的 API 调用直接短路，避免持续报错刷屏。
 */
const TERMINAL_MESSAGE_CODES = new Set([230011, 231003]);
const UNAVAILABLE_CACHE_TTL_MS = 30 * 60 * 1000;
const MAX_CACHE_SIZE_BEFORE_PRUNE = 512;
const unavailableMessageCache = new Map();
function normalizeMessageId(messageId) {
    if (!messageId)
        return undefined;
    // 兼容合成 ID：om_xxx:suffix -> om_xxx
    const colonIndex = messageId.indexOf(":");
    if (colonIndex >= 0)
        return messageId.slice(0, colonIndex);
    return messageId;
}
function pruneExpired(nowMs = Date.now()) {
    for (const [messageId, state] of unavailableMessageCache) {
        if (nowMs - state.markedAtMs > UNAVAILABLE_CACHE_TTL_MS) {
            unavailableMessageCache.delete(messageId);
        }
    }
}
function coerceCode(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string") {
        const parsed = Number(value);
        if (Number.isFinite(parsed))
            return parsed;
    }
    return undefined;
}
/**
 * 从 Lark SDK 抛错对象中提取飞书 API code。
 */
export function extractLarkApiCode(err) {
    if (!err || typeof err !== "object")
        return undefined;
    const e = err;
    return (coerceCode(e.code) ??
        coerceCode(e.data?.code) ??
        coerceCode(e.response?.data?.code));
}
export function isTerminalMessageApiCode(code) {
    return typeof code === "number" && TERMINAL_MESSAGE_CODES.has(code);
}
export function markMessageUnavailable(params) {
    const normalizedId = normalizeMessageId(params.messageId);
    if (!normalizedId)
        return;
    if (unavailableMessageCache.size >= MAX_CACHE_SIZE_BEFORE_PRUNE) {
        pruneExpired();
    }
    unavailableMessageCache.set(normalizedId, {
        apiCode: params.apiCode,
        operation: params.operation,
        markedAtMs: Date.now(),
    });
}
export function getMessageUnavailableState(messageId) {
    const normalizedId = normalizeMessageId(messageId);
    if (!normalizedId)
        return undefined;
    const state = unavailableMessageCache.get(normalizedId);
    if (!state)
        return undefined;
    if (Date.now() - state.markedAtMs > UNAVAILABLE_CACHE_TTL_MS) {
        unavailableMessageCache.delete(normalizedId);
        return undefined;
    }
    return state;
}
export function isMessageUnavailable(messageId) {
    return !!getMessageUnavailableState(messageId);
}
export function markMessageUnavailableFromError(params) {
    const normalizedId = normalizeMessageId(params.messageId);
    if (!normalizedId)
        return undefined;
    const code = extractLarkApiCode(params.error);
    if (!isTerminalMessageApiCode(code))
        return undefined;
    markMessageUnavailable({
        messageId: normalizedId,
        apiCode: code,
        operation: params.operation,
    });
    return code;
}
export class MessageUnavailableError extends Error {
    messageId;
    apiCode;
    operation;
    constructor(params) {
        const operationText = params.operation ? `, op=${params.operation}` : "";
        super(`[feishu-message-unavailable] message ${params.messageId} unavailable (code=${params.apiCode}${operationText})`);
        this.name = "MessageUnavailableError";
        this.messageId = params.messageId;
        this.apiCode = params.apiCode;
        this.operation = params.operation;
    }
}
export function isMessageUnavailableError(error) {
    return (error instanceof MessageUnavailableError ||
        (typeof error === "object" &&
            error !== null &&
            error.name === "MessageUnavailableError"));
}
export function assertMessageAvailable(messageId, operation) {
    const normalizedId = normalizeMessageId(messageId);
    if (!normalizedId)
        return;
    const state = getMessageUnavailableState(normalizedId);
    if (!state)
        return;
    throw new MessageUnavailableError({
        messageId: normalizedId,
        apiCode: state.apiCode,
        operation: operation ?? state.operation,
    });
}
/**
 * 针对 message_id 的统一保护：
 * - 调用前检查是否已标记不可用；
 * - 调用报错后识别 230011/231003 并标记；
 * - 命中时抛出 MessageUnavailableError 供上游快速终止流程。
 */
export async function runWithMessageUnavailableGuard(params) {
    const normalizedId = normalizeMessageId(params.messageId);
    if (!normalizedId) {
        return params.fn();
    }
    assertMessageAvailable(normalizedId, params.operation);
    try {
        return await params.fn();
    }
    catch (error) {
        const code = markMessageUnavailableFromError({
            messageId: normalizedId,
            error,
            operation: params.operation,
        });
        if (code) {
            throw new MessageUnavailableError({
                messageId: normalizedId,
                apiCode: code,
                operation: params.operation,
            });
        }
        throw error;
    }
}
//# sourceMappingURL=message-unavailable.js.map