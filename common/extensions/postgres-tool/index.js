/**
 * Shared Postgres Tool for OpenClaw Instances
 * Deployed via ClawTeam volume mapping.
 */
class PostgresTool {
  #pool = null;
  #logger;

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

    try {
      const { default: pg } = await import('pg');
      this.#pool = new pg.Pool({ connectionString });
      this.#logger.info('PostgresTool: Connected to DB.');
    } catch (e) {
      this.#logger.error('PostgresTool: Failed to load pg driver or connect.', e);
    }
  }

  get tools() {
    return [
      {
        name: 'database_query',
        description: 'Execute SQL on the department-assigned database schema.',
        parameters: {
          type: 'object',
          properties: {
            sql: { type: 'string' }
          },
          required: ['sql']
        },
        execute: async ({ sql }) => {
          if (!this.#pool) throw new Error('Database not connected.');
          const res = await this.#pool.query(sql);
          return res.rows;
        }
      }
    ];
  }

  async shutdown() {
    if (this.#pool) await this.#pool.end();
  }
}

export default {
  id: "postgres-tool",
  register(api) {
    const instance = new PostgresTool(api);
    // 显式注册工具
    for (const tool of instance.tools) {
      api.registerTool(tool);
    }
    return instance;
  }
};

