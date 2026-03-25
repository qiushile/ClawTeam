/**
 * Shared Postgres Tool for OpenClaw Instances
 * Includes raw SQL capability + High-level semantic tools for multi-agent collaboration.
 * LISTEN/NOTIFY support only.
 */
import { Type } from "@sinclair/typebox";
import { Pool } from 'pg';

// 闭包变量：用于工具函数访问
let dbPool = null;
let dbUsername = 'unknown';
let logger = null;
let listenerClient = null;

export async function initPostgresTool(api) {
  // 防止重复初始化 — plugins 可能加载多轮
  if (dbPool) {
    api.logger.info('PostgresTool: Already initialized, skipping.');
    return true;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    api.logger.warn('PostgresTool: DATABASE_URL not found.');
    return null;
  }

  // Extract db_username from connection string (e.g. postgresql://dev_user:pass@host/db)
  try {
    const urlMatches = connectionString.match(/:\/\/([^:]+):/);
    dbUsername = urlMatches ? urlMatches[1] : 'unknown';
  } catch (e) {
    dbUsername = 'unknown';
  }

  logger = api.logger;

  try {
    dbPool = new Pool({
      connectionString,
      max: 3,                    // 每个容器最多 3 个连接
      idleTimeoutMillis: 30000,  // 空闲 30 秒回收
      connectionTimeoutMillis: 10000, // 连接超时 10 秒
    });
    logger.info(`PostgresTool: Connected to DB as ${dbUsername}.`);

    // 启动专属监听客户端
    await startListener();
  } catch (e) {
    logger.error(`PostgresTool: Initialization failed. Error: ${e.message}`);
    return null;
  }

  return true;
}

// --- Start async listener for realtime notifications ---
async function startListener() {
  if (!dbPool) {
    logger.error('PostgresTool: dbPool not initialized.');
    return;
  }
  
  try {
    // 使用 dbPool.connect() 获取持久连接
    listenerClient = await dbPool.connect();
    
    listenerClient.on('notification', (msg) => {
      try {
        // 兼容空 payload
        let payload = {};
        if (msg.payload && msg.payload.trim() !== '') {
          payload = JSON.parse(msg.payload);
        }
        logger.info(`[DB NOTIFY] Channel: ${msg.channel} | Payload:`, payload);
        
        // 特定 channel 处理逻辑
        if (msg.channel === 'task_channel') {
          handleTaskNotification(payload);
        }
      } catch (err) {
        logger.error(`Failed to parse notification payload: ${msg.payload}`, err);
      }
    });

    await listenerClient.query('LISTEN task_channel');
    await listenerClient.query('LISTEN message_channel');
    logger.info(`PostgresTool: Listening to task_channel and message_channel.`);
  } catch (e) {
    logger.error(`PostgresTool: Listener setup failed. Error: ${e.message}`);
  }
}

// --- Task notification handler ---
async function handleTaskNotification(payload) {
  logger.info(`[TASK NOTIFY] Processing task notification:`, payload);
  
  // 根据通知类型自动处理
  switch (payload.type) {
    case 'TASK_ASSIGNED': {
      // 自动将任务更新为 IN_PROGRESS
      try {
        const sql = `
          UPDATE shared.tasks 
          SET status = 'IN_PROGRESS'
          WHERE id = $1 AND assignee = $2
          RETURNING id, title, status;
        `;
        const result = await query(sql, [payload.task_id, dbUsername]);
        if (result.length > 0) {
          logger.info(`[TASK NOTIFY] Task ${payload.task_id} updated to IN_PROGRESS`);
        }
      } catch (e) {
        logger.error(`[TASK NOTIFY] Failed to update task ${payload.task_id}: ${e.message}`);
      }
      break;
    }
      
    case 'TASK_COMPLETED': {
      // 标记任务为 COMPLETED
      try {
        const sql = `
          UPDATE shared.tasks 
          SET status = 'COMPLETED'
          WHERE id = $1 AND assignee = $2
          RETURNING id, title, status;
        `;
        const result = await query(sql, [payload.task_id, dbUsername]);
        if (result.length > 0) {
          logger.info(`[TASK NOTIFY] Task ${payload.task_id} updated to COMPLETED`);
        }
      } catch (e) {
        logger.error(`[TASK NOTIFY] Failed to update task ${payload.task_id}: ${e.message}`);
      }
      break;
    }
      
    case 'TASK_FAILED': {
      // 标记任务为 FAILED
      try {
        const sql = `
          UPDATE shared.tasks 
          SET status = 'FAILED'
          WHERE id = $1 AND assignee = $2
          RETURNING id, title, status;
        `;
        const result = await query(sql, [payload.task_id, dbUsername]);
        if (result.length > 0) {
          logger.info(`[TASK NOTIFY] Task ${payload.task_id} updated to FAILED`);
        }
      } catch (e) {
        logger.error(`[TASK NOTIFY] Failed to update task ${payload.task_id}: ${e.message}`);
      }
      break;
    }
      
    case 'TASK_COMPLETION_ACK':
      logger.info(`[TASK NOTIFY] Task completion acknowledged: ${payload.task_id}`);
      break;
      
    default:
      logger.info(`[TASK NOTIFY] Unknown task notification type: ${payload.type}`);
  }
}

