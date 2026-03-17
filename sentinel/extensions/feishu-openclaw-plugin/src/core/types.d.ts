/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Core type definitions for the OpenClaw Feishu/Lark channel plugin.
 *
 * Contains inferred Zod config types, domain/connection enums, identifier types,
 * tools configuration, and account types. Messaging, outbound, and channel types
 * live in their respective module type files.
 */
import type { FeishuConfigSchema, FeishuGroupSchema, FeishuAccountConfigSchema, UATConfigSchema, z } from "./config-schema.js";
/** Fully resolved top-level Feishu channel configuration. */
export type FeishuConfig = z.infer<typeof FeishuConfigSchema>;
/** Per-group configuration overrides. */
export type FeishuGroupConfig = z.infer<typeof FeishuGroupSchema>;
/** Per-account configuration overrides (mirrors top-level minus `accounts`). */
export type FeishuAccountConfig = z.infer<typeof FeishuAccountConfigSchema>;
/**
 * The Lark platform brand.
 * - `"feishu"` targets the China-mainland Feishu service.
 * - `"lark"` targets the international Lark service.
 * - Any other string is treated as a custom base URL.
 */
export type LarkBrand = "feishu" | "lark" | (string & {});
/** How the plugin connects to Feishu to receive events. */
export type FeishuConnectionMode = "websocket" | "webhook";
/** The four ID types recognised by the Feishu API. */
export type FeishuIdType = "open_id" | "user_id" | "union_id" | "chat_id";
/** Per-feature toggles for the Feishu-specific tool capabilities. */
export type FeishuToolsConfig = {
    doc?: boolean;
    wiki?: boolean;
    drive?: boolean;
    perm?: boolean;
    scopes?: boolean;
    mail?: boolean;
    sheets?: boolean;
    okr?: boolean;
};
/** Per-feature toggles for card footer metadata visibility. */
export type FeishuFooterConfig = {
    status?: boolean;
    elapsed?: boolean;
};
/** Common fields shared by all resolved account states. */
type LarkAccountBase = {
    accountId: string;
    enabled: boolean;
    name?: string;
    encryptKey?: string;
    verificationToken?: string;
    brand: LarkBrand;
    config: FeishuConfig;
    extra?: {
        domain?: string;
        httpHeaders?: Record<string, string>;
    };
};
/** An account with both `appId` and `appSecret` present. */
export type ConfiguredLarkAccount = LarkAccountBase & {
    configured: true;
    appId: string;
    appSecret: string;
};
/** An account that is missing `appId` and/or `appSecret`. */
export type UnconfiguredLarkAccount = LarkAccountBase & {
    configured: false;
    appId?: string;
    appSecret?: string;
};
/** A resolved Lark account — either fully configured or not. */
export type LarkAccount = ConfiguredLarkAccount | UnconfiguredLarkAccount;
/** UAT (User Access Token) configuration. */
export type FeishuUATConfig = z.infer<typeof UATConfigSchema>;
/** The minimum credential set needed to interact with the Lark API. */
export type LarkCredentials = {
    appId: string;
    appSecret: string;
    encryptKey?: string;
    verificationToken?: string;
    brand: LarkBrand;
};
export {};
//# sourceMappingURL=types.d.ts.map