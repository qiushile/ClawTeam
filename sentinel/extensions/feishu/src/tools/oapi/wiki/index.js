/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
  * Wiki 工具集
  * 统一导出所有知识库相关工具的注册函数
 */
import { getEnabledLarkAccounts } from "../../../core/accounts.js";
import { resolveToolsConfig } from "../../../core/tools-config.js";
import { registerFeishuWikiSpaceTool } from "./space.js";
import { registerFeishuWikiSpaceNodeTool } from "./space-node.js";
/**
 * 注册所有 Wiki 工具
 */
export function registerFeishuWikiTools(api) {
    if (!api.config) {
        api.logger.debug?.("feishu_wiki: No config available, skipping");
        return;
    }
    const accounts = getEnabledLarkAccounts(api.config);
    if (accounts.length === 0) {
        api.logger.debug?.("feishu_wiki: No Feishu accounts configured, skipping");
        return;
    }
    // 检查 wiki 工具是否启用
    const toolsCfg = resolveToolsConfig(accounts[0].config.tools);
    if (!toolsCfg.wiki) {
        api.logger.debug?.("feishu_wiki: wiki tool disabled in config");
        return;
    }
    // 注册所有工具
    registerFeishuWikiSpaceTool(api);
    registerFeishuWikiSpaceNodeTool(api);
    api.logger.info?.("feishu_wiki: Registered feishu_wiki_space, feishu_wiki_space_node");
}
//# sourceMappingURL=index.js.map