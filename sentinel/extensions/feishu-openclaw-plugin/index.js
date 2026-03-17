/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * OpenClaw Feishu/Lark plugin entry point.
 *
 * Registers the Feishu channel and all tool families:
 * doc, wiki, drive, perm, bitable, task, calendar.
 */
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { feishuPlugin } from "./src/channel/plugin.js";
import { LarkClient } from "./src/core/lark-client.js";
import { registerOapiTools } from "./src/tools/oapi/index.js";
import { registerFeishuMcpDocTools } from "./src/tools/mcp/doc/index.js";
// import { registerFeishuMcpCommonTools } from "./src/tools/mcp/common/index.js";
import { registerFeishuOAuthTool } from "./src/tools/oauth.js";
import { registerFeishuOAuthBatchAuthTool } from "./src/tools/oauth-batch-auth.js";
import { runDiagnosis, formatDiagReportCli, traceByMessageId, formatTraceOutput, analyzeTrace, } from "./src/commands/diagnose.js";
import { registerCommands } from "./src/commands/index.js";
import { trace } from "./src/core/trace.js";
// ---------------------------------------------------------------------------
// Re-exports for external consumers
// ---------------------------------------------------------------------------
export { monitorFeishuProvider } from "./src/channel/monitor.js";
export { sendMessageFeishu, sendCardFeishu, updateCardFeishu, editMessageFeishu, } from "./src/messaging/outbound/send.js";
export { getMessageFeishu, } from "./src/messaging/outbound/fetch.js";
export { uploadImageLark, uploadFileLark, sendImageLark, sendFileLark, sendAudioLark, uploadAndSendMediaLark, } from "./src/messaging/outbound/media.js";
export { sendTextLark, sendCardLark, sendMediaLark, } from "./src/messaging/outbound/deliver.js";
export { probeFeishu } from "./src/channel/probe.js";
export { addReactionFeishu, removeReactionFeishu, listReactionsFeishu, FeishuEmoji, VALID_FEISHU_EMOJI_TYPES, } from "./src/messaging/outbound/reactions.js";
export { forwardMessageFeishu } from "./src/messaging/outbound/forward.js";
export { updateChatFeishu, addChatMembersFeishu, removeChatMembersFeishu, listChatMembersFeishu, } from "./src/messaging/outbound/chat-manage.js";
export { feishuMessageActions } from "./src/messaging/outbound/actions.js";
export { mentionedBot, nonBotMentions, extractMessageBody, formatMentionForText, formatMentionForCard, formatMentionAllForText, formatMentionAllForCard, buildMentionedMessage, buildMentionedCardContent, } from "./src/messaging/inbound/mention.js";
export { feishuPlugin } from "./src/channel/plugin.js";
export { handleFeishuReaction } from "./src/messaging/inbound/reaction-handler.js";
export { parseMessageEvent } from "./src/messaging/inbound/parse.js";
export { checkMessageGate } from "./src/messaging/inbound/gate.js";
export { isMessageExpired } from "./src/messaging/inbound/dedup.js";
// ---------------------------------------------------------------------------
// Plugin definition
// ---------------------------------------------------------------------------
const plugin = {
    id: "feishu",
    name: "Feishu",
    description: "Feishu/Lark channel plugin with doc/wiki/drive/task/calendar tools",
    configSchema: emptyPluginConfigSchema(),
    register(api) {
        LarkClient.setRuntime(api.runtime);
        api.registerChannel({ plugin: feishuPlugin });
        // ========================================
        // Register OAPI tools (calendar, task - using Feishu Open API directly)
        registerOapiTools(api);
        // Register MCP doc tools (using Model Context Protocol)
        registerFeishuMcpDocTools(api);
        // Register MCP common tools (fetch-file, get-user, search-user)
        // 不再支持
        // registerFeishuMcpCommonTools(api);
        // Register OAuth tool (UAT device flow authorization)
        registerFeishuOAuthTool(api);
        // Register OAuth batch auth tool (batch authorization for all app scopes)
        registerFeishuOAuthBatchAuthTool(api);
        // ---- Tool call hooks (auto-trace AI tool invocations) ----
        api.on("before_tool_call", (event) => {
            trace.info(`tool call: ${event.toolName} params=${JSON.stringify(event.params)}`);
        });
        api.on("after_tool_call", (event) => {
            if (event.error) {
                trace.error(`tool fail: ${event.toolName} ${event.error} (${event.durationMs ?? 0}ms)`);
            }
            else {
                trace.info(`tool done: ${event.toolName} ok (${event.durationMs ?? 0}ms)`);
            }
        });
        // ---- Diagnostic commands ----
        // CLI: openclaw feishu-diagnose [--trace <messageId>]
        api.registerCli((ctx) => {
            ctx.program
                .command("feishu-diagnose")
                .description("运行飞书插件诊断，检查配置、连通性和权限状态")
                .option("--trace <messageId>", "按 message_id 追踪完整处理链路")
                .option("--analyze", "分析追踪日志（需配合 --trace 使用）")
                .action(async (opts) => {
                try {
                    if (opts.trace) {
                        const lines = await traceByMessageId(opts.trace);
                        console.log(formatTraceOutput(lines, opts.trace));
                        if (opts.analyze && lines.length > 0) {
                            console.log(analyzeTrace(lines, opts.trace));
                        }
                    }
                    else {
                        const report = await runDiagnosis({
                            config: ctx.config,
                            logger: ctx.logger,
                        });
                        console.log(formatDiagReportCli(report));
                        if (report.overallStatus === "unhealthy") {
                            process.exitCode = 1;
                        }
                    }
                }
                catch (err) {
                    ctx.logger.error(`诊断命令执行失败: ${err}`);
                    process.exitCode = 1;
                }
            });
        }, { commands: ["feishu-diagnose"] });
        // Chat commands: /feishu_diagnose, /feishu_doctor, /feishu_auth, /feishu
        registerCommands(api);
    },
};
export default plugin;
//# sourceMappingURL=index.js.map