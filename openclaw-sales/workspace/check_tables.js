const { default: pg } = await import('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  // 查看数据库中有哪些 schema 和表
  const schemas = await pool.query(`
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY table_schema, table_name;
  `);

  console.log('=== 数据库中的表 ===');
  if (schemas.rows.length === 0) {
    console.log('✅ 未找到用户自定义表');
  } else {
    schemas.rows.forEach(row => {
      console.log(`  [${row.table_schema}] ${row.table_name}`);
    });
  }

} catch (error) {
  console.error('错误:', error.message);
} finally {
  await pool.end();
}