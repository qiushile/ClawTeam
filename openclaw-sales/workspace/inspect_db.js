const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    // 查询 shared schema 表结构
    const sharedTables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'shared'
      ORDER BY table_name;
    `);
    console.log('Shared Tables:', JSON.stringify(sharedTables.rows.map(r => r.table_name), null, 2));

    // 查询 sales_schema 表结构
    const salesTables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'sales_schema'
      ORDER BY table_name;
    `);
    console.log('Sales Tables:', JSON.stringify(salesTables.rows.map(r => r.table_name), null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
})();