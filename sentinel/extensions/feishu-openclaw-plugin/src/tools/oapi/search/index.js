/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
  * Search 工具集
  * 统一导出所有搜索相关工具的注册函数
 */
import { getEnabledLarkAccounts } from "../../../core/accounts.js";
import { resolveToolsConfig } from "../../../core/tools-config.js";
import { registerFeishuSearchDocWikiTool } from "./doc-search.js";
/**
 * 注册所有 Search 工具
 */
export function registerFeishuSearchTools(api) {
    if (!api.config) {
        api.logger.debug?.("feishu_search: No config available, skipping");
        return;
    }
    const accounts = getEnabledLarkAccounts(api.config);
    if (accounts.length === 0) {
        api.logger.debug?.("feishu_search: No Feishu accounts configured, skipping");
        return;
    }
    // 检查 search 工具是否启用（使用 doc 配置项，因为搜索是文档相关功能）
    const toolsCfg = resolveToolsConfig(accounts[0].config.tools);
    if (!toolsCfg.doc) {
        api.logger.debug?.("feishu_search: search tool disabled (controlled by doc config)");
        return;
    }
    // 注册所有工具
    registerFeishuSearchDocWikiTool(api);
    api.logger.info?.("feishu_search: Registered feishu_search_doc_wiki");
}
//# sourceMappingURL=index.js.map