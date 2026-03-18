/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Configuration merge helpers for Feishu account management.
 *
 * Centralises the pattern of merging a partial configuration patch
 * into the Feishu section of the top-level ClawdbotConfig, handling
 * both the default account (top-level fields) and named accounts
 * (nested under `accounts`).
 */
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk";
/** Generic Feishu account config merge. */
function mergeFeishuAccountConfig(cfg, accountId, patch) {
    const isDefault = !accountId || accountId === DEFAULT_ACCOUNT_ID;
    if (isDefault) {
        return {
            ...cfg,
            channels: {
                ...cfg.channels,
                feishu: { ...cfg.channels?.feishu, ...patch },
            },
        };
    }
    const feishuCfg = cfg.channels?.feishu;
    return {
        ...cfg,
        channels: {
            ...cfg.channels,
            feishu: {
                ...feishuCfg,
                accounts: {
                    ...feishuCfg?.accounts,
                    [accountId]: { ...feishuCfg?.accounts?.[accountId], ...patch },
                },
            },
        },
    };
}
/** Set the `enabled` flag on a Feishu account. */
export function setAccountEnabled(cfg, accountId, enabled) {
    return mergeFeishuAccountConfig(cfg, accountId, { enabled });
}
/** Apply an arbitrary config patch to a Feishu account. */
export function applyAccountConfig(cfg, accountId, patch) {
    return mergeFeishuAccountConfig(cfg, accountId, patch);
}
/** Delete a Feishu account entry from the config. */
export function deleteAccount(cfg, accountId) {
    const isDefault = !accountId || accountId === DEFAULT_ACCOUNT_ID;
    if (isDefault) {
        // Delete entire feishu config
        const next = { ...cfg };
        const nextChannels = { ...cfg.channels };
        delete nextChannels.feishu;
        if (Object.keys(nextChannels).length > 0) {
            next.channels = nextChannels;
        }
        else {
            delete next.channels;
        }
        return next;
    }
    // Delete specific account from accounts
    const feishuCfg = cfg.channels?.feishu;
    const accounts = { ...feishuCfg?.accounts };
    delete accounts[accountId];
    return {
        ...cfg,
        channels: {
            ...cfg.channels,
            feishu: {
                ...feishuCfg,
                accounts: Object.keys(accounts).length > 0 ? accounts : undefined,
            },
        },
    };
}
//# sourceMappingURL=config-adapter.js.map