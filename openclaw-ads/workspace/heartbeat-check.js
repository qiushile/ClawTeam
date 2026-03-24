const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 5000
});

async function runHeartbeat() {
  let client;
  
  try {
    console.log('=== HEARTBEAT 任务执行报告 ===');
    console.log(`时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
    console.log('');
    
    client = await pool.connect();
    
    // 任务 1: 检查分配给 ads 的待处理任务
    console.log('【任务 1】检查 ads 待处理任务...');
    const tasksResult = await client.query(`
      SELECT id, title, status, assignee, requester, created_at
      FROM shared.tasks
      WHERE assignee = 'ads' AND status IN ('PENDING', 'IN_PROGRESS')
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    if (tasksResult.rows.length === 0) {
      console.log('✅ 无待处理的 ads 任务');
    } else {
      console.log(`📋 找到 ${tasksResult.rows.length} 个任务:`);
      tasksResult.rows.forEach(row => {
        console.log(`   - [${row.status}] #${row.id} ${row.title} (请求方：${row.requester})`);
      });
    }
    console.log('');
    
    // 任务 2: 检查 ROI 异常波动
    console.log('【任务 2】检查主要渠道 ROI 异常波动...');
    const schemaCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.schemata 
        WHERE schema_name = 'ads_schema'
      )
    `);
    
    if (!schemaCheck.rows[0].exists) {
      console.log('⚠️ ads_schema 尚未创建，无法分析 ROI 数据');
    } else {
      try {
        const roiResult = await client.query(`
          SELECT channel, date, roi, spend, conversions
          FROM ads_schema.daily_performance
          WHERE date >= CURRENT_DATE - INTERVAL '7 days'
          ORDER BY date DESC, channel
          LIMIT 20
        `);
        
        if (roiResult.rows.length === 0) {
          console.log('⚠️ 无 ROI 数据可分析');
        } else {
          console.log(`📊 最近 7 天投放数据 (${roiResult.rows.length} 条记录)`);
          const channels = {};
          roiResult.rows.forEach(row => {
            if (!channels[row.channel]) channels[row.channel] = [];
            channels[row.channel].push({ date: row.date, roi: parseFloat(row.roi) });
          });
          
          for (const [channel, data] of Object.entries(channels)) {
            if (data.length >= 2) {
              const latest = data[0].roi;
              const prev = data[1].roi;
              const change = ((latest - prev) / prev * 100).toFixed(1);
              const flag = Math.abs(change) > 20 ? '⚠️' : '✅';
              console.log(`   ${flag} ${channel}: ROI ${latest.toFixed(2)} (变动：${change}%)`);
            }
          }
        }
      } catch (e) {
        console.log(`⚠️ ROI 分析失败：${e.message}`);
      }
    }
    console.log('');
    
    // 任务 3: 投放素材审核
    console.log('【任务 3】执行投放素材审核...');
    if (!schemaCheck.rows[0].exists) {
      console.log('⚠️ ads_schema 尚未创建，无法审核素材');
    } else {
      try {
        const creativeResult = await client.query(`
          SELECT c.creative_id, c.creative_name, c.status, c.creative_type, 
                 c.impressions, c.clicks, c.ctr, c.created_at
          FROM ads_schema.creatives c
          WHERE c.status IN ('pending_review', 'active')
          ORDER BY c.created_at DESC
          LIMIT 10
        `);
        
        if (creativeResult.rows.length === 0) {
          console.log('✅ 无需审核的素材');
        } else {
          console.log(`📝 待审核/活跃素材 (${creativeResult.rows.length} 个):`);
          creativeResult.rows.forEach(row => {
            const ctr = row.ctr ? `${(parseFloat(row.ctr) * 100).toFixed(2)}%` : 'N/A';
            const clicks = row.clicks || 0;
            console.log(`   - [${row.status}] ${row.creative_name} (${row.creative_type}, CTR: ${ctr}, 点击：${clicks})`);
          });
        }
      } catch (e) {
        console.log(`⚠️ 素材审核失败：${e.message}`);
      }
    }
    console.log('');
    
    console.log('=== HEARTBEAT 执行完成 ===');
    
  } catch (e) {
    console.error('❌ HEARTBEAT 执行错误:', e.message);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

runHeartbeat();
