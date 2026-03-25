# 插件 (Plugins) 分析报告

## 一、我的身份与运行环境

- **当前插件**: `feishu` - 飞书/Lark 企业消息通道
- **运行模式**: 飞书群聊 (channel=feishu)
- **核心职责**: 市场部品牌营销专家

---

## 二、当前已启用的插件分析

### 1. Feishu Plugin (@openclaw/feishu)

| 属性 | 详情 |
|-----|------|
| **ID** | feishu |
| **版本** | 2026.3.13 |
| **维护方** | @m1heng (社区维护) |
| **类型** | Channel + Skills Bundle |

#### 提供的 Skills (5个):
| Skill | 功能 | 我的使用频率 |
|-------|------|-------------|
| feishu-doc | 飞书文档读写、表格创建、图片上传 | ⭐⭐⭐⭐⭐ |
| feishu-wiki | 飞书知识库导航、页面管理 | ⭐⭐⭐⭐⭐ |
| feishu-drive | 飞书云盘文件管理 | ⭐⭐⭐⭐ |
| feishu-perm | 文档/文件权限管理 | ⭐⭐⭐ |
| feishu-bitable | 飞书多维表格操作 | ⭐⭐⭐⭐ |

#### 核心能力:
- ✅ 群聊消息收发 (@提及触发)
- ✅ 文档创建/读取/更新 (Markdown支持)
- ✅ 知识库页面导航
- ✅ 文件上传/下载/管理
- ✅ 表格创建与数据写入
- ✅ 消息反应 (表情)
- ✅ 卡片消息发送

#### 配置状态:
- 已配置并运行中
- 无需额外 API Key

---

## 三、其他可用插件评估

### A. 高价值/相关插件

| 插件          | 类型 | 功能 | 与我相关度 | 建议 |
|-------------|------|------|-----------|------|
| **memory-lancedb** | Memory | LanceDB 长期记忆存储，自动捕获/召回 | ⭐⭐⭐⭐⭐ | **强烈推荐** - 可记住市场偏好、品牌调性、历史决策 |
| **llm-task** | Tool | 通用LLM任务执行 | ⭐⭐⭐⭐ | 可用于复杂的营销文案生成、分析任务 |
| **acpx**    | Runtime | ACP运行时后端 | ⭐⭐⭐⭐ | 如需使用 MCP 服务或高级 agent 功能 |
| **diffs**   | Tool | Diff查看器/文件渲染 | ⭐⭐⭐ | 如需对比文档版本 |
| **lobster** | Workflow | 带审批的可恢复工作流 | ⭐⭐⭐ | 如需复杂审批流程 |

### B. 渠道类插件 (Channel Plugins)

| 插件 | 渠道 | 适用场景 | 与我相关度 |
|-----|------|---------|-----------|
| slack | Slack | 海外团队协作 | ⭐⭐⭐ |
| telegram | Telegram | 海外社群运营 | ⭐⭐ |
| discord | Discord | 海外社区/游戏 | ⭐⭐ |
| whatsapp | WhatsApp | 海外客户沟通 | ⭐⭐ |
| imessage | iMessage | 苹果生态 | ⭐ |
| bluebubbles | BlueBubbles | iMessage桥接 | ⭐ |
| signal | Signal | 隐私通讯 | ⭐ |
| matrix | Matrix | 去中心化通讯 | ⭐ |
| line | LINE | 日本/台湾/泰国市场 | ⭐⭐ |
| zalo | Zalo | 越南市场 | ⭐ |
| twitch | Twitch | 直播互动 | ⭐⭐⭐ |
| googlechat | Google Chat | Google Workspace | ⭐⭐ |
| mattermost | Mattermost | 企业自托管 | ⭐ |
| msteams | Microsoft Teams | 微软生态 | ⭐⭐ |
| nextcloud-talk | Nextcloud | 自托管通讯 | ⭐ |
| synology-chat | Synology | 群晖生态 | ⭐ |
| nostr | Nostr | 去中心化社交 | ⭐ |
| tlon | Tlon | Urbit生态 | ⭐ |
| irc | IRC | 传统聊天室 | ⭐ |

### C. 提供商插件 (Provider Plugins)

| 插件 | 提供商 | 用途 |
|-----|-------|------|
| ollama | Ollama | 本地模型运行 |
| vllm | vLLM | 高性能推理 |
| sglang | SGLang | 结构化生成语言 |
| qwen-portal-auth | 通义千问 | 阿里云模型 |
| minimax-portal-auth | MiniMax | 国内模型 |
| google-gemini-cli-auth | Gemini | Google模型 |
| copilot-proxy | Copilot | GitHub模型代理 |

### D. 专业功能插件

| 插件 | 功能 | 与我相关度 | 说明 |
|-----|------|-----------|------|
| voice-call | 语音通话 | ⭐⭐ | 支持Twilio/Telnyx/Plivo，可自动外呼 |
| talk-voice | 语音选择 | ⭐⭐ | 语音合成管理 |
| device-pair | 设备配对 | ⭐⭐⭐ | 手机节点连接 |
| phone-control | 手机控制 | ⭐⭐ | 远程控制手机功能 |
| thread-ownership | 线程所有权 | ⭐⭐ | Slack专用，防多代理冲突 |
| open-prose | OpenProse VM | ⭐⭐⭐ | 专业写作环境 |
| diagnostics-otel | 诊断遥测 | ⭐ | 运维向 |

---

## 四、插件配置建议

### 立即配置 (高优先级)

1. **memory-lancedb** - 长期记忆
   ```json
   {
     "embedding": {
       "apiKey": "${OPENAI_API_KEY}",
       "model": "text-embedding-3-small"
     },
     "autoCapture": true,
     "autoRecall": true
   }
   ```

### 按需配置 (中优先级)

3. **llm-task** - 如需要结构化任务
4. **slack** - 如团队使用 Slack
5. **voice-call** - 如需要语音外呼能力

### 暂不配置

- 其他渠道插件 (telegram/discord等) - 除非有海外市场
- 本地模型插件 (ollama/vllm) - 除非有私有化需求
- 开发向插件 (acpx/diffs) - 除非有定制需求

---

## 五、插件依赖关系

```
feishu (当前)
├── feishu-doc ← 依赖 drive (文件上传)
├── feishu-wiki ← 依赖 feishu-doc (内容读写)
├── feishu-drive
├── feishu-perm
└── feishu-bitable

memory-lancedb (推荐)
├── 依赖 OpenAI API Key
└── 提供 vector search 记忆

voice-call (可选)
├── 依赖 Twilio/Telnyx/Plivo 账户
└── 提供语音通话能力
```

---

## 六、总结

### 当前状态: ✅ 良好
- 核心飞书插件运行正常
- 具备完整的文档/知识库/云盘能力

### 推荐增强:
1. **memory-lancedb** - 添加长期记忆能力，提升个性化服务
2. **llm-task** - 复杂营销任务工作流
3. **slack** - 如需跨平台协作

### API Key 需求汇总:
| 服务 | 用途 | 优先级 |
|-----|------|-------|
| OPENAI_API_KEY | memory-lancedb 嵌入、图像生成、语音转录 | 高 |
| NOTION_API_KEY | Notion项目管理 | 中 |
| Twilio/Telnyx | voice-call 语音通话 | 低 |

---

*报告生成时间: 2026-03-23*
