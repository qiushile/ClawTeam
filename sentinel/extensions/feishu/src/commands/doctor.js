/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * feishu-doctor 诊断报告 Markdown 格式化（完全重构版）
 *
 * 直接生成 Markdown 诊断报告，不依赖 diagnose.ts 的任何架构和代码。
 * 按照 doctor_template.md 的格式规范实现。
 */
import { getEnabledLarkAccounts } from "../core/accounts.js";
import { LarkClient } from "../core/lark-client.js";
import { getAppGrantedScopes, missingScopes } from "../core/app-scope-checker.js";
import { getAppOwnerFallback } from "../core/app-owner-fallback.js";
import { getStoredToken, tokenStatus } from "../core/token-store.js";
import { filterSensitiveScopes, REQUIRED_APP_SCOPES, TOOL_SCOPES } from "../core/tool-scopes.js";
import { probeFeishu } from "../channel/probe.js";
import { AppScopeCheckFailedError } from "../core/tool-client.js";
import { getPluginVersion } from "../core/version.js";
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * 格式化时间戳为 "YYYY-MM-DD HH:mm:ss"
 */
function formatTimestamp(date) {
    return date.toLocaleString("sv-SE", { timeZone: "Asia/Shanghai" }).replace("T", " ");
}
/**
 * 获取所有工具动作需要的唯一 scope 列表（从 diagnose.ts 复制）
 */
function getAllToolScopes() {
    const scopesSet = new Set();
    for (const scopes of Object.values(TOOL_SCOPES)) {
        for (const scope of scopes) {
            scopesSet.add(scope);
        }
    }
    return Array.from(scopesSet).sort();
}
/**
 * 计算总体状态
 */
function calculateOverallStatus(appStatus, userStatus) {
    if (appStatus === "fail" || userStatus === "fail") {
        return "❌ 失败";
    }
    if (appStatus === "warn" || userStatus === "warn") {
        return "⚠️ 警告";
    }
    return "✅ 正常";
}
// ---------------------------------------------------------------------------
// 基础信息检查
// ---------------------------------------------------------------------------
/**
 * 掩码敏感信息（appSecret）
 */
function maskSecret(secret) {
    if (!secret)
        return "(未设置)";
    if (secret.length <= 4)
        return "****";
    return secret.slice(0, 4) + "****";
}
/**
 * 检查基础信息和账号状态
 */
async function checkBasicInfo(account, config) {
    const lines = [];
    let status = "pass";
    // 旧版官方插件是否已禁用
    const feishuEntry = config.plugins?.entries?.feishu;
    if (feishuEntry?.enabled !== false) {
        status = "fail";
        lines.push("❌ **旧版插件**: 检测到旧版官方插件未禁用\n" +
            "👉 请依次运行命令：\n" +
            "```\n" +
            "openclaw config set plugins.entries.feishu.enabled false --json\n" +
            "openclaw gateway restart\n" +
            "```");
    }
    else {
        lines.push("✅ **旧版插件**: 已禁用");
    }
    lines.push(`✅ **凭证完整性**: appId: ${account.appId}, appSecret: ${maskSecret(account.appSecret)}`);
    lines.push(`✅ **账户启用**: 已启用`);
    // API 连通性
    try {
        const probeResult = await probeFeishu({
            accountId: account.accountId,
            appId: account.appId,
            appSecret: account.appSecret,
            brand: account.brand,
        });
        if (probeResult.ok) {
            lines.push(`✅ **API 连通性**: 连接成功`);
        }
        else {
            status = "fail";
            lines.push(`❌ **API 连通性**: 连接失败 - ${probeResult.error}`);
        }
    }
    catch (err) {
        status = "fail";
        lines.push(`❌ **API 连通性**: 探测异常 - ${err instanceof Error ? err.message : String(err)}`);
    }
    return {
        status,
        markdown: lines.join("\n"),
    };
}
// ---------------------------------------------------------------------------
// 工具配置检查
// ---------------------------------------------------------------------------
const INCOMPLETE_PROFILES = new Set(["minimal", "coding", "messaging"]);
function checkToolsProfile(config) {
    const tools = config.tools;
    const profile = tools?.profile;
    if (!profile) {
        return {
            status: "pass",
            markdown: "✅ 飞书工具加载暂未发现异常",
        };
    }
    if (INCOMPLETE_PROFILES.has(profile)) {
        return {
            status: "warn",
            markdown: `⚠️ **工具基础允许列表**: 当前为 \`${profile}\`，飞书工具可能无法加载。可以按需修改配置：\n` +
                "```\n" +
                'openclaw config set tools.profile "full"\n' +
                "openclaw gateway restart\n" +
                "```\n" +
                "📖 参考文档: https://docs.openclaw.ai/zh-CN/tools",
        };
    }
    // profile === "full" 或其他未知值
    return {
        status: "pass",
        markdown: `✅ 飞书工具加载暂未发现异常`,
    };
}
// ---------------------------------------------------------------------------
// 应用权限检查
// ---------------------------------------------------------------------------
/**
 * 检查应用权限状态
 */
