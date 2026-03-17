/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * ToolClient — 工具层统一客户端。
 *
 * 专为 `src/tools/` 下的工具设计，封装 account 解析、SDK 管理、
 * TAT/UAT 自动切换和 scope 预检。工具代码只需声明 API 名称和调用逻辑，
 * 身份选择/scope 校验/token 管理全部由 `invoke()` 内聚处理。
 *
 * 用法：
 * ```typescript
 * const client = createToolClient(config);
 *
 * // UAT 调用 — 通过 { as: "user" } 指定用户身份
 * const res = await client.invoke(
 *   "calendar.v4.calendarEvent.create",
 *   (sdk, opts) => sdk.calendar.calendarEvent.create(payload, opts),
 *   { as: "user" },
 * );
 *
 * // TAT 调用 — 默认走应用身份
 * const res = await client.invoke(
 *   "calendar.v4.calendar.list",
 *   (sdk) => sdk.calendar.calendar.list(payload),
 *   { as: "tenant" },
 * );
 * ```
 */
import * as Lark from "@larksuiteoapi/node-sdk";
import type { ClawdbotConfig } from "openclaw/plugin-sdk";
import type { ConfiguredLarkAccount } from "./types.js";
import { NeedAuthorizationError } from "./uat-client.js";
import { type ToolActionKey } from "./scope-manager.js";
export { NeedAuthorizationError };
/** invoke() 错误共享的 scope 信息。 */
export type ScopeErrorInfo = {
    apiName: string;
    scopes: string[];
    /** 应用 scope 是否已验证通过。false 表示 app scope 检查失败，scope 信息可能不准确。 */
    appScopeVerified?: boolean;
    /** 应用 ID，用于生成开放平台权限管理链接。 */
    appId?: string;
};
/**
 * 应用缺少 application:application:self_manage 权限，无法查询应用权限配置。
 *
 * 需要管理员在飞书开放平台开通 application:application:self_manage 权限。
 */
export declare class AppScopeCheckFailedError extends Error {
    /** 应用 ID，用于生成开放平台权限管理链接。 */
    readonly appId?: string;
    constructor(appId?: string);
}
/**
 * 应用未开通 OAPI 所需 scope。
 *
 * 需要管理员在飞书开放平台开通权限。
 */
export declare class AppScopeMissingError extends Error {
    readonly apiName: string;
    /** OAPI 需要但 APP 未开通的 scope 列表。 */
    readonly missingScopes: string[];
    /** 应用 ID，用于生成开放平台权限管理链接。 */
    readonly appId?: string;
    readonly scopeNeedType?: "one" | "all";
    /** 触发此错误时使用的 token 类型，用于保持 card action 二次校验一致。 */
    readonly tokenType?: "user" | "tenant";
    constructor(info: ScopeErrorInfo, scopeNeedType?: "one" | "all", tokenType?: "user" | "tenant");
}
/**
 * 用户未授权或 scope 不足，需要发起 OAuth 授权。
 *
 * `requiredScopes` 为 APP∩OAPI 的有效 scope，可直接传给
 * `feishu_oauth authorize --scope`。
 */
export declare class UserAuthRequiredError extends Error {
    readonly userOpenId: string;
    readonly apiName: string;
    /** APP∩OAPI 交集 scope，传给 OAuth authorize。 */
    readonly requiredScopes: string[];
    /** 应用 scope 是否已验证通过。false 时 requiredScopes 可能不准确。 */
    readonly appScopeVerified: boolean;
    /** 应用 ID，用于生成开放平台权限管理链接。 */
    readonly appId?: string;
    constructor(userOpenId: string, info: ScopeErrorInfo);
}
/**
 * 服务端报 99991679 — 用户 token 的 scope 不足。
 *
 * 需要增量授权：用缺失的 scope 发起新 Device Flow。
 */
export declare class UserScopeInsufficientError extends Error {
    readonly userOpenId: string;
    readonly apiName: string;
    /** 缺失的 scope 列表。 */
    readonly missingScopes: string[];
    constructor(userOpenId: string, info: ScopeErrorInfo);
}
/** OAuth 授权提示信息，与 handleInvokeError 返回的结构一致。 */
export interface AuthHint {
    error: string;
    api: string;
    required_scope: string;
    user_open_id: string;
    message: string;
    next_tool_call: {
        tool: "feishu_oauth";
        params: {
            action: "authorize";
            scope: string;
        };
    };
}
/** tryInvoke 返回值的判别联合体。 */
export type TryInvokeResult<T> = {
    ok: true;
    data: T;
} | {
    ok: false;
    error: string;
    authHint: AuthHint;
} | {
    ok: false;
    error: string;
    authHint?: undefined;
};
/** Per-request options returned by `Lark.withUserAccessToken()`. */
type LarkRequestOptions = ReturnType<typeof Lark.withUserAccessToken>;
/**
 * @deprecated 使用 `InvokeFn` 代替。
 * Callback that receives the SDK client and per-request UAT options.
 */
export type ApiFn<T> = (sdk: Lark.Client, opts: LarkRequestOptions) => Promise<T>;
/**
 * invoke() 的回调签名。
 *
 * - UAT 模式：`opts` 为 `Lark.withUserAccessToken(token)`，需传给 SDK 方法；`uat` 为 User Access Token 原始字符串
 * - TAT 模式：`opts` 为 `undefined`，SDK 默认走应用身份；`uat` 也为 `undefined`
 */
