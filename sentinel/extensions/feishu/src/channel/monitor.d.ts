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
import type { ClawdbotConfig, RuntimeEnv } from "openclaw/plugin-sdk";
export type MonitorFeishuOpts = {
    config?: ClawdbotConfig;
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
    accountId?: string;
};
/**
 * Start monitoring for all enabled Feishu accounts (or a single
 * account when `opts.accountId` is specified).
 */
export declare function monitorFeishuProvider(opts?: MonitorFeishuOpts): Promise<void>;
/**
 * Stop monitoring for a specific account or all accounts.
 *
 * Disconnects WebSocket clients and clears cached bot identity.
 */
export declare function stopFeishuMonitor(accountId?: string): void;
//# sourceMappingURL=monitor.d.ts.map