const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function checkSalesData() {
  try {
    await client.connect();

    // 查询 sales_schema 中的所有表
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'sales_schema'
      ORDER BY table_name;
    `;

    const tablesResult = await client.query(tablesQuery);

    console.log('\n=== sales_schema 中的数据表 ===');
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  sales_schema 中没有数据表');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }

    // 尝试查询一些可能的转化数据表
    const possibleTables = ['leads', 'opportunities', 'deals', 'conversions', 'pipeline', 'customers'];

    console.log('\n=== 尝试查询关键转化数据 ===');

    for (const tableName of possibleTables) {
      const checkTableExists = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'sales_schema'
          AND table_name = '${tableName}'
        );
      `;

      const existsResult = await client.query(checkTableExists);

      if (existsResult.rows[0].exists) {
        console.log(`\n📊 ${tableName} 表存在`);

        // 查询昨天的数据（使用 UTC 时间）
        const yesterdayDataQuery = `
          SELECT COUNT(*) as count
          FROM sales_schema.${tableName}
          WHERE created_at >= (CURRENT_DATE - INTERVAL '1 day')::timestamp
            AND created_at < CURRENT_DATE::timestamp;
        `;

        const countResult = await client.query(yesterdayDataQuery);
        console.log(`   昨日新增: ${countResult.rows[0].count} 条`);

        // 查询今日数据
        const todayDataQuery = `
          SELECT COUNT(*) as count
          FROM sales_schema.${tableName}
          WHERE created_at >= CURRENT_DATE::timestamp;
        `;

        const todayResult = await client.query(todayDataQuery);
        console.log(`   今日新增: ${todayResult.rows[0].count} 条`);

        // 查询总数
        const totalQuery = `
          SELECT COUNT(*) as count
          FROM sales_schema.${tableName};
        `;

        const totalResult = await client.query(totalQuery);
        console.log(`   总计: ${totalResult.rows[0].count} 条`);
      }
    }

    await client.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSalesData();