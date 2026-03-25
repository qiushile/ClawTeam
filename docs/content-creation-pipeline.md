# 内容创作 Pipeline 配置指南

## 概述

营销部 Multi-Agent 内容创作流水线，实现从素材收集 → 内容创作 → 编辑优化 → 发布的一体化流程。

## Pipeline 架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    内容创作 Pipeline                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. content-strategist (策略师)                                  │
│     ↓ 输出：内容策略、选题方向、目标受众分析                      │
│                                                                 │
│  2. material-collector (素材收集)                                │
│     ↓ 输出：参考资料、数据、案例、引用素材                        │
│                                                                 │
│  3. content-writer (内容撰写)                                    │
│     ↓ 输出：初稿文章                                              │
│                                                                 │
│  4. content-editor (编辑优化)                                    │
│     ↓ 输出：润色后的文章 + SEO 优化建议                            │
│                                                                 │
│  5. publisher (发布)                                             │
│     ↓ 输出：格式化内容 + 发布到目标平台                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 子 Agent 注册配置

### marketing/openclaw.json 添加 agents.list

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "default": true,
        "workspace": "/home/node/.openclaw/workspace",
        "subagents": {
          "allowAgents": ["*"]
        }
      },
      {
        "id": "content-strategist",
        "workspace": "/home/node/.openclaw/workspace-content-strategist"
      },
      {
        "id": "material-collector",
        "workspace": "/home/node/.openclaw/workspace-material-collector"
      },
      {
        "id": "content-writer",
        "workspace": "/home/node/.openclaw/workspace-content-writer"
      },
      {
        "id": "content-editor",
        "workspace": "/home/node/.openclaw/workspace-content-editor"
      },
      {
        "id": "publisher",
        "workspace": "/home/node/.openclaw/workspace-publisher"
      }
    ]
  }
}
```

## 各 Agent 职责

### 1. content-strategist (内容策略师)

**职责：**
- 分析目标受众和平台特性
- 制定内容策略和选题方向
- 规划内容结构和关键信息点
- 确定内容调性和品牌声音

**输出：**
```json
{
  "topic": "文章主题",
  "target_audience": "目标受众描述",
  "platform": "发布平台",
  "content_type": "文章/视频/播客",
  "key_messages": ["核心信息 1", "核心信息 2"],
  "tone": "专业/轻松/幽默",
  "word_count": 期望字数，
  "seo_keywords": ["关键词 1", "关键词 2"]
}
```

### 2. material-collector (素材收集员)

**职责：**
- 收集相关参考资料和数据
- 整理案例和引用素材
- 搜集图片和多媒体素材
- 验证信息来源可靠性

**输出：**
```json
{
  "references": [
    {"title": "参考文章", "url": "链接", "key_points": ["要点"]}
  ],
  "data_points": [
    {"stat": "数据描述", "value": "数值", "source": "来源"}
  ],
  "examples": ["案例 1", "案例 2"],
  "quotes": ["引用 1", "引用 2"],
  "images": ["图片描述/链接"]
}
```

### 3. content-writer (内容撰写)

**职责：**
- 根据策略和素材撰写初稿
- 确保内容结构清晰、逻辑连贯
- 保持品牌声音一致性
- 融入 SEO 关键词

**输出：** 完整文章初稿（Markdown 格式）

### 4. content-editor (内容编辑)

**职责：**
- 润色文字，提升可读性
- 优化标题和小标题
- SEO 优化（关键词密度、meta 描述）
- 检查事实准确性
- 添加行动号召 (CTA)

**输出：**
- 编辑后的完整文章
- SEO 优化建议
- 发布前检查清单

### 5. publisher (发布专员)

**职责：**
- 格式化内容适配目标平台
- 添加标签和分类
- 安排发布时间
- 执行发布操作
- 跟踪发布状态

**输出：**
- 发布确认
- 文章链接
- 初期数据跟踪

## 使用示例

### 通过 main agent 调度

```javascript
// 1. 策略规划
const strategy = await sessions_spawn({
  agentId: "content-strategist",
  task: "为新产品发布制定内容策略，目标受众是 25-35 岁科技从业者，发布平台是微信公众号和知乎"
});

// 2. 素材收集
const materials = await sessions_spawn({
  agentId: "material-collector",
  task: `收集关于${strategy.topic}的素材，包括数据、案例、引用`,
  context: strategy.output
});

// 3. 内容撰写
const draft = await sessions_spawn({
  agentId: "content-writer",
  task: "根据策略和素材撰写文章初稿",
  context: { strategy: strategy.output, materials: materials.output }
});

// 4. 编辑优化
const edited = await sessions_spawn({
  agentId: "content-editor",
  task: "编辑润色文章，优化 SEO",
  context: { draft: draft.output, strategy: strategy.output }
});

// 5. 发布
const published = await sessions_spawn({
  agentId: "publisher",
  task: "发布到微信公众号和知乎",
  context: { article: edited.output, platforms: ["wechat", "zhihu"] }
});
```

### 一键 Pipeline（推荐）

创建一个 orchestrator agent 来自动串联整个流程：

```javascript
const result = await sessions_spawn({
  agentId: "content-pipeline-orchestrator",
  task: "创作一篇关于 [主题] 的文章，发布到 [平台]"
});
// 自动执行 5 个步骤，返回最终发布结果
```

## 工作目录结构

```
/opt/openclaw-team/openclaw-marketing/
├── workspace/                          # main agent
├── workspace-content-strategist/       # 策略师
│   └── SOUL.md
├── workspace-material-collector/       # 素材收集
│   └── SOUL.md
├── workspace-content-writer/           # 撰写
│   └── SOUL.md
├── workspace-content-editor/           # 编辑
│   └── SOUL.md
├── workspace-publisher/                # 发布
│   └── SOUL.md
└── openclaw.json                       # 配置 agents.list
```

## 部署步骤

1. 在 `openclaw-marketing/openclaw.json` 中添加 `agents.list`
2. 为每个子 agent 创建 workspace 目录和 SOUL.md
3. 重启营销部容器：`docker restart openclaw-marketing`
4. 测试：`sessions_spawn(agentId="content-strategist", task="...")`

## 扩展

可根据需要添加更多 specialized agents：
- `seo-specialist` - SEO 专家
- `social-media-adapter` - 社媒适配
- `analytics-tracker` - 数据跟踪
- `translation-service` - 多语言翻译
