# 部门内 Multi-Agent 配置指南

## 概述

每个部门容器内启用 OpenClaw 原生 Multi-Agent，让部门主 Agent（main）能通过 `sessions_spawn` 调度本容器内的子 Agent。

## 当前状态

- 每个部门容器只有 1 个 `main` agent
- 子 Agent 定义已存在于 `workspace/agents/` 目录（如研发部有 23 个专家角色）
- 但未在 `openclaw.json` 的 `agents.list` 中注册，所以无法被 `sessions_spawn` 调用

## 配置步骤

### 1. 修改 openclaw.json — 注册子 Agent

以**研发部（openclaw-dev）**为例，在 `openclaw.json` 的 `agents` 下增加 `list`：

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
        "id": "code-reviewer",
        "workspace": "/home/node/.openclaw/workspace-code-reviewer"
      },
      {
        "id": "backend-architect",
        "workspace": "/home/node/.openclaw/workspace-backend-architect"
      },
      {
        "id": "frontend-developer",
        "workspace": "/home/node/.openclaw/workspace-frontend-developer"
      },
      {
        "id": "security-engineer",
        "workspace": "/home/node/.openclaw/workspace-security-engineer"
      },
      {
        "id": "devops-automator",
        "workspace": "/home/node/.openclaw/workspace-devops-automator"
      }
    ],
    "defaults": {
      "model": {
        "primary": "aliyun/qwen3.5-plus",
        "fallbacks": []
      },
      "subagents": {
        "allowAgents": ["*"]
      },
      ...其他现有 defaults 配置保持不变...
    }
  }
}
```

**关键字段说明：**
- `id`: 子 Agent 的唯一标识，main agent 用 `sessions_spawn(agentId="code-reviewer")` 来调用
- `default: true`: 只能有一个，标记为接收飞书消息的默认 agent
- `workspace`: 子 Agent 的独立工作目录
- `subagents.allowAgents: ["*"]`: 允许 main agent spawn 任意子 agent

### 2. 创建子 Agent 工作目录

在**宿主机**的部门目录下创建子 Agent workspace，映射到容器内：

```bash
# 以研发部为例
cd /opt/openclaw-team/openclaw-dev

# 为每个子 Agent 创建 workspace 目录
mkdir -p workspace-code-reviewer
mkdir -p workspace-backend-architect
mkdir -p workspace-frontend-developer
mkdir -p workspace-security-engineer
mkdir -p workspace-devops-automator
```

### 3. 为子 Agent 编写 SOUL.md

每个子 Agent workspace 里需要一个 `SOUL.md`，定义其角色和行为。可以从现有的 `workspace/agents/<name>/SOUL.md` 复制：

```bash
# 示例：复制现有定义到新 workspace
cp workspace/agents/code-reviewer/SOUL.md workspace-code-reviewer/SOUL.md
cp workspace/agents/backend-architect/SOUL.md workspace-backend-architect/SOUL.md
# ...依此类推
```

### 4. 修改 docker-compose.yml — 挂载子 Agent workspace

在部门服务的 `volumes` 中添加子 Agent workspace 挂载：

```yaml
  openclaw-dev:
    <<: *openclaw-base
    container_name: openclaw-dev
    volumes:
      - ./openclaw-dev:/home/node/.openclaw
      # 子 Agent workspace 挂载
      - ./openclaw-dev/workspace-code-reviewer:/home/node/.openclaw/workspace-code-reviewer
      - ./openclaw-dev/workspace-backend-architect:/home/node/.openclaw/workspace-backend-architect
      - ./openclaw-dev/workspace-frontend-developer:/home/node/.openclaw/workspace-frontend-developer
      - ./openclaw-dev/workspace-security-engineer:/home/node/.openclaw/workspace-security-engineer
      - ./openclaw-dev/workspace-devops-automator:/home/node/.openclaw/workspace-devops-automator
      # 公共扩展
      - ./common/extensions/postgres-tool:/home/node/.openclaw/extensions/postgres-tool
      - ./common/extensions/task-notifier:/home/node/.openclaw/extensions/task-notifier
