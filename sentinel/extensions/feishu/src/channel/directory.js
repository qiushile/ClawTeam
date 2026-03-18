/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Directory listing for Feishu peers (users) and groups.
 *
 * Provides both config-based (offline) and live API directory
 * lookups so the outbound subsystem and UI can resolve targets.
 */
import { getLarkAccount } from "../core/accounts.js";
import { LarkClient } from "../core/lark-client.js";
import { normalizeFeishuTarget } from "../core/targets.js";
// ---------------------------------------------------------------------------
// Config-based (offline) directory
// ---------------------------------------------------------------------------
/**
 * List users known from the channel config (allowFrom + dms fields).
 *
 * Does not make any API calls -- useful when the bot is not yet
 * connected or when credentials are unavailable.
 */
export async function listFeishuDirectoryPeers(params) {
    const account = getLarkAccount(params.cfg, params.accountId);
    const feishuCfg = account.config;
    const q = params.query?.trim().toLowerCase() || "";
    const ids = new Set();
    // Collect from allowFrom entries.
    for (const entry of feishuCfg?.allowFrom ?? []) {
        const trimmed = String(entry).trim();
        if (trimmed && trimmed !== "*") {
            ids.add(trimmed);
        }
    }
    // Collect from per-user DM config keys.
    for (const userId of Object.keys(feishuCfg?.dms ?? {})) {
        const trimmed = userId.trim();
        if (trimmed) {
            ids.add(trimmed);
        }
    }
    return Array.from(ids)
        .map((raw) => raw.trim())
        .filter(Boolean)
        .map((raw) => normalizeFeishuTarget(raw) ?? raw)
        .filter((id) => (q ? id.toLowerCase().includes(q) : true))
        .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
        .map((id) => ({ kind: "user", id }));
}
/**
 * List groups known from the channel config (groups + groupAllowFrom).
 */
export async function listFeishuDirectoryGroups(params) {
    const account = getLarkAccount(params.cfg, params.accountId);
    const feishuCfg = account.config;
    const q = params.query?.trim().toLowerCase() || "";
    const ids = new Set();
    // Collect from per-group config keys.
    for (const groupId of Object.keys(feishuCfg?.groups ?? {})) {
        const trimmed = groupId.trim();
        if (trimmed && trimmed !== "*") {
            ids.add(trimmed);
        }
    }
    // Collect from groupAllowFrom entries.
    for (const entry of feishuCfg?.groupAllowFrom ?? []) {
        const trimmed = String(entry).trim();
        if (trimmed && trimmed !== "*") {
            ids.add(trimmed);
        }
    }
    return Array.from(ids)
        .map((raw) => raw.trim())
        .filter(Boolean)
        .filter((id) => (q ? id.toLowerCase().includes(q) : true))
        .slice(0, params.limit && params.limit > 0 ? params.limit : undefined)
        .map((id) => ({ kind: "group", id }));
}
// ---------------------------------------------------------------------------
// Live API directory
// ---------------------------------------------------------------------------
/**
 * List users via the Feishu contact/v3/users API.
 *
 * Falls back to config-based listing when credentials are missing or
 * the API call fails.
 */
export async function listFeishuDirectoryPeersLive(params) {
    const account = getLarkAccount(params.cfg, params.accountId);
    if (!account.configured) {
        return listFeishuDirectoryPeers(params);
    }
    try {
        const client = LarkClient.fromAccount(account).sdk;
        const peers = [];
        const limit = params.limit ?? 50;
        const response = await client.contact.user.list({
            params: {
                page_size: Math.min(limit, 50),
            },
        });
        if (response.code === 0 && response.data?.items) {
            for (const user of response.data.items) {
                if (user.open_id) {
                    const q = params.query?.trim().toLowerCase() || "";
                    const name = user.name || "";
                    if (!q || user.open_id.toLowerCase().includes(q) || name.toLowerCase().includes(q)) {
                        peers.push({
                            kind: "user",
                            id: user.open_id,
                            name: name || undefined,
                        });
                    }
                }
                if (peers.length >= limit) {
                    break;
                }
            }
        }
        return peers;
    }
    catch {
        // Fallback to config-based listing on API failure.
        return listFeishuDirectoryPeers(params);
    }
}
/**
 * List groups via the Feishu im/v1/chats API.
 *
 * Falls back to config-based listing when credentials are missing or
 * the API call fails.
 */
export async function listFeishuDirectoryGroupsLive(params) {
    const account = getLarkAccount(params.cfg, params.accountId);
    if (!account.configured) {
        return listFeishuDirectoryGroups(params);
    }
    try {
        const client = LarkClient.fromAccount(account).sdk;
        const groups = [];
        const limit = params.limit ?? 50;
        const response = await client.im.chat.list({
            params: {
                page_size: Math.min(limit, 100),
            },
        });
        if (response.code === 0 && response.data?.items) {
            for (const chat of response.data.items) {
                if (chat.chat_id) {
                    const q = params.query?.trim().toLowerCase() || "";
                    const name = chat.name || "";
                    if (!q || chat.chat_id.toLowerCase().includes(q) || name.toLowerCase().includes(q)) {
                        groups.push({
                            kind: "group",
                            id: chat.chat_id,
                            name: name || undefined,
                        });
                    }
                }
                if (groups.length >= limit) {
                    break;
                }
            }
        }
        return groups;
    }
    catch {
        // Fallback to config-based listing on API failure.
        return listFeishuDirectoryGroups(params);
    }
}
//# sourceMappingURL=directory.js.map