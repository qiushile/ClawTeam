/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Request-level tracing for the Feishu plugin.
 *
 * Uses Node.js AsyncLocalStorage to propagate a trace context (message_id,
 * chat_id, account_id) through the entire async call chain without passing
 * parameters explicitly.  Call {@link withTrace} at the event entry point
 * (monitor.ts) and use {@link trace} anywhere downstream to emit logs
 * that are automatically tagged with the originating message_id.
 */
import { AsyncLocalStorage } from "node:async_hooks";
import { getUserAgent } from "./version.js";
// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------
const store = new AsyncLocalStorage();
/** Stored logger functions, defaults to console. */
let logFn = console.log;
let errorFn = console.error;
/**
 * Set the logger functions for trace output.
 *
 * Should be called once during plugin activation (or when the first
 * monitor starts) with the RuntimeEnv log/error functions so trace
 * output is routed to gateway.log.
 */
export function setTraceLogger(log, error) {
    logFn = log;
    errorFn = error;
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
/**
 * Run `fn` within a trace context.  All async operations spawned inside
 * `fn` will inherit the context and can access it via {@link getTraceContext}
 * or use the {@link trace} logger which auto-prefixes the message_id.
 */
export function withTrace(ctx, fn) {
    return store.run(ctx, fn);
}
/** Return the current trace context, or `undefined` if not inside withTrace. */
export function getTraceContext() {
    return store.getStore();
}
// ---------------------------------------------------------------------------
// Logger
// ---------------------------------------------------------------------------
function buildPrefix() {
    const ctx = store.getStore();
    if (!ctx)
        return "feishu:";
    return `feishu[${ctx.accountId}][msg:${ctx.messageId}]:`;
}
function getLog() {
    return logFn;
}
function getError() {
    return errorFn;
}
export const trace = {
    info(msg) {
        getLog()(`${buildPrefix()} ${msg}`);
    },
    warn(msg) {
        getLog()(`${buildPrefix()} [WARN] ${msg}`);
    },
    error(msg) {
        getError()(`${buildPrefix()} ${msg}`);
    },
    debug(msg) {
        getLog()(`${buildPrefix()} [DEBUG] ${msg}`);
    },
    /** Milliseconds elapsed since the trace context was created. */
    elapsed() {
        const ctx = store.getStore();
        if (!ctx)
            return 0;
        return Date.now() - ctx.startTime;
    },
};
// ---------------------------------------------------------------------------
// Header-aware fetch
// ---------------------------------------------------------------------------
/**
 * Drop-in replacement for `fetch()` that automatically injects
 * `httpHeaders` from the current {@link TraceContext} (if any) and
 * adds the User-Agent header.
 *
 * Used by `device-flow.ts` and `uat-client.ts` so that custom headers
 * (e.g. `x-tt-env` for BOE swim-lane routing) are transparently applied
 * without changing every call-site's signature.
 */
export function feishuFetch(url, init) {
    const ctx = store.getStore();
    const extra = ctx?.httpHeaders;
    const userAgent = getUserAgent();
    // 始终注入 User-Agent，并合并 TraceContext 中的额外 headers
    const headers = {
        ...init?.headers,
        ...extra,
        "User-Agent": userAgent,
    };
    return fetch(url, { ...init, headers });
}
//# sourceMappingURL=trace.js.map