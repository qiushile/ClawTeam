/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * ChannelPlugin interface implementation for the Feishu/Lark channel.
 *
 * This is the top-level entry point that the OpenClaw plugin system uses to
 * discover capabilities, resolve accounts, obtain outbound adapters, and
 * start the inbound event gateway.
 */
import { DEFAULT_ACCOUNT_ID, PAIRING_APPROVED_MESSAGE, } from "openclaw/plugin-sdk";
import { getLarkAccount, getLarkAccountIds, getDefaultLarkAccountId, } from "../core/accounts.js";
import { listFeishuDirectoryPeers, listFeishuDirectoryGroups, listFeishuDirectoryPeersLive, listFeishuDirectoryGroupsLive, } from "./directory.js";
import { feishuOnboardingAdapter } from "./onboarding.js";
import { feishuOutbound } from "../messaging/outbound/outbound.js";
import { feishuMessageActions } from "../messaging/outbound/actions.js";
import { resolveFeishuGroupToolPolicy } from "../messaging/inbound/policy.js";
import { LarkClient } from "../core/lark-client.js";
import { sendMessageFeishu } from "../messaging/outbound/send.js";
import { normalizeFeishuTarget, looksLikeFeishuId } from "../core/targets.js";
import { triggerOnboarding } from "../tools/onboarding-auth.js";
import { setAccountEnabled, applyAccountConfig, deleteAccount } from "./config-adapter.js";
// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------
const meta = {
    id: "feishu",
    label: "Feishu",
    selectionLabel: "Feishu/Lark (\u98DE\u4E66)",
    docsPath: "/channels/feishu",
    docsLabel: "feishu",
    blurb: "\u98DE\u4E66/Lark enterprise messaging.",
    aliases: ["lark"],
    order: 70,
};
// ---------------------------------------------------------------------------
// Channel plugin definition
// ---------------------------------------------------------------------------
export const feishuPlugin = {
    id: "feishu",
    meta: {
        ...meta,
    },
    // -------------------------------------------------------------------------
    // Pairing
    // -------------------------------------------------------------------------
    pairing: {
        idLabel: "feishuUserId",
        normalizeAllowEntry: (entry) => entry.replace(/^(feishu|user|open_id):/i, ""),
        notifyApproval: async ({ cfg, id }) => {
            const accountId = getDefaultLarkAccountId(cfg);
            console.log(`[feishu] notifyApproval called for ${id}, accountId=${accountId}`);
            // 1. 发送配对成功消息（保持现有行为）
            await sendMessageFeishu({
                cfg,
                to: id,
                text: PAIRING_APPROVED_MESSAGE,
                accountId,
            });
            // 2. 触发 onboarding
            try {
                await triggerOnboarding({ cfg, userOpenId: id, accountId });
                console.log(`[feishu] onboarding completed for ${id}`);
            }
            catch (err) {
                console.error(`[feishu] onboarding failed for ${id}:`, err);
            }
        },
    },
    // -------------------------------------------------------------------------
    // Capabilities
    // -------------------------------------------------------------------------
    capabilities: {
        chatTypes: ["direct", "group"],
        media: true,
        reactions: true,
        threads: true,
        polls: false,
        nativeCommands: true,
        blockStreaming: true,
    },
    // -------------------------------------------------------------------------
    // Agent prompt
    // -------------------------------------------------------------------------
    agentPrompt: {
        messageToolHints: () => [
            "- Feishu targeting: omit `target` to reply to the current conversation (auto-inferred). Explicit targets: `user:open_id` or `chat:chat_id`.",
            "- Feishu supports interactive cards for rich messages.",
            "- Feishu reactions use UPPERCASE emoji type names (e.g. `OK`,`THUMBSUP`,`THANKS`,`MUSCLE`,`FINGERHEART`,`APPLAUSE`,`FISTBUMP`,`JIAYI`,`DONE`,`SMILE`,`BLUSH` ), not Unicode emoji characters.",
            "- Feishu `action=delete`/`action=unsend` only deletes messages sent by the bot. When the user quotes a message and says 'delete this', use the **quoted message's** message_id, not the user's own message_id.",
        ],
    },
    // -------------------------------------------------------------------------
    // Groups
    // -------------------------------------------------------------------------
    groups: {
        resolveToolPolicy: resolveFeishuGroupToolPolicy,
    },
    // -------------------------------------------------------------------------
    // Reload
    // -------------------------------------------------------------------------
    reload: { configPrefixes: ["channels.feishu"] },
    // -------------------------------------------------------------------------
    // Config schema (JSON Schema)
    // -------------------------------------------------------------------------
    configSchema: {
        schema: {
            type: "object",
            additionalProperties: false,
            properties: {
                enabled: { type: "boolean" },
                appId: { type: "string" },
                appSecret: { type: "string" },
                encryptKey: { type: "string" },
                verificationToken: { type: "string" },
                domain: {
                    oneOf: [
                        { type: "string", enum: ["feishu", "lark"] },
                        { type: "string", format: "uri", pattern: "^https://" },
                    ],
                },
                connectionMode: { type: "string", enum: ["websocket", "webhook"] },
                webhookPath: { type: "string" },
                webhookPort: { type: "integer", minimum: 1 },
                dmPolicy: { type: "string", enum: ["open", "pairing", "allowlist", "disabled"] },
                allowFrom: {
                    type: "array",
                    items: { oneOf: [{ type: "string" }, { type: "number" }] },
                },
                groupPolicy: {
                    type: "string",
                    enum: ["open", "allowlist", "disabled"],
                },
                groupAllowFrom: {
                    type: "array",
                    items: { oneOf: [{ type: "string" }, { type: "number" }] },
                },
                requireMention: { type: "boolean" },
                historyLimit: { type: "integer", minimum: 0 },
                dmHistoryLimit: { type: "integer", minimum: 0 },
                textChunkLimit: { type: "integer", minimum: 1 },
                chunkMode: { type: "string", enum: ["length", "newline"] },
                mediaMaxMb: { type: "number", minimum: 0 },
                replyMode: {
                    oneOf: [
                        { type: "string", enum: ["auto", "static", "streaming"] },
                        {
                            type: "object",
                            properties: {
                                default: { type: "string", enum: ["auto", "static", "streaming"] },
                                group: { type: "string", enum: ["auto", "static", "streaming"] },
                                direct: { type: "string", enum: ["auto", "static", "streaming"] },
                            },
                        },
                    ],
                },
                streaming: { type: "boolean" },
                blockStreaming: { type: "boolean" },
                reactionNotifications: {
                    type: "string",
                    enum: ["off", "own", "all"],
                },
                accounts: {
                    type: "object",
                    additionalProperties: {
                        type: "object",
                        properties: {
                            enabled: { type: "boolean" },
                            name: { type: "string" },
                            appId: { type: "string" },
                            appSecret: { type: "string" },
                            encryptKey: { type: "string" },
                            verificationToken: { type: "string" },
                            domain: { type: "string", enum: ["feishu", "lark"] },
                            connectionMode: {
                                type: "string",
                                enum: ["websocket", "webhook"],
                            },
                        },
                    },
                },
            },
        },
    },
    // -------------------------------------------------------------------------
    // Config adapter
    // -------------------------------------------------------------------------
    config: {
        listAccountIds: (cfg) => getLarkAccountIds(cfg),
        resolveAccount: (cfg, accountId) => getLarkAccount(cfg, accountId),
        defaultAccountId: (cfg) => getDefaultLarkAccountId(cfg),
        setAccountEnabled: ({ cfg, accountId, enabled }) => {
            return setAccountEnabled(cfg, accountId, enabled);
        },
        deleteAccount: ({ cfg, accountId }) => {
            return deleteAccount(cfg, accountId);
        },
        isConfigured: (account) => account.configured,
        describeAccount: (account) => ({
            accountId: account.accountId,
            enabled: account.enabled,
            configured: account.configured,
            name: account.name,
            appId: account.appId,
            brand: account.brand,
        }),
        resolveAllowFrom: ({ cfg, accountId }) => {
            const account = getLarkAccount(cfg, accountId);
            return (account.config?.allowFrom ?? []).map((entry) => String(entry));
        },
        formatAllowFrom: ({ allowFrom }) => allowFrom
            .map((entry) => String(entry).trim())
            .filter(Boolean)
            .map((entry) => entry.toLowerCase()),
    },
    // -------------------------------------------------------------------------
    // Security
    // -------------------------------------------------------------------------
    security: {
        collectWarnings: ({ cfg, accountId }) => {
            const account = getLarkAccount(cfg, accountId);
            const feishuCfg = account.config;
            const defaultGroupPolicy = cfg.channels?.defaults?.groupPolicy;
            const groupPolicy = feishuCfg?.groupPolicy ?? defaultGroupPolicy ?? "allowlist";
            if (groupPolicy !== "open") {
                return [];
            }
            return [
                `- Feishu[${account.accountId}] groups: groupPolicy="open" allows any group to interact (mention-gated). To restrict which groups are allowed, set groupPolicy="allowlist" and list group IDs in channels.feishu.groups. To restrict which senders can trigger the bot, set channels.feishu.groupAllowFrom with user open_ids (ou_xxx).`,
            ];
        },
    },
    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------
    setup: {
        resolveAccountId: () => DEFAULT_ACCOUNT_ID,
        applyAccountConfig: ({ cfg, accountId }) => {
            return applyAccountConfig(cfg, accountId, { enabled: true });
        },
    },
    // -------------------------------------------------------------------------
    // Onboarding
    // -------------------------------------------------------------------------
    onboarding: feishuOnboardingAdapter,
    // -------------------------------------------------------------------------
    // Messaging
    // -------------------------------------------------------------------------
    messaging: {
        normalizeTarget: (raw) => normalizeFeishuTarget(raw) ?? undefined,
        targetResolver: {
            looksLikeId: looksLikeFeishuId,
            hint: "<chatId|user:openId|chat:chatId>",
        },
    },
    // -------------------------------------------------------------------------
    // Directory
    // -------------------------------------------------------------------------
    directory: {
        self: async () => null,
        listPeers: async ({ cfg, query, limit, accountId }) => listFeishuDirectoryPeers({
            cfg,
            query: query ?? undefined,
            limit: limit ?? undefined,
            accountId: accountId ?? undefined,
        }),
        listGroups: async ({ cfg, query, limit, accountId }) => listFeishuDirectoryGroups({
            cfg,
            query: query ?? undefined,
            limit: limit ?? undefined,
            accountId: accountId ?? undefined,
        }),
        listPeersLive: async ({ cfg, query, limit, accountId }) => listFeishuDirectoryPeersLive({
            cfg,
            query: query ?? undefined,
            limit: limit ?? undefined,
            accountId: accountId ?? undefined,
        }),
        listGroupsLive: async ({ cfg, query, limit, accountId }) => listFeishuDirectoryGroupsLive({
            cfg,
            query: query ?? undefined,
            limit: limit ?? undefined,
            accountId: accountId ?? undefined,
        }),
    },
    // -------------------------------------------------------------------------
    // Outbound
    // -------------------------------------------------------------------------
    outbound: feishuOutbound,
    // -------------------------------------------------------------------------
    // Threading
    // -------------------------------------------------------------------------
    threading: {
        buildToolContext: ({ context, hasRepliedRef }) => ({
            currentChannelId: normalizeFeishuTarget(context.To ?? "") ?? undefined,
            currentThreadTs: context.MessageThreadId != null
                ? String(context.MessageThreadId)
                : undefined,
            currentMessageId: context.CurrentMessageId,
            hasRepliedRef,
        }),
    },
    // -------------------------------------------------------------------------
    // Actions
    // -------------------------------------------------------------------------
    actions: feishuMessageActions,
    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------
    status: {
        defaultRuntime: {
            accountId: DEFAULT_ACCOUNT_ID,
            running: false,
            lastStartAt: null,
            lastStopAt: null,
            lastError: null,
            port: null,
        },
        buildChannelSummary: ({ snapshot }) => ({
            configured: snapshot.configured ?? false,
            running: snapshot.running ?? false,
            lastStartAt: snapshot.lastStartAt ?? null,
            lastStopAt: snapshot.lastStopAt ?? null,
            lastError: snapshot.lastError ?? null,
            port: snapshot.port ?? null,
            probe: snapshot.probe,
            lastProbeAt: snapshot.lastProbeAt ?? null,
        }),
        probeAccount: async ({ account }) => {
            return await LarkClient.fromAccount(account).probe();
        },
        buildAccountSnapshot: ({ account, runtime, probe }) => ({
            accountId: account.accountId,
            enabled: account.enabled,
            configured: account.configured,
            name: account.name,
            appId: account.appId,
            brand: account.brand,
            running: runtime?.running ?? false,
            lastStartAt: runtime?.lastStartAt ?? null,
            lastStopAt: runtime?.lastStopAt ?? null,
            lastError: runtime?.lastError ?? null,
            port: runtime?.port ?? null,
            probe,
        }),
    },
    // -------------------------------------------------------------------------
    // Gateway
    // -------------------------------------------------------------------------
    gateway: {
        startAccount: async (ctx) => {
            const { monitorFeishuProvider } = await import("./monitor.js");
            const account = getLarkAccount(ctx.cfg, ctx.accountId);
            const port = account.config?.webhookPort ?? null;
            ctx.setStatus({ accountId: ctx.accountId, port });
            ctx.log?.info(`starting feishu[${ctx.accountId}] (mode: ${account.config?.connectionMode ?? "websocket"})`);
            return monitorFeishuProvider({
                config: ctx.cfg,
                runtime: ctx.runtime,
                abortSignal: ctx.abortSignal,
                accountId: ctx.accountId,
            });
        },
    },
};
//# sourceMappingURL=plugin.js.map