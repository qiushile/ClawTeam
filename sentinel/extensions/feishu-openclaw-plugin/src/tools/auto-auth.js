/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * auto-auth.ts — 工具层自动授权处理。
 *
 * 当 OAPI 工具遇到授权问题时，直接在工具层处理，不再让 AI 判断：
 *
 * - UserAuthRequiredError (appScopeVerified=true)
 *   → 直接调用 executeAuthorize 发起 OAuth Device Flow 卡片
 *
 * - UserScopeInsufficientError
 *   → 直接调用 executeAuthorize（使用 missingScopes）
 *
 * - AppScopeMissingError
 *   → 发送应用权限引导卡片；用户点击"我已完成"后：
 *     1. 更新卡片为处理中状态
 *     2. invalidateAppScopeCache
 *     3. 发送中间合成消息告知 AI（"应用权限已确认，正在发起用户授权..."）
 *     4. 调用 executeAuthorize 发起 OAuth Device Flow
 *
 * - 其他情况（AppScopeCheckFailedError、appScopeVerified=false 等）
 *   → 回退到原 handleInvokeError（不触发自动授权）
 *
 * 降级策略（保守）：以下情况均回退到 handleInvokeError：
 * - 无 TraceContext（非消息场景）
 * - 无 senderOpenId（无法确定授权对象）
 * - 账号未配置（!acct.configured）
 * - 任何步骤抛出异常
 */
import { getTraceContext, trace } from "../core/trace.js";
import { getLarkAccount } from "../core/accounts.js";
import { UserAuthRequiredError, UserScopeInsufficientError, AppScopeMissingError, } from "../core/tool-client.js";
import { invalidateAppScopeCache, getAppGrantedScopes, isAppScopeSatisfied } from "../core/app-scope-checker.js";
import { LarkClient } from "../core/lark-client.js";
import { createCardEntity, sendCardByCardId, updateCardKitCardForAuth, } from "../card/cardkit.js";
import { executeAuthorize } from "./oauth.js";
import { formatLarkError } from "./oapi/helpers.js";
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function json(obj) {
    return {
        content: [{ type: "text", text: JSON.stringify(obj, null, 2) }],
        details: obj,
    };
}
/**
 * 防抖缓冲区 Map。
 *
 * Key 规则：
 *   用户授权：`user:${accountId}:${senderOpenId}:${messageId}`
 *   应用授权：`app:${accountId}:${chatId}:${messageId}`
 */
const authBatches = new Map();
/** 防抖窗口（毫秒） */
const AUTH_DEBOUNCE_MS = 50;
/** 用户授权防抖窗口（毫秒）。比 app auth 的 50ms 更长，保证应用权限卡片先发出。 */
const AUTH_USER_DEBOUNCE_MS = 150;
/**
 * Scope 更新防抖窗口（毫秒）。
 * 比初始防抖更长，因为工具调用可能间隔数十到数百毫秒顺序到达。
 * 需要等足够久以收集所有后续到达的 scope 后再一次性更新卡片。
 */
const AUTH_UPDATE_DEBOUNCE_MS = 500;
/**
 * 冷却期（毫秒）。
 * flushFn 执行完毕后，entry 继续保留在 Map 中这么长时间，
 * 防止后续顺序到达的工具调用创建重复卡片。
 */
const AUTH_COOLDOWN_MS = 30_000;
/**
 * 将授权请求入队到防抖缓冲区。
 *
 * 同一 bufferKey 的请求会被合并：
 * - collecting 阶段：scope 集合取并集，共享同一个 flushFn 执行结果
 * - executing 阶段：flushFn 已在运行，后续请求直接复用已有结果（不重复发卡片）
 *
 * @param bufferKey - 缓冲区 key（区分不同用户/会话）
 * @param scopes - 本次请求需要的 scope 列表
 * @param ctx - 上下文信息（仅第一个请求的被采用）
 * @param flushFn - 定时器到期后执行的实际授权函数，接收合并后的 scope 数组
 */