```

> **注意：** 因为主 volume `./openclaw-dev:/home/node/.openclaw` 会覆盖容器内的 `.openclaw` 目录，子 workspace 目录放在 `openclaw-dev/` 下会自动映射进去，**不需要额外挂载**。只有当子 workspace 放在部门目录外面时才需要单独挂载。

### 5. 配置 bindings（消息路由）

确保飞书消息只路由到 `main` agent，不会误发给子 agent：

```json
{
  "bindings": [
    {
      "agentId": "main",
      "match": {
        "channel": "feishu"
      }
    }
  ]
}
```

如果不配置 bindings，有 `default: true` 的 agent 会自动接收所有消息，子 agent 不会被消息触发。

### 6. main agent 的 SOUL.md 中添加调度说明

在 main agent 的 `SOUL.md` 或 `AGENTS.md` 中添加：

```markdown
## 可调度的子 Agent

当你需要专业能力时，使用 `sessions_spawn` 调度子 Agent：

| Agent ID | 角色 | 擅长 |
|---|---|---|
| code-reviewer | 代码审查专家 | 代码审查、安全漏洞、最佳实践 |
| backend-architect | 后端架构师 | 系统设计、API 设计、数据库 |
| frontend-developer | 前端开发 | Vue3、Uniapp、UI 实现 |
| security-engineer | 安全工程师 | 安全审计、渗透测试、加固 |
| devops-automator | DevOps | CI/CD、Docker、部署 |

### 调度示例

\```
sessions_spawn(
  agentId="code-reviewer",
  task="Review the following code for security issues: ...",
  mode="run"
)
\```
```

---

## 各部门推荐子 Agent 规划

### 研发部（openclaw-dev）
| Agent ID | 角色 |
|---|---|
| code-reviewer | 代码审查 |
| backend-architect | 后端架构 |
| frontend-developer | 前端开发 |
| security-engineer | 安全工程 |
| devops-automator | DevOps |
| database-optimizer | 数据库优化 |
| technical-writer | 技术文档 |

### 设计部（openclaw-design）
| Agent ID | 角色 |
|---|---|
| ui-designer | UI 设计 |
| ux-researcher | 用户体验研究 |
| brand-designer | 品牌设计 |

### 产品部（openclaw-pm）
| Agent ID | 角色 |
|---|---|
| requirement-analyst | 需求分析 |
| data-analyst | 数据分析 |
| user-researcher | 用户调研 |

### 营销部（openclaw-marketing）
| Agent ID | 角色 |
|---|---|
| content-writer | 内容撰写 |
| seo-specialist | SEO 优化 |
| social-media-manager | 社媒运营 |

### QA 部（openclaw-qa）
| Agent ID | 角色 |
|---|---|
| test-engineer | 测试工程 |
| performance-tester | 性能测试 |
| automation-engineer | 自动化测试 |

### 中枢（openclaw-orchestrator）
| Agent ID | 角色 |
|---|---|
| task-planner | 任务拆解与规划 |
| progress-tracker | 进度跟踪 |

### 其他部门
按需添加，遵循相同模式。

---

## 完整操作 Checklist

对每个需要子 Agent 的部门：

- [ ] 在 `openclaw-<dept>/` 下创建 `workspace-<agent-id>/` 目录
- [ ] 在 workspace 中放入 `SOUL.md`（从 `workspace/agents/<name>/` 复制或新建）
- [ ] 修改 `openclaw-<dept>/openclaw.json`，在 `agents` 下添加 `list` 数组
- [ ] 确保 main agent 的 `subagents.allowAgents` 包含要调度的子 agent id
- [ ] 如需要，修改 `docker-compose.yml` 添加 volumes 挂载
- [ ] 更新 main agent 的 SOUL.md/AGENTS.md 中的调度说明
- [ ] 重启部门容器：`docker restart openclaw-<dept>`
- [ ] 测试：在飞书中让 main agent 执行 `sessions_spawn`

---

## 注意事项

1. **agents.list 中 main agent 必须显式声明**，否则启动会报错
2. **每个子 agent 必须有独立的 workspace**，不能共用
3. **agentDir 会自动创建**在 `~/.openclaw/agents/<agentId>/` 下
4. **子 agent 不接收飞书消息**，只能被 main agent 通过 `sessions_spawn` 调用
5. **子 agent 继承 main agent 的 model/plugins 配置**（来自 `agents.defaults`）
6. **workspace 目录放在部门目录内**会被主 volume 自动映射，无需额外挂载
