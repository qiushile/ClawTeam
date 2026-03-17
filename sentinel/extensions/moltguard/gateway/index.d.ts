#!/usr/bin/env node
/**
 * OpenGuardrails AI Security Gateway
 *
 * Local HTTP proxy that intercepts LLM API calls, sanitizes sensitive data
 * before sending to providers, and restores it in responses.
 * Supports Anthropic, OpenAI, and Gemini protocols.
 */
/**
 * Stop the gateway server
 */
export declare function stopGateway(): Promise<void>;
/**
 * Check if gateway is running
 */
export declare function isGatewayServerRunning(): boolean;
/**
 * Start gateway server
 * @param configPath - Path to config file
 * @param embedded - If true, don't call process.exit on errors (for in-process use)
 */
export declare function startGateway(configPath?: string, embedded?: boolean): void;
export { sanitize, sanitizeMessages } from "./sanitizer.js";
export { restore, restoreJSON, restoreSSELine } from "./restorer.js";
export { addActivityListener, removeActivityListener, clearActivityListeners, } from "./activity.js";
export type { GatewayConfig, MappingTable, SanitizeResult, EntityMatch, GatewayActivityEvent, ActivityListener, } from "./types.js";
//# sourceMappingURL=index.d.ts.map