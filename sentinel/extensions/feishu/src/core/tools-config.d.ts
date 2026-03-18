/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Default values and resolution logic for the Feishu tools configuration.
 *
 * Each boolean flag controls whether a particular category of Feishu-specific
 * agent tools (document access, wiki queries, drive operations, etc.) is
 * enabled for a given account.
 */
import type { FeishuToolsConfig } from "./types.js";
/**
 * The default tools configuration.
 *
 * By default every non-destructive capability is enabled.  The `perm` flag
 * (permission management) defaults to `false` because granting / revoking
 * permissions is a privileged operation that admins should opt into
 * explicitly.
 */
export declare const DEFAULT_TOOLS_CONFIG: Required<FeishuToolsConfig>;
/**
 * Merge a partial tools configuration with `DEFAULT_TOOLS_CONFIG`.
 *
 * Fields present in the input take precedence; anything absent falls back
 * to the default value.
 */
export declare function resolveToolsConfig(cfg?: FeishuToolsConfig): Required<FeishuToolsConfig>;
//# sourceMappingURL=tools-config.d.ts.map