/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
  * OAPI Tools Index
 *
  * This module registers all tools that directly use Feishu Open API (OAPI).
  * These tools are placed here to distinguish them from MCP-based tools.
 */
import { registerFeishuCalendarCalendarTool } from "./calendar/calendar.js";
import { registerFeishuCalendarEventTool } from "./calendar/event.js";
import { registerFeishuCalendarEventAttendeeTool } from "./calendar/event-attendee.js";
import { registerFeishuCalendarFreebusyTool } from "./calendar/freebusy.js";
import { registerFeishuTaskTaskTool } from "./task/task.js";
import { registerFeishuTaskTasklistTool } from "./task/tasklist.js";
import { registerFeishuTaskCommentTool } from "./task/comment.js";
import { registerFeishuTaskSubtaskTool } from "./task/subtask.js";
import { registerFeishuBitableAppTool } from "./bitable/app.js";
import { registerFeishuBitableAppTableTool } from "./bitable/app-table.js";
import { registerFeishuBitableAppTableRecordTool } from "./bitable/app-table-record.js";
import { registerFeishuBitableAppTableFieldTool } from "./bitable/app-table-field.js";
import { registerFeishuBitableAppTableViewTool } from "./bitable/app-table-view.js";
// import { registerFeishuMailTools } from "./mail/index.js";
import { registerFeishuSearchTools } from "./search/index.js";
import { registerFeishuDriveTools } from "./drive/index.js";
import { registerFeishuWikiTools } from "./wiki/index.js";
import { registerFeishuImTools as registerFeishuImBotTools } from "../tat/im/index.js";
import { registerFeishuSheetsTools } from "./sheets/index.js";
// import { registerFeishuOkrTools } from "./okr/index.js";
import { registerGetUserTool } from "./common/get-user.js";
import { registerSearchUserTool } from "./common/search-user.js";
import { registerFeishuChatTools } from "./chat/index.js";
import { registerFeishuImTools as registerFeishuImUserTools } from "./im/index.js";
export function registerOapiTools(api) {
    // Common tools
    registerGetUserTool(api);
    registerSearchUserTool(api);
    // Chat tools
    registerFeishuChatTools(api);
    // IM tools (user identity)
    registerFeishuImUserTools(api);
    // Calendar tools
    registerFeishuCalendarCalendarTool(api);
    registerFeishuCalendarEventTool(api);
    registerFeishuCalendarEventAttendeeTool(api);
    registerFeishuCalendarFreebusyTool(api);
    // Task tools
    registerFeishuTaskTaskTool(api);
    registerFeishuTaskTasklistTool(api);
    registerFeishuTaskCommentTool(api);
    registerFeishuTaskSubtaskTool(api);
    // Bitable tools
    registerFeishuBitableAppTool(api);
    registerFeishuBitableAppTableTool(api);
    registerFeishuBitableAppTableRecordTool(api);
    registerFeishuBitableAppTableFieldTool(api);
    registerFeishuBitableAppTableViewTool(api);
    // Search tools
    registerFeishuSearchTools(api);
    // Drive tools
    registerFeishuDriveTools(api);
    // Wiki tools
    registerFeishuWikiTools(api);
    // Mail tools
    // 暂不支持
    // registerFeishuMailTools(api);
    // Sheets tools
    registerFeishuSheetsTools(api);
    // OKR tools
    // 暂不支持
    // registerFeishuOkrTools(api);
    // IM tools (bot identity)
    registerFeishuImBotTools(api);
    api.logger.info?.("✅ Registered all OAPI tools (calendar, task, bitable, mail, search, drive, wiki, sheets, okr, im)");
}
//# sourceMappingURL=index.js.map