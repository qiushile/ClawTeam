# LISTEN/NOTIFY 配置指南

## 📌 一句话总结

**数据库管理员（root）执行一次初始化脚本，所有 Agent 自动启用 LISTEN/NOTIFY 功能**

---

## 🚀 执行步骤

### 步骤 1: 数据库初始化（root 执行一次）

```bash
# 先设置数据库密码（示例占位符，请勿写死到脚本）
export OPENCLAW_DB_PASSWORD='<db-password>'

# 执行 SQL 初始化脚本
psql "postgresql://dev_user:${OPENCLAW_DB_PASSWORD}@postgres-db:5432/openclaw_db" -f /home/node/.openclaw/workspace/init-listen-notify.sql

# 或者执行完整脚本
bash /home/node/.openclaw/workspace/init-full.sh
```

**执行后会发生：**
- ✅ 创建 `notify_task_change()` 函数
- ✅ 创建 `tasks_notify_trigger` 触发器
- ✅ INSERT/UPDATE `shared.tasks` 时自动发送 NOTIFY

### 步骤 2: Agent 自动启用

**无需额外配置！** Agent 启动时：
1. `postgres-tool` 插件会自动调用 `startListener()`
2. 自动执行 `LISTEN task_channel`
3. 自动设置通知处理函数

**Agent 端代码（已内置在 postgres-tool）：**

```javascript
// /home/node/.openclaw/extensions/postgres-tool/index.js (第 55-71 行)
async function startListener(connectionString) {
  listenerClient.on('notification', (msg) => {
    try {
      const data = JSON.parse(msg.payload);
      
      // 检查 target_user 是否匹配当前用户
      if (data.target_user === dbUsername || data.target_user === '*') {
        const notification = data.notification;
        
        switch (notification.event) {
          case 'TASK_CREATED':
            console.log(`任务 ${notification.task_id} 已创建`);
            break;
          case 'TASK_STATUS_CHANGED':
            console.log(`任务 ${notification.task_id} 状态变更`);
            break;
          // ... 其他处理逻辑
        }
      }
    } catch (err) {
      logger.error(`Failed to parse notification payload: ${msg.payload}`);
    }
  });

  await listenerClient.query('LISTEN task_channel');
  await listenerClient.query('LISTEN message_channel');
}
```

---

## 📊 通知流程

| 角色 | 操作 | 通知对象 | 通知内容 |
|------|------|----------|----------|
| 任务发送人 | INSERT 任务 | 任务接收人 | `TASK_CREATED` |
| 任务发送人 | INSERT 任务 | 自己 | `TASK_CONFIRMED` |
| 任务接收人 | UPDATE 任务 | 任务发送人 | `TASK_STATUS_CHANGED` (COMPLETED/FAILED) |

---

## 🧪 测试

### 测试通知功能

```bash
# 以 root 执行测试脚本
node /home/node/.openclaw/workspace/test-listen-notify.js
```

**预期输出：**
```
==========================================
LISTEN/NOTIFY 测试
==========================================

✅ 创建监听客户端
✅ LISTEN task_channel
✅ 通知处理函数已设置

📌 任务已创建: ID=10, title="[测试] LISTEN/NOTIFY 测试任务"
 ⏳ 等待通知...

🔔 收到通知: task_channel
  Target User: dev_user
  Notification: {
    "event": "TASK_CREATED",
    "task_id": 10,
    ...
  }

📌 任务已更新为 COMPLETED, ID=10
 ⏳ 等待通知...

🔔 收到通知: task_channel
  Target User: dev_user
  Notification: {
    "event": "TASK_STATUS_CHANGED",
    "old_status": "PENDING",
    "new_status": "COMPLETED",
    ...
  }

✅ 测试完成！所有通知均已成功接收
```

### 查看 Gateway 日志

```bash
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | grep "DB NOTIFY"
```

---

## 📝 开发者说明

### 如果你开发新的 Agent

你**不需要写** LISTEN 逻辑！只需：

1. 在 `AGENTS.md` 中指定 `postgres-tool` 插件
2. 配置正确的 `DATABASE_URL`（使用你的部门用户）

**示例：**

```json
{
  "plugins": {
    "entries": {
      "postgres-tool": {
        "enabled": true
      }
    }
  },
  "env": {
    "DATABASE_URL": "postgresql://<db-user>:<db-password>@postgres-db:5432/openclaw_db"
  }
}
```

---

## ⚙️ 通知 payload 格式

```json
{
  "target_user": "dev_user",
  "notification": {
    "event": "TASK_CREATED",
    "task_id": 10,
    "assignee": "dev_user",
    "requester": "pm_user",
    "title": "任务标题",
    "priority": "P1",
    "timestamp": "2026-03-21T15:30:00.000Z"
  }
}
```

**event 类型：**
- `TASK_CREATED` - 任务创建
- `TASK_STATUS_CHANGED` - 状态变更
- `TASK_RESULT_READY` - 结果就绪
- `TASK_CONFIRMED` - 任务确认

---

## 🐛 故障排查

### 问题：收不到通知

**原因 1: 未建立 LISTEN 连接**
```
检查 Gateway 日志: grep "Listening to task_channel"
```

**原因 2: 数据库用户不匹配**
```
确保 DATABASE_URL 中的用户名正确
例如: postgresql://<db-user>:<db-password>@postgres-db:5432/openclaw_db
```

**原因 3: 触发器未创建**
```sql
-- 检查触发器是否存在
SELECT tgname FROM pg_trigger WHERE tgname = 'tasks_notify_trigger';
```

### 问题：通知格式错误

检查 PostgreSQL 日志：
```sql
SHOW log_min_messages;
SET log_min_messages = 'notice';
```

---

## 📚 参考文件

| 文件 | 用途 |
|------|------|
| `/home/node/.openclaw/workspace/init-listen-notify.sql` | SQL 初始化脚本 |
| `/home/node/.openclaw/workspace/init-full.sh` | 完整初始化脚本 |
| `/home/node/.openclaw/workspace/test-listen-notify.js` | 测试脚本 |
| `/home/node/.openclaw/workspace/agent-listen-example.js` | Agent 示例代码 |
| `/home/node/.openclaw/extensions/postgres-tool/index.js` | 实际 LISTEN 逻辑 |

---

**GitHub 小贴士：** 所有配置完成后，Agent 之间可以自动通过数据库 NOTIFY 进行协作，无需额外配置。
