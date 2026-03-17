/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * UAT (User Access Token) API call wrapper.
 *
 * Provides a safe, auto-refreshing interface for making Feishu API calls on
 * behalf of a user.  Tokens are read from the OS Keychain, refreshed
 * transparently, and **never** exposed to the AI layer.
 */
import { getStoredToken, setStoredToken, removeStoredToken, tokenStatus, maskToken, } from "./token-store.js";
import { resolveOAuthEndpoints } from "./device-flow.js";
import { trace, feishuFetch } from "./trace.js";
import { LarkClient } from "./lark-client.js";
import { getAppOwnerFallback } from "./app-owner-fallback.js";
// ---------------------------------------------------------------------------
// Per-user refresh lock
// ---------------------------------------------------------------------------
/**
 * Guards against concurrent refresh operations for the same user.
 *
 * refresh_token is single-use: if two requests trigger a refresh
 * simultaneously, the second one would use an already-consumed token and
 * fail.  The lock ensures only one refresh runs at a time per user.
 */
const refreshLocks = new Map();
// ---------------------------------------------------------------------------
// Refresh implementation
// ---------------------------------------------------------------------------
async function doRefreshToken(opts, stored) {
    // refresh_token already expired → can't refresh, need re-auth.
    if (Date.now() >= stored.refreshExpiresAt) {
        trace.info(`uat-client: refresh_token expired for ${opts.userOpenId}, clearing`);
        await removeStoredToken(opts.appId, opts.userOpenId);
        return null;
    }
    const endpoints = resolveOAuthEndpoints(opts.domain);
    const resp = await feishuFetch(endpoints.token, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: stored.refreshToken,
            client_id: opts.appId,
            client_secret: opts.appSecret,
        }).toString(),
    });
    const data = (await resp.json());
    // Feishu v2 token endpoint returns `code: 0` on success.
    // Some responses use `error` field instead (standard OAuth).
    const code = data.code;
    const error = data.error;
    if ((code !== undefined && code !== 0) || error) {
        const errCode = code ?? error;
        const errMsg = data.error_description ?? data.msg ?? "unknown";
        // Known irrecoverable codes: invalid/expired/missing refresh_token
        if (code === 20003 || code === 20004 || code === 20024 || code === 20063) {
            trace.warn(`uat-client: refresh failed (code=${errCode}), clearing token for ${opts.userOpenId}`);
            await removeStoredToken(opts.appId, opts.userOpenId);
            return null;
        }
        throw new Error(`Token refresh failed (code=${errCode}): ${errMsg}`);
    }
    if (!data.access_token) {
        throw new Error("Token refresh returned no access_token");
    }
    const now = Date.now();
    const updated = {
        userOpenId: stored.userOpenId,
        appId: opts.appId,
        accessToken: data.access_token,
        // refresh_token is rotated – always use the new one.
        refreshToken: data.refresh_token ?? stored.refreshToken,
        expiresAt: now + (data.expires_in ?? 7200) * 1000,
        refreshExpiresAt: data.refresh_token_expires_in
            ? now + data.refresh_token_expires_in * 1000
            : stored.refreshExpiresAt,
        scope: data.scope ?? stored.scope,
        grantedAt: stored.grantedAt,
    };
    await setStoredToken(updated);
    trace.info(`uat-client: refreshed UAT for ${opts.userOpenId} (at:${maskToken(updated.accessToken)})`);
    return updated;
}
/**
 * Refresh with per-user locking.
 */
