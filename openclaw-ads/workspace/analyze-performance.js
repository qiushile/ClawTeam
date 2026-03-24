const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function analyzePerformance() {
  const client = await pool.connect();
  
  try {
    console.log('=== 投放数据分析报告 ===\n');
    console.log(`时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
    console.log(`分析周期：过去 7 天\n`);
    
    // 1. 整体表现概览
    console.log('【1】整体表现概览 (过去 7 天)');
    
    const overview = await client.query(`
      SELECT 
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        SUM(spend) as total_spend,
        SUM(conversions) as total_conversions,
        SUM(revenue) as total_revenue,
        AVG(roi) as avg_roi,
        AVG(ctr) as avg_ctr
      FROM ads_schema.daily_performance
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
    `);
    
    const o = overview.rows[0];
    const overallRoi = parseFloat(o.avg_roi).toFixed(2);
    const overallCtr = (parseFloat(o.avg_ctr) * 100).toFixed(2);
    const overallCpa = parseFloat(o.total_spend) / parseInt(o.total_conversions);
    
    console.log(`
    ┌─────────────────────────────────────────────────┐
    │  📊 整体投放表现                                │
    ├─────────────────────────────────────────────────┤
    │  展示量 (Impressions):     ${parseInt(o.total_impressions).toLocaleString()}          │
    │  点击量 (Clicks):          ${parseInt(o.total_clicks).toLocaleString()}           │
    │  花费 (Spend):            $${parseFloat(o.total_spend).toLocaleString('en-US', {minimumFractionDigits: 2})}        │
    │  转化数 (Conversions):     ${parseInt(o.total_conversions).toLocaleString()}           │
    │  收入 (Revenue):          $${parseFloat(o.total_revenue).toLocaleString('en-US', {minimumFractionDigits: 2})}       │
    ├─────────────────────────────────────────────────┤
    │  平均 ROI:                 ${overallRoi}x                      │
    │  平均 CTR:                 ${overallCtr}%                     │
    │  平均 CPA:                $${overallCpa.toFixed(2)}                      │
    └─────────────────────────────────────────────────┘
    `);
    
    // 2. 分渠道表现
    console.log('【2】分渠道表现分析');
    
    const byChannel = await client.query(`
      SELECT 
        channel,
        SUM(impressions) as impressions,
        SUM(clicks) as clicks,
        SUM(spend) as spend,
        SUM(conversions) as conversions,
        SUM(revenue) as revenue,
        AVG(roi) as avg_roi,
        AVG(ctr) as avg_ctr
      FROM ads_schema.daily_performance
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY channel
      ORDER BY spend DESC
    `);
    
    console.log('\n    渠道表现排名 (按花费):');
    console.log('    ' + '─'.repeat(75));
    console.log(`    ${'渠道'.padEnd(16)} ${'花费'.padStart(10)} ${'转化'.padStart(6)} ${'ROI'.padStart(8)} ${'CTR'.padStart(7)} ${'状态'}`);
    console.log('    ' + '─'.repeat(75));
    
    byChannel.rows.forEach(row => {
      const roi = parseFloat(row.avg_roi).toFixed(2);
      const ctr = (parseFloat(row.avg_ctr) * 100).toFixed(2);
      const roiStatus = roi >= 3 ? '✅ 优秀' : roi >= 2 ? '⚠️ 一般' : '❌ 需优化';
      
      console.log(`    ${row.channel.padEnd(16)} $${parseFloat(row.spend).toLocaleString().padStart(9)} ${parseInt(row.conversions).toString().padStart(6)} ${roi.padStart(8)}x ${(ctr+'%').padStart(7)} ${roiStatus}`);
    });
    console.log('    ' + '─'.repeat(75) + '\n');
    
    // 3. ROI 趋势分析
    console.log('【3】ROI 趋势分析 (按日期)');
    
    const trend = await client.query(`
      SELECT 
        date,
        SUM(spend) as spend,
        SUM(revenue) as revenue,
        SUM(revenue) / NULLIF(SUM(spend), 0) as roi
      FROM ads_schema.daily_performance
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date
    `);
    
    console.log('\n    日期          花费          收入          ROI     趋势');
    console.log('    ' + '─'.repeat(62));
    
    let prevRoi = 0;
    trend.rows.forEach((row) => {
      const roi = parseFloat(row.roi).toFixed(2);
      const change = prevRoi > 0 ? ((roi - prevRoi) / prevRoi * 100).toFixed(1) : 0;
      const arrow = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
      const changeStr = change !== 0 ? `${change > 0 ? '+' : ''}${change}%` : '0%';
      
      console.log(`    ${row.date}  $${parseFloat(row.spend).toLocaleString().padStart(9)}  $${parseFloat(row.revenue).toLocaleString().padStart(9)}  ${roi.padStart(6)}x  ${arrow} ${changeStr}`);
      prevRoi = roi;
    });
    console.log('    ' + '─'.repeat(62) + '\n');
    
    // 4. 异常检测与优化建议
    console.log('【4】异常检测与优化建议');
    
    const anomalies = [];
    
    const lowRoiChannels = byChannel.rows.filter(r => parseFloat(r.avg_roi) < 2);
    if (lowRoiChannels.length > 0) {
      lowRoiChannels.forEach(ch => {
        anomalies.push(`⚠️ ${ch.channel} ROI 偏低 (${parseFloat(ch.avg_roi).toFixed(2)}x)`);
        anomalies.push(`   → 检查广告素材质量和落地页转化率`);
      });
    }
    
    const lowCtrChannels = byChannel.rows.filter(r => parseFloat(r.avg_ctr) < 0.015);
    if (lowCtrChannels.length > 0) {
      lowCtrChannels.forEach(ch => {
        anomalies.push(`⚠️ ${ch.channel} CTR 偏低 (${(parseFloat(ch.avg_ctr)*100).toFixed(2)}%)`);
        anomalies.push(`   → A/B 测试新的广告创意`);
      });
    }
    
    if (anomalies.length === 0) {
      console.log('   ✅ 各渠道表现健康，无明显异常\n');
    } else {
      console.log('');
      anomalies.forEach(a => console.log('   ' + a));
      console.log('');
    }
    
    // 5. 素材状态
    console.log('【5】广告素材状态');
    
    const creativeStats = await client.query(`
      SELECT status, COUNT(*) as count FROM ads_schema.creatives GROUP BY status
    `);
    
    creativeStats.rows.forEach(row => {
      const statusMap = { 'pending_review': '⏳ 待审核', 'active': '✅ 投放中', 'paused': '⏸️ 已暂停' };
      console.log(`   ${statusMap[row.status] || row.status}: ${row.count} 个`);
    });
    
    const pendingCount = creativeStats.rows.find(r => r.status === 'pending_review')?.count || 0;
    if (pendingCount > 0) {
      console.log(`\n   💡 建议：审核并激活 ${pendingCount} 个待审核素材`);
    }
    
    console.log('\n');
    console.log('=== 分析报告完成 ===\n');
    
    console.log('📋 行动建议:');
    console.log('   1. 审核并激活待审核的广告素材');
    console.log('   2. 持续监控 ROI 趋势，优化低效渠道');
    console.log('   3. 每周进行一次全面的投放分析');
    
  } catch (e) {
    console.error('❌ 分析失败:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

analyzePerformance();
