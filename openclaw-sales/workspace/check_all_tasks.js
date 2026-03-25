const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    // 查询所有 sales_user 相关的任务
    const allTasks = await pool.query(`
      SELECT id, title, status, priority, assignee, created_at
      FROM shared.tasks
      WHERE assignee = 'sales_user'
      ORDER BY created_at DESC
      LIMIT 20;
    `);
    console.log('Sales Tasks (All):', JSON.stringify(allTasks.rows, null, 2));

    // 查询最新的任务
    const recentTasks = await pool.query(`
      SELECT id, title, status, assignee, created_at
      FROM shared.tasks
      ORDER BY created_at DESC
      LIMIT 10;
    `);
    console.log('\nRecent Tasks (All):', JSON.stringify(recentTasks.rows, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
})();