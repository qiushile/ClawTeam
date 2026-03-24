const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seedPerformanceData() {
  const client = await pool.connect();
  
  try {
    console.log('=== 生成模拟投放效果数据 ===\n');
    console.log(`时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`);
    
    const channels = ['Google Search', 'Google Display', 'Meta Feed', 'Meta Stories'];
    const today = new Date();
    
    console.log('【1】插入 8 天效果数据...\n');
    
    for (let day = 7; day >= 0; day--) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      const dateStr = date.toISOString().split('T')[0];
      
      for (const channel of channels) {
        const baseImpressions = channel.includes('Search') ? 50000 : 80000;
        const variance = 0.8 + Math.random() * 0.4;
        const impressions = Math.floor(baseImpressions * variance * (1 + (7-day)*0.05));
        
        const baseCtr = channel.includes('Search') ? 0.035 : 0.012;
        const ctr = baseCtr * (0.9 + Math.random() * 0.2);
        const clicks = Math.floor(impressions * ctr);
        
        const baseCpc = channel.includes('Search') ? 2.5 : 0.8;
        const spend = parseFloat((clicks * baseCpc * (0.9 + Math.random() * 0.2)).toFixed(2));
        
        const conversionRate = 0.04 + Math.random() * 0.03;
        const conversions = Math.floor(clicks * conversionRate);
        
        const revenue = parseFloat((conversions * (150 + Math.random() * 100)).toFixed(2));
        const roi = spend > 0 ? parseFloat((revenue / spend).toFixed(4)) : 0;
        const cpc = clicks > 0 ? parseFloat((spend / clicks).toFixed(4)) : 0;
        const cpa = conversions > 0 ? parseFloat((spend / conversions).toFixed(4)) : 0;
        
        // 先删除可能存在的重复记录
        await client.query(`
          DELETE FROM ads_schema.daily_performance 
          WHERE channel = $1 AND date = $2
        `, [channel, dateStr]);
        
        // 插入新记录
        await client.query(`
          INSERT INTO ads_schema.daily_performance 
          (channel, date, impressions, clicks, spend, conversions, revenue, roi, ctr, cpc, cpa)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          channel, dateStr, impressions, clicks, spend, conversions, revenue, roi,
          parseFloat(ctr.toFixed(4)), cpc, cpa
        ]);
      }
    }
    
    console.log('   ✅ 已生成 8 天 × 4 渠道 = 32 条效果数据\n');
    
    // 验证数据
    const count = await client.query(`
      SELECT COUNT(*) as total, MIN(date) as min_date, MAX(date) as max_date
      FROM ads_schema.daily_performance
    `);
    
    console.log('【2】数据验证】');
    console.log(`   总记录数：${count.rows[0].total} 条`);
    console.log(`   日期范围：${count.rows[0].min_date} 至 ${count.rows[0].max_date}\n`);
    
    console.log('=== 数据 seeding 完成 ===\n');
    
  } catch (e) {
    console.error('❌ Seeding 失败:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seedPerformanceData();
