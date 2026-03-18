/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Sheets 工具集
 * 注册飞书电子表格工具
 */
import { getEnabledLarkAccounts } from "../../../core/accounts.js";
import { resolveToolsConfig } from "../../../core/tools-config.js";
import { registerFeishuSheetTool } from "./sheet.js";
/**
 * 注册 Sheets 工具
 */
export function registerFeishuSheetsTools(api) {
    if (!api.config) {
        api.logger.debug?.("feishu_sheets: No config available, skipping");
        return;
    }
    const accounts = getEnabledLarkAccounts(api.config);
    if (accounts.length === 0) {
        api.logger.debug?.("feishu_sheets: No Feishu accounts configured, skipping");
        return;
    }
    const toolsCfg = resolveToolsConfig(accounts[0].config.tools);
    if (!toolsCfg.sheets) {
        api.logger.debug?.("feishu_sheets: sheets tool disabled in config");
        return;
    }
    registerFeishuSheetTool(api);
    api.logger.info?.("feishu_sheets: Registered feishu_sheet tool");
}
//# sourceMappingURL=index.js.map