async function refreshWithLock(opts, stored) {
    const key = `${opts.appId}:${opts.userOpenId}`;
    // Another refresh is already in-flight – wait for it and re-read.
    const existing = refreshLocks.get(key);
    if (existing) {
        await existing;
        return getStoredToken(opts.appId, opts.userOpenId);
    }
    const promise = doRefreshToken(opts, stored);
    refreshLocks.set(key, promise);
    try {
        return await promise;
    }
    finally {
        refreshLocks.delete(key);
    }
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
/**
 * Obtain a valid access_token for the given user.
 *
 * - Reads from Keychain.
 * - Refreshes proactively if the token is about to expire.
 * - Throws when no token exists or refresh fails irrecoverably.
 *
 * **The returned token must never be exposed to the AI layer.**
 */
export async function getValidAccessToken(opts) {
    // 1. Check App Owner (拦截非所有者，即使有 Token 也不允许使用)
    // 构造临时 account 对象以调用 getAppOwnerFallback
    const tempAccount = {
        accountId: "temp",
        enabled: true,
        configured: true,
        brand: opts.domain,
        appId: opts.appId,
        appSecret: opts.appSecret,
        config: {},
    };
    try {
        const sdk = LarkClient.fromAccount(tempAccount).sdk;
        const appOwnerId = await getAppOwnerFallback(tempAccount, sdk);
        if (appOwnerId && appOwnerId !== opts.userOpenId) {
            trace.warn(`uat-client: blocking non-owner access for user ${opts.userOpenId} (owner=${appOwnerId})`);
            // 抛出 NeedAuthorizationError 会导致前端弹出授权卡片，但用户授权后依然会被拦截
            // 这里抛出普通 Error，前端会显示错误信息
            throw new Error("Permission denied: Only the app owner is authorized to use this feature.");
        }
    }
    catch (err) {
        // 忽略获取 owner 失败的错误（fail open），避免影响正常流程
        // 除非错误是我们自己抛出的 Permission denied
        if (err.message && err.message.includes("Permission denied")) {
            throw err;
        }
        trace.warn(`uat-client: failed to check app owner, proceeding: ${err}`);
    }
    let stored = await getStoredToken(opts.appId, opts.userOpenId);
    if (!stored) {
        throw new NeedAuthorizationError(opts.userOpenId);
    }
    const status = tokenStatus(stored);
    if (status === "valid") {
        return stored.accessToken;
    }
    if (status === "needs_refresh") {
        const refreshed = await refreshWithLock(opts, stored);
        if (!refreshed) {
            throw new NeedAuthorizationError(opts.userOpenId);
        }
        return refreshed.accessToken;
    }
    // expired
    await removeStoredToken(opts.appId, opts.userOpenId);
    throw new NeedAuthorizationError(opts.userOpenId);
}
/**
 * Execute an API call with a valid UAT, retrying once on token-expiry errors.
 */
export async function callWithUAT(opts, apiCall) {
    const accessToken = await getValidAccessToken(opts);
    try {
        return await apiCall(accessToken);
    }
    catch (err) {
        // Retry once if the server reports token invalid/expired.
        const code = err?.code ?? err?.response?.data?.code;
        if (code === 99991668 || code === 99991669) {
            trace.warn(`uat-client: API call failed (code=${code}), refreshing and retrying`);
            const stored = await getStoredToken(opts.appId, opts.userOpenId);
            if (!stored)
                throw new NeedAuthorizationError(opts.userOpenId);
            const refreshed = await refreshWithLock(opts, stored);
            if (!refreshed)
                throw new NeedAuthorizationError(opts.userOpenId);
            return await apiCall(refreshed.accessToken);
        }
        throw err;
    }
}
/**
 * Query the authorisation status for a user (does **not** trigger refresh).
 */
export async function getUATStatus(appId, userOpenId) {
    const stored = await getStoredToken(appId, userOpenId);
    if (!stored) {
        return { authorized: false, userOpenId };
    }
    return {
        authorized: true,
        userOpenId,
        scope: stored.scope,
        expiresAt: stored.expiresAt,
        refreshExpiresAt: stored.refreshExpiresAt,
        grantedAt: stored.grantedAt,
        tokenStatus: tokenStatus(stored),
    };
}
/**
 * Revoke a user's UAT by removing it from the Keychain.
 */
export async function revokeUAT(appId, userOpenId) {
    await removeStoredToken(appId, userOpenId);
    trace.info(`uat-client: revoked UAT for ${userOpenId}`);
}
// ---------------------------------------------------------------------------
// Error class
// ---------------------------------------------------------------------------
/**
 * Thrown when no valid UAT exists and the user needs to (re-)authorise.
 * Callers should catch this and trigger the OAuth flow.
 */
export class NeedAuthorizationError extends Error {
    userOpenId;
    constructor(userOpenId) {
        super("need_user_authorization");
        this.name = "NeedAuthorizationError";
        this.userOpenId = userOpenId;
    }
}
//# sourceMappingURL=uat-client.js.map