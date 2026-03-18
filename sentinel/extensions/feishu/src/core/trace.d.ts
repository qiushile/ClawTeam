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
export type TraceContext = {
    messageId: string;
    chatId: string;
    accountId: string;
    startTime: number;
    senderOpenId?: string;
    httpHeaders?: Record<string, string>;
    chatType?: "p2p" | "group";
    threadId?: string;
};
/**
 * Set the logger functions for trace output.
 *
 * Should be called once during plugin activation (or when the first
 * monitor starts) with the RuntimeEnv log/error functions so trace
 * output is routed to gateway.log.
 */
export declare function setTraceLogger(log: (msg: string) => void, error: (msg: string) => void): void;
/**
 * Run `fn` within a trace context.  All async operations spawned inside
 * `fn` will inherit the context and can access it via {@link getTraceContext}
 * or use the {@link trace} logger which auto-prefixes the message_id.
 */
export declare function withTrace<T>(ctx: TraceContext, fn: () => T | Promise<T>): T | Promise<T>;
/** Return the current trace context, or `undefined` if not inside withTrace. */
export declare function getTraceContext(): TraceContext | undefined;
export declare const trace: {
    info(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
    debug(msg: string): void;
    /** Milliseconds elapsed since the trace context was created. */
    elapsed(): number;
};
/**
 * Drop-in replacement for `fetch()` that automatically injects
 * `httpHeaders` from the current {@link TraceContext} (if any) and
 * adds the User-Agent header.
 *
 * Used by `device-flow.ts` and `uat-client.ts` so that custom headers
 * (e.g. `x-tt-env` for BOE swim-lane routing) are transparently applied
 * without changing every call-site's signature.
 */
export declare function feishuFetch(url: string | URL | Request, init?: RequestInit): Promise<Response>;
//# sourceMappingURL=trace.d.ts.map