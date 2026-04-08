const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function getSalesUserTasks() {
  try {
    await client.connect();

    // 查询分配给 sales_user 的任务（按照 SOUL.md 中的规范）
    const tasksQuery = `
      SELECT id, title, description, status, created_at, updated_at
      FROM shared.tasks
      WHERE assignee = 'sales_user'
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const result = await client.query(tasksQuery);
    console.log(JSON.stringify(result.rows, null, 2));

    await client.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

getSalesUserTasks();