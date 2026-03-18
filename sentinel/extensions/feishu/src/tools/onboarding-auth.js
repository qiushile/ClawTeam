/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Onboarding 预授权模块。
 *
 * 配对后自动发起 OAuth Device Flow，引导应用 owner 完成用户授权。
 * 仅当配对用户 === 应用 owner 时触发。
 *
 * 飞书限制：单次 OAuth 最多 50 个 scope。
 * 超过 50 个时自动分批处理，每批授权完成后自动发起下一批（链式触发）。
 */
import { getLarkAccount } from "../core/accounts.js";
import { LarkClient } from "../core/lark-client.js";
import { getAppInfo, getAppGrantedScopes } from "../core/app-scope-checker.js";
import { executeAuthorize } from "./oauth.js";
import { trace } from "../core/trace.js";
import { filterSensitiveScopes } from "../core/tool-scopes.js";
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_SCOPES_PER_BATCH = 100;
// ---------------------------------------------------------------------------
// Trigger onboarding
// ---------------------------------------------------------------------------
/**
 * 配对后触发 onboarding OAuth 授权。
 *
 * 流程：
 *   1. 检查 userOpenId === 应用 owner，不匹配则静默跳过
 *   2. 读取 onboarding-scopes.json 中的 user scope 列表
 *   3. 分批处理（每批最多 50 个），第一批直接发起 OAuth Device Flow
 *   4. 每批授权完成后通过 onAuthComplete 回调自动发起下一批
 */
export async function triggerOnboarding(params) {
    const { cfg, userOpenId, accountId } = params;
    const acct = getLarkAccount(cfg, accountId);
    if (!acct.configured) {
        trace.warn(`onboarding: account ${accountId} not configured, skipping`);
        return;
    }
    const sdk = LarkClient.fromAccount(acct).sdk;
    const { appId } = acct;
    // 1. 获取应用信息 → 检查 owner
    let appInfo;
    try {
        appInfo = await getAppInfo(sdk, appId);
    }
    catch (err) {
        trace.warn(`onboarding: failed to get app info for ${appId}: ${err}`);
        return;
    }
    // 2. 检查 userOpenId === ownerOpenId
    if (!appInfo.ownerOpenId) {
        trace.info(`onboarding: app ${appId} has no owner info, skipping`);
        return;
    }
    if (userOpenId !== appInfo.ownerOpenId) {
        trace.info(`onboarding: user ${userOpenId} is not app owner (${appInfo.ownerOpenId}), skipping`);
        return;
    }
    trace.info(`onboarding: user ${userOpenId} is app owner, starting OAuth`);
    // 3. 动态获取应用已开通的 user scope 列表
    let allUserScopes;
    try {
        allUserScopes = await getAppGrantedScopes(sdk, appId, "user");
    }
    catch (err) {
        trace.warn(`onboarding: failed to get app granted scopes: ${err}`);
        return;
    }
    // 过滤掉敏感 scope
    allUserScopes = filterSensitiveScopes(allUserScopes);
    if (allUserScopes.length === 0) {
        trace.info("onboarding: no user scopes configured, skipping");
        return;
    }
    // 4. 分批
    const batches = [];
    for (let i = 0; i < allUserScopes.length; i += MAX_SCOPES_PER_BATCH) {
        batches.push(allUserScopes.slice(i, i + MAX_SCOPES_PER_BATCH));
    }
    trace.info(`onboarding: ${allUserScopes.length} user scopes, ${batches.length} batch(es)`);
    // 5. 链式发起授权（第一批同步发起，后续批次由 onAuthComplete 回调触发）
    const startBatch = async (batchIndex) => {
        if (batchIndex >= batches.length) {
            trace.info("onboarding: all batches completed");
            return;
        }
        const batch = batches[batchIndex];
        const scope = batch.join(" ");
        let batchInfo = "";
        if (batches.length > 1) {
            batchInfo =
                `\n\n📋 授权进度：第 ${batchIndex + 1}/${batches.length} 批` +
                    `（本批 ${batch.length} 个权限，共 ${allUserScopes.length} 个）`;
            if (batchIndex < batches.length - 1) {
                batchInfo += `\n授权完成后将自动发起下一批。`;
            }
            else {
                batchInfo += `\n这是最后一批，授权完成后即可使用所有功能。`;
            }
        }
        const traceCtx = {
            messageId: `onboarding:${Date.now()}`,
            chatId: userOpenId,
            accountId,
            startTime: Date.now(),
            senderOpenId: userOpenId,
            httpHeaders: acct.extra?.httpHeaders,
            chatType: "p2p",
        };
        trace.info(`onboarding: starting batch ${batchIndex + 1}/${batches.length}, scopes=${batch.length}`);
        try {
            await executeAuthorize({
                account: acct,
                senderOpenId: userOpenId,
                scope,
                isBatchAuth: true,
                totalAppScopes: allUserScopes.length,
                alreadyGranted: batchIndex * MAX_SCOPES_PER_BATCH,
                batchInfo,
                skipSyntheticMessage: true,
                cfg,
                traceCtx,
                onAuthComplete: async () => {
                    trace.info(`onboarding: batch ${batchIndex + 1}/${batches.length} auth completed`);
                    await startBatch(batchIndex + 1);
                },
            });
        }
        catch (err) {
            trace.error(`onboarding: batch ${batchIndex + 1} failed: ${err}`);
        }
    };
    await startBatch(0);
}
//# sourceMappingURL=onboarding-auth.js.map