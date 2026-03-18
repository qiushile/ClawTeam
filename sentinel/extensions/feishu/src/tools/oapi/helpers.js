/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
  * OAPI 工具专用辅助函数
 *
  * 提供 OAPI 工具特有的功能（如时间转换），并复用通用辅助函数。
 */
// ---------------------------------------------------------------------------
// 通用功能（从 tools/helpers.ts 导入）
// ---------------------------------------------------------------------------
export { formatToolResult, formatToolError, createToolLogger, createClientGetter, createToolContext, getFirstAccount, validateRequiredParams, validateEnum, } from "../helpers.js";
// ---------------------------------------------------------------------------
// ToolClient（工具层统一客户端）
// ---------------------------------------------------------------------------
export { ToolClient, createToolClient, NeedAuthorizationError, AppScopeMissingError, UserAuthRequiredError, UserScopeInsufficientError, } from "../../core/tool-client.js";
// ---------------------------------------------------------------------------
// OAPI 专用：客户端便捷创建
// ---------------------------------------------------------------------------
import { createClientGetter } from "../helpers.js";
/**
 * 从配置直接创建飞书客户端（OAPI 工具常用模式）
 *
 * 这是对 createClientGetter 的简化封装，直接返回客户端实例而非 getter 函数。
 *
 * @param config - OpenClaw 配置对象
 * @returns 飞书 SDK 客户端实例
 * @throws 如果没有启用的账号
 *
 * @example
 * ```typescript
 * export function registerMyOapiTool(api: OpenClawPluginApi) {
 *   api.registerTool({
 *     name: "my_oapi_tool",
 *     async execute(_toolCallId, params) {
 *       const client = createFeishuClientFromConfig(api.config);
 *       const res = await client.calendar.calendarEvent.list({ ... });
 *       return json(res.data);
 *     }
 *   });
 * }
 * ```
 */
export function createFeishuClientFromConfig(config) {
    const getClient = createClientGetter(config);
    return getClient();
}
// ---------------------------------------------------------------------------
// OAPI 专用：返回值格式化（简化版）
// ---------------------------------------------------------------------------
import { formatToolResult } from "../helpers.js";
/**
 * 格式化返回值为 JSON（OAPI 工具常用简化接口）
 *
 * 这是对 formatToolResult 的简化封装，函数名更短便于频繁使用。
 *
 * @param data - 要返回的数据
 * @returns 格式化的工具返回值
 *
 * @example
 * ```typescript
 * return json({ task: taskData });
 * return json({ error: "Invalid parameter" });
 * ```
 */
export function json(data) {
    return formatToolResult(data);
}
// ---------------------------------------------------------------------------
// OAPI 专用：时间转换工具
// ---------------------------------------------------------------------------
/**
 * 解析时间字符串为 Unix 时间戳（秒）
 *
 * 支持多种格式：
 * 1. ISO 8601 / RFC 3339（带时区）："2024-01-01T00:00:00+08:00"
 * 2. 不带时区的格式（默认为北京时间 UTC+8）：
 *    - "2026-02-25 14:30"
 *    - "2026-02-25 14:30:00"
 *    - "2026-02-25T14:30:00"
 *
 * @param input - 时间字符串
 * @returns Unix 时间戳字符串（秒），解析失败返回 null
 *
 * @example
 * ```typescript
 * parseTimeToTimestamp("2026-02-25T14:30:00+08:00")  // => "1740459000"
 * parseTimeToTimestamp("2026-02-25 14:30")           // => "1740459000" (默认北京时间)
 * parseTimeToTimestamp("2026-02-25T14:30:00")        // => "1740459000" (默认北京时间)
 * parseTimeToTimestamp("invalid")                    // => null
 * ```
 */
