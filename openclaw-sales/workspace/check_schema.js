const { default: pg } = await import('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  // 查看每个表的结构
  const tables = ['shared.tasks', 'shared.department_registry', 'shared.agent_heartbeats', 'shared.collaboration_events'];
  
  for (const table of tables) {
    console.log(`\n\n=== ${table} 表结构 ===`);
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'shared' AND table_name = '${table.split('.')[1]}'
      ORDER BY ordinal_position;
    `);
    
    if (columns.rows.length === 0) {
      console.log('  (表不存在或无列)');
    } else {
      columns.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? `DEFAULT ${col.column_default}` : '';
        console.log(`  ${col.column_name.padEnd(20)} ${col.data_type.padEnd(15)} ${nullable.padEnd(6)} ${defaultVal}`);
      });
    }
  }

} catch (error) {
  console.error('错误:', error.message);
} finally {
  await pool.end();
}