/**
 * Shared Postgres Tool for OpenClaw Instances
 * Includes raw SQL capability + High-level semantic tools for multi-agent collaboration.
 */
class PostgresTool {
  #pool = null;
  #listenerClient = null;
  #logger;
  #dbUsername;

  constructor(api) {
    this.#logger = api.logger;
    this.init();
  }

  async init() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      this.#logger.warn('PostgresTool: DATABASE_URL not found.');
      return;
    }

    // Extract db_username from connection string (e.g. postgresql://dev_user:pass@host/db)
    try {
      const urlMatches = connectionString.match(/:\/\/([^:]+):/);
      this.#dbUsername = urlMatches ? urlMatches[1] : 'unknown';
    } catch (e) {
      this.#dbUsername = 'unknown';
    }

    try {
      const { default: pg } = await import('pg');
      this.#pool = new pg.Pool({ connectionString });
      this.#logger.info(`PostgresTool: Connected to DB as ${this.#dbUsername}.`);

      // 启动专属监听客户端
      this.#startListener(pg, connectionString);
    } catch (e) {
      this.#logger.error(`PostgresTool: Initialization failed. Error: ${e.message}`);
    }
  }

  // --- Start async listener for realtime notifications ---
  async #startListener(pg, connectionString) {
    try {
      this.#listenerClient = new pg.Client({ connectionString });
      await this.#listenerClient.connect();
      
      this.#listenerClient.on('notification', (msg) => {
        try {
          const payload = JSON.parse(msg.payload);
          this.#logger.info(`[DB NOTIFY] Channel: ${msg.channel} | Payload:`, payload);
          // 可以在这里拓展：自动触发 agent 的 run 动作
        } catch (err) {
          this.#logger.error(`Failed to parse notification payload: ${msg.payload}`);
        }
      });

      await this.#listenerClient.query('LISTEN task_channel');
      await this.#listenerClient.query('LISTEN message_channel');
      this.#logger.info(`PostgresTool: Listening to task_channel and message_channel.`);
    } catch (e) {
      this.#logger.error(`PostgresTool: Listener setup failed. Error: ${e.message}`);
    }
  }

  // --- Helper to execute queries safely ---
  async #query(text, params = []) {
    if (!this.#pool) throw new Error('Database not connected.');
    try {
      const res = await this.#pool.query(text, params);
      return res.rows;
    } catch (e) {
      this.#logger.error(`DB Error [${text}]: ${e.message}`);
      throw new Error(`Database Error: ${e.message}`);
    }
  }

  get tools() {
    return [
      // 1. 底层能力保留 (给高级查询用)
      {
        name: 'database_query',
        description: 'Execute raw SQL. Use ONLY when semantic tools cannot fulfill the requirement.',
        parameters: {
          type: 'object',
          properties: { sql: { type: 'string' } },
          required: ['sql']
        },
        execute: async (args) => {
          const sql = args?.sql;
          if (!sql) {
            this.#logger.error(`database_query called with invalid sql: ${JSON.stringify(args)}`);
            throw new Error('database_query: sql parameter is required');
          }
          return this.#query(sql);
        }
      },

      // 2. 任务流转机制
      {
        name: 'send_task',
        description: 'Create and assign a task to another department.',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            assignee: { type: 'string', description: 'Real DB username of the target department, e.g., dev_user' },
            priority: { type: 'string', enum: ['P0', 'P1', 'P2', 'P3'], default: 'P2' },
            tags: { type: 'array', items: { type: 'string' } },
            parent_task_id: { type: 'integer' }
          },
          required: ['title', 'assignee']
        },
        execute: async (params) => {
          // 严格参数验证
          const title = typeof params?.title === 'string' ? params.title.trim() : '';
          const assignee = typeof params?.assignee === 'string' ? params.assignee.trim() : '';
          
          if (!title) {
            this.#logger.error(`send_task called with invalid title: ${JSON.stringify(params)}`);
            throw new Error('send_task: title is required and must be a non-empty string');
          }
          if (!assignee) {
            this.#logger.error(`send_task called with invalid assignee: ${JSON.stringify(params)}`);
            throw new Error('send_task: assignee is required and must be a non-empty string');
          }
          
          const sql = `
            INSERT INTO shared.tasks (title, description, assignee, requester, priority, tags, parent_task_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, status, created_at;
          `;
          const values = [
            title,
            typeof params?.description === 'string' ? params.description : '',
            assignee,
            this.#dbUsername,
            typeof params?.priority === 'string' ? params.priority : 'P2',
            Array.isArray(params?.tags) ? params.tags : [],
            typeof params?.parent_task_id === 'number' ? params.parent_task_id : null
          ];
          return this.#query(sql, values);
        }
      },
      {
        name: 'get_my_tasks',
        description: 'Fetch pending/in-progress tasks assigned to your department, or tasks requested by you.',
        parameters: {
          type: 'object',
          properties: {
            role: { type: 'string', enum: ['assignee', 'requester', 'both'], default: 'both' },
            status: { type: 'string', description: 'Filter by status (e.g. PENDING)' },
            limit: { type: 'integer', default: 10 }
          }
        },
        execute: async ({ role, status, limit }) => {
          let conditions = [];
          if (role === 'assignee') conditions.push(`assignee = '${this.#dbUsername}'`);
          else if (role === 'requester') conditions.push(`requester = '${this.#dbUsername}'`);
          else conditions.push(`(assignee = '${this.#dbUsername}' OR requester = '${this.#dbUsername}')`);
          
          let statusFilter = '';
          if (status) statusFilter = `AND status = '${status}'`;

          const sql = `
            SELECT id, title, status, priority, requester, assignee, created_at 
            FROM shared.tasks 
            WHERE ${conditions.join(' OR ')} ${statusFilter}
            ORDER BY created_at DESC 
            LIMIT $1;
          `;
          return this.#query(sql, [limit || 10]);
        }
      },
      {
        name: 'update_task_status',
        description: 'Update the status or result of a task assigned to you.',
        parameters: {
          type: 'object',
          properties: {
            task_id: { type: 'integer' },
            status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'FAILED'] },
            result: { type: 'string', description: 'Execution result or linked artifacts summary' }
          },
          required: ['task_id', 'status']
        },
        execute: async ({ task_id, status, result }) => {
          const sql = `
            UPDATE shared.tasks 
            SET status = $1, result = COALESCE($2, result)
            WHERE id = $3 AND (assignee = $4 OR requester = $4)
            RETURNING id, title, status, result;
          `;
          return this.#query(sql, [status, result || null, task_id, this.#dbUsername]);
        }
      },

      // 3. 通信与消息机制
      {
        name: 'send_message',
        description: 'Send an async message to another agent or broadcast to all.',
        parameters: {
          type: 'object',
          properties: {
            to_agent: { type: 'string', description: 'Target DB username, e.g. dev_user. Leave empty to broadcast.' },
            msg_type: { type: 'string', description: 'e.g. REQUEST, NOTIFY, ALGORITHM_UPDATE' },
            payload: { type: 'object', description: 'JSON structure with message content' }
          },
          required: ['msg_type', 'payload']
        },
        execute: async (params) => {
          // 严格参数验证
          const msgType = typeof params?.msg_type === 'string' ? params.msg_type.trim() : '';
          const payload = params?.payload;
          
          if (!msgType) {
            this.#logger.error(`send_message called with invalid msg_type: ${JSON.stringify(params)}`);
            throw new Error('send_message: msg_type is required and must be a non-empty string');
          }
          if (payload === undefined || payload === null || typeof payload !== 'object') {
            this.#logger.error(`send_message called with invalid payload: ${JSON.stringify(params)}`);
            throw new Error('send_message: payload is required and must be an object');
          }
          
          const sql = `
            INSERT INTO shared.inter_agent_messages (from_agent, to_agent, msg_type, payload)
            VALUES ($1, $2, $3, $4)
            RETURNING id, created_at;
          `;
          return this.#query(sql, [this.#dbUsername, typeof params?.to_agent === 'string' ? params.to_agent : null, msgType, payload]);
        }
      },
      {
        name: 'check_inbox',
        description: 'Read unread messages sent to you.',
        parameters: {
          type: 'object',
          properties: {
            mark_read: { type: 'boolean', default: true }
          }
        },
        execute: async ({ mark_read }) => {
          const sqlSelect = `
            SELECT id, from_agent, msg_type, payload, created_at 
            FROM shared.inter_agent_messages 
            WHERE (to_agent = $1 OR to_agent IS NULL) AND is_read = false
            ORDER BY created_at ASC;
          `;
          const messages = await this.#query(sqlSelect, [this.#dbUsername]);
          
          if (mark_read !== false && messages.length > 0) {
            const ids = messages.map(m => m.id);
            await this.#query(`UPDATE shared.inter_agent_messages SET is_read = true WHERE id = ANY($1)`, [ids]);
          }
          return messages;
        }
      },

      // 4. 服务发现与心跳
      {
        name: 'heartbeat',
        description: 'Report that you are alive and optionally declare your current status.',
        parameters: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['online', 'busy', 'offline'], default: 'online' },
            current_task_id: { type: 'integer' }
          }
        },
        execute: async ({ status, current_task_id }) => {
          const sql = `
            INSERT INTO shared.agent_heartbeats (db_username, status, current_task_id, last_seen_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            ON CONFLICT (db_username) DO UPDATE 
            SET status = EXCLUDED.status, 
                current_task_id = EXCLUDED.current_task_id,
                last_seen_at = CURRENT_TIMESTAMP;
          `;
          await this.#query(sql, [this.#dbUsername, status || 'online', current_task_id || null]);
          return { success: true, timestamp: new Date().toISOString() };
        }
      },
      {
        name: 'lookup_department',
        description: 'Find a department based on capabilities. Useful for Orchestrator routing.',
        parameters: {
          type: 'object',
          properties: {}
        },
        execute: async () => {
          return this.#query(`SELECT code, db_username, name, capabilities FROM shared.department_registry WHERE is_active = true`);
        }
      }
    ];
  }

  async shutdown() {
    if (this.#listenerClient) {
      await this.#listenerClient.end();
    }
    if (this.#pool) {
      await this.#pool.end();
    }
  }
}

export default {
  id: "postgres-tool",
  register(api) {
    const instance = new PostgresTool(api);
    for (const tool of instance.tools) {
      api.registerTool(tool);
    }
    return instance;
  }
};
