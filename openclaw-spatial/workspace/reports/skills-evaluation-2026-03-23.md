# 空间计算部门 Skills 评估报告

**日期:** 2026-03-23  
**评估人:** 空间计算顾问  
**总技能库:** 53 个可用 Skills

---

## 📋 推荐 Skills 列表 (15 个)

### 🔥 高优先级 (核心业务相关)

| # | Skill 名称 | 适用场景 | 依赖要求 | 优先级 |
|---|-----------|---------|---------|--------|
| 1 | **openai-image-gen** | 3D 资产预览图生成、UI 概念图批量产出 | OPENAI_API_KEY, python3 | ⭐⭐⭐ |
| 2 | **nano-banana-pro** | Gemini 图像生成/编辑，支持多图合成 | GEMINI_API_KEY, uv | ⭐⭐⭐ |
| 3 | **canvas** | 向连接的 Mac/iOS/Android 节点推送 XR 界面、空间交互原型 | 无 (需节点连接) | ⭐⭐⭐ |
| 4 | **coding-agent** | 委托 Codex/Claude Code 开发 visionOS/SwiftUI 代码 | codex/claude/pi 命令行工具 | ⭐⭐⭐ |
| 5 | **video-frames** | 从视频提取帧用于 AR 参考、空间视频分析 | ffmpeg | ⭐⭐ |
| 6 | **openai-whisper-api** | 空间音频转录、语音交互日志分析 | OPENAI_API_KEY, curl | ⭐⭐ |
| 7 | **github** | 管理空间计算相关开源项目、PR 审查 | gh CLI | ⭐⭐ |
| 8 | **summarize** | 快速摘要 XR 技术文档、WWDC 视频内容 | summarize CLI | ⭐⭐ |

### 📦 中优先级 (协作与文档)

| # | Skill 名称 | 适用场景 | 依赖要求 | 优先级 |
|---|-----------|---------|---------|--------|
| 9 | **notion** | 空间计算资产数据库、项目追踪 | NOTION_API_KEY | ⭐⭐ |
| 10 | **obsidian** | 技术笔记管理、Swift/Metal 代码片段库 | obsidian-cli | ⭐⭐ |
| 11 | **tmux** | 管理后台编码会话、监控并行开发任务 | tmux | ⭐⭐ |
| 12 | **sherpa-onnx-tts** | 离线语音合成、XR 语音反馈本地化 | 需下载运行时和模型 | ⭐ |

### 🛡️ 低优先级 (运维与安全)

| # | Skill 名称 | 适用场景 | 依赖要求 | 优先级 |
|---|-----------|---------|---------|--------|
| 13 | **healthcheck** | 定期安全审计、OpenClaw 部署健康检查 | 无 | ⭐ |
| 14 | **camsnap** | 从 RTSP 摄像头捕获帧用于空间定位参考 | camsnap CLI, ffmpeg | ⭐ |
| 15 | **skill-creator** | 创建部门专属技能 (如 visionOS 空间 API 封装) | 无 | ⭐ |

---

## 🔍 详细分析

### 核心推荐 (Top 5)

#### 1. openai-image-gen 🎨
**为什么适合:** 空间计算部门需要频繁生成 3D 资产预览图、UI 概念图、空间界面 mockup。支持批量生成 (最多 16 张)，自动创建 gallery 索引页。

**典型用法:**
```bash
# 生成 visionOS 界面概念图
python3 scripts/gen.py --prompt "futuristic visionOS floating window UI with spatial controls" --count 8 --model gpt-image-1

# 生成透明背景 AR 资产
python3 scripts/gen.py --prompt "3D holographic data visualization" --background transparent --output-format webp
```

**安装成本:** 低 (只需 Python + API Key)

---

#### 2. canvas 🖼️
**为什么适合:** 可直接向连接的 Mac/iOS/Android 节点推送 HTML5 交互原型，用于测试空间界面、XR 交互逻辑。支持 Live Reload，适合快速迭代。

**典型用法:**
```bash
# 向 Mac 节点推送空间交互原型
canvas action:present node:mac-xxx target:http://<hostname>:18793/__openclaw__/canvas/spatial-ui.html

# 实时开发 (保存即更新)
# 配置 liveReload: true 后，修改 HTML 自动刷新到所有连接节点
```

**安装成本:** 中 (需配置 gateway.bind 和节点连接)

---

#### 3. coding-agent 🧩
**为什么适合:** 空间计算开发涉及大量 Swift/Metal/visionOS 代码，可委托 Codex/Claude Code 进行代码生成、重构、PR 审查。支持后台并行执行。

**典型用法:**
```bash
# 委托开发 visionOS 空间组件
bash pty:true workdir:~/Projects/SpatialApp background:true command:"codex exec --full-auto 'Create a visionOS RealityView with hand tracking'"

# 并行审查多个 PR
bash pty:true workdir:~/Projects/SpatialApp background:true command:"codex exec 'Review PR #45 for spatial memory leaks'"
```

