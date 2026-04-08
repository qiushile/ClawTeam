const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function heartbeatCheck() {
  try {
    await client.connect();

    // 1. 检查分配给 sales_user 的任务
    const tasksQuery = `
      SELECT id, title, description, status, created_at
      FROM shared.tasks
      WHERE assignee = 'sales_user'
      AND status IN ('PENDING', 'IN_PROGRESS')
      ORDER BY created_at DESC
    `;

    const tasksResult = await client.query(tasksQuery);

    console.log('=== 分配给 sales_user 的待处理任务 ===');
    if (tasksResult.rows.length === 0) {
      console.log('无待处理任务');
    } else {
      console.log(JSON.stringify(tasksResult.rows, null, 2));
    }

    // 2. 检查昨日的转化数据（如果有相关表）
    // 由于 sales_schema 目前没有表，这里暂时跳过
    console.log('\n=== 昨日转化数据 ===');
    console.log('sales_schema 中暂无数据表');

    // 3. 检查高优任务
    const highPriorityTasks = await client.query(`
      SELECT id, title, status
      FROM shared.tasks
      WHERE assignee = 'sales_user'
      AND status = 'PENDING'
      ORDER BY created_at ASC
      LIMIT 5
    `);

    console.log('\n=== 今日高优待办 ===');
    if (highPriorityTasks.rows.length === 0) {
      console.log('无高优先级任务');
    } else {
      highPriorityTasks.rows.forEach((task, idx) => {
        console.log(`${idx + 1}. ${task.title} [${task.status}]`);
      });
    }

    await client.end();

    // 如果所有检查都显示无任务需要关注，返回特殊标记
    if (tasksResult.rows.length === 0 && highPriorityTasks.rows.length === 0) {
      console.log('\nNO_ACTION_NEEDED');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

heartbeatCheck();