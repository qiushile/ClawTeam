const { default: pg } = await import('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  // 检查部门注册表
  const depts = await pool.query(`
    SELECT id, department_name, db_username, contact_channel, is_active
    FROM shared.department_registry
    ORDER BY id;
  `);

  console.log('=== 部门注册表 ===');
  if (depts.rows.length === 0) {
    console.log('✅ 无部门注册记录');
  } else {
    depts.rows.forEach(dept => {
      console.log(`  [${dept.id}] ${dept.department_name} (${dept.db_username})`);
      console.log(`       渠道: ${dept.contact_channel} | 激活: ${dept.is_active}`);
    });
  }

} catch (error) {
  console.error('错误:', error.message);
} finally {
  await pool.end();
}