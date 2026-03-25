# 技能 (Skills) 评估报告

## 一、适合市场部的高优先级 Skills（推荐启用）

| 序号 | Skill 名称 | 核心功能 | 与我的匹配度 | 使用场景 | 依赖/配置 |
|------|-----------|---------|-------------|---------|----------|
| 1 | **feishu-doc** | 飞书文档读写操作 | ⭐⭐⭐⭐⭐ | 市场部日常文档协作、报告撰写、内容发布 | 飞书频道已配置，可用 |
| 2 | **feishu-wiki** | 飞书知识库导航 | ⭐⭐⭐⭐⭐ | 团队知识管理、SOP沉淀、品牌资产库 | 依赖 feishu-doc |
| 3 | **feishu-drive** | 飞书云盘文件管理 | ⭐⭐⭐⭐ | 营销素材存储、文件夹管理、资源分发 | 需用户共享文件夹给Bot |
| 4 | **openai-image-gen** | OpenAI图像批量生成 | ⭐⭐⭐⭐⭐ | 社媒配图、营销海报、广告素材快速生成 | 需 OPENAI_API_KEY |
| 5 | **skill-creator** | Skill创建/编辑/审计 | ⭐⭐⭐⭐ | 自定义市场部专属工作流、知识封装 | 内置脚本工具 |
| 6 | **summarize** | URL/视频/文档摘要 | ⭐⭐⭐⭐ | 竞品分析、行业报告速读、会议转录摘要 | 需安装 summarize CLI |
| 7 | **github** | GitHub PR/Issue/CI操作 | ⭐⭐⭐ | 营销网站代码协作、版本管理、发布追踪 | 需 gh CLI 认证 |
| 8 | **notion** | Notion页面/数据库操作 | ⭐⭐⭐⭐ | 项目管理、内容日历、营销计划 | 需 NOTION_API_KEY |
| 9 | **weather** | 天气查询 | ⭐⭐⭐ | 户外活动策划、展会安排、出行提醒 | 无需API Key |
| 10 | **canvas** | HTML内容展示 | ⭐⭐⭐ | 营销数据看板、活动监控大屏 | 需配置 canvasHost |
| 11 | **openai-whisper-api** | 音频转录 | ⭐⭐⭐⭐ | 播客内容转录、会议录音整理、视频字幕 | 需 OPENAI_API_KEY |
| 12 | **slack** | Slack消息/反应/置顶 | ⭐⭐⭐ | 跨团队协作、Slack渠道营销 | 需 slack 配置 |

---

## 二、中等优先级 Skills（按需启用）

| 序号 | Skill 名称 | 核心功能 | 潜在价值 | 备注 |
|------|-----------|---------|---------|------|
| 13 | **feishu-perm** | 飞书权限管理 | 文档分享、协作权限控制 | 默认禁用，敏感操作 |
| 14 | **healthcheck** | 主机安全加固 | 服务器/网关安全审计 | 运维向，市场部低优先级 |
| 15 | **node-connect** | 节点连接诊断 | 移动端配对问题排查 | 技术向，运营备用 |

---

## 三、暂不推荐的 Skills（与当前职责关联低）

| Skill 名称 | 功能说明 | 不推荐理由 |
|-----------|---------|-----------|
| 1password | 密码管理 | 市场部不直接管理基础设施密码 |
| apple-notes/reminders | 苹果生态笔记/提醒 | 团队使用飞书，非苹果原生 |
| bear-notes/obsidian | 第三方笔记工具 | 团队已统一飞书 |
| blogwatcher | 博客监控 | 无明确营销场景 |
| bluebubbles/imsg | 短信/iMessage | 国内使用微信/飞书 |
| camsnap | 摄像头拍照 | 无营销场景 |
| coding-agent | 代码编写Agent | 非开发职责 |
| discord | Discord消息 | 国内不常用 |
| gifgrep | GIF搜索 | 低频需求 |
| goplaces | 地点搜索 | 低频需求 |
| himalaya | 邮件客户端 | 使用飞书邮件 |
| mcporter | Minecraft工具 | 无关 |
| model-usage | 模型用量统计 | 运维向 |
| nano-banana-pro/nano-pdf | PDF处理 | 可用飞书文档替代 |
| openhue | 飞利浦Hue控制 | 无关 |
| oracle | Oracle数据库 | 无关 |
| ordercli | 订单CLI | 无关 |
| peekaboo | 系统监控 | 运维向 |
| sag | 智能代理 | 未明确场景 |
| session-logs | 会话日志 | 运维向 |
| sherpa-onnx-tts | 语音合成 | 低优先级 |
| songsee | 音乐搜索 | 无关 |
| sonoscli | Sonos音响控制 | 无关 |
| spotify-player | Spotify控制 | 国内不常用 |
| things-mac | 任务管理 | 团队使用飞书任务 |
| tmux | 终端复用 | 开发向 |
| trello | Trello看板 | 可用飞书/Notion替代 |
| video-frames | 视频帧提取 | 低频需求 |
| voice-call | 语音通话 | 使用飞书会议 |
| wacli | WhatsApp CLI | 国内不常用 |
| xurl | URL提取 | 低频需求 |
| eightctl/gemini/gh-issues/gog | 特定平台工具 | 无明确需求 |

---

## 四、Skills 启用建议汇总

### 立即启用（已就绪或配置简单）
1. ✅ feishu-doc / feishu-wiki / feishu-drive - 飞书生态核心
2. ✅ weather - 零配置，立即可用
3. ⏳ openai-image-gen - 需配置 OPENAI_API_KEY
4. ⏳ openai-whisper-api - 需配置 OPENAI_API_KEY
5. ⏳ summarize - 需安装 summarize CLI
6. ⏳ notion - 需配置 NOTION_API_KEY

### 后续评估
- canvas - 需评估是否有数据可视化需求
- github - 需评估是否有代码协作需求
- slack - 需评估是否有Slack渠道

---

## 五、建议配置的 API Keys

| 服务 | 用途 | 优先级 |
|-----|------|-------|
| OPENAI_API_KEY | 图像生成、语音转录 | 高 |
| NOTION_API_KEY | 项目管理、内容日历 | 中 |
| GEMINI_API_KEY | summarize 备用模型 | 低 |

---

*报告生成时间: 2026-03-23*
*评估标准: 与"品牌营销专家"角色职责匹配度、团队当前工具栈(飞书为主)、国内市场环境*
