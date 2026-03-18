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
import type { LarkBrand } from "./types.js";
export type UATCallOptions = {
    userOpenId: string;
    appId: string;
    appSecret: string;
    domain: LarkBrand;
};
export type UATStatus = {
    authorized: boolean;
    userOpenId: string;
    scope?: string;
    expiresAt?: number;
    refreshExpiresAt?: number;
    grantedAt?: number;
    tokenStatus?: "valid" | "needs_refresh" | "expired";
};
/**
 * Obtain a valid access_token for the given user.
 *
 * - Reads from Keychain.
 * - Refreshes proactively if the token is about to expire.
 * - Throws when no token exists or refresh fails irrecoverably.
 *
 * **The returned token must never be exposed to the AI layer.**
 */
export declare function getValidAccessToken(opts: UATCallOptions): Promise<string>;
/**
 * Execute an API call with a valid UAT, retrying once on token-expiry errors.
 */
export declare function callWithUAT<T>(opts: UATCallOptions, apiCall: (accessToken: string) => Promise<T>): Promise<T>;
/**
 * Query the authorisation status for a user (does **not** trigger refresh).
 */
export declare function getUATStatus(appId: string, userOpenId: string): Promise<UATStatus>;
/**
 * Revoke a user's UAT by removing it from the Keychain.
 */
export declare function revokeUAT(appId: string, userOpenId: string): Promise<void>;
/**
 * Thrown when no valid UAT exists and the user needs to (re-)authorise.
 * Callers should catch this and trigger the OAuth flow.
 */
export declare class NeedAuthorizationError extends Error {
    readonly userOpenId: string;
    constructor(userOpenId: string);
}
//# sourceMappingURL=uat-client.d.ts.map