function enqueueAuthRequest(bufferKey, scopes, ctx, flushFn, debounceMs = AUTH_DEBOUNCE_MS) {
    const existing = authBatches.get(bufferKey);
    if (existing) {
        // 不论哪个阶段，都追加 scope
        for (const s of scopes)
            existing.scopes.add(s);
        if (existing.phase === "executing") {
            // flushFn 已在执行或已完成（卡片已发出），复用结果
            // 同时触发延迟刷新：用合并后的 scope 重新调用 flushFn 更新卡片
            trace.info(`auto-auth: auth in-flight, piggyback → key=${bufferKey}, scopes=[${[...existing.scopes].join(", ")}]`);
            // 防抖 + 互斥：多个快速到达的请求只触发一次卡片更新
            if (existing.updateTimer)
                clearTimeout(existing.updateTimer);
            existing.updateTimer = setTimeout(async () => {
                existing.updateTimer = null;
                // 互斥：如果上一轮更新还在执行，标记 pendingReupdate 等它结束后重跑
                if (existing.isUpdating) {
                    existing.pendingReupdate = true;
                    trace.info(`auto-auth: scope update deferred (previous update still running) → key=${bufferKey}`);
                    return;
                }
                existing.isUpdating = true;
                try {
                    const mergedScopes = [...existing.scopes];
                    trace.info(`auto-auth: scope update flush → key=${bufferKey}, scopes=[${mergedScopes.join(", ")}]`);
                    // 重新调用 flushFn（executeAuthorize 会检测到 pendingFlow，
                    // 原地更新旧卡片内容 + 重启 Device Flow）
                    await existing.flushFn(mergedScopes);
                }
                catch (err) {
                    trace.warn(`auto-auth: scope update failed: ${err}`);
                }
                finally {
                    existing.isUpdating = false;
                    // 如果锁定期间有新 scope 到达，再跑一轮
                    if (existing.pendingReupdate) {
                        existing.pendingReupdate = false;
                        const finalScopes = [...existing.scopes];
                        trace.info(`auto-auth: scope reupdate → key=${bufferKey}, scopes=[${finalScopes.join(", ")}]`);
                        try {
                            await existing.flushFn(finalScopes);
                        }
                        catch (err) {
                            trace.warn(`auto-auth: scope reupdate failed: ${err}`);
                        }
                    }
                }
            }, AUTH_UPDATE_DEBOUNCE_MS);
            return existing.resultPromise;
        }
        // collecting 阶段：正常合并
        trace.info(`auto-auth: debounce merge → key=${bufferKey}, scopes=[${[...existing.scopes].join(", ")}]`);
        return new Promise((resolve, reject) => {
            existing.waiters.push({ resolve, reject });
        });
    }
    // 创建新缓冲区（collecting 阶段）
    const entry = {
        phase: "collecting",
        scopes: new Set(scopes),
        waiters: [],
        timer: null,
        resultPromise: null,
        updateTimer: null,
        isUpdating: false,
        pendingReupdate: false,
        flushFn: null,
        account: ctx.account,
        cfg: ctx.cfg,
        traceCtx: ctx.traceCtx,
    };
    const promise = new Promise((resolve, reject) => {
        entry.waiters.push({ resolve, reject });
    });
    entry.timer = setTimeout(async () => {
        // 转入 executing 阶段（不从 Map 中删除，阻止后续请求创建新卡片）
        entry.phase = "executing";
        entry.timer = null;
        entry.flushFn = flushFn; // 保存引用，供 executing 阶段 scope 更新时重新调用
        const mergedScopes = [...entry.scopes];
        trace.info(`auto-auth: debounce flush → key=${bufferKey}, ` +
            `waiters=${entry.waiters.length}, scopes=[${mergedScopes.join(", ")}]`);
        // 将 flushFn 的 Promise 存入 entry，供 executing 阶段的后来者复用
        entry.resultPromise = flushFn(mergedScopes);
        try {
            const result = await entry.resultPromise;
            for (const w of entry.waiters)
                w.resolve(result);
        }
        catch (err) {
            for (const w of entry.waiters)
                w.reject(err);
        }
        finally {
            // 进入冷却期：entry 继续留在 Map 中，后续到达的工具调用
            // 会命中 executing 分支并复用 resultPromise，不会创建新卡片。
            // 冷却期结束后清理。
            setTimeout(() => authBatches.delete(bufferKey), AUTH_COOLDOWN_MS);
        }
    }, debounceMs);
    authBatches.set(bufferKey, entry);
    return promise;
}
const pendingAppAuthFlows = new Map();
/**
 * 去重索引：dedupKey → operationId。
 *
 * 防止并发工具调用（parallel tool calls）时重复发送内容相同的应用授权卡片。
 * key = chatId + "\0" + sorted(missingScopes).join(",")
 */
