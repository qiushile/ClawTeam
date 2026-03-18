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
// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------
/**
 * The default tools configuration.
 *
 * By default every non-destructive capability is enabled.  The `perm` flag
 * (permission management) defaults to `false` because granting / revoking
 * permissions is a privileged operation that admins should opt into
 * explicitly.
 */
export const DEFAULT_TOOLS_CONFIG = {
    doc: true,
    wiki: true,
    drive: true,
    scopes: true,
    perm: false,
    mail: true,
    sheets: true,
    okr: false,
};
// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------
/**
 * Merge a partial tools configuration with `DEFAULT_TOOLS_CONFIG`.
 *
 * Fields present in the input take precedence; anything absent falls back
 * to the default value.
 */
export function resolveToolsConfig(cfg) {
    if (!cfg)
        return { ...DEFAULT_TOOLS_CONFIG };
    return {
        doc: cfg.doc ?? DEFAULT_TOOLS_CONFIG.doc,
        wiki: cfg.wiki ?? DEFAULT_TOOLS_CONFIG.wiki,
        drive: cfg.drive ?? DEFAULT_TOOLS_CONFIG.drive,
        perm: cfg.perm ?? DEFAULT_TOOLS_CONFIG.perm,
        scopes: cfg.scopes ?? DEFAULT_TOOLS_CONFIG.scopes,
        mail: cfg.mail ?? DEFAULT_TOOLS_CONFIG.mail,
        sheets: cfg.sheets ?? DEFAULT_TOOLS_CONFIG.sheets,
        okr: cfg.okr ?? DEFAULT_TOOLS_CONFIG.okr,
    };
}
//# sourceMappingURL=tools-config.js.map