export function parseTimeToTimestamp(input) {
    try {
        const trimmed = input.trim();
        // 检查是否包含时区信息（Z 或 +/- 偏移）
        const hasTimezone = /[Zz]$|[+-]\d{2}:\d{2}$/.test(trimmed);
        if (hasTimezone) {
            // 有时区信息，直接解析
            const date = new Date(trimmed);
            if (isNaN(date.getTime()))
                return null;
            return Math.floor(date.getTime() / 1000).toString();
        }
        // 没有时区信息，当作北京时间处理
        // 支持格式：YYYY-MM-DD HH:mm 或 YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DDTHH:mm:ss
        const normalized = trimmed.replace("T", " ");
        const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/);
        if (!match) {
            // 尝试直接解析（可能是其他 ISO 8601 格式）
            const date = new Date(trimmed);
            if (isNaN(date.getTime()))
                return null;
            return Math.floor(date.getTime() / 1000).toString();
        }
        const [, year, month, day, hour, minute, second] = match;
        // 当作北京时间（UTC+8），转换为 UTC
        const utcDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour) - 8, // 北京时间减去 8 小时得到 UTC
        parseInt(minute), parseInt(second ?? "0")));
        return Math.floor(utcDate.getTime() / 1000).toString();
    }
    catch {
        return null;
    }
}
/**
 * 解析时间字符串为 Unix 时间戳（毫秒）
 *
 * 支持多种格式：
 * 1. ISO 8601 / RFC 3339（带时区）："2024-01-01T00:00:00+08:00"
 * 2. 不带时区的格式（默认为北京时间 UTC+8）：
 *    - "2026-02-25 14:30"
 *    - "2026-02-25 14:30:00"
 *    - "2026-02-25T14:30:00"
 *
 * @param input - 时间字符串
 * @returns Unix 时间戳字符串（毫秒），解析失败返回 null
 *
 * @example
 * ```typescript
 * parseTimeToTimestampMs("2026-02-25T14:30:00+08:00")  // => "1740459000000"
 * parseTimeToTimestampMs("2026-02-25 14:30")           // => "1740459000000" (默认北京时间)
 * parseTimeToTimestampMs("2026-02-25T14:30:00")        // => "1740459000000" (默认北京时间)
 * parseTimeToTimestampMs("invalid")                    // => null
 * ```
 */
export function parseTimeToTimestampMs(input) {
    try {
        const trimmed = input.trim();
        // 检查是否包含时区信息（Z 或 +/- 偏移）
        const hasTimezone = /[Zz]$|[+-]\d{2}:\d{2}$/.test(trimmed);
        if (hasTimezone) {
            // 有时区信息，直接解析
            const date = new Date(trimmed);
            if (isNaN(date.getTime()))
                return null;
            return date.getTime().toString();
        }
        // 没有时区信息，当作北京时间处理
        // 支持格式：YYYY-MM-DD HH:mm 或 YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DDTHH:mm:ss
        const normalized = trimmed.replace("T", " ");
        const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/);
        if (!match) {
            // 尝试直接解析（可能是其他 ISO 8601 格式）
            const date = new Date(trimmed);
            if (isNaN(date.getTime()))
                return null;
            return date.getTime().toString();
        }
        const [, year, month, day, hour, minute, second] = match;
        // 当作北京时间（UTC+8），转换为 UTC
        const utcDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour) - 8, // 北京时间减去 8 小时得到 UTC
        parseInt(minute), parseInt(second ?? "0")));
        return utcDate.getTime().toString();
    }
    catch {
        return null;
    }
}
/**
 * 解析时间字符串为 RFC 3339 格式（用于 freebusy API）
 *
 * 支持多种格式：
 * 1. ISO 8601 / RFC 3339（带时区）："2024-01-01T00:00:00+08:00" - 直接返回
 * 2. 不带时区的格式（默认为北京时间 UTC+8）：
 *    - "2026-02-25 14:30" - 转换为 "2026-02-25T14:30:00+08:00"
 *    - "2026-02-25 14:30:00" - 转换为 "2026-02-25T14:30:00+08:00"
 *    - "2026-02-25T14:30:00" - 转换为 "2026-02-25T14:30:00+08:00"
 *
 * @param input - 时间字符串
 * @returns RFC 3339 格式的时间字符串，解析失败返回 null
 *
 * @example
 * ```typescript
 * parseTimeToRFC3339("2026-02-25T14:30:00+08:00")  // => "2026-02-25T14:30:00+08:00"
 * parseTimeToRFC3339("2026-02-25 14:30")           // => "2026-02-25T14:30:00+08:00"
 * parseTimeToRFC3339("2026-02-25T14:30:00")        // => "2026-02-25T14:30:00+08:00"
 * ```
 */
export function parseTimeToRFC3339(input) {
    try {
        const trimmed = input.trim();
        // 检查是否包含时区信息（Z 或 +/- 偏移）
        const hasTimezone = /[Zz]$|[+-]\d{2}:\d{2}$/.test(trimmed);
        if (hasTimezone) {
            // 有时区信息，验证后直接返回
            const date = new Date(trimmed);
            if (isNaN(date.getTime()))
                return null;
            return trimmed;
        }
        // 没有时区信息，当作北京时间处理，转换为 RFC 3339 格式
        // 支持格式：YYYY-MM-DD HH:mm 或 YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DDTHH:mm:ss
        const normalized = trimmed.replace("T", " ");
        const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/);
        if (!match) {
            // 尝试直接解析（可能是其他 ISO 8601 格式）
            const date = new Date(trimmed);
            if (isNaN(date.getTime()))
                return null;
            // 如果能解析但没有时区，添加 +08:00
            return trimmed.includes("T") ? `${trimmed}+08:00` : trimmed;
        }
        const [, year, month, day, hour, minute, second] = match;
        const sec = second ?? "00";
        // 直接构造 RFC 3339 格式（北京时间 UTC+8）
        return `${year}-${month}-${day}T${hour}:${minute}:${sec}+08:00`;
    }
    catch {
        return null;
    }
}
/**
 * 将时间戳（秒）转换为北京时间字符串
 *
 * @param timestamp - Unix 时间戳（秒），可以是字符串或数字
 * @returns 北京时间字符串，格式：'YYYY-MM-DD HH:mm:ss'
 *
 * @example
 * ```typescript
 * formatTimestampToBeijingTime(1740459000)     // => "2026-02-25 14:30:00"
 * formatTimestampToBeijingTime("1740459000")   // => "2026-02-25 14:30:00"
 * ```
 */