const dedupIndex = new Map();
/**
 * 活跃卡片索引：`${chatId}:${messageId}` → operationId。
 *
 * 当 scope 更新时（不同 scope 集合），通过 chatId+messageId 找到已有卡片并原地更新，
 * 而非创建新卡片。与 dedupIndex（按 scope 精确匹配）互补。
 */
const activeAppCardIndex = new Map();
/** TTL：15 分钟后自动清理，防止内存泄漏。 */
const PENDING_FLOW_TTL_MS = 15 * 60 * 1000;
/** 计算去重 key（chatId + messageId + 有序 scopes）。 */
function makeDedupKey(chatId, messageId, scopes) {
    return chatId + "\0" + messageId + "\0" + [...scopes].sort().join(",");
}
// ---------------------------------------------------------------------------
// Card builders — CardKit v2 格式
// ---------------------------------------------------------------------------
/**
 * 构建应用权限引导卡片。
 *
 * 蓝色 header，列出缺失的 scope，提供权限管理链接和"我已完成，继续授权"按钮。
 */
function buildAppScopeMissingCard(params) {
    const { missingScopes, appId, operationId } = params;
    const authUrl = appId
        ? `https://open.feishu.cn/app/${appId}/auth?q=${encodeURIComponent(missingScopes.join(","))}&op_from=feishu-openclaw&token_type=user`
        : "https://open.feishu.cn/";
    const multiUrl = { url: authUrl, pc_url: authUrl, android_url: authUrl, ios_url: authUrl };
    const scopeList = missingScopes.map((s) => `• ${s}`).join("\n");
    return {
        schema: "2.0",
        config: { wide_screen_mode: true },
        header: {
            title: { tag: "plain_text", content: "🔐 需要申请权限才能继续" },
            template: "orange",
        },
        body: {
            elements: [
                {
                    tag: "markdown",
                    content: "调用前，请你先申请以下**所有**权限：",
                    text_size: "normal",
                },
                {
                    tag: "column_set",
                    flex_mode: "none",
                    background_style: "grey",
                    horizontal_spacing: "default",
                    columns: [
                        {
                            tag: "column",
                            width: "weighted",
                            weight: 1,
                            vertical_align: "center",
                            elements: [{ tag: "markdown", content: scopeList }],
                        },
                    ],
                },
                { tag: "hr" },
                {
                    tag: "column_set",
                    flex_mode: "none",
                    horizontal_spacing: "default",
                    columns: [
                        {
                            tag: "column",
                            width: "weighted",
                            weight: 3,
                            vertical_align: "center",
                            elements: [{ tag: "markdown", content: "**第一步：申请所有权限**" }],
                        },
                        {
                            tag: "column",
                            width: "weighted",
                            weight: 1,
                            vertical_align: "center",
                            elements: [
                                {
                                    tag: "button",
                                    text: { tag: "plain_text", content: "去申请" },
                                    type: "primary",
                                    multi_url: multiUrl,
                                },
                            ],
                        },
                    ],
                },
                {
                    tag: "column_set",
                    flex_mode: "none",
                    horizontal_spacing: "default",
                    columns: [
                        {
                            tag: "column",
                            width: "weighted",
                            weight: 3,
                            vertical_align: "center",
                            elements: [{ tag: "markdown", content: "**第二步：创建版本并审核通过**" }],
                        },
                        {
                            tag: "column",
                            width: "weighted",
                            weight: 1,
                            vertical_align: "center",
                            elements: [
                                {
                                    tag: "button",
                                    text: { tag: "plain_text", content: "已完成" },
                                    type: "default",
                                    value: { action: "app_auth_done", operation_id: operationId },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    };
}
/**
 * 构建应用权限引导卡片的"处理中"状态（用户点击按钮后更新）。
 */
function buildAppAuthProgressCard() {
    return {
        schema: "2.0",
        config: { wide_screen_mode: false },
        header: {
            title: { tag: "plain_text", content: "授权成功" },
            subtitle: { tag: "plain_text", content: "" },
            template: "green",
            padding: "12px 12px 12px 12px",
            icon: { tag: "standard_icon", token: "yes_filled" },
        },
        body: {
            elements: [
                {
                    tag: "markdown",
                    content: "您的应用权限已开通，正在为您发起用户授权",
                    text_size: "normal",
                },
            ],
        },
    };
}
// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
/**
 * 发送应用权限引导卡片，并将 flow 存入 pendingAppAuthFlows。
 * 返回工具结果（告知 AI 等待用户操作）。
 */
async function sendAppScopeCard(params) {
    const { account, missingScopes, appId, scopeNeedType, tokenType, cfg, traceCtx } = params;
    const { accountId, chatId, messageId } = traceCtx;
    const activeCardKey = `${chatId}:${messageId}`;
    // ---- 去重：避免并发工具调用时发出多张内容相同的卡片 ----
    const dedup = makeDedupKey(chatId, messageId, missingScopes);
    const existingOpId = dedupIndex.get(dedup);
    if (existingOpId && pendingAppAuthFlows.has(existingOpId)) {
        trace.info(`auto-auth: dedup – app-scope card already pending for chatId=${chatId}, ` +
            `scopes=[${missingScopes.join(", ")}], skipping duplicate send`);
        return json({
            awaiting_app_authorization: true,
            message: "已向用户发送授权引导卡片，等待用户完成授权操作。" +
                "请告知用户：按照卡片提示完成授权，完成后系统将自动重试之前的操作。" +
                "请等待用户完成卡片操作，不要建议其他替代方案。",
            missing_scopes: missingScopes,
        });
    }
    // ---- 卡片复用：同一 chatId+messageId 已有活跃卡片时，原地更新而非创建新卡片 ----
    const activeOpId = activeAppCardIndex.get(activeCardKey);
    const activeFlow = activeOpId ? pendingAppAuthFlows.get(activeOpId) : undefined;
    if (activeFlow) {
        // 更新已有卡片的内容（合并后的 scope）
        const newOperationId = Date.now().toString(36) + Math.random().toString(36).slice(2);
        const card = buildAppScopeMissingCard({ missingScopes, appId, operationId: newOperationId });
        const newSeq = activeFlow.sequence + 1;
        try {
            await updateCardKitCardForAuth({
                cfg,
                cardId: activeFlow.cardId,
                card,
                sequence: newSeq,
                accountId,
            });
            trace.info(`auto-auth: app-scope card updated in-place, cardId=${activeFlow.cardId}, ` +
                `seq=${newSeq}, scopes=[${missingScopes.join(", ")}]`);
            // 更新 flow 信息
            activeFlow.sequence = newSeq;
            activeFlow.requiredScopes = missingScopes;
            activeFlow.scopeNeedType = scopeNeedType;
            // 迁移到新 operationId（按钮回调需要匹配）
            pendingAppAuthFlows.delete(activeOpId);
            dedupIndex.delete(activeFlow.dedupKey);
            const newDedup = makeDedupKey(chatId, messageId, missingScopes);
            activeFlow.dedupKey = newDedup;
            pendingAppAuthFlows.set(newOperationId, activeFlow);
            dedupIndex.set(newDedup, newOperationId);
            activeAppCardIndex.set(activeCardKey, newOperationId);
            return json({
                awaiting_app_authorization: true,
                message: "已向用户发送授权引导卡片，等待用户完成授权操作。" +
                    "请告知用户：按照卡片提示完成授权，完成后系统将自动重试之前的操作。" +
                    "请等待用户完成卡片操作，不要建议其他替代方案。",
                missing_scopes: missingScopes,
            });
        }
        catch (err) {
            trace.warn(`auto-auth: failed to update existing app-scope card, creating new one: ${err}`);
            // 降级：走下面的新建卡片路径
        }
    }
    const operationId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const card = buildAppScopeMissingCard({ missingScopes, appId, operationId });
    // 创建 CardKit 卡片实体
    const cardId = await createCardEntity({ cfg, card, accountId });
    if (!cardId) {
        trace.warn("auto-auth: createCardEntity failed for app-scope card, falling back");
        return json({
            error: "app_scope_missing",
            missing_scopes: missingScopes,
            message: `应用缺少以下权限：${missingScopes.join(", ")}，` +
                `请管理员在开放平台开通后重试。` +
                (appId ? `\n权限管理：https://open.feishu.cn/app/${appId}/permission` : ""),
        });
    }
    // 发送到当前会话
    const replyToMsgId = traceCtx.messageId?.startsWith("om_")
        ? traceCtx.messageId
        : undefined;
    await sendCardByCardId({ cfg, to: chatId, cardId, replyToMessageId: replyToMsgId, replyInThread: Boolean(traceCtx?.threadId), accountId });
    // 存入 pending map，15 分钟 TTL
    const flow = {
        appId: appId ?? account.appId,
        accountId,
        cardId,
        sequence: 0,
        requiredScopes: missingScopes,
        scopeNeedType,
        tokenType,
        cfg,
        traceCtx,
        dedupKey: dedup,
    };
    pendingAppAuthFlows.set(operationId, flow);
    dedupIndex.set(dedup, operationId);
    activeAppCardIndex.set(activeCardKey, operationId);
    setTimeout(() => {
        pendingAppAuthFlows.delete(operationId);
        dedupIndex.delete(dedup);
        // 只在当前 operationId 仍是活跃卡片时才清理
        if (activeAppCardIndex.get(activeCardKey) === operationId) {
            activeAppCardIndex.delete(activeCardKey);
        }
    }, PENDING_FLOW_TTL_MS);
    trace.info(`auto-auth: app-scope card sent, operationId=${operationId}, scopes=[${missingScopes.join(", ")}]`);
    return json({
        awaiting_app_authorization: true,
        message: "已向用户发送授权引导卡片，等待用户完成授权操作。" +
            "请告知用户：按照卡片提示完成授权，完成后系统将自动重试之前的操作。" +
            "请等待用户完成卡片操作，不要建议其他替代方案。",
        missing_scopes: missingScopes,
    });
}
// ---------------------------------------------------------------------------
// Card action handler (exported for monitor.ts)
// ---------------------------------------------------------------------------
/**
 * 处理 card.action.trigger 回调事件（由 monitor.ts 调用）。
 *
 * 当用户点击应用权限引导卡片的"我已完成，继续授权"按钮时：
 * 1. 更新卡片为"处理中"状态
 * 2. 清除应用 scope 缓存
 * 3. 发送中间合成消息告知 AI
 * 4. 发起 OAuth Device Flow
 *
 * 注意：函数体内的主要逻辑通过 setImmediate + fire-and-forget 异步执行，
 * 确保 Feishu card.action.trigger 回调在 3 秒内返回。
 */
export async function handleCardAction(data, cfg, accountId) {
    let action;
    let operationId;
    let senderOpenId;
    try {
        const event = data;
        action = event.action?.value?.action;
        operationId = event.action?.value?.operation_id;
        senderOpenId = event.operator?.open_id;
    }
    catch {
        return;
    }
    if (action !== "app_auth_done" || !operationId)
        return;
    const flow = pendingAppAuthFlows.get(operationId);
    if (!flow) {
        trace.warn(`auto-auth: card action ${operationId} not found (expired or already handled)`);
        return;
    }
    trace.info(`auto-auth: app_auth_done clicked by ${senderOpenId}, operationId=${operationId}`);
    // scope 校验在同步路径完成（3 秒内返回 toast response）
    invalidateAppScopeCache(flow.appId);
    const acct = getLarkAccount(flow.cfg, flow.accountId);
    if (!acct.configured) {
        trace.warn(`auto-auth: account ${flow.accountId} not configured, skipping OAuth`);
        return;
    }
    const sdk = LarkClient.fromAccount(acct).sdk;
    let grantedScopes = [];
    try {
        // 使用与原始 AppScopeMissingError 相同的 tokenType，保证校验逻辑完全一致
        grantedScopes = await getAppGrantedScopes(sdk, flow.appId, flow.tokenType);
    }
    catch (err) {
        trace.warn(`auto-auth: failed to re-check app scopes: ${err}, proceeding anyway`);
    }
    // 使用共享函数 isAppScopeSatisfied，与 tool-client invoke() 逻辑完全一致：
    //   - scopeNeedType "all" → 全部必须有
    //   - 默认"one" → 交集非空即可
    //   - grantedScopes 为空 → 视为满足（API 失败退回服务端判断）
    if (!isAppScopeSatisfied(grantedScopes, flow.requiredScopes, flow.scopeNeedType)) {
        trace.warn(`auto-auth: app scopes still missing after user confirmation: [${flow.requiredScopes.join(", ")}]`);
        return {
            toast: {
                type: "error",
                content: "权限尚未开通，请确认已申请并审核通过后再试",
            },
        };
    }
    trace.info(`auto-auth: app scopes verified, proceeding with OAuth`);
    // 校验通过才删除，防止用户在权限通过前多次点击无法重试
    pendingAppAuthFlows.delete(operationId);
    dedupIndex.delete(flow.dedupKey);
    const flowActiveCardKey = `${flow.traceCtx.chatId}:${flow.traceCtx.messageId}`;
    if (activeAppCardIndex.get(flowActiveCardKey) === operationId) {
        activeAppCardIndex.delete(flowActiveCardKey);
    }
    // 通过回调返回值直接更新卡片（方式一：3 秒内立即更新）。
    // 飞书文档要求 card 字段必须包含 type + data 包装：
    //   { card: { type: "raw", data: { schema: "2.0", ... } } }
    // 注意：不能在回调返回前调用 card.update API，飞书文档明确说明
    // "延时更新必须在响应回调请求之后执行，并行执行或提前执行会出现更新失败"。
    const successCard = buildAppAuthProgressCard();
    // 后台异步：回调响应之后再执行 API 更新 + OAuth
    setImmediate(async () => {
        try {
            // 通过 API 再次更新卡片（确保所有查看者都看到更新，不只是点击者）
            try {
                await updateCardKitCardForAuth({
                    cfg,
                    cardId: flow.cardId,
                    card: successCard,
                    sequence: flow.sequence + 1,
                    accountId,
                });
            }
            catch (err) {
                trace.warn(`auto-auth: failed to update app-scope card to progress via API: ${err}`);
            }
            // 发起 OAuth Device Flow（完成后 executeAuthorize 会自动发合成消息触发 AI 重试）
            if (!flow.traceCtx.senderOpenId) {
                trace.warn("auto-auth: no senderOpenId in traceCtx, skipping OAuth");
                return;
            }
            // 查找同 messageId 的 user auth batch，合并其 scope
            const userBatchKey = `user:${flow.accountId}:${flow.traceCtx.senderOpenId}:${flow.traceCtx.messageId}`;
            const userBatch = authBatches.get(userBatchKey);
            const mergedScopes = new Set(flow.requiredScopes);
            if (userBatch) {
                for (const s of userBatch.scopes)
                    mergedScopes.add(s);
                trace.info(`auto-auth: merged user batch scopes into app auth completion: [${[...mergedScopes].join(", ")}]`);
            }
            await executeAuthorize({
                account: acct,
                senderOpenId: flow.traceCtx.senderOpenId,
                scope: [...mergedScopes].join(" "),
                showBatchAuthHint: true,
                forceAuth: true, // 应用权限刚经历移除→补回，不信任本地 UAT 缓存
                cfg: flow.cfg,
                traceCtx: flow.traceCtx,
            });
        }
        catch (err) {
            trace.error(`auto-auth: handleCardAction background task failed: ${err}`);
        }
    });
    // 回调返回值：通过 card 字段立即更新卡片 + toast 提示
    return {
        toast: {
            type: "success",
            content: "权限确认成功",
        },
        card: {
            type: "raw",
            data: successCard,
        },
    };
}
// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
/**
 * 统一处理 `client.invoke()` 抛出的错误，支持自动发起 OAuth 授权。
 *
 * 替代 `handleInvokeError`，在工具层直接处理授权问题：
 * - 用户授权类错误 → 直接 executeAuthorize（发 Device Flow 卡片）
 * - 应用权限缺失 → 发送引导卡片，用户确认后自动接力 OAuth
 * - 其他错误 → 回退到 handleInvokeError 的标准处理
 *
 * @param err - invoke() 或其他逻辑抛出的错误
 * @param cfg - OpenClaw 配置对象（从工具注册函数的闭包中获取）
 */
export async function handleInvokeErrorWithAutoAuth(err, cfg) {
    const traceCtx = getTraceContext();
    if (traceCtx) {
        const senderOpenId = traceCtx.senderOpenId;
        // --- Path 1：用户授权类错误 → 防抖合并后发起 OAuth ---
        if (senderOpenId) {
            // 1a. 用户未授权或 token scope 不足（且 app scope 已验证）
            if (err instanceof UserAuthRequiredError && err.appScopeVerified) {
                const scopes = err.requiredScopes;
                try {
                    const acct = getLarkAccount(cfg, traceCtx.accountId);
                    if (acct.configured) {
                        const bufferKey = `user:${traceCtx.accountId}:${senderOpenId}:${traceCtx.messageId}`;
                        trace.info(`auto-auth: UserAuthRequiredError → enqueue, key=${bufferKey}, scopes=[${scopes.join(", ")}]`);
                        return await enqueueAuthRequest(bufferKey, scopes, { account: acct, cfg, traceCtx }, async (mergedScopes) => {
                            // 等待同一消息的 app auth 卡片先发出
                            const appKey = `app:${traceCtx.accountId}:${traceCtx.chatId}:${traceCtx.messageId}`;
                            const appEntry = authBatches.get(appKey);
                            if (appEntry?.resultPromise) {
                                await appEntry.resultPromise.catch(() => {
                                });
                            }
                            return executeAuthorize({
                                account: acct,
                                senderOpenId,
                                scope: mergedScopes.join(" "),
                                showBatchAuthHint: true,
                                cfg,
                                traceCtx,
                            });
                        }, AUTH_USER_DEBOUNCE_MS);
                    }
                }
                catch (autoAuthErr) {
                    trace.warn(`auto-auth: executeAuthorize failed: ${autoAuthErr}, falling back`);
                }
            }
            // 1b. 用户 token 存在但 scope 不足（服务端 99991679）
            if (err instanceof UserScopeInsufficientError) {
                const scopes = err.missingScopes;
                try {
                    const acct = getLarkAccount(cfg, traceCtx.accountId);
                    if (acct.configured) {
                        const bufferKey = `user:${traceCtx.accountId}:${senderOpenId}:${traceCtx.messageId}`;
                        trace.info(`auto-auth: UserScopeInsufficientError → enqueue, key=${bufferKey}, scopes=[${scopes.join(", ")}]`);
                        return await enqueueAuthRequest(bufferKey, scopes, { account: acct, cfg, traceCtx }, async (mergedScopes) => {
                            // 等待同一消息的 app auth 卡片先发出
                            const appKey = `app:${traceCtx.accountId}:${traceCtx.chatId}:${traceCtx.messageId}`;
                            const appEntry = authBatches.get(appKey);
                            if (appEntry?.resultPromise) {
                                await appEntry.resultPromise.catch(() => {
                                });
                            }
                            return executeAuthorize({
                                account: acct,
                                senderOpenId,
                                scope: mergedScopes.join(" "),
                                showBatchAuthHint: true,
                                cfg,
                                traceCtx,
                            });
                        }, AUTH_USER_DEBOUNCE_MS);
                    }
                }
                catch (autoAuthErr) {
                    trace.warn(`auto-auth: executeAuthorize failed: ${autoAuthErr}, falling back`);
                }
            }
        }
        else {
            trace.error(`senderOpenId not found ${err}`);
        }
        // --- Path 2：应用权限缺失 → 防抖合并后发送引导卡片 ---
        if (err instanceof AppScopeMissingError && traceCtx.chatId) {
            // 捕获当前错误的附加信息，供 flushFn 使用
            const appScopeErr = err;
            try {
                const acct = getLarkAccount(cfg, traceCtx.accountId);
                if (acct.configured) {
                    const bufferKey = `app:${traceCtx.accountId}:${traceCtx.chatId}:${traceCtx.messageId}`;
                    trace.info(`auto-auth: AppScopeMissingError → enqueue, key=${bufferKey}, ` +
                        `scopes=[${appScopeErr.missingScopes.join(", ")}]`);
                    return await enqueueAuthRequest(bufferKey, appScopeErr.missingScopes, { account: acct, cfg, traceCtx }, (mergedScopes) => sendAppScopeCard({
                        account: acct,
                        missingScopes: mergedScopes,
                        appId: appScopeErr.appId,
                        scopeNeedType: "all", // 合并后所有 scope 都需要
                        tokenType: appScopeErr.tokenType,
                        cfg,
                        traceCtx,
                    }));
                }
            }
            catch (cardErr) {
                trace.warn(`auto-auth: sendAppScopeCard failed: ${cardErr}, falling back`);
            }
        }
    }
    else {
        trace.error(`traceCtx not found ${err}`);
    }
    return json({
        error: formatLarkError(err),
    });
}
//# sourceMappingURL=auto-auth.js.map