async function checkAppPermissions(account, sdk) {
    const { appId } = account;
    try {
        // 获取应用已开通的权限（tenant token）
        const grantedScopes = await getAppGrantedScopes(sdk, appId, "tenant");
        // 计算缺失的必需权限
        const requiredMissing = missingScopes(grantedScopes, Array.from(REQUIRED_APP_SCOPES));
        if (requiredMissing.length === 0) {
            // 全部权限已开通
            return {
                status: "pass",
                markdown: `全部 ${REQUIRED_APP_SCOPES.length} 个必需权限已开通`,
                missingScopes: [],
            };
        }
        // 缺少必需权限
        const lines = [];
        let applyUrl = `https://open.feishu.cn/app/${appId}/auth?op_from=feishu-openclaw&token_type=tenant`;
        if (requiredMissing.length < 20) {
            applyUrl = `https://open.feishu.cn/app/${appId}/auth?q=${encodeURIComponent(requiredMissing.join(","))}&op_from=feishu-openclaw&token_type=tenant`;
        }
        lines.push(`缺少 ${requiredMissing.length} 个必需权限。需应用管理员申请开通 [申请](${applyUrl})`);
        lines.push("");
        for (const scope of requiredMissing) {
            lines.push(`- ${scope}`);
        }
        return {
            status: "fail",
            markdown: lines.join("\n"),
            missingScopes: requiredMissing,
        };
    }
    catch (err) {
        // API 调用失败（通常是缺少 application:application:self_manage 权限）
        const applyUrl = `https://open.feishu.cn/app/${appId}/auth?q=application:application:self_manage&op_from=feishu-openclaw&token_type=tenant`;
        if (err instanceof AppScopeCheckFailedError) {
            return {
                status: "fail",
                markdown: `无法查询应用权限状态。原因：未开通 application:application:self_manage 权限\n\n需应用管理员申请开通 [申请](${applyUrl})`,
                missingScopes: [],
            };
        }
        return {
            status: "fail",
            markdown: `无法查询应用权限状态。${err instanceof Error ? err.message : String(err)}\n\n建议检查 application:application:self_manage 权限 [申请](${applyUrl})`,
            missingScopes: [],
        };
    }
}
// ---------------------------------------------------------------------------
// 用户权限检查
// ---------------------------------------------------------------------------
/**
 * 生成权限对照表
 */
function generatePermissionTable(appGrantedScopes, userGrantedScopes, hasValidUser) {
    let allScopes = getAllToolScopes();
    allScopes = filterSensitiveScopes(allScopes);
    const appSet = new Set(appGrantedScopes);
    const userSet = new Set(userGrantedScopes);
    const lines = [];
    lines.push("| 权限名称 | 应用已开通 | 用户已授权 |");
    lines.push("|----------|-----------|-----------|");
    for (const scope of allScopes) {
        const appGranted = appSet.has(scope) ? "✅" : "❌";
        // 如果没有有效用户，显示 ➖；否则根据授权情况显示 ✅ 或 ❌
        const userGranted = !hasValidUser ? "➖" : (userSet.has(scope) ? "✅" : "❌");
        lines.push(`| ${scope} | ${appGranted} | ${userGranted} |`);
    }
    return lines.join("\n");
}
/**
 * 检查用户权限状态
 */