export function formatTimestampToBeijingTime(timestamp) {
    const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    const date = new Date(ts * 1000); // 秒转毫秒
    // UTC 时间加上 8 小时得到北京时间
    const beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    const year = beijingTime.getUTCFullYear();
    const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(beijingTime.getUTCDate()).padStart(2, '0');
    const hour = String(beijingTime.getUTCHours()).padStart(2, '0');
    const minute = String(beijingTime.getUTCMinutes()).padStart(2, '0');
    const second = String(beijingTime.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
/**
 * 将时间戳（毫秒）转换为北京时间字符串
 *
 * @param timestamp - Unix 时间戳（毫秒），可以是字符串或数字
 * @returns 北京时间字符串，格式：'YYYY-MM-DD HH:mm:ss'
 *
 * @example
 * ```typescript
 * formatTimestampMsToBeijingTime(1740459000000)   // => "2026-02-25 14:30:00"
 * formatTimestampMsToBeijingTime("1740459000000") // => "2026-02-25 14:30:00"
 * ```
 */
export function formatTimestampMsToBeijingTime(timestamp) {
    const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    const date = new Date(ts); // 毫秒直接使用
    // UTC 时间加上 8 小时得到北京时间
    const beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    const year = beijingTime.getUTCFullYear();
    const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(beijingTime.getUTCDate()).padStart(2, '0');
    const hour = String(beijingTime.getUTCHours()).padStart(2, '0');
    const minute = String(beijingTime.getUTCMinutes()).padStart(2, '0');
    const second = String(beijingTime.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
/**
 * 转换时间范围对象（用于 search 等 API）
 *
 * 将包含 ISO 8601 格式时间字符串的时间范围转换为时间戳。
 *
 * @param timeRange - 时间范围对象，包含可选的 start 和 end 字段
 * @param unit - 时间戳单位，'s' 为秒，'ms' 为毫秒，默认为 's'
 * @returns 转换后的时间范围对象，包含数字类型的时间戳
 * @throws 如果时间格式错误
 *
 * @example
 * ```typescript
 * convertTimeRange({ start: "2026-02-25T14:00:00+08:00", end: "2026-02-25T18:00:00+08:00" })
 * // => { start: 1740459000, end: 1740473400 }
 *
 * convertTimeRange({ start: "2026-02-25T14:00:00+08:00" }, 'ms')
 * // => { start: 1740459000000 }
 * ```
 */
export function convertTimeRange(timeRange, unit = 's') {
    if (!timeRange)
        return undefined;
    const result = {};
    const parseFn = unit === 'ms' ? parseTimeToTimestampMs : parseTimeToTimestamp;
    if (timeRange.start) {
        const ts = parseFn(timeRange.start);
        if (!ts) {
            throw new Error(`时间格式错误！start 必须使用 ISO 8601 / RFC 3339 格式（包含时区），例如 "2024-01-01T00:00:00+08:00"，收到: ${timeRange.start}`);
        }
        result.start = parseInt(ts, 10);
    }
    if (timeRange.end) {
        const ts = parseFn(timeRange.end);
        if (!ts) {
            throw new Error(`时间格式错误！end 必须使用 ISO 8601 / RFC 3339 格式（包含时区），例如 "2024-01-01T00:00:00+08:00"，收到: ${timeRange.end}`);
        }
        result.end = parseInt(ts, 10);
    }
    return Object.keys(result).length > 0 ? result : undefined;
}
// ---------------------------------------------------------------------------
// OAPI 专用：飞书 API 错误处理
// ---------------------------------------------------------------------------
/**
 * Re-export 飞书 API 错误处理函数
 *
 * 这些函数专门用于处理飞书 Open API 的响应和错误。
 */
export { assertLarkOk, formatLarkError } from "../../core/api-error.js";
// ---------------------------------------------------------------------------
// OAPI 专用：invoke() 统一错误处理
// ---------------------------------------------------------------------------
import { AppScopeMissingError, UserAuthRequiredError, UserScopeInsufficientError, } from "../../core/tool-client.js";
/**
 * 统一处理 `client.invoke()` 抛出的错误，返回工具结果。
 *
 * 替换 5 个工具文件中重复的 catch 块，将结构化错误转换为
 * AI 可理解的 JSON 响应。
 *
 * @param err - invoke() 或其他逻辑抛出的错误
 * @returns 格式化的工具返回值
 *
 * @example
 * ```typescript
 * try {
 *   const res = await client.invoke("feishu_calendar_event.create", ...);
 *   return json({ event: res.data });
 * } catch (err) {
 *   return handleInvokeError(err);
 * }
 * ```
 */
// export function handleInvokeError(err: unknown) {
//   // 优先判断：应用缺少 application:application:self_manage 权限
//   if (err instanceof AppScopeCheckFailedError) {
//     const link = err.appId
//       ? `https://open.feishu.cn/app/${err.appId}/auth?q=application:application:self_manage&op_from=feishu-openclaw&token_type=tenant`
//       : "";
//     return json({
//       error: "app_scope_check_failed",
//       message:
//         `应用缺少核心权限 application:application:self_manage，无法正常检查权限配置。` +
//         `请联系应用管理员在飞书开放平台「权限管理」中开通此权限。` +
//         (link ? `\n权限管理链接：${link}` : ""),
//     });
//   }
//
//   if (err instanceof AppScopeMissingError) {
//     const link = err.appId
//       ? `https://open.feishu.cn/app/${err.appId}/auth?q=${encodeURIComponent(err.missingScopes.join(","))}&op_from=feishu-openclaw&token_type=user`
//       : "";
//     return json({
//       error: "app_scope_missing",
//       api: err.apiName,
//       missing_scopes: err.missingScopes,
//       message:
//         `应用缺少权限：${err.missingScopes.join(", ")}。` +
//         `请联系应用管理员在飞书开放平台「权限管理」中开通这些权限。` +
//         (link ? `\n权限管理链接：${link}` : ""),
//     });
//   }
//
//   if (err instanceof UserAuthRequiredError) {
//     // 当 app scope 检查失败时，scope 信息不可靠
//     if (!err.appScopeVerified) {
//       const link = err.appId
//         ? `https://open.feishu.cn/app/${err.appId}/auth?q=application:application:self_manage&op_from=feishu-openclaw&token_type=tenant`
//         : "";
//       return json({
//         error: "app_scope_check_failed",
//         api: err.apiName,
//         message:
//           `无法完成用户授权：应用可能缺少 application:application:self_manage 权限，` +
//           `无法正确检查权限配置。请联系应用管理员处理。` +
//           (link ? `\n权限管理链接：${link}` : ""),
//       });
//     }
//
//     return json({
//       error: "need_user_authorization",
//       api: err.apiName,
//       required_scope: err.requiredScopes.join(" "),
//       user_open_id: err.userOpenId,
//       message: "操作需要用户授权，自动授权流程未能启动，请稍后重试。",
//     });
//   }
//
//   if (err instanceof UserScopeInsufficientError) {
//     return json({
//       error: "user_scope_insufficient",
//       api: err.apiName,
//       missing_scopes: err.missingScopes,
//       user_open_id: err.userOpenId,
//       message: `用户已授权但缺少权限 [${err.missingScopes.join(" ")}]，自动授权流程未能启动，请稍后重试。`,
//     });
//   }
//
//   // 兼容旧的 NeedAuthorizationError
//   if (err instanceof NeedAuthorizationError) {
//     return json({
//       error: "need_user_authorization",
//       user_open_id: err.userOpenId,
//       message: "操作需要用户授权，自动授权流程未能启动，请稍后重试。",
//     });
//   }
//
//   // 兜底：飞书 API 错误 / 其他异常
//   return json({
//     error: formatLarkError(err),
//   });
// }
/**
 * 判断错误是否为 invoke() 层级的结构化错误（授权/权限相关）。
 *
 * 适用于中间 catch 块需要让授权错误继续冒泡到外层
 * `handleInvokeError` 的场景（如 `resolveCalendarId`）。
 *
 * 对于"允许失败"的子操作，优先使用 `client.tryInvoke()` 代替手动
 * `isInvokeError` + throw 模式。
 */
export function isInvokeError(err) {
    return (err instanceof UserAuthRequiredError ||
        err instanceof AppScopeMissingError ||
        err instanceof UserScopeInsufficientError);
}
// ---------------------------------------------------------------------------
// 自动授权：handleInvokeErrorWithAutoAuth
// ---------------------------------------------------------------------------
export { handleInvokeErrorWithAutoAuth } from "../auto-auth.js";
//# sourceMappingURL=helpers.js.map