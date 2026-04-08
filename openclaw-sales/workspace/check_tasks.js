const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://sales_user:sales_pass_123@postgres-db:5432/openclaw_db'
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // 查询分配给 sales_user 的 PENDING 任务
    const tasksQuery = `
      SELECT * FROM shared.tasks
      WHERE assignee = 'sales_user' AND status = 'PENDING'
      ORDER BY created_at DESC;
    `;

    const result = await client.query(tasksQuery);
    console.log('\n=== 分配给 sales_user 的 PENDING 任务 ===');
    if (result.rows.length === 0) {
      console.log('没有待处理的任务');
    } else {
      result.rows.forEach((task, index) => {
        console.log(`\n任务 ${index + 1}:`);
        console.log(`  ID: ${task.id}`);
        console.log(`  标题: ${task.title}`);
        console.log(`  描述: ${task.description}`);
        console.log(`  创建时间: ${task.created_at}`);
        console.log(`  优先级: ${task.priority}`);
      });
    }

    // 查询协作事件
    const eventsQuery = `
      SELECT * FROM shared.collaboration_events
      WHERE from_role = 'sales_user' OR to_role = 'sales_user'
      ORDER BY created_at DESC
      LIMIT 10;
    `;

    const eventsResult = await client.query(eventsQuery);
    console.log('\n=== 最近的协作事件 ===');
    if (eventsResult.rows.length === 0) {
      console.log('没有协作事件');
    } else {
      eventsResult.rows.forEach((event, index) => {
        console.log(`\n事件 ${index + 1}:`);
        console.log(`  类型: ${event.event_type}`);
        console.log(`  从: ${event.from_role}`);
        console.log(`  到: ${event.to_role}`);
        console.log(`  消息: ${event.message}`);
        console.log(`  时间: ${event.created_at}`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

main();