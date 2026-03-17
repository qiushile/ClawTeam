/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Onboarding wizard adapter for the Feishu/Lark channel plugin.
 *
 * Implements the ChannelOnboardingAdapter interface so the `openclaw
 * setup` wizard can configure Feishu credentials, domain, group
 * policies, and DM allowlists interactively.
 */
import { addWildcardAllowFrom, DEFAULT_ACCOUNT_ID, formatDocsLink, } from "openclaw/plugin-sdk";
import { getLarkCredentials } from "../core/accounts.js";
import { probeFeishu } from "./probe.js";
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const channel = "feishu";
// ---------------------------------------------------------------------------
// Config mutation helpers
// ---------------------------------------------------------------------------
function setFeishuDmPolicy(cfg, dmPolicy) {
    const allowFrom = dmPolicy === "open"
        ? addWildcardAllowFrom(cfg.channels?.feishu?.allowFrom)?.map((entry) => String(entry))
        : undefined;
    return {
        ...cfg,
        channels: {
            ...cfg.channels,
            feishu: {
                ...cfg.channels?.feishu,
                dmPolicy,
                ...(allowFrom ? { allowFrom } : {}),
            },
        },
    };
}
function setFeishuAllowFrom(cfg, allowFrom) {
    return {
        ...cfg,
        channels: {
            ...cfg.channels,
            feishu: {
                ...cfg.channels?.feishu,
                allowFrom,
            },
        },
    };
}
function setFeishuGroupPolicy(cfg, groupPolicy) {
    return {
        ...cfg,
        channels: {
            ...cfg.channels,
            feishu: {
                ...cfg.channels?.feishu,
                enabled: true,
                groupPolicy,
            },
        },
    };
}
function setFeishuGroupAllowFrom(cfg, groupAllowFrom) {
    return {
        ...cfg,
        channels: {
            ...cfg.channels,
            feishu: {
                ...cfg.channels?.feishu,
                groupAllowFrom,
            },
        },
    };
}
function setFeishuGroups(cfg, groups) {
    return {
        ...cfg,
        channels: {
            ...cfg.channels,
            feishu: {
                ...cfg.channels?.feishu,
                groups,
            },
        },
    };
}
// ---------------------------------------------------------------------------
// Input helpers
// ---------------------------------------------------------------------------
function parseAllowFromInput(raw) {
    return raw
        .split(/[\n,;]+/g)
        .map((entry) => entry.trim())
        .filter(Boolean);
}
// ---------------------------------------------------------------------------
// Prompter helpers
// ---------------------------------------------------------------------------
async function noteFeishuCredentialHelp(prompter) {
    await prompter.note([
        "1) Go to Feishu Open Platform (open.feishu.cn)",
        "2) Create a self-built app",
        "3) Get App ID and App Secret from Credentials page",
        "4) Enable required permissions: im:message, im:chat, contact:user.base:readonly",
        "5) Publish the app or add it to a test group",
        "Tip: you can also set FEISHU_APP_ID / FEISHU_APP_SECRET env vars.",
        `Docs: ${formatDocsLink("/channels/feishu", "feishu")}`,
    ].join("\n"), "Feishu credentials");
}
async function promptFeishuAllowFrom(params) {
    const existing = params.cfg.channels?.feishu?.allowFrom ?? [];
    await params.prompter.note([
        "Allowlist Feishu DMs by open_id or user_id.",
        "You can find user open_id in Feishu admin console or via API.",
        "Examples:",
        "- ou_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "- on_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ].join("\n"), "Feishu allowlist");
    while (true) {
        const entry = await params.prompter.text({
            message: "Feishu allowFrom (user open_ids)",
            placeholder: "ou_xxxxx, ou_yyyyy",
            initialValue: existing[0] ? String(existing[0]) : undefined,
            validate: (value) => String(value ?? "").trim() ? undefined : "Required",
        });
        const parts = parseAllowFromInput(String(entry));
        if (parts.length === 0) {
            await params.prompter.note("Enter at least one user.", "Feishu allowlist");
            continue;
        }
        const unique = [
            ...new Set([
                ...existing
                    .map((v) => String(v).trim())
                    .filter(Boolean),
                ...parts,
            ]),
        ];
        return setFeishuAllowFrom(params.cfg, unique);
    }
}
// ---------------------------------------------------------------------------
// DM policy
// ---------------------------------------------------------------------------
const dmPolicy = {
    label: "Feishu",
    channel,
    policyKey: "channels.feishu.dmPolicy",
    allowFromKey: "channels.feishu.allowFrom",
    getCurrent: (cfg) => cfg.channels?.feishu?.dmPolicy ?? "pairing",
    setPolicy: (cfg, policy) => setFeishuDmPolicy(cfg, policy),
    promptAllowFrom: promptFeishuAllowFrom,
};
// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------
export const feishuOnboardingAdapter = {
    channel,
    // -----------------------------------------------------------------------
    // getStatus
    // -----------------------------------------------------------------------
    getStatus: async ({ cfg }) => {
        const feishuCfg = cfg.channels?.feishu;
        const configured = Boolean(getLarkCredentials(feishuCfg));
        // Attempt a live probe when credentials are present.
        let probeResult = null;
        if (configured && feishuCfg) {
            try {
                probeResult = await probeFeishu(feishuCfg);
            }
            catch {
                // Ignore probe errors -- status degrades gracefully.
            }
        }
        const statusLines = [];
        if (!configured) {
            statusLines.push("Feishu: needs app credentials");
        }
        else if (probeResult?.ok) {
            statusLines.push(`Feishu: connected as ${probeResult.botName ?? probeResult.botOpenId ?? "bot"}`);
        }
        else {
            statusLines.push("Feishu: configured (connection not verified)");
        }
        return {
            channel,
            configured,
            statusLines,
            selectionHint: configured ? "configured" : "needs app creds",
            quickstartScore: configured ? 2 : 0,
        };
    },
    // -----------------------------------------------------------------------
    // configure
    // -----------------------------------------------------------------------
    configure: async ({ cfg, prompter }) => {
        const feishuCfg = cfg.channels?.feishu;
        const resolved = getLarkCredentials(feishuCfg);
        const hasConfigCreds = Boolean(feishuCfg?.appId?.trim() && feishuCfg?.appSecret?.trim());
        const canUseEnv = Boolean(!hasConfigCreds &&
            process.env.FEISHU_APP_ID?.trim() &&
            process.env.FEISHU_APP_SECRET?.trim());
        let next = cfg;
        let appId = null;
        let appSecret = null;
        // Show credential help if nothing is configured yet.
        if (!resolved) {
            await noteFeishuCredentialHelp(prompter);
        }
        // --- Credential acquisition ---
        if (canUseEnv) {
            const keepEnv = await prompter.confirm({
                message: "FEISHU_APP_ID + FEISHU_APP_SECRET detected. Use env vars?",
                initialValue: true,
            });
            if (keepEnv) {
                next = {
                    ...next,
                    channels: {
                        ...next.channels,
                        feishu: { ...next.channels?.feishu, enabled: true },
                    },
                };
            }
            else {
                appId = String(await prompter.text({
                    message: "Enter Feishu App ID",
                    validate: (value) => (value?.trim() ? undefined : "Required"),
                })).trim();
                appSecret = String(await prompter.text({
                    message: "Enter Feishu App Secret",
                    validate: (value) => (value?.trim() ? undefined : "Required"),
                })).trim();
            }
        }
        else if (hasConfigCreds) {
            const keep = await prompter.confirm({
                message: "Feishu credentials already configured. Keep them?",
                initialValue: true,
            });
            if (!keep) {
                appId = String(await prompter.text({
                    message: "Enter Feishu App ID",
                    validate: (value) => (value?.trim() ? undefined : "Required"),
                })).trim();
                appSecret = String(await prompter.text({
                    message: "Enter Feishu App Secret",
                    validate: (value) => (value?.trim() ? undefined : "Required"),
                })).trim();
            }
        }
        else {
            appId = String(await prompter.text({
                message: "Enter Feishu App ID",
                validate: (value) => (value?.trim() ? undefined : "Required"),
            })).trim();
            appSecret = String(await prompter.text({
                message: "Enter Feishu App Secret",
                validate: (value) => (value?.trim() ? undefined : "Required"),
            })).trim();
        }
        // --- Persist and test credentials ---
        if (appId && appSecret) {
            next = {
                ...next,
                channels: {
                    ...next.channels,
                    feishu: {
                        ...next.channels?.feishu,
                        enabled: true,
                        appId,
                        appSecret,
                    },
                },
            };
            const testCfg = next.channels?.feishu;
            try {
                const probe = await probeFeishu(testCfg);
                if (probe.ok) {
                    await prompter.note(`Connected as ${probe.botName ?? probe.botOpenId ?? "bot"}`, "Feishu connection test");
                }
                else {
                    await prompter.note(`Connection failed: ${probe.error ?? "unknown error"}`, "Feishu connection test");
                }
            }
            catch (err) {
                await prompter.note(`Connection test failed: ${String(err)}`, "Feishu connection test");
            }
        }
        // --- Domain selection ---
        const currentDomain = next.channels?.feishu?.domain ?? "feishu";
        const domain = await prompter.select({
            message: "Which Feishu domain?",
            options: [
                { value: "feishu", label: "Feishu (feishu.cn) - China" },
                { value: "lark", label: "Lark (larksuite.com) - International" },
            ],
            initialValue: currentDomain,
        });
        if (domain) {
            next = {
                ...next,
                channels: {
                    ...next.channels,
                    feishu: {
                        ...next.channels?.feishu,
                        domain: domain,
                    },
                },
            };
        }
        // --- Group policy (two-layer model, aligned with Telegram) ---
        //
        // Layer 1: Which GROUPS are allowed?
        //   groupPolicy controls group-level access:
        //   - "open"      → any group can interact with the bot
        //   - "allowlist"  → only groups listed in `groups` config are allowed
        //   - "disabled"   → no group interactions at all
        //
        // Layer 2: Which SENDERS within allowed groups can trigger the bot?
        //   groupAllowFrom filters by sender open_id (ou_xxx).
        const existingGroupAllowFrom = next.channels?.feishu?.groupAllowFrom ??
            [];
        const legacyChatIds = existingGroupAllowFrom.filter((e) => String(e).startsWith("oc_"));
        const senderAllowFrom = existingGroupAllowFrom.filter((e) => !String(e).startsWith("oc_"));
        // ---- Migration prompt for legacy chat_id entries ----
        if (legacyChatIds.length > 0) {
            await prompter.note([
                `⚠️  Detected legacy config: groupAllowFrom contains chat_ids (${legacyChatIds.join(", ")})`,
                "",
                "Old semantic: groupAllowFrom controlled which groups could use the bot.",
                "New semantic: groupAllowFrom is for SENDER filtering (open_ids like ou_xxx).",
                "",
                "Recommended migration:",
                `  1. Move chat_ids (oc_xxx) → channels.feishu.groups`,
                `  2. Keep sender IDs (ou_xxx) in groupAllowFrom`,
            ].join("\n"), "Legacy config detected");
            const migrate = await prompter.confirm({
                message: `Migrate ${legacyChatIds.length} chat_id(s) to groups config?`,
                initialValue: true,
            });
            if (migrate) {
                // Build new groups config from legacy chat_ids
                // Legacy semantic: chat_id in groupAllowFrom meant "allow this group for any sender"
                // So migrated groups need groupPolicy: "open" to preserve this behavior
                const existingGroups = next.channels?.feishu?.groups ?? {};
                const migratedGroups = {
                    ...existingGroups,
                };
                for (const chatId of legacyChatIds) {
                    if (!migratedGroups[String(chatId)]) {
                        // Preserve old semantic: group allowed, any sender can trigger
                        migratedGroups[String(chatId)] = {
                            enabled: true,
                            groupPolicy: "open",
                        };
                    }
                }
                next = setFeishuGroups(next, migratedGroups);
                // Keep sender IDs in groupAllowFrom, clear legacy chat_ids
                if (senderAllowFrom.length > 0) {
                    next = setFeishuGroupAllowFrom(next, senderAllowFrom);
                }
                else {
                    // Clear groupAllowFrom if no sender IDs left
                    next = setFeishuGroupAllowFrom(next, []);
                }
                await prompter.note(`✅ Migrated: ${legacyChatIds.length} chat_id(s) moved to groups, ` +
                    `${senderAllowFrom.length} sender(s) kept in groupAllowFrom`, "Migration complete");
            }
            else {
                await prompter.note("Skipped migration. Please update config manually to avoid issues.", "Migration skipped");
            }
        }
        const groupPolicy = await prompter.select({
            message: "Group chat policy — which groups can interact with the bot?",
            options: [
                {
                    value: "allowlist",
                    label: "Allowlist — only groups listed in `groups` config (default)",
                },
                {
                    value: "open",
                    label: "Open — any group (requires @mention)",
                },
                {
                    value: "disabled",
                    label: "Disabled — no group interactions",
                },
            ],
            initialValue: next.channels?.feishu?.groupPolicy ??
                "allowlist",
        });
        if (groupPolicy) {
            next = setFeishuGroupPolicy(next, groupPolicy);
        }
        // --- Group sender allowlist ---
        if (groupPolicy !== "disabled") {
            // After migration, groupAllowFrom should only contain sender IDs (ou_xxx)
            const existing = next.channels?.feishu?.groupAllowFrom ??
                [];
            const entry = await prompter.text({
                message: "Group sender allowlist — which users can trigger the bot in allowed groups? (user open_ids)",
                placeholder: "ou_xxxxx, ou_yyyyy",
                initialValue: existing.length > 0 ? existing.map(String).join(", ") : undefined,
            });
            if (entry) {
                const parts = parseAllowFromInput(String(entry));
                if (parts.length > 0) {
                    next = setFeishuGroupAllowFrom(next, parts);
                }
                // If user entered nothing but groupPolicy is allowlist, warn them
            }
            else if (groupPolicy === "allowlist") {
                // User pressed enter without input - this means NO senders allowed
                // Keep empty groupAllowFrom, which combined with allowlist = deny all
                await prompter.note("Empty sender list + allowlist = nobody can trigger. " +
                    "Use groupPolicy 'open' if you want anyone in allowed groups to trigger.", "Note");
            }
        }
        return { cfg: next, accountId: DEFAULT_ACCOUNT_ID };
    },
    // -----------------------------------------------------------------------
    // dmPolicy
    // -----------------------------------------------------------------------
    dmPolicy,
    // -----------------------------------------------------------------------
    // disable
    // -----------------------------------------------------------------------
    disable: (cfg) => ({
        ...cfg,
        channels: {
            ...cfg.channels,
            feishu: { ...cfg.channels?.feishu, enabled: false },
        },
    }),
};
//# sourceMappingURL=onboarding.js.map