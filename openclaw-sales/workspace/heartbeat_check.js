const { default: pg } = await import('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  // 检查 sales 用户的待处理任务
  const result = await pool.query(`
    SELECT id, title, description, status, priority, requester, assignee, created_at, updated_at
    FROM shared.tasks
    WHERE assignee = 'sales_user'
      AND status IN ('PENDING', 'IN_PROGRESS')
    ORDER BY priority DESC, created_at ASC;
  `);

  console.log('=== Sales 部门待处理任务 ===');
  if (result.rows.length === 0) {
    console.log('✅ 无待处理任务');
  } else {
    result.rows.forEach(task => {
      console.log(`\n[任务 #${task.id}] ${task.title}`);
      console.log(`  状态: ${task.status} | 优先级: ${task.priority}`);
      console.log(`  创建时间: ${task.created_at}`);
      if (task.description) console.log(`  描述: ${task.description}`);
      if (task.tags && task.tags.length > 0) console.log(`  标签: ${task.tags.join(', ')}`);
    });
  }

  // 检查协作事件
  const events = await pool.query(`
    SELECT id, event_type, from_role, to_role, task_id, created_at
    FROM shared.collaboration_events
    WHERE (from_role = 'sales' OR to_role = 'sales')
      AND created_at > NOW() - INTERVAL '24 hours'
    ORDER BY created_at DESC
    LIMIT 10;
  `);

  console.log('\n\n=== 24小时内相关协作事件 ===');
  if (events.rows.length === 0) {
    console.log('✅ 无新协作事件');
  } else {
    events.rows.forEach(evt => {
      console.log(`\n[${evt.event_type}] ${evt.from_role} → ${evt.to_role}`);
      console.log(`  时间: ${evt.created_at}`);
      if (evt.task_id) console.log(`  任务ID: ${evt.task_id}`);
    });
  }

} catch (error) {
  console.error('错误:', error.message);
} finally {
  await pool.end();
}