**安装成本:** 中 (需安装 Codex/Claude Code CLI)

---

#### 4. nano-banana-pro 🍌
**为什么适合:** Gemini 3 Pro Image 支持图像编辑和多图合成，适合将多个 3D 资产参考图合成为场景预览，或进行图像到图像的风格转换。

**典型用法:**
```bash
# 编辑现有 3D 资产图
uv run scripts/generate_image.py --prompt "make this hologram more transparent with blue glow" -i input.png --filename output.png --resolution 2K

# 多图合成场景
uv run scripts/generate_image.py --prompt "combine these UI elements into one cohesive spatial interface" -i ui1.png -i ui2.png -i ui3.png
```

**安装成本:** 低 (只需 uv + GEMINI_API_KEY)

---

#### 5. github 🐙
**为什么适合:** 空间计算项目通常开源协作，需要管理 Issues、PRs、CI 状态。gh CLI 提供完整的 GitHub 操作能力。

**典型用法:**
```bash
# 审查空间计算相关 PR
gh pr view 55 --repo owner/spatial-framework --json title,body,author
gh pr checks 55 --repo owner/spatial-framework

# 批量管理 Issues
gh issue list --repo owner/spatial-framework --state open --json number,title,labels
```

**安装成本:** 低 (只需 gh CLI + 认证)

---

## 🔌 当前插件分析

### 已安装插件 (3 个)

| 插件 ID | 名称 | 类型 | 描述 |
|--------|------|------|------|
| **postgres-tool** | Postgres Shared Tool | utility | 共享数据库访问工具，支持跨 Agent 协作表操作 |
| **task-notifier** | Task Notifier | utility | 任务通知监听器 + 飞书消息发送 |

### 插件状态评估

✅ **postgres-tool**
- 状态：正常连接 (spatial_user)
- 用途：联邦协作 2.0 语义接口核心
- 建议：保持当前配置

✅ **task-notifier**
- 状态：正常监听 (task_channel, message_channel)
- 用途：飞书任务通知、跨部门消息同步
- 建议：保持当前配置

### 推荐新增插件

| 插件 | 用途 | 优先级 |
|------|------|--------|
| **feishu-doc** | 飞书文档读写 (部门知识库) | ⭐⭐⭐ |
| **feishu-drive** | 飞书云盘管理 (3D 资产存储) | ⭐⭐ |
| **feishu-perm** | 飞书权限管理 (跨部门协作) | ⭐⭐ |
| **feishu-wiki** | 飞书知识库导航 (技术文档) | ⭐⭐ |

---

## 📊 Skills 安装优先级矩阵

```
安装成本
    ↑
高  │     coding-agent    canvas
    │     sherpa-onnx-tts
    │
中  │  github  summarize  obsidian
    │  notion  tmux       camsnap
    │
低  │  openai-image-gen   nano-banana-pro
    │  openai-whisper-api video-frames
    │  healthcheck        skill-creator
    └────────────────────────────────→ 业务价值
        低              高
```

---

## 🎯 下一步建议

### 立即行动 (本周)
1. **安装 openai-image-gen** - 配置 OPENAI_API_KEY，测试批量生成 3D 资产预览图
2. **配置 canvas** - 设置 gateway.bind=lan 或 tailnet，测试向 Mac 节点推送界面
3. **安装 nano-banana-pro** - 配置 GEMINI_API_KEY，测试图像编辑功能

### 中期计划 (本月)
4. **部署 coding-agent** - 安装 Codex 或 Claude Code CLI，建立并行开发工作流
5. **配置 github** - 认证 gh CLI，接入空间计算项目仓库
6. **评估 feishu 插件** - 根据协作需求安装 feishu-doc/drive/perm/wiki

### 长期规划 (下季度)
7. **建立技能库** - 使用 skill-creator 创建部门专属技能 (visionOS API 封装等)
8. **自动化巡检** - 配置 healthcheck 定期安全审计
9. **语音交互链** - 整合 whisper-api + sherpa-onnx-tts 实现完整语音交互

---

## ⚠️ 注意事项

1. **API Key 管理**: 所有需要 API Key 的 Skills 应统一存储在 `~/.openclaw/openclaw.json` 的 `skills.entries` 配置中，避免硬编码
2. **权限隔离**: 飞书群组的 `groupPolicy="open"` 存在安全风险，建议改为 `allowlist` 模式
3. **资源限制**: 图像生成和视频处理技能需设置合理的 exec timeout (建议 300 秒)
4. **节点连接**: canvas 技能依赖 Tailscale 或 LAN 连接，需确保 gateway.bind 配置正确

---

**报告生成完毕。** 如需进一步分析某个 Skill 或插件，请随时告知。
