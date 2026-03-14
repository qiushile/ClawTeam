# OpenClaw Agent Team 监控系统

## 📁 文件结构

```
/opt/openclaw-team/monitor/
├── health-check.sh        # 健康检查主脚本
├── heartbeat-trigger.sh   # Heartbeat 触发器（带通知逻辑）
├── health-state.json      # 最新检查状态（自动生成）
└── README.md              # 本文档
```

## 🔍 检查内容

| 检查项 | 频率 | 说明 |
|--------|------|------|
| 容器状态 | 5 分钟 | 检查 3 个 agent 容器是否运行 |
| Gateway 端口 | 5 分钟 | 检查 18001/18002/18003 端口 |
| Web UI 端口 | 5 分钟 | 检查 13000/13001/13002（可选） |
| 日志错误 | 5 分钟 | 扫描最近 5 分钟 ERROR/FATAL |
| 资源使用 | 5 分钟 | CPU/内存使用率 |
| 数据库 | 5 分钟 | PostgreSQL 容器状态 |

## ⚙️ 配置位置

| 配置项 | 位置 |
|--------|------|
| Cron 任务 | `/root/.openclaw/workspace/cron/jobs.json` |
| Heartbeat | `/root/.openclaw/workspace/HEARTBEAT.md` |
| Gateway 配置 | `/root/.openclaw/openclaw.json` |

## 🚀 手动运行

```bash
# 运行健康检查
/opt/openclaw-team/monitor/health-check.sh

# 纯文本输出（适合脚本调用）
/opt/openclaw-team/monitor/health-check.sh --plain

# 运行完整触发器（带通知逻辑）
/opt/openclaw-team/monitor/heartbeat-trigger.sh
```

## 📊 状态文件

`health-state.json` 记录最新检查结果：

```json
{
  "timestamp": "2026-03-14 16:05:29",
  "status": "CRITICAL",
  "exitCode": 1
}
```

**状态值：**
- `HEALTHY` - 一切正常
- `WARNING` - 有警告（重启次数多、日志错误等）
- `CRITICAL` - 严重问题（容器宕机、端口不可用）

## 🔔 告警规则

| 级别 | 条件 | 通知 |
|------|------|------|
| CRITICAL | 容器宕机、端口不可用、数据库异常 | 立即飞书通知 |
| WARNING | 重启次数>3、错误日志增多 | 记录，可配置通知 |
| HEALTHY | 所有检查通过 | 静默 |

## 🛠️ 修改检查频率

编辑 `/root/.openclaw/workspace/cron/jobs.json`：

```json
{
  "jobs": [
    {
      "name": "agent-team-health-check",
      "schedule": "*/5 * * * *",  // 修改这里
      ...
    }
  ]
}
```

**Cron 表达式示例：**
- `*/5 * * * *` - 每 5 分钟
- `*/10 * * * *` - 每 10 分钟
- `0 * * * *` - 每小时整点
- `0 9 * * *` - 每天早上 9 点

## 📝 查看历史状态

```bash
# 查看最新状态
cat /opt/openclaw-team/monitor/health-state.json

# 查看 cron 日志
openclaw cron logs
```

## 📊 端口配置

| 容器 | Gateway 端口 | Web UI 端口 |
|------|-------------|-------------|
| **orchestrator** | 18001 | 13000 |
| **agent-dev** | 18002 | 13001 |
| **agent-pm** | 18003 | 13002 |

所有 Gateway 端口仅绑定 `127.0.0.1`，不暴露到公网。

## 🔧 故障排除

### 容器正常运行但端口不可用

检查容器端口映射：
```bash
docker port openclaw-dev
```

检查容器日志：
```bash
docker logs --tail 50 openclaw-dev
```

### Cron 任务未执行

检查 cron 状态：
```bash
openclaw cron status
```

重启 Gateway：
```bash
openclaw gateway restart
```

### 飞书通知未发送

检查飞书插件配置：
```bash
cat /root/.openclaw/openclaw.json | jq '.channels.feishu'
```

---

最后更新：2026-03-14
