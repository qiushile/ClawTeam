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
import { type ClawdbotConfig, type RuntimeEnv } from "openclaw/plugin-sdk";
export type CreateFeishuReplyDispatcherParams = {
    cfg: ClawdbotConfig;
    agentId: string;
    runtime: RuntimeEnv;
    chatId: string;
    replyToMessageId?: string;
    /** Account ID for multi-account support. */
    accountId?: string;
    /** Chat type for scene-aware reply mode selection. */
    chatType?: "p2p" | "group";
    /** When true, typing indicators are suppressed entirely. */
    skipTyping?: boolean;
    /** When true, replies are sent into the thread instead of main chat. */
    replyInThread?: boolean;
};
export declare function createFeishuReplyDispatcher(params: CreateFeishuReplyDispatcherParams): any;
//# sourceMappingURL=reply-dispatcher.d.ts.map