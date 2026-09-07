# 任务调度系统

> 日期: 2026-09-07
> 作者: 研发部高级研发专家 (dev_user)
> 状态: ✅ 已完成

---

## 一、架构

```
┌─────────────────────────────────────────┐
│              Agent (dev)                 │
│  ┌───────────────────────────────────┐  │
│  │     lib/task-scheduler.js         │  │
│  │  ├── getPendingTasks()            │  │
│  │  ├── getInProgressTasks()         │  │
│  │  ├── getTimeoutTasks()            │  │
│  │  ├── claimTask()                  │  │
│  │  ├── completeTask()               │  │
│  │  ├── createTask()                 │  │
│  │  └── getSummary()                 │  │
│  └───────────────┬───────────────────┘  │
└──────────────────┼──────────────────────┘
                   │
          ┌────────┴────────┐
          │   PostgreSQL    │
          │  shared.tasks   │
          │  dev_tasks      │
          └─────────────────┘
```

## 二、组件

### 2.1 lib/task-scheduler.js

统一任务查询与优先级调度库。

**API**:

| 方法 | 说明 | 返回 |
|------|------|------|
| `getPendingTasks(assignee?)` | 查询所有 PENDING 任务，按优先级排序 | Task[] |
| `getInProgressTasks()` | 查询所有 IN_PROGRESS 任务 | Task[] |
| `getTimeoutTasks(hours=48)` | 查询超时任务 | TimeoutTask[] |
| `claimTask(id, assignee, source?)` | 认领任务 (PENDING → IN_PROGRESS) | {success, taskId} |
| `completeTask(id, result, source?)` | 完成任务 (IN_PROGRESS → COMPLETED) | {success, taskId} |
| `createTask(title, desc, assignee?, priority?, source?)` | 创建任务 | {success, taskId} |
| `getSummary()` | 获取任务统计摘要 | {dev: {}, shared: {}} |

**优先级**: P0 (URGENT) > P1 (HIGH) > P2 (NORMAL/MEDIUM) > P3 (LOW)

**超时**: IN_PROGRESS 超过 48 小时自动标记

### 2.2 scripts/db-health-monitor.js

PostgreSQL 健康检查与自动恢复脚本。

**功能**:
1. 检查当前 DB 连接
2. 连接失败时指数退避重试 (1s→2s→4s→8s→16s)
3. 重试失败后自动扫描子网 (172.23.0.1-254:5432)
4. 找到新 IP 后自动更新 `.dev-config.json`

**用法**:
```bash
# 单次检查
node scripts/db-health-monitor.js --once

# 守护模式 (每 30 分钟)
node scripts/db-health-monitor.js
```

**返回**:
```json
{"status": "ok", "host": "172.23.0.14"}
{"status": "recovered", "host": "172.23.0.14"}
{"status": "relocated", "host": "172.23.0.X", "prev_host": "172.23.0.Y"}
{"status": "down", "host": null}
```

## 三、验收标准

| # | 验收项 | 状态 |
|---|--------|------|
| 1 | 任务查询 < 500ms | ✅ |
| 2 | PENDING 任务按优先级排序 | ✅ |
| 3 | 超时任务检测 (48h) | ✅ |
| 4 | DB 连接健康检查 | ✅ |
| 5 | IP 漂移自动扫描与恢复 | ✅ |
| 6 | 自动更新 .dev-config.json | ✅ |

---

> 完成时间: 2026-09-07
> 状态: ✅ 完成
