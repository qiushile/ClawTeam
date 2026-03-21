const { default: pg } = await import('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  // 检查部门注册表结构和数据
  const depts = await pool.query(`
    SELECT *
    FROM shared.department_registry
    ORDER BY department_name;
  `);

  console.log('=== 部门注册表 ===');
  if (depts.rows.length === 0) {
    console.log('✅ 无部门注册记录');
  } else {
    console.log(`列: ${Object.keys(depts.rows[0]).join(', ')}`);
    depts.rows.forEach(dept => {
      console.log(`\n  ${JSON.stringify(dept)}`);
    });
  }

  // 同时检查 agent_heartbeats
  console.log('\n\n=== Agent 心跳记录 (最近10条) ===');
  const heartbeats = await pool.query(`
    SELECT *
    FROM shared.agent_heartbeats
    ORDER BY heartbeat_time DESC
    LIMIT 10;
  `);
  
  if (heartbeats.rows.length === 0) {
    console.log('✅ 无心跳记录');
  } else {
    console.log(`列: ${Object.keys(heartbeats.rows[0]).join(', ')}`);
    heartbeats.rows.forEach(hb => {
      console.log(`\n  ${JSON.stringify(hb)}`);
    });
  }

} catch (error) {
  console.error('错误:', error.message);
} finally {
  await pool.end();
}