# 战略咨询专家 Skills 评估报告

**生成时间**: 2026-03-23 10:21  
**评估角色**: 战略咨询专家 (Strategic Consultant)  
**评估范围**: OpenClaw 平台所有可用 Skills

---

## 一、推荐 Skills 清单（优先级排序）

### 🔥 高度推荐（核心必备）

#### 1. **summarize** ⭐⭐⭐⭐⭐
- **功能**: URL、文件、YouTube视频内容总结与转录
- **适用场景**: 快速分析行业报告、竞品资料、会议录像
- **价值**: 大幅提升信息处理效率，咨询项目前期调研利器
- **依赖**: summarize CLI (可通过brew安装)
- **示例**: `summarize "https://competitor-report.com" --model google/gemini-3-flash-preview`

#### 2. **notion** ⭐⭐⭐⭐⭐
- **功能**: Notion API 完整集成，创建/查询/更新页面和数据库
- **适用场景**: 项目知识库管理、咨询交付物沉淀、团队协作
- **价值**: 咨询项目知识资产化的核心工具
- **依赖**: NOTION_API_KEY
- **示例**: 查询数据库、创建项目页面、管理交付清单

#### 3. **obsidian** ⭐⭐⭐⭐⭐
- **功能**: Obsidian vault 管理，支持搜索、创建、移动笔记
- **适用场景**: 个人知识管理、方法论沉淀、案例库构建
- **价值**: 双向链接支持知识图谱构建，战略思维可视化
- **依赖**: obsidian-cli (可通过brew安装)
- **特点**: 纯Markdown，支持 [[wikilinks]]

#### 4. **trello** ⭐⭐⭐⭐
- **功能**: Trello 项目管理完整集成
- **适用场景**: 咨询项目进度跟踪、任务分配、里程碑管理
- **价值**: 可视化项目管理，客户沟通透明化
- **依赖**: TRELLO_API_KEY, TRELLO_TOKEN
- **示例**: 创建任务卡片、移动列表、添加评论

#### 5. **github** ⭐⭐⭐⭐
- **功能**: GitHub CLI 完整集成，支持 PR、Issue、CI 管理
- **适用场景**: 技术咨询项目代码审查、DevOps咨询、敏捷流程优化
- **价值**: 技术项目治理的核心工具
- **依赖**: gh CLI
- **示例**: `gh pr checks 55 --repo owner/repo`

---

### 💼 业务支撑类

#### 6. **gog** ⭐⭐⭐⭐
- **功能**: Google Workspace 完整集成（Gmail/Calendar/Drive/Contacts/Sheets/Docs）
- **适用场景**: 邮件管理、日程协调、文档协作、数据分析
- **价值**: 企业办公自动化的核心工具
- **依赖**: OAuth认证、gog CLI
- **特色**: 支持HTML邮件、日历颜色标记、Sheets批量操作

#### 7. **himalaya** ⭐⭐⭐
- **功能**: 命令行邮件客户端（IMAP/SMTP）
- **适用场景**: 邮件批处理、自动归档、搜索过滤
- **价值**: 轻量级邮件管理，适合自动化流程
- **依赖**: himalaya CLI、IMAP/SMTP配置
- **特点**: 支持多账户、MML邮件格式

#### 8. **blogwatcher** ⭐⭐⭐
- **功能**: 博客和RSS/Atom监控
- **适用场景**: 行业趋势跟踪、竞争对手动态监控、思想领导力内容追踪
- **价值**: 自动化信息收集，保持行业敏感度
- **依赖**: blogwatcher CLI
- **示例**: `blogwatcher scan` 扫描更新

---

### 🛠 技术增强类

#### 9. **coding-agent** ⭐⭐⭐⭐
- **功能**: 委托 Codex/Claude Code 进行编程任务
- **适用场景**: 技术咨询代码审查、原型开发、自动化脚本编写
- **价值**: 技术方案的快速验证与实现
- **依赖**: codex/claude/opencode CLI
- **注意**: 需要 git 仓库环境，支持后台执行

#### 10. **oracle** ⭐⭐⭐⭐
- **功能**: 长期深度分析引擎（GPT-5.2 Pro 浏览器模式）
- **适用场景**: 复杂问题深度分析、架构设计评审、技术债务评估
- **价值**: 处理需要长时间思考的复杂咨询问题
- **依赖**: oracle CLI
- **特色**: 支持会话恢复，适合10分钟-1小时的深度分析

