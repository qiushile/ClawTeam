/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Feishu / Lark SDK client management.
 *
 * Provides `LarkClient` — a unified manager for Lark SDK client instances,
 * WebSocket connections, EventDispatcher lifecycle, and bot identity.
 *
 * Consumers obtain instances via factory methods:
 *   - `LarkClient.fromCfg(cfg, accountId)` — resolve account from config
 *   - `LarkClient.fromAccount(account)` — from a pre-resolved account
 *   - `LarkClient.fromCredentials(credentials)` — ephemeral instance (not cached)
 */
import * as Lark from "@larksuiteoapi/node-sdk";
import { getLarkAccount } from "./accounts.js";
import { clearUserNameCache } from "../messaging/inbound/user-name-cache.js";
import { clearChatInfoCache } from "./chat-info-cache.js";
import { getUserAgent } from "./version.js";
// ---------------------------------------------------------------------------
// 注入 User-Agent 到所有飞书 SDK 请求
// ---------------------------------------------------------------------------
const GLOBAL_LARK_USER_AGENT_KEY = "LARK_USER_AGENT";
function installGlobalUserAgent() {
    // node-sdk 内置拦截器最终会读取 global.LARK_USER_AGENT 并覆盖 User-Agent
    globalThis[GLOBAL_LARK_USER_AGENT_KEY] =
        getUserAgent();
}
installGlobalUserAgent();
// 使用 interceptors 在所有 HTTP 请求中注入 User-Agent header
Lark.defaultHttpInstance.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    config.headers["User-Agent"] = getUserAgent();
    return config;
});
// ---------------------------------------------------------------------------
// Brand → SDK domain
// ---------------------------------------------------------------------------
const BRAND_TO_DOMAIN = {
    feishu: Lark.Domain.Feishu,
    lark: Lark.Domain.Lark,
};
/** Map a `LarkBrand` to the SDK `domain` parameter. */
function resolveBrand(brand) {
    return BRAND_TO_DOMAIN[brand ?? "feishu"] ?? brand.replace(/\/+$/, "");
}
// ---------------------------------------------------------------------------
// HTTP header injection
// ---------------------------------------------------------------------------
/**
 * Wrap the SDK's `defaultHttpInstance` to inject custom headers into every
 * outgoing request.
 *
 * The SDK routes all API calls through `httpInstance.request()`, so we only
 * need to override that single method.
 */
