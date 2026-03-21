const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function checkSalesData() {
  try {
    await client.connect();

    // 检查 shared.tasks 表的任务分布
    const tasksByStatus = await client.query(`
      SELECT status, COUNT(*) as count
      FROM shared.tasks
      WHERE assignee = 'sales'
      GROUP BY status
    `);

    // 检查是否有 collaboration_events
    const recentEvents = await client.query(`
      SELECT event_type, created_at
      FROM shared.collaboration_events
      WHERE from_role = 'sales'
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // 检查 sales_schema 的表
    const salesTables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'sales_schema'
      LIMIT 10
    `);

    console.log('=== Sales Tasks by Status ===');
    console.log(JSON.stringify(tasksByStatus.rows, null, 2));
    console.log('\n=== Recent Sales Collaboration Events ===');
    console.log(JSON.stringify(recentEvents.rows, null, 2));
    console.log('\n=== Sales Schema Tables ===');
    console.log(JSON.stringify(salesTables.rows, null, 2));

    await client.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSalesData();