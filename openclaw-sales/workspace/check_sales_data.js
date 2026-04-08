const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://sales_user:sales_pass_123@postgres-db:5432/openclaw_db'
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // 查询 sales_schema 中的所有表
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'sales_schema'
      ORDER BY table_name;
    `;

    const tablesResult = await client.query(tablesQuery);
    console.log('\n=== sales_schema 中的表 ===');
    if (tablesResult.rows.length === 0) {
      console.log('sales_schema 中没有表');
    } else {
      tablesResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.table_name}`);
      });
    }

    // 检查是否有线索相关的表
    const leadsTable = tablesResult.rows.find(row => row.table_name.toLowerCase().includes('lead') || row.table_name.toLowerCase().includes('线索'));
    const oppsTable = tablesResult.rows.find(row => row.table_name.toLowerCase().includes('opp') || row.table_name.toLowerCase().includes('商机') || row.table_name.toLowerCase().includes('opportunity'));
    const dealsTable = tablesResult.rows.find(row => row.table_name.toLowerCase().includes('deal') || row.table_name.toLowerCase().includes('成交'));

    console.log('\n=== 昨日转化数据汇总 ===');
    console.log('日期:', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (leadsTable) {
      const newLeadsQuery = `
        SELECT COUNT(*) as count
        FROM sales_schema.${leadsTable.table_name}
        WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day';
      `;
      const newLeadsResult = await client.query(newLeadsQuery);
      console.log(`\n新线索数: ${newLeadsResult.rows[0].count}`);
    }

    if (oppsTable) {
      const newOppsQuery = `
        SELECT COUNT(*) as count
        FROM sales_schema.${oppsTable.table_name}
        WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day';
      `;
      const newOppsResult = await client.query(newOppsQuery);
      console.log(`新商机数: ${newOppsResult.rows[0].count}`);

      const wonOppsQuery = `
        SELECT COUNT(*) as count
        FROM sales_schema.${oppsTable.table_name}
        WHERE DATE(updated_at) = CURRENT_DATE - INTERVAL '1 day'
        AND status ILIKE '%won%' OR status ILIKE '%成交%' OR stage ILIKE '%won%' OR stage ILIKE '%成交%';
      `;
      const wonOppsResult = await client.query(wonOppsQuery);
      console.log(`成交商机数: ${wonOppsResult.rows[0].count}`);
    }

    if (dealsTable) {
      const dealsQuery = `
        SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total_amount
        FROM sales_schema.${dealsTable.table_name}
        WHERE DATE(updated_at) = CURRENT_DATE - INTERVAL '1 day';
      `;
      const dealsResult = await client.query(dealsQuery);
      console.log(`\n成交订单数: ${dealsResult.rows[0].count}`);
      console.log(`成交金额: ¥${dealsResult.rows[0].total_amount}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

main();