/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Access control policies for the Feishu/Lark channel plugin.
 *
 * Provides allowlist matching, group configuration lookup, tool policy
 * extraction, group access checks, and reply policy resolution.
 */
import type { ChannelGroupContext, GroupToolPolicyConfig } from "openclaw/plugin-sdk";
import type { FeishuConfig, FeishuGroupConfig } from "../../core/types.js";
export type FeishuAllowlistMatch = {
    allowed: boolean;
    matchKey?: string;
    matchSource?: "wildcard" | "id" | "name";
};
/**
 * Check whether a sender is permitted by a given allowlist.
 *
 * Entries are normalised to lowercase strings before comparison.
 * A single "*" entry acts as a wildcard that matches everyone.
 * When the allowlist is empty the result is `{ allowed: false }`.
 */
export declare function resolveFeishuAllowlistMatch(params: {
    allowFrom: Array<string | number>;
    senderId: string;
    senderName?: string | null;
}): FeishuAllowlistMatch;
/**
 * Look up the per-group configuration by group ID.
 *
 * Performs a case-insensitive lookup against the keys in `cfg.groups`.
 * Returns `undefined` when no matching group entry is found.
 */
export declare function resolveFeishuGroupConfig(params: {
    cfg?: FeishuConfig;
    groupId?: string | null;
}): FeishuGroupConfig | undefined;
/**
 * Extract the tool policy configuration from the group config that
 * corresponds to the given group context.
 */
export declare function resolveFeishuGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
/**
 * Determine whether an inbound group message should be processed.
 *
 * - `disabled` --> always rejected
 * - `open`     --> always allowed
 * - `allowlist` --> allowed only when the sender matches the allowlist
 */
export declare function isFeishuGroupAllowed(params: {
    groupPolicy: "open" | "allowlist" | "disabled";
    allowFrom: Array<string | number>;
    senderId: string;
    senderName?: string | null;
}): boolean;
/**
 * Resolve whether the bot requires an explicit @-mention to respond.
 *
 * DMs never require a mention.  For groups the precedence is:
 *   groupConfig.requireMention > globalConfig.requireMention > true (default)
 */
export declare function resolveFeishuReplyPolicy(params: {
    isDirectMessage: boolean;
    globalConfig?: FeishuConfig;
    groupConfig?: FeishuGroupConfig;
}): {
    requireMention: boolean;
};
//# sourceMappingURL=policy.d.ts.map