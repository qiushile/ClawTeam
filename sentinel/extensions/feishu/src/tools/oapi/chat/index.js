/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
  * Chat Tools Index
 *
  * 群组相关工具
 */
import { registerChatSearchTool } from "./chat.js";
import { registerChatMembersTool } from "./members.js";
export function registerFeishuChatTools(api) {
    registerChatSearchTool(api);
    registerChatMembersTool(api);
    api.logger.info?.("feishu_chat: Registered feishu_chat, feishu_chat_members");
}
//# sourceMappingURL=index.js.map