export type InvokeFn<T> = (sdk: Lark.Client, opts?: LarkRequestOptions, uat?: string) => Promise<T>;
/** invoke() 的选项。 */
export type InvokeOptions = {
    /** 强制 token 类型。省略时根据 API meta 自动选择（优先 user）。 */
    as?: "user" | "tenant";
    /** 覆盖 senderOpenId。 */
    userOpenId?: string;
};
/** invokeByPath() 的选项 — 在 InvokeOptions 基础上增加 HTTP 请求参数。 */
export type InvokeByPathOptions = InvokeOptions & {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    query?: Record<string, string>;
    /** 自定义请求 header，会与 Authorization / Content-Type 合并（自定义优先）。 */
    headers?: Record<string, string>;
};
export declare class ToolClient {
    /** 当前解析的账号信息（appId、appSecret 保证存在）。 */
    readonly account: ConfiguredLarkAccount;
    /** 当前请求的用户 open_id（来自 TraceContext，可能为 undefined）。 */
    readonly senderOpenId: string | undefined;
    /** Lark SDK 实例（TAT 身份），直接调用即可。 */
    readonly sdk: Lark.Client;
    constructor(params: {
        account: ConfiguredLarkAccount;
        senderOpenId: string | undefined;
        sdk: Lark.Client;
    });
    /**
     * 统一 API 调用入口。
     *
     * 自动处理：
     * - 根据 API meta 选择 UAT / TAT
     * - 严格模式：检查应用和用户是否拥有所有 API 要求的 scope
     * - 无 token 或 scope 不足时抛出结构化错误
     * - UAT 模式下复用 callWithUAT 的 refresh + retry
     *
     * @param apiName - meta.json 中的 toolName，如 `"calendar.v4.calendarEvent.create"`
     * @param fn - API 调用逻辑。UAT 时 opts 已注入 token，TAT 时 opts 为 undefined。
     * @param options - 可选配置：
     *   - `as`: 指定 UAT/TAT
     *   - `userOpenId`: 覆盖用户 ID
     *
     * @throws {@link AppScopeMissingError} 应用未开通 API 所需 scope
     * @throws {@link UserAuthRequiredError} 用户未授权或 scope 不足
     * @throws {@link UserScopeInsufficientError} 服务端报用户 scope 不足
     *
     * @example
     * // UAT 调用 — 通过 { as: "user" } 指定
     * const res = await client.invoke(
     *   "calendar.v4.calendarEvent.create",
     *   (sdk, opts) => sdk.calendar.calendarEvent.create(payload, opts),
     *   { as: "user" },
     * );
     *
     * @example
     * // TAT 调用
     * const res = await client.invoke(
     *   "calendar.v4.calendar.list",
     *   (sdk) => sdk.calendar.calendar.list(payload),
     *   { as: "tenant" },
     * );
     *
     */
    invoke<T>(toolAction: ToolActionKey, fn: InvokeFn<T>, options?: InvokeOptions): Promise<T>;
    /**
     * 内部 invoke 实现，只支持 ToolActionKey（严格类型检查）
     */
    private _invokeInternal;
    /**
     * invoke() 的非抛出包装，适用于"允许失败"的子操作。
     *
     * - 成功 → `{ ok: true, data }`
     * - 用户授权错误（可通过 OAuth 恢复）→ `{ ok: false, authHint }`
     * - 应用权限缺失 / appScopeVerified=false → **仍然 throw**（需管理员操作）
     * - 其他错误 → `{ ok: false, error }`
     */
    /**
     * 对 SDK 未覆盖的飞书 API 发起 raw HTTP 请求，同时复用 invoke() 的
     * auth/scope/refresh 全链路。
     *
     * @param apiName - 逻辑 API 名称（用于日志和错误信息），如 `"im.v1.chatP2p.batchQuery"`
     * @param path - API 路径（以 `/open-apis/` 开头），如 `"/open-apis/im/v1/chat_p2p/batch_query"`
     * @param options - HTTP 方法、body、query 及 InvokeOptions（as、userOpenId 等）
     *
     * @example
     * ```typescript
     * const res = await client.invokeByPath<{ data: { items: Array<{ chat_id: string }> } }>(
     *   "im.v1.chatP2p.batchQuery",
     *   "/open-apis/im/v1/chat_p2p/batch_query",
     *   {
     *     method: "POST",
     *     body: { chatter_ids: [openId] },
     *     as: "user",
     *   },
     * );
     * ```
     */
    invokeByPath<T = any>(toolAction: ToolActionKey, path: string, options?: InvokeByPathOptions): Promise<T>;
    private invokeAsTenant;
    private invokeAsUser;
    /**
     * 发起 raw HTTP 请求到飞书 API，自动处理域名解析、header 注入和错误检测。
     */
    private rawRequest;
    /**
     * 识别飞书服务端错误码并转换为结构化错误。
     *
     * - 99991672 → AppScopeMissingError（清缓存后抛出）
     * - 99991679 → UserScopeInsufficientError
     */
    private rethrowStructuredError;
    /**
     * 以用户身份执行 API 调用（UAT）。
     *
     * @deprecated 使用 {@link invoke} 代替，可获得 scope 预检和结构化错误。
     */
    asUser<T>(fn: ApiFn<T>): Promise<T>;
    asUser<T>(userOpenId: string, fn: ApiFn<T>): Promise<T>;
}
/**
 * 从配置创建 {@link ToolClient}。
 *
 * 自动从当前 {@link TraceContext} 解析 accountId 和 senderOpenId。
 * 如果 TraceContext 不可用（如非消息场景），回退到 `accountIndex`
 * 指定的账号。
 *
 * @param config - OpenClaw 配置对象
 * @param accountIndex - 回退账号索引（默认 0）
 */
export declare function createToolClient(config: ClawdbotConfig, accountIndex?: number): ToolClient;
//# sourceMappingURL=tool-client.d.ts.map