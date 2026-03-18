/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * feishu_auth command — 飞书用户权限批量授权命令实现
 *
 * 直接复用 onboarding-auth.ts 的 triggerOnboarding() 函数。
 * 注意：此命令仅限应用 owner 执行（与 onboarding 逻辑一致）
 */
import { triggerOnboarding } from "../tools/onboarding-auth.js";
import { getTraceContext } from "../core/trace.js";
import { getLarkAccount } from "../core/accounts.js";
import { LarkClient } from "../core/lark-client.js";
import { getAppInfo, getAppGrantedScopes } from "../core/app-scope-checker.js";
import { getStoredToken } from "../core/token-store.js";
import { filterSensitiveScopes } from "../core/tool-scopes.js";
/**
 * 执行飞书用户权限批量授权命令
 * 直接调用 triggerOnboarding()，包含 owner 检查
 */
export async function runFeishuAuth(config) {
    const traceCtx = getTraceContext();
    const senderOpenId = traceCtx?.senderOpenId;
    if (!senderOpenId) {
        return "❌ 无法获取用户身份，请在飞书对话中使用此命令";
    }
    // 提前检查 owner 身份，给出明确提示
    const acct = getLarkAccount(config, traceCtx.accountId);
    if (!acct.configured) {
        return `❌ 账号 ${traceCtx.accountId} 配置不完整`;
    }
    const sdk = LarkClient.fromAccount(acct).sdk;
    const { appId } = acct;
    let appInfo;
    try {
        appInfo = await getAppInfo(sdk, appId);
    }
    catch (err) {
        const link = `https://open.feishu.cn/app/${appId}/auth?q=application:application:self_manage&op_from=feishu-openclaw&token_type=tenant`;
        return `❌ 应用缺少核心权限 application:application:self_manage，无法查询可授权 scope 列表。\n\n请管理员在飞书开放平台开通此权限后重试：[申请权限](${link})`;
    }
    if (appInfo.ownerOpenId && senderOpenId !== appInfo.ownerOpenId) {
        return "❌ 此命令仅限应用 owner 执行\n\n如需授权，请联系应用管理员。";
    }
    // 预检：是否还有未授权的 scope
    let appScopes;
    try {
        appScopes = await getAppGrantedScopes(sdk, appId, "user");
    }
    catch {
        const link = `https://open.feishu.cn/app/${appId}/auth?q=application:application:self_manage&op_from=feishu-openclaw&token_type=tenant`;
        return `❌ 应用缺少核心权限 application:application:self_manage，无法查询可授权 scope 列表。\n\n请管理员在飞书开放平台开通此权限后重试：[申请权限](${link})`;
    }
    // offline_access 预检 — OAuth 必须的前提权限
    const allScopes = await getAppGrantedScopes(sdk, appId);
    if (allScopes.length > 0 && !allScopes.includes("offline_access")) {
        const link = `https://open.feishu.cn/app/${appId}/auth?q=offline_access&op_from=feishu-openclaw&token_type=user`;
        return `❌ 应用缺少核心权限 offline_access，无法查询可授权 scope 列表。\n\n请管理员在飞书开放平台开通此权限后重试：[申请权限](${link})`;
    }
    appScopes = filterSensitiveScopes(appScopes);
    if (appScopes.length === 0) {
        return "当前应用未开通任何用户级权限，无需授权。";
    }
    const existing = await getStoredToken(appId, senderOpenId);
    const grantedScopes = new Set(existing?.scope?.split(/\s+/).filter(Boolean) ?? []);
    const missingScopes = appScopes.filter((s) => !grantedScopes.has(s));
    if (missingScopes.length === 0) {
        return `✅ 您已授权所有可用权限（共 ${appScopes.length} 个），无需重复授权。`;
    }
    // 调用 triggerOnboarding 执行批量授权
    await triggerOnboarding({
        cfg: config,
        userOpenId: senderOpenId,
        accountId: traceCtx.accountId,
    });
    return `✅ 已发送授权请求`;
}
//# sourceMappingURL=auth.js.map