async function checkUserPermissions(account, sdk) {
    const { appId } = account;
    const lines = [];
    try {
        // 1. 获取应用所有者
        const ownerId = await getAppOwnerFallback(account, sdk);
        // 2. 读取 token
        const token = ownerId ? await getStoredToken(appId, ownerId) : null;
        // 判断是否有有效的用户授权
        const hasUserAuth = !!token;
        // 变量初始化
        let authStatus = "warn";
        let refreshStatus = "warn";
        let validCount = 0;
        let scopes = [];
        let userTokenStatus = "expired";
        let userMissing = [];
        // 获取应用开通的支持 user token 的权限
        const appUserScopes = await getAppGrantedScopes(sdk, appId, "user");
        const allScopes = getAllToolScopes();
        const appGrantedCount = appUserScopes.filter((s) => allScopes.includes(s)).length;
        if (hasUserAuth) {
            // 有用户授权 - 检查授权状态
            const status = tokenStatus(token);
            userTokenStatus = status;
            scopes = token.scope.split(" ").filter(Boolean);
            validCount = status === "valid" ? 1 : 0;
            const needsRefreshCount = status === "needs_refresh" ? 1 : 0;
            const expiredCount = status === "expired" ? 1 : 0;
            authStatus = expiredCount > 0 ? "warn" : validCount === 1 ? "pass" : "warn";
            const authEmoji = authStatus === "pass" ? "✅" : "⚠️";
            lines.push(`${authEmoji} **授权状态**: 共 1 个用户 | ✓ 有效: ${validCount}, ⟳ 需刷新: ${needsRefreshCount}, ✗ 已过期: ${expiredCount}`);
            // Token 自动刷新检查
            const hasOfflineAccess = scopes.includes("offline_access");
            refreshStatus = hasOfflineAccess ? "pass" : "warn";
            const refreshEmoji = refreshStatus === "pass" ? "✅" : "⚠️";
            lines.push(`${refreshEmoji} **Token 自动刷新**: ${hasOfflineAccess ? "✓ 已开启自动刷新 (1/1 个用户)" : "✗ 未开启自动刷新，Token 将在 2 小时后过期"}`);
        }
        else {
            // 没有用户授权
            lines.push("⚠️ **暂无用户授权**");
            lines.push("");
            lines.push("尚未有用户通过 OAuth 授权。用户首次使用需以用户身份的功能时，会自动触发授权流程。");
            lines.push("");
        }
        // 计算用户已授权权限数
        const userGrantedCount = validCount === 1 ? scopes.filter((s) => allScopes.includes(s)).length : 0;
        // 计算用户缺失的权限
        if (hasUserAuth && validCount === 1) {
            const scopeSet = new Set(scopes);
            userMissing = allScopes.filter((s) => !scopeSet.has(s));
        }
        // 权限对照统计
        const tableStatus = appGrantedCount < allScopes.length || userGrantedCount < allScopes.length ? (appGrantedCount < allScopes.length ? "fail" : "warn") : "pass";
        const tableEmoji = tableStatus === "pass" ? "✅" : tableStatus === "warn" ? "⚠️" : "❌";
        if (validCount === 0) {
            lines.push(`**权限对照**: 应用 **${appGrantedCount}/${allScopes.length}** 已开通，用户 **暂无授权**`);
        }
        else if (userGrantedCount < allScopes.length) {
            lines.push(`${tableEmoji} **用户身份权限不足**: 应用 **${appGrantedCount}/${allScopes.length}** 已开通，用户 **${userGrantedCount}/${allScopes.length}** 已授权`);
        }
        else {
            lines.push(`${tableEmoji} **权限对照**: 应用 **${appGrantedCount}/${allScopes.length}** 已开通，用户 **${userGrantedCount}/${allScopes.length}** 已授权`);
        }
        lines.push("");
        // 添加指引信息
        if (appGrantedCount < allScopes.length) {
            // 计算缺失的应用权限
            const appMissingScopes = allScopes.filter((s) => !appUserScopes.includes(s));
            let appApplyUrl = `https://open.feishu.cn/app/${appId}/auth?op_from=feishu-openclaw&token_type=user`;
            if (appMissingScopes.length < 20) {
                appApplyUrl = `https://open.feishu.cn/app/${appId}/auth?q=${encodeURIComponent(appMissingScopes.join(","))}&op_from=feishu-openclaw&token_type=user`;
            }
            lines.push(`💡 应用缺少 ${appMissingScopes.length} 个用户身份权限。需应用管理员申请开通 [申请](${appApplyUrl})`);
            // lines.push("");
        }
        if (userGrantedCount < allScopes.length && validCount > 0) {
            lines.push(`💡 用户需要重新授权以获得完整权限，可以向机器人发送消息 "**/feishu auth**"`);
            lines.push("");
        }
        else if (!hasUserAuth) {
            lines.push(`💡 用户需要进行 OAuth 授权，可以向机器人发送消息 "**/feishu auth**"`);
            lines.push("");
        }
        // 生成详细权限对照表
        const table = generatePermissionTable(appUserScopes, validCount === 1 ? scopes : [], validCount === 1);
        lines.push(table);
        // 计算总体状态
        const overallStatus = tableStatus === "fail"
            ? "fail"
            : authStatus === "warn" || refreshStatus === "warn" || tableStatus === "warn"
                ? "warn"
                : "pass";
        return {
            status: overallStatus,
            markdown: lines.join("\n"),
            hasAuth: hasUserAuth,
            tokenExpired: userTokenStatus === "expired",
            missingUserScopes: userMissing,
        };
    }
    catch (err) {
        const applyUrl = `https://open.feishu.cn/app/${appId}/auth?q=application:application:self_manage&op_from=feishu-openclaw&token_type=tenant`;
        if (err instanceof AppScopeCheckFailedError) {
            return {
                status: "warn",
                markdown: `用户权限检查失败：无法查询应用权限。原因：未开通 application:application:self_manage 权限\n\n需应用管理员申请开通 [申请](${applyUrl})`,
                hasAuth: false,
                tokenExpired: false,
                missingUserScopes: [],
            };
        }
        return {
            status: "warn",
            markdown: `用户权限检查失败: ${err instanceof Error ? err.message : String(err)}`,
            hasAuth: false,
            tokenExpired: false,
            missingUserScopes: [],
        };
    }
}
// ---------------------------------------------------------------------------
// 主函数
// ---------------------------------------------------------------------------
/**
 * 运行飞书插件诊断，生成 Markdown 格式报告
 */
