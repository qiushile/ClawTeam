/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Access control policies for the Feishu/Lark channel plugin.
 *
 * Provides allowlist matching, group configuration lookup, tool policy
 * extraction, group access checks, and reply policy resolution.
 */
/**
 * Check whether a sender is permitted by a given allowlist.
 *
 * Entries are normalised to lowercase strings before comparison.
 * A single "*" entry acts as a wildcard that matches everyone.
 * When the allowlist is empty the result is `{ allowed: false }`.
 */
export function resolveFeishuAllowlistMatch(params) {
    const allowFrom = params.allowFrom
        .map((entry) => String(entry).trim().toLowerCase())
        .filter(Boolean);
    if (allowFrom.length === 0) {
        return { allowed: false };
    }
    // Wildcard: allow everyone
    if (allowFrom.includes("*")) {
        return { allowed: true, matchKey: "*", matchSource: "wildcard" };
    }
    // Match by sender ID
    const senderId = params.senderId.toLowerCase();
    if (allowFrom.includes(senderId)) {
        return { allowed: true, matchKey: senderId, matchSource: "id" };
    }
    // Match by sender display name
    const senderName = params.senderName?.toLowerCase();
    if (senderName && allowFrom.includes(senderName)) {
        return { allowed: true, matchKey: senderName, matchSource: "name" };
    }
    return { allowed: false };
}
// ---------------------------------------------------------------------------
// Group configuration lookup
// ---------------------------------------------------------------------------
/**
 * Look up the per-group configuration by group ID.
 *
 * Performs a case-insensitive lookup against the keys in `cfg.groups`.
 * Returns `undefined` when no matching group entry is found.
 */
export function resolveFeishuGroupConfig(params) {
    const groups = params.cfg?.groups ?? {};
    const groupId = params.groupId?.trim();
    if (!groupId) {
        return undefined;
    }
    // Direct (exact-key) lookup first
    const direct = groups[groupId];
    if (direct) {
        return direct;
    }
    // Case-insensitive fallback
    const lowered = groupId.toLowerCase();
    const matchKey = Object.keys(groups).find((key) => key.toLowerCase() === lowered);
    return matchKey ? groups[matchKey] : undefined;
}
// ---------------------------------------------------------------------------
// Group tool policy
// ---------------------------------------------------------------------------
/**
 * Extract the tool policy configuration from the group config that
 * corresponds to the given group context.
 */
export function resolveFeishuGroupToolPolicy(params) {
    const cfg = params.cfg.channels?.feishu;
    if (!cfg) {
        return undefined;
    }
    const groupConfig = resolveFeishuGroupConfig({
        cfg,
        groupId: params.groupId,
    });
    return groupConfig?.tools;
}
// ---------------------------------------------------------------------------
// Group access gate
// ---------------------------------------------------------------------------
/**
 * Determine whether an inbound group message should be processed.
 *
 * - `disabled` --> always rejected
 * - `open`     --> always allowed
 * - `allowlist` --> allowed only when the sender matches the allowlist
 */
export function isFeishuGroupAllowed(params) {
    const { groupPolicy } = params;
    if (groupPolicy === "disabled") {
        return false;
    }
    if (groupPolicy === "open") {
        return true;
    }
    // allowlist
    return resolveFeishuAllowlistMatch(params).allowed;
}
// ---------------------------------------------------------------------------
// Reply policy (mention requirement)
// ---------------------------------------------------------------------------
/**
 * Resolve whether the bot requires an explicit @-mention to respond.
 *
 * DMs never require a mention.  For groups the precedence is:
 *   groupConfig.requireMention > globalConfig.requireMention > true (default)
 */
export function resolveFeishuReplyPolicy(params) {
    if (params.isDirectMessage) {
        return { requireMention: false };
    }
    const requireMention = params.groupConfig?.requireMention ??
        params.globalConfig?.requireMention ??
        true;
    return { requireMention };
}
//# sourceMappingURL=policy.js.map