#!/usr/bin/env node

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function main() {
  try {
    // 1. 查询未完成任务
    const query = `
      SELECT id, title, description, status, priority, created_at
      FROM shared.tasks
      WHERE assignee = 'sales_user'
      AND status NOT IN ('COMPLETED', 'FAILED', 'CANCELLED')
      ORDER BY priority DESC, created_at ASC
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      console.log('NO_PENDING_TASKS');
      process.exit(0);
    }

    console.log('TASKS_FOUND');
    console.log(JSON.stringify(result.rows, null, 2));

    // 2. 更新 PENDING 任务为 IN_PROGRESS
    for (const row of result.rows) {
      if (row.status === 'PENDING') {
        await pool.query(
          'UPDATE shared.tasks SET status = $1, updated_at = NOW() WHERE id = $2',
          ['IN_PROGRESS', row.id]
        );
        console.log(`Task ${row.id} updated to IN_PROGRESS`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();