const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 5000
});

async function runDailyTaskCheck() {
  let client;
  
  try {
    console.log('=== 每日任务兜底检查 ===');
    console.log(`时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
    console.log('');
    
    client = await pool.connect();
    
    // 步骤 1: 查询分配给 ads_user 的未完成任务
    console.log('【步骤 1】查询 ads_user 未完成任务...');
    const tasksResult = await client.query(`
      SELECT id, title, description, status, assignee, requester, created_at, updated_at
      FROM shared.tasks
      WHERE assignee = 'ads_user' 
        AND status NOT IN ('COMPLETED', 'FAILED', 'CANCELLED')
      ORDER BY 
        CASE status WHEN 'PENDING' THEN 0 WHEN 'IN_PROGRESS' THEN 1 ELSE 2 END,
        created_at ASC
    `);
    
    if (tasksResult.rows.length === 0) {
      console.log('✅ 无待处理任务');
      console.log('');
      console.log('=== 检查完成：无需汇报 ===');
      return;
    }
    
    console.log(`📋 找到 ${tasksResult.rows.length} 个未完成任务:`);
    tasksResult.rows.forEach(row => {
      console.log(`   - [${row.status}] #${row.id} ${row.title}`);
      console.log(`     请求方：${row.requester} | 创建时间：${row.created_at}`);
    });
    console.log('');
    
    // 步骤 2: 将 PENDING 任务更新为 IN_PROGRESS
    const pendingTasks = tasksResult.rows.filter(r => r.status === 'PENDING');
    
    if (pendingTasks.length > 0) {
      console.log('【步骤 2】更新 PENDING 任务为 IN_PROGRESS...');
      for (const task of pendingTasks) {
        await client.query(`
          UPDATE shared.tasks 
          SET status = 'IN_PROGRESS', updated_at = NOW()
          WHERE id = $1
        `, [task.id]);
        console.log(`   ✅ #${task.id} ${task.title} → IN_PROGRESS`);
        
        // 添加协作事件
        await client.query(`
          INSERT INTO shared.collaboration_events 
            (task_id, from_role, event_type, description)
          VALUES ($1, 'ads_user', 'RECEIVED_ACK', $2)
        `, [task.id, `已接单并开始处理：${task.title}`]);
      }
      console.log('');
    }
    
    // 步骤 3: 生成汇报内容
    console.log('【步骤 3】生成飞书汇报内容...');
    console.log('');
    console.log('=== 飞书汇报内容（供参考）===');
    console.log('');
    console.log('世乐，早！投放部每日任务检查汇报：');
    console.log('');
    console.log(`📊 当前待处理任务：${tasksResult.rows.length} 个`);
    console.log('');
    
    for (const task of tasksResult.rows) {
      const newStatus = task.status === 'PENDING' ? 'IN_PROGRESS' : task.status;
      console.log(`📌 #${task.id} ${task.title}`);
      console.log(`   状态：${newStatus} | 请求方：${task.requester}`);
      if (task.description) {
        console.log(`   描述：${task.description}`);
      }
      console.log('');
    }
    
    const todayPriority = pendingTasks.length > 0 
      ? `今天优先处理：${pendingTasks.map(t => t.title).join('、')}`
      : '今天优先处理：继续跟进已在进行中的任务';
    
    console.log(`🎯 ${todayPriority}`);
    console.log('');
    console.log('=== 检查完成 ===');
    
  } catch (e) {
    console.error('❌ 每日任务检查错误:', e.message);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

runDailyTaskCheck();