// --- Helper to execute queries safely ---
async function query(text, params = [], timeoutMs = 30000) {
  if (!dbPool) throw new Error('Database not connected.');

  // 参数验证：拒绝空或非字符串的 SQL
  if (!text || typeof text !== 'string' || text.trim() === '') {
    logger.error('database_query called with empty sql');
    throw new Error('database_query: sql parameter must be a non-empty string');
  }

  // 创建查询超时控制器
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error('Query timeout')), timeoutMs);

  try {
    const res = await dbPool.query({
      text,
      values: params,
      signal: controller.signal
    });
    logger.info(`DB Query OK [${text.substring(0, 50)}...]: ${res.rowCount || 0} rows`);
    return res.rows;
  } catch (e) {
    if (e.name === 'AbortError') {
      logger.error(`DB Timeout [${text.substring(0, 50)}...]: Query exceeded ${timeoutMs}ms`);
      throw new Error(`Database Query Timeout: ${timeoutMs}ms`);
    }
    logger.error(`DB Error [${text}]: ${e.message}`);
    throw new Error(`Database Error: ${e.message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

export function buildPostgresTools() {
  if (!dbUsername || !logger) {
    throw new Error('PostgresTool not initialized. Call initPostgresTool() first.');
  }

  return [
    // 1. 底层能力保留 (给高级查询用)
    {
      name: 'database_query',
      description: 'Execute raw SQL. Use ONLY when semantic tools cannot fulfill the requirement.',
      parameters: Type.Object({
        sql: Type.String({ description: 'SQL query to execute' })
      }),
      async execute(_toolCallId, params) {
        if (!params || typeof params !== 'object') {
          logger.error(`database_query called with invalid params: ${typeof params}`);
          throw new Error('database_query: params must be an object');
        }
        const { sql } = params;
        if (!sql || typeof sql !== 'string' || sql.trim() === '') {
          logger.error(`database_query called with invalid sql: ${JSON.stringify(sql)}`);
          throw new Error('database_query: sql parameter is required and must be a non-empty string');
        }
        return query(sql);
      }
    },

    // 2. 任务流转机制
    {
      name: 'send_task',
      description: 'Create and assign a task to another department.',
      parameters: Type.Object({
        title: Type.String({ description: 'Task title' }),
        description: Type.String({ description: 'Task description (optional)' }),
        assignee: Type.String({ description: 'Real DB username of the target department, e.g., dev_user' }),
        priority: Type.Optional(
          Type.Unsafe<'P0' | 'P1' | 'P2' | 'P3'>({
            type: 'string',
            enum: ['P0', 'P1', 'P2', 'P3'],
            default: 'P2',
            description: 'Priority level'
          })
        ),
        tags: Type.Optional(
          Type.Array(Type.String({ description: 'Tag string' }))
        ),
        parent_task_id: Type.Optional(Type.Integer({ description: 'Parent task ID' }))
      }),
      async execute(_toolCallId, params) {
        if (!params || typeof params !== 'object') {
          logger.error(`send_task called with invalid params: ${typeof params}`);
          throw new Error('send_task: params must be an object');
        }
        const { title, description, assignee, priority, tags, parent_task_id } = params;
        
        // 严格参数验证
        const safeTitle = typeof title === 'string' ? title.trim() : '';
        const safeAssignee = typeof assignee === 'string' ? assignee.trim() : '';
        
        if (!safeTitle) {
          logger.error(`send_task called with invalid title: ${JSON.stringify(title)}`);
          throw new Error('send_task: title is required and must be a non-empty string');
        }
        if (!safeAssignee) {
          logger.error(`send_task called with invalid assignee: ${JSON.stringify(assignee)}`);
          throw new Error('send_task: assignee is required and must be a non-empty string');
        }
        
        const sql = `
          INSERT INTO shared.tasks (title, description, assignee, requester, priority, tags, parent_task_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, status, created_at;
        `;
        const values = [
          safeTitle,
          typeof description === 'string' ? description : '',
          safeAssignee,
          dbUsername,
          typeof priority === 'string' ? priority : 'P2',
          Array.isArray(tags) ? tags : [],
          typeof parent_task_id === 'number' ? parent_task_id : null
        ];
        return query(sql, values);
      }
    },
    {
      name: 'get_my_tasks',
      description: 'Fetch pending/in-progress tasks assigned to your department, or tasks requested by you.',
      parameters: Type.Object({
        role: Type.Optional(
          Type.Unsafe<'assignee' | 'requester' | 'both'>({
            type: 'string',
            enum: ['assignee', 'requester', 'both'],
            default: 'both',
            description: 'Filter by role'
          })
        ),
        status: Type.Optional(Type.String({ description: 'Filter by status (e.g. PENDING)' })),
        limit: Type.Optional(Type.Integer({ description: 'Max results (default: 10)' }))
      }),
      async execute(_toolCallId, params) {
        if (!params || typeof params !== 'object') {
          logger.error(`get_my_tasks called with invalid params: ${typeof params}`);
          throw new Error('get_my_tasks: params must be an object');
        }
        const { role, status, limit } = params;
        let conditions = [];
        if (role === 'assignee') conditions.push(`assignee = '${dbUsername}'`);
        else if (role === 'requester') conditions.push(`requester = '${dbUsername}'`);
        else conditions.push(`(assignee = '${dbUsername}' OR requester = '${dbUsername}')`);
        
        let statusFilter = '';
        if (status) statusFilter = `AND status = '${status}'`;

        const sql = `
          SELECT id, title, status, priority, requester, assignee, created_at 
          FROM shared.tasks 
          WHERE ${conditions.join(' OR ')} ${statusFilter}
          ORDER BY created_at DESC 
          LIMIT $1;
        `;
        return query(sql, [limit || 10]);
      }
    },
    {
      name: 'update_task_status',
      description: 'Update the status or result of a task assigned to you.',
      parameters: Type.Object({
        task_id: Type.Integer({ description: 'Task ID' }),
        status: Type.Unsafe<'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'FAILED'>({
          type: 'string',
          enum: ['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'FAILED'],
          description: 'New status'
        }),
        result: Type.Optional(Type.String({ description: 'Execution result or linked artifacts summary' }))
      }),
      async execute(_toolCallId, params) {
        if (!params || typeof params !== 'object') {
          logger.error(`update_task_status called with invalid params: ${typeof params}`);
          throw new Error('update_task_status: params must be an object');
        }
        const { task_id, status, result } = params;
        const sql = `
          UPDATE shared.tasks 
          SET status = $1, result = COALESCE($2, result)
          WHERE id = $3 AND (assignee = $4 OR requester = $4)
          RETURNING id, title, status, result;
        `;
        return query(sql, [status, result || null, task_id, dbUsername]);
      }
    },

    // 3. 通信与消息机制
    {
      name: 'send_message',
      description: 'Send an async message to another agent or broadcast to all.',
      parameters: Type.Object({
        to_agent: Type.Optional(Type.String({ description: 'Target DB username, e.g. dev_user. Leave empty to broadcast.' })),
        msg_type: Type.String({ description: 'e.g. REQUEST, NOTIFY, ALGORITHM_UPDATE' }),
        payload: Type.Object({}, { description: 'JSON structure with message content' })
      }),
      async execute(_toolCallId, params) {
        if (!params || typeof params !== 'object') {
          logger.error(`send_message called with invalid params: ${typeof params}`);
          throw new Error('send_message: params must be an object');
        }
        const { to_agent, msg_type, payload } = params;
        
        const safeMsgType = typeof msg_type === 'string' ? msg_type.trim() : '';
        
        if (!safeMsgType) {
          logger.error(`send_message called with invalid msg_type: ${JSON.stringify(msg_type)}`);
          throw new Error('send_message: msg_type is required and must be a non-empty string');
        }
        if (payload === undefined || payload === null || typeof payload !== 'object') {
          logger.error(`send_message called with invalid payload: ${typeof payload}`);
          throw new Error('send_message: payload is required and must be an object');
        }
        
        const sql = `
          INSERT INTO shared.inter_agent_messages (from_agent, to_agent, msg_type, payload)
          VALUES ($1, $2, $3, $4)
          RETURNING id, created_at;
        `;
        return query(sql, [dbUsername, typeof to_agent === 'string' ? to_agent : null, safeMsgType, payload]);
      }
    },
    {
      name: 'check_inbox',
      description: 'Read unread messages sent to you.',
      parameters: Type.Object({
        mark_read: Type.Optional(Type.Boolean({ description: 'Mark messages as read (default: true)' }))
      }),
      async execute(_toolCallId, params) {
        if (!params || typeof params !== 'object') {
          logger.error(`check_inbox called with invalid params: ${typeof params}`);
          throw new Error('check_inbox: params must be an object');
        }
        const { mark_read } = params;
        const sqlSelect = `
          SELECT id, from_agent, msg_type, payload, created_at 
          FROM shared.inter_agent_messages 
          WHERE (to_agent = $1 OR to_agent IS NULL) AND is_read = false
          ORDER BY created_at ASC;
        `;
        const messages = await query(sqlSelect, [dbUsername]);
        
        if (mark_read !== false && messages.length > 0) {
          const ids = messages.map(m => m.id);
          await query(`UPDATE shared.inter_agent_messages SET is_read = true WHERE id = ANY($1)`, [ids]);
        }
        return messages;
      }
    },

    // 4. 服务发现与心跳
    {
      name: 'heartbeat',
      description: 'Report that you are alive and optionally declare your current status.',
      parameters: Type.Object({
        status: Type.Optional(
          Type.Unsafe<'online' | 'busy' | 'offline'>({
            type: 'string',
            enum: ['online', 'busy', 'offline'],
            default: 'online',
            description: 'Current status'
          })
        ),
        current_task_id: Type.Optional(Type.Integer({ description: 'Current task ID' }))
      }),
      async execute(_toolCallId, params) {
        if (!params || typeof params !== 'object') {
          logger.error(`heartbeat called with invalid params: ${typeof params}`);
          throw new Error('heartbeat: params must be an object');
        }
        const { status, current_task_id } = params;
        const sql = `
          INSERT INTO shared.agent_heartbeats (db_username, status, current_task_id, last_seen_at)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
          ON CONFLICT (db_username) DO UPDATE 
          SET status = EXCLUDED.status, 
              current_task_id = EXCLUDED.current_task_id,
              last_seen_at = CURRENT_TIMESTAMP;
        `;
        await query(sql, [dbUsername, status || 'online', current_task_id || null]);
        return { success: true, timestamp: new Date().toISOString() };
      }
    },
    {
      name: 'lookup_department',
      description: 'Find a department based on capabilities. Useful for Orchestrator routing.',
      parameters: Type.Object({}),
      async execute(_toolCallId) {
        return query(`SELECT code, db_username, name, capabilities FROM shared.department_registry WHERE is_active = true`);
      }
    }
  ];
}

export async function shutdownPostgresTool() {
  if (listenerClient) {
    await listenerClient.query('UNLISTEN task_channel');
    await listenerClient.query('UNLISTEN message_channel');
    await listenerClient.release();
    listenerClient = null;
  }
  if (dbPool) {
    await dbPool.end();
    dbPool = null;
  }
}

export default {
  id: "postgres-tool",
  register(api) {
    const initPromise = initPostgresTool(api);
    
    // Register tools after initialization
    initPromise.then(() => {
      const tools = buildPostgresTools();
      for (const tool of tools) {
        api.registerTool(tool);
      }
    }).catch(err => {
      api.logger.error(`PostgresTool: Registration failed. Error: ${err.message}`);
    });

    return { initPromise };
  }
};
