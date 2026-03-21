const { default: pg } = await import('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  // 记录 heartbeat 事件
  await pool.query(`
    INSERT INTO shared.collaboration_events (task_id, from_role, to_role, event_type, message)
    VALUES (NULL, 'sales', 'system', 'HEARTBEAT_REPORT', $1)
  `, ['Sales 部门心跳报告已完成，无待处理任务，待命中...']);
  
  console.log('✅ 协作事件已记录');
} catch (error) {
  console.error('❌ 记录事件失败:', error.message);
} finally {
  await pool.end();
}