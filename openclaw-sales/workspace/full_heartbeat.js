const { default: pg } = await import('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  console.log('========== Sales 部门心跳报告 ==========');
  console.log(`时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  
  // 1. 检查待处理任务
  console.log('\n📋 【待处理任务】');
  const tasks = await pool.query(`
    SELECT id, title, description, status, priority, requester, assignee, created_at
    FROM shared.tasks
    WHERE assignee = 'sales_user'
      AND status IN ('PENDING', 'IN_PROGRESS')
    ORDER BY 
      CASE priority WHEN 'P0' THEN 1 WHEN 'P1' THEN 2 WHEN 'P2' THEN 3 WHEN 'P3' THEN 4 ELSE 5 END,
      created_at ASC;
  `);

  if (tasks.rows.length === 0) {
    console.log('  ✅ 无待处理任务');
  } else {
    tasks.rows.forEach(task => {
      const priorityEmoji = task.priority === 'P0' ? '🔴' : task.priority === 'P1' ? '🟠' : task.priority === 'P2' ? '🟡' : '🟢';
      console.log(`\n  ${priorityEmoji} 任务 #${task.id}: ${task.title}`);
      console.log(`     状态: ${task.status} | 请求方: ${task.requester}`);
      console.log(`     创建时间: ${new Date(task.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
      if (task.description) console.log(`     描述: ${task.description.substring(0, 100)}${task.description.length > 100 ? '...' : ''}`);
    });
  }

  // 2. 检查部门注册信息
  console.log('\n🏢 【部门注册信息】');
  const dept = await pool.query(`
    SELECT code, name, db_username, capabilities, is_active
    FROM shared.department_registry
    WHERE code = 'sales';
  `);

  if (dept.rows.length === 0) {
    console.log('  ⚠️  Sales 部门未注册');
  } else {
    const d = dept.rows[0];
    console.log(`  部门代码: ${d.code}`);
    console.log(`  部门名称: ${d.name}`);
    console.log(`  数据库用户: ${d.db_username}`);
    console.log(`  能力描述: ${d.capabilities || '无'}`);
    console.log(`  激活状态: ${d.is_active ? '✅ 已激活' : '❌ 未激活'}`);
  }

  // 3. 更新心跳记录
  await pool.query(`
    INSERT INTO shared.agent_heartbeats (db_username, status, metadata)
    VALUES ($1, 'online', $2)
    ON CONFLICT (db_username) DO UPDATE SET
      last_seen_at = CURRENT_TIMESTAMP,
      status = 'online',
      metadata = EXCLUDED.metadata;
  `, ['sales_user', JSON.stringify({
    timestamp: new Date().toISOString(),
    timezone: 'Asia/Shanghai',
    pending_tasks: tasks.rows.length,
    last_check: 'heartbeat_report'
  })]);

  console.log('\n💓 【心跳状态】');
  console.log('  ✅ 已更新心跳记录');

  // 4. 24小时内协作事件
  console.log('\n🤝 【最近协作事件】(24小时内)');
  const events = await pool.query(`
    SELECT id, task_id, from_role, to_role, event_type, message, created_at
    FROM shared.collaboration_events
    WHERE (from_role = 'sales' OR to_role = 'sales')
      AND created_at > NOW() - INTERVAL '24 hours'
    ORDER BY created_at DESC
    LIMIT 5;
  `);

  if (events.rows.length === 0) {
    console.log('  ✅ 无新协作事件');
  } else {
    events.rows.forEach(evt => {
      console.log(`\n  [${evt.event_type}] ${evt.from_role} → ${evt.to_role}`);
      console.log(`     时间: ${new Date(evt.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
      if (evt.task_id) console.log(`     关联任务: #${evt.task_id}`);
      if (evt.message) console.log(`     消息: ${evt.message.substring(0, 60)}${evt.message.length > 60 ? '...' : ''}`);
    });
  }

  // 5. 今日高优待办总结
  console.log('\n📝 【今日高优待办】');
  if (tasks.rows.length === 0) {
    console.log('  ✅ 所有任务已清零，待命中...');
  } else {
    console.log(`  共有 ${tasks.rows.length} 个待处理任务，优先级排序如下:`);
    tasks.rows.forEach((task, idx) => {
      const priorityEmoji = task.priority === 'P0' ? '🔴' : task.priority === 'P1' ? '🟠' : task.priority === 'P2' ? '🟡' : '🟢';
      console.log(`  ${idx + 1}. ${priorityEmoji} ${task.title}`);
    });
  }

  console.log('\n==========================================');

} catch (error) {
  console.error('❌ 错误:', error.message);
  console.error(error.stack);
} finally {
  await pool.end();
}