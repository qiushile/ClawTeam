# PostgreSQL 任务表交互指南

> 本文档说明如何通过 PostgreSQL 工具与 `shared.tasks` 和 `shared.collaboration_events` 表进行交互。

---

## 📌 环境配置

### 数据库连接信息
```javascript
const { Client } = require('pg');

const client = new Client({
  host: 'postgres-db',
  port: 5432,
  user: process.env.DATABASE_USER || 'dev_user',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'openclaw_db'
});

await client.connect();
```

### 数据库 URL
```
DATABASE_URL=postgresql://<db-user>:<db-password>@postgres-db:5432/openclaw_db
```

---

## 📊 表结构

### 1. `shared.tasks` 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | integer | 主键 |
| title | varchar | 任务标题（必填） |
| description | text | 任务描述 |
| requester | varchar | 发起人角色（必填） |
| assignee | varchar | 执行人角色（必填） |
| status | varchar | 状态：'PENDING' \| 'IN_PROGRESS' \| 'COMPLETED' |
| priority | integer | 优先级（0-10） |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |
| result | text | 任务完成后的结果摘要 |

### 2. `shared.collaboration_events` 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | integer | 主键 |
| task_id | integer | 关联的任务 ID |
| from_role | varchar | 发送方角色 |
| to_role | varchar | 接收方角色 |
| event_type | varchar | 事件类型（见下方列表） |
| message | text | 事件消息 |
| created_at | timestamp | 创建时间 |

---

## 🎯 事件类型枚举

- `CREATED_BY_SELF`: 自我创建任务
- `ACCEPTED_BY_ASSIGNEE`: 任务被接收
- `STARTED_WORK`: 开始工作
- `DELIVERED_TO_REQUESTER`: 交付给请求人
- `REJECTED_BY_ASSIGNEE`: 任务被拒绝
- `ASKED_FOR_CLARIFICATION`: 请求澄清
- `REQUESTED_ASSISTANCE`: 请求协助
- `UPDATED_STATUS`: 状态更新

---

## 🔧 常用操作

### 1. 获取我的待办任务

```javascript
// 查询所有状态为 PENDING 且 assignee 为当前角色的任务
const result = await client.query(`
  SELECT id, title, description, status, created_at
  FROM shared.tasks
  WHERE assignee = 'dev' AND status = 'PENDING'
  ORDER BY created_at ASC
`);
console.log(result.rows);
```

### 2. 创建新任务

```javascript
const result = await client.query(`
  INSERT INTO shared.tasks (title, description, requester, assignee, status, created_at, updated_at)
  VALUES (
    '任务标题',
    '任务描述',
    'requester_role',
    'assignee_role',
    'PENDING',
    NOW(),
    NOW()
  )
  RETURNING id, title, status
`);
console.log('Task created:', result.rows[0]);
```

### 3. 更新任务状态

```javascript
const result = await client.query(`
  UPDATE shared.tasks
  SET status = 'IN_PROGRESS', updated_at = NOW()
  WHERE id = 123
  RETURNING id, title, status
`);
```

### 4. 记录协作事件

```javascript
const result = await client.query(`
  INSERT INTO shared.collaboration_events (task_id, from_role, to_role, event_type, message, created_at)
  VALUES (
    123,                              -- task_id
    'dev',                            -- from_role
    'pm',                             -- to_role
    'ACCEPTED_BY_ASSIGNEE',           -- event_type
    '我已经接收此任务并开始处理',       -- message
    NOW()
  )
  RETURNING id, event_type, message
`);
```

### 5. 完成任务并提交结果

```javascript
// 更新任务状态为完成
const updateResult = await client.query(`
  UPDATE shared.tasks
  SET status = 'COMPLETED', result = $1, updated_at = NOW()
  WHERE id = $2
  RETURNING id, title, status, result
`, ['任务完成后的关键产出摘要', 123]);

// 记录完成事件
await client.query(`
  INSERT INTO shared.collaboration_events (task_id, from_role, to_role, event_type, message, created_at)
  VALUES (
    123,
    'dev',
    'requester_role',
    'DELIVERED_TO_REQUESTER',
    '任务已完成，关键产出：[简要说明]',
    NOW()
  )
`);
```

---

## 🔐 权限与安全策略

### 行级安全（RLS）规则

1. 用户只能查看和操作满足以下条件之一的任务：
   - `assignee = CURRENT_USER`
   - `requester = CURRENT_USER`

2. 用户只能插入满足 RLS 条件的任务（即 requester 或 assignee 必须是当前角色）

### 角色命名规范

- 所有角色名必须使用下划线命名法，如：
  - `dev_user`
  - `pm_user`
  - `design_user`
  - `expert_user`
  - `security_user`

---

## 📝 使用示例：完整任务流程

```javascript
const { Client } = require('pg');

async function processTask() {
  const client = new Client({
    host: 'postgres-db',
    port: 5432,
    user: process.env.DATABASE_USER || 'dev_user',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'openclaw_db'
  });

  await client.connect();

  try {
    // 1. 获取待办任务
    const pendingTasks = await client.query(`
      SELECT * FROM shared.tasks
      WHERE assignee = 'dev_user' AND status = 'PENDING'
      ORDER BY created_at LIMIT 1
    `);

    if (pendingTasks.rows.length === 0) {
      console.log('无待办任务');
      return;
    }

    const task = pendingTasks.rows[0];
    console.log('发现新任务:', task.title);

    // 2. 更新任务状态为进行中
    await client.query(`
      UPDATE shared.tasks
      SET status = 'IN_PROGRESS', updated_at = NOW()
      WHERE id = $1
    `, [task.id]);

    // 3. 记录接收事件
    await client.query(`
      INSERT INTO shared.collaboration_events (task_id, from_role, to_role, event_type, message, created_at)
      VALUES ($1, 'dev_user', 'dev_user', 'ACCEPTED_BY_ASSIGNEE', '任务开始处理', NOW())
    `, [task.id]);

    // ... 执行任务逻辑 ...

    // 4. 完成任务
    await client.query(`
      UPDATE shared.tasks
      SET status = 'COMPLETED', result = $1, updated_at = NOW()
      WHERE id = $2
    `, ['任务完成的具体产出', task.id]);

    // 5. 记录完成事件
    await client.query(`
      INSERT INTO shared.collaboration_events (task_id, from_role, to_role, event_type, message, created_at)
      VALUES ($1, 'dev_user', 'requester_role', 'DELIVERED_TO_REQUESTER', '任务已完成', NOW())
    `, [task.id]);

  } finally {
    await client.end();
  }
}

processTask();
```

---

## ⚠️ 注意事项

1. **角色名必须匹配**：`requester` 和 `assignee` 字段必须使用完整的角色名（如 `dev_user`），不要使用简写如 `dev`。
2. **及时更新状态**：接收到任务后立即更新为 `IN_PROGRESS`，避免其他 Agent 重复处理。
3. **记录事件**：关键操作（接收、完成、请求协助等）都应记录到 `collaboration_events` 表。
4. **异常处理**：建议使用 `try-finally` 确保数据库连接正确关闭。

---

*本文档由 dev_user 自动生成*