export async function runFeishuDoctor(config) {
    const lines = [];
    // 1. 获取第一个已启用的飞书账户
    const accounts = getEnabledLarkAccounts(config);
    if (accounts.length === 0) {
        return "❌ **错误**: 未找到已启用的飞书账户\n\n请在 OpenClaw 配置文件中配置飞书账户并启用。";
    }
    // getEnabledLarkAccounts 只返回已配置且已启用的账户，所以这里可以安全断言为 ConfiguredLarkAccount
    const account = accounts[0];
    const sdk = LarkClient.fromAccount(account).sdk;
    // 2. 检查基础信息和账号状态
    const basicInfoResult = await checkBasicInfo(account, config);
    // 3. 检查应用权限
    const appResult = await checkAppPermissions(account, sdk);
    // 4. 检查用户权限
    const userResult = await checkUserPermissions(account, sdk);
    // 6. 生成报告头部
    lines.push("### 飞书插件诊断");
    lines.push("");
    lines.push(`插件版本: ${getPluginVersion()}  |  诊断时间: ${formatTimestamp(new Date())}`);
    lines.push("");
    lines.push("---");
    lines.push("");
    // // 7. 生成诊断摘要（包含总体状态）
    // const summary = generateSummary({
    //   basicInfoOk: basicInfoResult.apiOk,
    //   appStatus: appResult.status,
    //   userStatus: userResult.status,
    //   appMissingScopes: appResult.missingScopes,
    //   userHasAuth: userResult.hasAuth,
    //   userTokenExpired: userResult.tokenExpired,
    //   userMissingScopes: userResult.missingUserScopes,
    //   appId: account.appId,
    // }, overallStatus);
    // lines.push(summary);
    // lines.push("");
    // lines.push("---");
    // lines.push("");
    // 8. 环境信息
    const basicTitle = basicInfoResult.status === "pass"
        ? "#### ✅ 环境信息检查通过"
        : "#### ❌ 环境信息检查未通过";
    lines.push(basicTitle);
    lines.push("");
    lines.push(basicInfoResult.markdown);
    lines.push("");
    lines.push("---");
    lines.push("");
    // 8.5 工具配置
    const toolsResult = checkToolsProfile(config);
    const toolsTitle = toolsResult.status === "pass"
        ? "#### ✅ 工具配置检查通过"
        : "#### ⚠️ 工具配置检查异常";
    lines.push(toolsTitle);
    lines.push("");
    lines.push(toolsResult.markdown);
    lines.push("");
    lines.push("---");
    lines.push("");
    // 9. 应用权限
    const appTitle = appResult.status === "pass"
        ? "#### ✅ 应用身份权限检查通过"
        : "#### ❌ 应用身份权限检查未通过";
    lines.push(appTitle);
    lines.push("");
    lines.push(appResult.markdown);
    lines.push("");
    lines.push("---");
    lines.push("");
    // 10. 用户权限
    const userTitle = userResult.status === "pass"
        ? "#### ✅ 用户身份权限检查通过"
        : "#### ❌ 用户身份权限检查未通过";
    lines.push(userTitle);
    lines.push("");
    lines.push(userResult.markdown);
    lines.push("");
    return lines.join("\n");
}
//# sourceMappingURL=doctor.js.map