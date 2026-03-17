/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * OAuth 2.0 Device Authorization Grant (RFC 8628) for Feishu/Lark.
 *
 * Two-step flow:
 *   1. `requestDeviceAuthorization` – obtains device_code + user_code.
 *   2. `pollDeviceToken` – polls the token endpoint until the user authorises,
 *      rejects, or the code expires.
 *
 * All HTTP calls use the built-in `fetch` (Node 18+). The Lark SDK is not
 * used here because these OAuth endpoints are outside the SDK's scope.
 */
import { trace, feishuFetch, getTraceContext } from "./trace.js";
// ---------------------------------------------------------------------------
// Endpoint resolution
// ---------------------------------------------------------------------------
/**
 * Resolve the two OAuth endpoint URLs based on the configured brand.
 */
export function resolveOAuthEndpoints(brand) {
    if (!brand || brand === "feishu") {
        return {
            deviceAuthorization: "https://accounts.feishu.cn/oauth/v1/device_authorization",
            token: "https://open.feishu.cn/open-apis/authen/v2/oauth/token",
        };
    }
    if (brand === "lark") {
        return {
            deviceAuthorization: "https://accounts.larksuite.com/oauth/v1/device_authorization",
            token: "https://open.larksuite.com/open-apis/authen/v2/oauth/token",
        };
    }
    // Custom domain – derive paths by convention.
    // Smart derivation: open.X → accounts.X for the device authorization endpoint.
    const base = brand.replace(/\/+$/, "");
    let accountsBase = base;
    try {
        const parsed = new URL(base);
        if (parsed.hostname.startsWith("open.")) {
            accountsBase = `${parsed.protocol}//${parsed.hostname.replace(/^open\./, "accounts.")}`;
        }
    }
    catch { /* fallback to base */ }
    return {
        deviceAuthorization: `${accountsBase}/oauth/v1/device_authorization`,
        token: `${base}/open-apis/authen/v2/oauth/token`,
    };
}
// ---------------------------------------------------------------------------
// Step 1 – Device Authorization Request
// ---------------------------------------------------------------------------
/**
 * Request a device authorisation code from the Feishu OAuth server.
 *
 * Uses Confidential Client authentication (HTTP Basic with appId:appSecret).
 * The `offline_access` scope is automatically appended so that the token
 * response includes a refresh_token.
 */
export async function requestDeviceAuthorization(params) {
    const { appId, appSecret, brand } = params;
    const endpoints = resolveOAuthEndpoints(brand);
    // Ensure offline_access is always requested.
    let scope = params.scope ?? "";
    if (!scope.includes("offline_access")) {
        scope = scope ? `${scope} offline_access` : "offline_access";
    }
    const basicAuth = Buffer.from(`${appId}:${appSecret}`).toString("base64");
    const body = new URLSearchParams();
    body.set("client_id", appId);
    body.set("scope", scope);
    trace.info(`device-flow: requesting device authorization (scope="${scope}") url=${endpoints.deviceAuthorization} token_url=${endpoints.token}`);
    trace.info(`device-flow: traceCtx httpHeaders=${JSON.stringify(getTraceContext()?.httpHeaders ?? null)}`);
    const resp = await feishuFetch(endpoints.deviceAuthorization, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${basicAuth}`,
        },
        body: body.toString(),
    });
    const text = await resp.text();
    trace.info(`device-flow: response status=${resp.status} body=${text.slice(0, 500)}`);
    let data;
    try {
        data = JSON.parse(text);
    }
    catch {
        throw new Error(`Device authorization failed: HTTP ${resp.status} – ${text.slice(0, 200)}`);
    }
    if (!resp.ok || data.error) {
        const msg = data.error_description ?? data.error ?? "Unknown error";
        throw new Error(`Device authorization failed: ${msg}`);
    }
    const expiresIn = data.expires_in ?? 240;
    const interval = data.interval ?? 5;
    trace.info(`device-flow: device_code obtained, expires_in=${expiresIn}s (${Math.round(expiresIn / 60)}min), interval=${interval}s`);
    return {
        deviceCode: data.device_code,
        userCode: data.user_code,
        verificationUri: data.verification_uri,
        verificationUriComplete: data.verification_uri_complete ?? data.verification_uri,
        expiresIn,
        interval,
    };
}
// ---------------------------------------------------------------------------
// Step 2 – Poll Token Endpoint
// ---------------------------------------------------------------------------
function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, ms);
        signal?.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new DOMException("Aborted", "AbortError"));
        }, { once: true });
    });
}
/**
 * Poll the token endpoint until the user authorises, rejects, or the code
 * expires.
 *
 * Handles `authorization_pending` (keep polling), `slow_down` (back off by
 * +5 s), `access_denied` and `expired_token` (terminal errors).
 *
 * Pass an `AbortSignal` to cancel polling from the outside.
 */
export async function pollDeviceToken(params) {
    const { appId, appSecret, brand, deviceCode, expiresIn, signal } = params;
    let interval = params.interval;
    const endpoints = resolveOAuthEndpoints(brand);
    const deadline = Date.now() + expiresIn * 1000;
    while (Date.now() < deadline) {
        if (signal?.aborted) {
            return { ok: false, error: "expired_token", message: "Polling was cancelled" };
        }
        await sleep(interval * 1000, signal);
        let data;
        try {
            const resp = await feishuFetch(endpoints.token, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                    device_code: deviceCode,
                    client_id: appId,
                    client_secret: appSecret,
                }).toString(),
            });
            data = (await resp.json());
        }
        catch (err) {
            trace.warn(`device-flow: poll network error: ${err}`);
            continue;
        }
        const error = data.error;
        if (!error && data.access_token) {
            trace.info("device-flow: token obtained successfully");
            const refreshToken = data.refresh_token ?? "";
            const expiresIn = data.expires_in ?? 7200;
            let refreshExpiresIn = data.refresh_token_expires_in ?? 604800;
            if (!refreshToken) {
                trace.warn("device-flow: no refresh_token in response, token will not be refreshable");
                refreshExpiresIn = expiresIn;
            }
            return {
                ok: true,
                token: {
                    accessToken: data.access_token,
                    refreshToken,
                    expiresIn,
                    refreshExpiresIn,
                    scope: data.scope ?? "",
                },
            };
        }
        if (error === "authorization_pending") {
            trace.debug("device-flow: authorization_pending, retrying...");
            continue;
        }
        if (error === "slow_down") {
            interval += 5;
            trace.info(`device-flow: slow_down, interval increased to ${interval}s`);
            continue;
        }
        if (error === "access_denied") {
            trace.info("device-flow: user denied authorization");
            return { ok: false, error: "access_denied", message: "用户拒绝了授权" };
        }
        if (error === "expired_token" || error === "invalid_grant") {
            trace.info(`device-flow: device code expired/invalid (error=${error})`);
            return { ok: false, error: "expired_token", message: "授权码已过期，请重新发起" };
        }
        // Unknown error – treat as terminal.
        const desc = data.error_description ?? error ?? "Unknown error";
        trace.warn(`device-flow: unexpected error: error=${error}, desc=${desc}`);
        return { ok: false, error: "expired_token", message: desc };
    }
    return { ok: false, error: "expired_token", message: "授权超时，请重新发起" };
}
//# sourceMappingURL=device-flow.js.map