#### 11. **clawhub** ⭐⭐⭐
- **功能**: OpenClaw Skills 市场客户端
- **适用场景**: 发现新技能、更新已安装技能、发布自定义技能
- **价值**: 持续扩展能力边界
- **依赖**: clawhub CLI (npm安装)
- **示例**: `clawhub search "data analysis"`

---

### 📊 数据与可视化类

#### 12. **canvas** ⭐⭐⭐
- **功能**: HTML内容展示到连接的节点设备
- **适用场景**: 咨询报告可视化展示、交互式演示文稿
- **价值**: 提升客户沟通体验
- **依赖**: OpenClaw节点应用（Mac/iOS/Android）
- **特点**: 支持LiveReload开发模式

#### 13. **openai-image-gen** ⭐⭐⭐
- **功能**: 批量生成图像（OpenAI Images API）
- **适用场景**: 报告封面、概念图、流程图生成
- **价值**: 提升交付物专业度
- **依赖**: OPENAI_API_KEY
- **特色**: 支持随机提示词采样

#### 14. **openai-whisper-api** ⭐⭐⭐
- **功能**: 音频转录（OpenAI Whisper API）
- **适用场景**: 会议录音转文字、访谈内容整理
- **价值**: 自动化定性研究数据处理
- **依赖**: OPENAI_API_KEY
- **特点**: 支持多种音频格式

---

### 🌐 平台集成类（已安装）

#### 15-18. **feishu-doc/drive/wiki/perm** ⭐⭐⭐⭐⭐
- **功能**: 飞书文档、云盘、知识库、权限管理完整集成
- **适用场景**: 团队协作、文档共享、知识沉淀
- **价值**: 已安装，核心协作工具
- **状态**: ✅ 已安装并启用
- **示例**: 创建飞书文档、上传文件、设置权限

---

### ⚙️ 系统与运维类

#### 19. **healthcheck** ⭐⭐⭐
- **功能**: 主机安全加固和风险容忍配置
- **适用场景**: IT咨询项目、安全审计、合规检查
- **价值**: 提供标准化的安全评估框架
- **依赖**: 无需额外依赖

#### 20. **skill-creator** ⭐⭐⭐
- **功能**: 创建、编辑、改进 AgentSkills
- **适用场景**: 定制化咨询工具开发、方法论工具化
- **价值**: 将咨询方法论转化为可复用的技能
- **状态**: ✅ 可用
- **特色**: 支持SKILL.md审计和重构

---

## 二、插件配置分析

### ✅ 已加载插件（4个）

#### 1. **feishu** 
- **状态**: ✅ 已加载
- **版本**: 2026.3.13
- **功能**: 飞书/ Lark 通道插件
- **注册工具**:
  - feishu_doc: 文档读写
  - feishu_app_scopes: 应用权限
  - feishu_chat: 聊天工具
  - feishu_wiki: 知识库工具
  - feishu_drive: 云盘工具
  - feishu_bitable: 多维表格工具
- **价值**: 核心协作平台，支持团队沟通和知识管理

#### 2. **memory-lancedb**
- **状态**: ✅ 已加载
- **版本**: 2026.3.13
- **功能**: 文件支持的内存搜索工具和CLI
- **配置**:
  - 向量搜索: ✅ 就绪
  - 全文搜索: ✅ 就绪
  - 缓存: ✅ 已开启
- **注意**: ⚠️ 存在文件权限警告（uid=1001 vs expected uid=1000）
- **价值**: 长期记忆支持，持续学习

#### 3. **postgres-tool**
- **状态**: ✅ 已加载
- **版本**: 1.0.0
- **功能**: 共享PostgreSQL访问工具
- **连接**: expert_user
- **工具集**:
  - database_query: 原始SQL查询
  - send_task: 任务分发
  - get_my_tasks: 任务查询
  - update_task_status: 状态更新
  - send_message: 消息发送
  - check_inbox: 消息接收
  - heartbeat: 心跳上报
  - lookup_department: 部门查询
- **价值**: 跨Agent协作的核心基础设施
- **监听通道**: task_channel, message_channel

#### 4. **task-notifier**
- **状态**: ✅ 已加载
- **版本**: 1.0.0
- **功能**: 任务通知监听器和飞书消息发送器
- **价值**: 实时任务状态推送，异步协作支持

---

### 📦 可用但未加载插件（39个）

