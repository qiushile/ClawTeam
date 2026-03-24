const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkSchema() {
  const client = await pool.connect();
  
  try {
    console.log('=== 数据库 Schema 检查 ===\n');
    
    // 检查 shared.tasks 表结构
    console.log('【shared.tasks 表结构】');
    const tasksCols = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'shared' AND table_name = 'tasks'
      ORDER BY ordinal_position
    `);
    tasksCols.rows.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    console.log('');
    
    // 检查 shared.collaboration_events 表结构
    console.log('【shared.collaboration_events 表结构】');
    const eventsCols = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'shared' AND table_name = 'collaboration_events'
      ORDER BY ordinal_position
    `);
    if (eventsCols.rows.length > 0) {
      eventsCols.rows.forEach(col => {
        console.log(`   ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('   (表不存在或无列)');
    }
    console.log('');
    
    // 检查 ads_schema 有哪些表
    console.log('【ads_schema 表列表】');
    const adsTables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'ads_schema'
      ORDER BY table_name
    `);
    if (adsTables.rows.length > 0) {
      adsTables.rows.forEach(t => console.log(`   - ${t.table_name}`));
    } else {
      console.log('   (ads_schema 不存在或无表)');
    }
    console.log('');
    
    // 检查当前 shared.tasks 中的数据
    console.log('【shared.tasks 数据样例】');
    const tasksData = await client.query(`SELECT * FROM shared.tasks LIMIT 5`);
    if (tasksData.rows.length > 0) {
      console.log(JSON.stringify(tasksData.rows, null, 2));
    } else {
      console.log('   (无数据)');
    }
    
  } catch (e) {
    console.error('❌ Schema 检查错误:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema();
