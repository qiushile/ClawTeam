/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * 应用所有者兜底逻辑 - 当 senderOpenId 缺失时（如 cron 触发），自动使用应用所有者身份
 */
import type { ConfiguredLarkAccount } from "./types.js";
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
export declare function getAppOwnerFallback(account: ConfiguredLarkAccount, sdk: any): Promise<string | undefined>;
//# sourceMappingURL=app-owner-fallback.d.ts.map