#### 通信渠道类
- discord, telegram, signal, slack, whatsapp, imessage, line, matrix, mattermost, msteams, zalo, googlechat, nextcloud-talk, irc, tlon, twitch, bluebubbles

#### 模型提供商类
- ollama-provider, vllm-provider, sglang-provider, copilot-proxy, qwen-portal-auth, minimax-portal-auth, google-gemini-cli-auth

#### 运行时增强类
- acpx (ACP runtime), diffs (diff查看器), device-pair (设备配对), diagnostics-otel (OpenTelemetry导出), llm-task (LLM工具), lobster (工作流工具)

#### 语音与多媒体类
- voice-call, talk-voice, phone-control

---

## 三、配置建议

### 🎯 优先安装（前5个）

1. **summarize** - 咨询工作效率倍增器
   ```bash
   brew install steipete/tap/summarize
   ```

2. **notion** - 知识管理核心
   - 获取 API Key: https://notion.so/my-integrations
   - 配置: `export NOTION_API_KEY="ntn_xxx"`

3. **obsidian** - 个人知识库
   ```bash
   brew install yakitrak/yakitrak/obsidian-cli
   ```

4. **trello** - 项目管理
   - 获取 Key: https://trello.com/app-key
   - 配置: `export TRELLO_API_KEY="xxx" TRELLO_TOKEN="xxx"`

5. **github** - 技术项目协作
   ```bash
   # macOS
   brew install gh
   # Linux
   apt install gh
   # 认证
   gh auth login
   ```

---

### 🔧 环境变量配置建议

```bash
# Notion
export NOTION_API_KEY="ntn_xxx"

# Trello
export TRELLO_API_KEY="xxx"
export TRELLO_TOKEN="xxx"

# OpenAI (用于 summarize, openai-image-gen, openai-whisper-api)
export OPENAI_API_KEY="sk-xxx"

# Google Workspace (用于 gog)
export GOG_ACCOUNT="you@example.com"

# ElevenLabs (用于 sag TTS)
export ELEVENLABS_API_KEY="xxx"
export ELEVENLABS_VOICE_ID="default_voice_id"
```

---

## 四、能力缺口与补充建议

### 当前缺失但重要的能力

1. **数据分析增强**
   - 建议: 安装 Python/R 数据分析工具链
   - 应用: 定量研究、财务建模、市场分析

2. **图表可视化**
   - 建议: 集成 Mermaid 或 D3.js
   - 应用: 流程图、组织架构图、数据可视化

3. **OCR与PDF处理**
   - 建议: 安装 nano-pdf skill
   - 应用: 扫描件处理、报告提取

4. **多语言支持**
   - 建议: 配置翻译API
   - 应用: 国际化咨询项目

---

## 五、实施路线图

### 阶段一：基础设施（第1周）
- [ ] 安装 summarize, github CLI
- [ ] 配置 Notion API
- [ ] 设置 Obsidian vault

### 阶段二：工作流优化（第2-3周）
- [ ] 配置 Trello 看板模板
- [ ] 建立 Notion-Obsidian 知识同步流程
- [ ] 实践 summarize 分析工作流

### 阶段三：高级应用（第4周）
- [ ] 探索 oracle 深度分析
- [ ] 尝试 coding-agent 自动化
- [ ] 构建自定义 skill (skill-creator)

---

## 六、安全与权限注意事项

### ⚠️ 关键警告


2. **配置文件权限**
   - openclaw.json 权限过于开放 (644)
   - 建议修复: `chmod 600 /home/node/.openclaw/openclaw.json`

3. **群组策略安全**
   - 当前 groupPolicy="open" 存在注入风险
   - 建议修改为 "allowlist" 并严格控制权限

4. **未追踪插件**
   - postgres-tool 和 task-notifier 缺少来源验证
   - 建议在 plugins.allow 中明确信任

---

## 附录：Skills 完整清单

系统中共发现 **53个 Skills**，涵盖：
- 知识管理: notion, obsidian, bear-notes, apple-notes
- 项目管理: trello, things-mac
- 开发工具: github, coding-agent, gh-issues
- 通信工具: himalaya, discord, slack, imsg
- 内容处理: summarize, nano-pdf, openai-whisper
- 多媒体: openai-image-gen, spotify-player, sag
- 系统工具: healthcheck, node-connect, skill-creator
- 其他: weather, blogwatcher, oracle, clawhub

---

**报告生成**: 战略咨询专家 Agent  
**日期**: 2026-03-23  
**版本**: v1.0