/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * 应用所有者兜底逻辑 - 当 senderOpenId 缺失时（如 cron 触发），自动使用应用所有者身份
 */
/** 应用所有者缓存（appId → { ownerId, timestamp }）。 */
const appOwnerCache = new Map();
/** 缓存过期时间：24 小时。 */
const CACHE_TTL = 24 * 60 * 60 * 1000;
/**
 * 获取应用所有者的 open_id，用作 senderOpenId 缺失时的兜底。
 *
 * 调用 `/open-apis/application/v6/applications` API 查询应用信息，
 * 优先使用 owner.owner_id（当 type=2 企业内成员时），回退到 creator_id。
 *
 * 结果缓存 24 小时，避免频繁请求。
 *
 * @param account - 已配置的飞书账号信息
 * @param sdk - 飞书 SDK 实例（必须已初始化 TAT）
 * @returns 应用所有者的 open_id，如果查询失败或无有效所有者则返回 undefined
 */
export async function getAppOwnerFallback(account, sdk) {
    const { appId } = account;
    try {
        // 1. 检查缓存
        const cached = appOwnerCache.get(appId);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`[app-owner-fallback] Using cached owner (appId=${appId}, ownerId=${cached.ownerId})`);
            return cached.ownerId;
        }
        console.log(`[app-owner-fallback] Fetching app owner for appId=${appId}`);
        // 2. 调用 API 获取应用信息（使用 TAT）- 参考 app-scope-checker.ts
        const res = await sdk.request({
            method: "GET",
            url: `/open-apis/application/v6/applications/${appId}`,
            params: { lang: "zh_cn" },
        });
        console.log(`[app-owner-fallback] API response code=${res.code}`);
        if (res.code !== 0) {
            console.log(`[app-owner-fallback] API failed with code=${res.code}, msg=${res.msg}`);
            return undefined;
        }
        // 3. 获取应用信息
        const appInfo = res.data?.app;
        if (!appInfo) {
            console.log(`[app-owner-fallback] No app data returned (appId=${appId})`);
            return undefined;
        }
        // 4. 提取 owner_id，优先使用 owner.owner_id，回退到 creator_id
        let ownerId;
        if (appInfo.owner?.type === 2 && appInfo.owner.owner_id) {
            // type=2 表示企业内成员
            ownerId = appInfo.owner.owner_id;
        }
        else if (appInfo.creator_id) {
            ownerId = appInfo.creator_id;
        }
        if (!ownerId) {
            console.log(`[app-owner-fallback] No valid owner/creator found for app (appId=${appId})`);
            return undefined;
        }
        // 5. 缓存结果
        appOwnerCache.set(appId, { ownerId, timestamp: Date.now() });
        console.log(`[app-owner-fallback] Cached app owner (appId=${appId}, ownerId=${ownerId})`);
        return ownerId;
    }
    catch (err) {
        console.log(`[app-owner-fallback] Failed to get app owner (appId=${appId}): ${err}`);
        return undefined;
    }
}
//# sourceMappingURL=app-owner-fallback.js.map