function createHttpInstanceWithHeaders(headers) {
    const base = Lark.defaultHttpInstance;
    const wrapper = Object.create(base);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- axios opts
    wrapper.request = ((opts) => base.request({
        ...opts,
        headers: {
            ...opts?.headers,
            ...headers,
            "User-Agent": getUserAgent(), // 确保 User-Agent 被注入（放在最后，避免被 headers 覆盖）
        },
    }));
    return wrapper;
}
// ---------------------------------------------------------------------------
// LarkClient
// ---------------------------------------------------------------------------
/** Instance cache keyed by accountId. */
const cache = new Map();
export class LarkClient {
    account;
    _sdk = null;
    _wsClient = null;
    _botOpenId;
    _botName;
    // ---- Plugin runtime (singleton) ------------------------------------------
    static _runtime = null;
    /** Persist the runtime instance for later retrieval (activate 阶段调用一次). */
    static setRuntime(runtime) {
        LarkClient._runtime = runtime;
    }
    /** Retrieve the stored runtime instance. Throws if not yet initialised. */
    static get runtime() {
        if (!LarkClient._runtime) {
            throw new Error("Feishu plugin runtime has not been initialised. " +
                "Ensure LarkClient.setRuntime() is called during plugin activation.");
        }
        return LarkClient._runtime;
    }
    // --------------------------------------------------------------------------
    constructor(account) {
        this.account = account;
    }
    /** Shorthand for `this.account.accountId`. */
    get accountId() {
        return this.account.accountId;
    }
    // ---- Static factory / cache ------------------------------------------------
    /** Resolve account from config and return a cached `LarkClient`. */
    static fromCfg(cfg, accountId) {
        return LarkClient.fromAccount(getLarkAccount(cfg, accountId));
    }
    /**
     * Get (or create) a cached `LarkClient` for the given account.
     * If the cached instance has stale credentials it is replaced.
     */
    static fromAccount(account) {
        const existing = cache.get(account.accountId);
        if (existing &&
            existing.account.appId === account.appId &&
            existing.account.appSecret === account.appSecret) {
            return existing;
        }
        const instance = new LarkClient(account);
        cache.set(account.accountId, instance);
        return instance;
    }
    /**
     * Create an ephemeral `LarkClient` from bare credentials.
     * The instance is **not** added to the global cache — suitable for
     * one-off probe / diagnose calls that should not pollute account state.
     */
    static fromCredentials(credentials) {
        const base = {
            accountId: credentials.accountId ?? "default",
            enabled: true,
            brand: credentials.brand ?? "feishu",
            config: {},
        };
        const account = credentials.appId && credentials.appSecret
            ? { ...base, configured: true, appId: credentials.appId, appSecret: credentials.appSecret }
            : { ...base, configured: false, appId: credentials.appId, appSecret: credentials.appSecret };
        return new LarkClient(account);
    }
    /** Look up a cached instance by accountId. */
    static get(accountId) {
        return cache.get(accountId) ?? null;
    }
    /**
     * Dispose one or all cached instances.
     * With `accountId` — dispose that single instance.
     * Without — dispose every cached instance and clear the cache.
     */
    static clearCache(accountId) {
        if (accountId !== undefined) {
            cache.get(accountId)?.dispose();
            clearUserNameCache(accountId);
            clearChatInfoCache(accountId);
        }
        else {
            for (const inst of cache.values())
                inst.disconnect();
            cache.clear();
            clearUserNameCache();
            clearChatInfoCache();
        }
    }
    // ---- SDK client (lazy) -----------------------------------------------------
    /** Lazily-created Lark SDK client. */
    get sdk() {
        if (!this._sdk) {
            const { appId, appSecret } = this.requireCredentials();
            const httpHeaders = this.account.extra?.httpHeaders;
            const clientOpts = {
                appId,
                appSecret,
                appType: Lark.AppType.SelfBuild,
                domain: resolveBrand(this.account.brand),
            };
            // 如果有额外的 HTTP headers（如 x-tt-env），仍然需要包装 httpInstance
            if (httpHeaders && Object.keys(httpHeaders).length > 0) {
                clientOpts.httpInstance = createHttpInstanceWithHeaders(httpHeaders);
            }
            this._sdk = new Lark.Client(clientOpts);
        }
        return this._sdk;
    }
    // ---- Bot identity ----------------------------------------------------------
    /**
     * Probe bot identity via the `bot/v3/info` API.
     * Results are cached on the instance for subsequent access via
     * `botOpenId` / `botName`.
     */
    async probe() {
        if (!this.account.appId || !this.account.appSecret) {
            return { ok: false, error: "missing credentials (appId, appSecret)" };
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = await this.sdk.request({
                method: "GET",
                url: "/open-apis/bot/v3/info",
                data: {},
            });
            if (res.code !== 0) {
                return {
                    ok: false,
                    appId: this.account.appId,
                    error: `API error: ${res.msg || `code ${res.code}`}`,
                };
            }
            const bot = res.bot || res.data?.bot;
            this._botOpenId = bot?.open_id;
            this._botName = bot?.bot_name;
            return {
                ok: true,
                appId: this.account.appId,
                botName: this._botName,
                botOpenId: this._botOpenId,
            };
        }
        catch (err) {
            return {
                ok: false,
                appId: this.account.appId,
                error: err instanceof Error ? err.message : String(err),
            };
        }
    }
    /** Cached bot open_id (available after `probe()` or `startWS()`). */
    get botOpenId() {
        return this._botOpenId;
    }
    /** Cached bot name (available after `probe()` or `startWS()`). */
    get botName() {
        return this._botName;
    }
    // ---- WebSocket lifecycle ---------------------------------------------------
    /**
     * Start WebSocket event monitoring.
     *
     * Flow: probe bot identity → EventDispatcher → WSClient → start.
     * The returned Promise resolves when `abortSignal` fires.
     */
    async startWS(opts) {
        const { handlers, abortSignal, autoProbe = true } = opts;
        if (autoProbe)
            await this.probe();
        const dispatcher = new Lark.EventDispatcher({
            encryptKey: this.account.encryptKey ?? "",
            verificationToken: this.account.verificationToken ?? "",
        });
        dispatcher.register(handlers);
        const { appId, appSecret } = this.requireCredentials();
        const httpHeaders = this.account.extra?.httpHeaders;
        const wsOpts = {
            appId,
            appSecret,
            domain: resolveBrand(this.account.brand),
            loggerLevel: Lark.LoggerLevel.info,
        };
        // 如果有额外的 HTTP headers（如 x-tt-env），仍然需要包装 httpInstance
        if (httpHeaders && Object.keys(httpHeaders).length > 0) {
            wsOpts.httpInstance = createHttpInstanceWithHeaders(httpHeaders);
        }
        this._wsClient = new Lark.WSClient(wsOpts);
        // SDK 的 handleEventData 只处理 type="event"，card action 回调是 type="card" 会被丢弃。
        // 打 patch 将 "card" 类型消息改成 "event" 后交给原 handler，让 EventDispatcher 正常路由。
        const wsClientAny = this._wsClient;
        const origHandleEventData = wsClientAny.handleEventData.bind(wsClientAny);
        wsClientAny.handleEventData = (data) => {
            const msgType = data.headers?.find?.((h) => h.key === "type")?.value;
            if (msgType === "card") {
                const patchedData = {
                    ...data,
                    headers: data.headers.map((h) => h.key === "type" ? { ...h, value: "event" } : h),
                };
                return origHandleEventData(patchedData);
            }
            return origHandleEventData(data);
        };
        await this.waitForAbort(dispatcher, abortSignal);
    }
    /** Whether a WebSocket client is currently active. */
    get wsConnected() {
        return this._wsClient !== null;
    }
    /** Disconnect WebSocket but keep instance in cache. */
    disconnect() {
        if (this._wsClient) {
            try {
                this._wsClient.close({ force: true });
            }
            catch {
                // Ignore errors during close — the client may already be torn down.
            }
        }
        this._wsClient = null;
    }
    /** Disconnect + remove from cache. */
    dispose() {
        this.disconnect();
        cache.delete(this.accountId);
    }
    // ---- Private helpers -------------------------------------------------------
    /** Assert credentials exist or throw. */
    requireCredentials() {
        const appId = this.account.appId;
        const appSecret = this.account.appSecret;
        if (!appId || !appSecret) {
            throw new Error(`LarkClient[${this.accountId}]: appId and appSecret are required`);
        }
        return { appId, appSecret };
    }
    /**
     * Start the WSClient and return a promise that resolves when the
     * abort signal fires (or immediately if already aborted).
     */
    waitForAbort(dispatcher, signal) {
        return new Promise((resolve, reject) => {
            if (signal?.aborted) {
                this.disconnect();
                return resolve();
            }
            signal?.addEventListener("abort", () => {
                this.disconnect();
                resolve();
            }, { once: true });
            try {
                void this._wsClient.start({ eventDispatcher: dispatcher });
            }
            catch (err) {
                this.disconnect();
                reject(err);
            }
        });
    }
}
//# sourceMappingURL=lark-client.js.map