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
import type { ClawdbotConfig, RuntimeEnv, HistoryEntry } from "openclaw/plugin-sdk";
import type { FeishuReactionCreatedEvent } from "../types.js";
export declare function handleFeishuReaction(params: {
    cfg: ClawdbotConfig;
    event: FeishuReactionCreatedEvent;
    botOpenId?: string;
    runtime?: RuntimeEnv;
    chatHistories?: Map<string, HistoryEntry[]>;
    accountId?: string;
}): Promise<void>;
//# sourceMappingURL=reaction-handler.d.ts.map