const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createCampaign() {
  const client = await pool.connect();
  
  try {
    console.log('=== 创建广告投放活动 ===\n');
    console.log(`时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`);
    
    // 1. 查询可用渠道
    console.log('【1】查询可用渠道...');
    const channels = await client.query('SELECT channel_id, channel_name, platform FROM ads_schema.channels WHERE status = \'active\'');
    console.log(`   找到 ${channels.rows.length} 个活跃渠道:`);
    channels.rows.forEach(ch => {
      console.log(`      [${ch.channel_id}] ${ch.channel_name} (${ch.platform})`);
    });
    console.log('');
    
    // 2. 创建广告活动
    console.log('【2】创建广告活动...');
    
    const campaigns = [
      {
        name: '2026 Q1 品牌认知 campaign - Google Search',
        channel_id: 1, // Google Search
        objective: 'brand_awareness',
        total_budget: 50000,
        daily_budget: 1500,
        bid_strategy: 'target_impression_share',
        start_date: '2026-03-24',
        end_date: '2026-06-30'
      },
      {
        name: '2026 Q1 转化驱动 campaign - Meta Feed',
        channel_id: 3, // Meta Feed
        objective: 'conversions',
        total_budget: 30000,
        daily_budget: 1000,
        bid_strategy: 'lowest_cost_with_bid_cap',
        start_date: '2026-03-24',
        end_date: '2026-06-30'
      },
      {
        name: '2026 Q1 再营销 campaign - Google Display',
        channel_id: 2, // Google Display
        objective: 'remarketing',
        total_budget: 15000,
        daily_budget: 500,
        bid_strategy: 'target_roas',
        start_date: '2026-03-24',
        end_date: '2026-06-30'
      }
    ];
    
    for (const camp of campaigns) {
      const result = await client.query(`
        INSERT INTO ads_schema.campaigns (
          campaign_name, channel_id, objective, status,
          start_date, end_date, total_budget, daily_budget, bid_strategy,
          targeting_config, created_at
        ) VALUES ($1, $2, $3, 'active', $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        RETURNING campaign_id
      `, [
        camp.name,
        camp.channel_id,
        camp.objective,
        camp.start_date,
        camp.end_date,
        camp.total_budget,
        camp.daily_budget,
        camp.bid_strategy,
        JSON.stringify({
          locations: ['CN', 'US', 'SG'],
          age_range: '25-54',
          interests: ['business', 'technology', 'marketing']
        })
      ]);
      
      const campaignId = result.rows[0].campaign_id;
      console.log(`   ✅ 已创建：${camp.name} (ID: ${campaignId})`);
    }
    console.log('');
    
    // 3. 创建广告组
    console.log('【3】创建广告组...');
    
    const adGroups = [
      { campaign_name: 'Google Search', group_name: '品牌词组', bid: 2.5 },
      { campaign_name: 'Google Search', group_name: '竞品词组', bid: 3.0 },
      { campaign_name: 'Google Search', group_name: '通用词组', bid: 1.8 },
      { campaign_name: 'Meta Feed', group_name: '25-34 岁女性', bid: 1.2 },
      { campaign_name: 'Meta Feed', group_name: '35-44 岁男性', bid: 1.5 },
      { campaign_name: 'Google Display', group_name: '再营销 - 网站访客', bid: 0.8 },
      { campaign_name: 'Google Display', group_name: '再营销 - APP 用户', bid: 1.0 }
    ];
    
    for (const ag of adGroups) {
      const campResult = await client.query(`
        SELECT campaign_id FROM ads_schema.campaigns WHERE campaign_name LIKE $1
      `, [`%${ag.campaign_name}%`]);
      
      if (campResult.rows.length > 0) {
        const campaignId = campResult.rows[0].campaign_id;
        await client.query(`
          INSERT INTO ads_schema.ad_groups (
            ad_group_name, campaign_id, status, bid_amount,
            targeting_config, created_at
          ) VALUES ($1, $2, 'active', $3, $4, CURRENT_TIMESTAMP)
        `, [
          ag.group_name,
          campaignId,
          ag.bid,
          JSON.stringify({ placements: 'auto', devices: ['mobile', 'desktop'] })
        ]);
        console.log(`   ✅ 已创建：${ag.campaign_name} - ${ag.group_name} (bid: $${ag.bid})`);
      }
    }
    console.log('');
    
    // 4. 创建素材
    console.log('【4】创建广告素材...');
    
    const creatives = [
      {
        group_pattern: '品牌词组',
        name: '搜索广告 - 品牌词素材 A',
        type: 'search_ad',
        headline: '专业投放解决方案 | 提升 ROI 300%',
        description: 'AI 驱动的智能投放平台，帮助广告主实现精准获客和高效转化。立即免费试用！',
        cta: '立即咨询',
        landing_page: 'https://example.com/landing/brand'
      },
      {
        group_pattern: '品牌词组',
        name: '搜索广告 - 品牌词素材 B',
        headline: '投放部必备工具 | 自动化广告投放',
        description: '跨渠道统一管理，智能优化出价，实时数据监控。1000+ 企业信赖的选择。',
        cta: '免费试用',
        landing_page: 'https://example.com/landing/automation'
      },
      {
        group_pattern: '25-34 岁女性',
        name: 'Meta 信息流素材 - 职场女性',
        type: 'image_ad',
        headline: '职场女性的投放利器',
        description: '告别繁琐操作，让 AI 帮你管理广告活动。每天节省 3 小时，ROI 提升 2 倍。',
        cta: '了解更多',
        landing_page: 'https://example.com/landing/female-professional'
      },
      {
        group_pattern: '再营销 - 网站访客',
        name: '展示广告 - 再营销素材 A',
        type: 'display_ad',
        headline: '还在犹豫吗？',
        description: '限时优惠：新用户首月 5 折！立即注册，开启智能投放之旅。',
        cta: '立即注册',
        landing_page: 'https://example.com/landing/remarketing'
      }
    ];
    
    for (const cr of creatives) {
      const agResult = await client.query(`
        SELECT ad_group_id FROM ads_schema.ad_groups WHERE ad_group_name LIKE $1
      `, [`%${cr.group_pattern}%`]);
      
      if (agResult.rows.length > 0) {
        const adGroupId = agResult.rows[0].ad_group_id;
        await client.query(`
          INSERT INTO ads_schema.creatives (
            creative_name, ad_group_id, creative_type, status,
            headline, description, call_to_action, landing_page_url,
            impressions, clicks, ctr, created_at
          ) VALUES ($1, $2, $3, 'pending_review', $4, $5, $6, $7, 0, 0, 0, CURRENT_TIMESTAMP)
        `, [
          cr.name,
          adGroupId,
          cr.type,
          cr.headline,
          cr.description,
          cr.cta,
          cr.landing_page
        ]);
        console.log(`   ✅ 已创建：${cr.name} [${cr.type}]`);
      }
    }
    console.log('');
    
    // 5. 添加关键词
    console.log('【5】添加搜索关键词...');
    
    const keywords = [
      { campaign: 'Google Search', group: '品牌词组', keyword: '投放管理平台', match: 'phrase', cpc: 2.5 },
      { campaign: 'Google Search', group: '品牌词组', keyword: '广告投放系统', match: 'phrase', cpc: 2.8 },
      { campaign: 'Google Search', group: '品牌词组', keyword: '智能投放工具', match: 'exact', cpc: 3.0 },
      { campaign: 'Google Search', group: '竞品词组', keyword: '竞品 A 投放', match: 'phrase', cpc: 3.5 },
      { campaign: 'Google Search', group: '竞品词组', keyword: '竞品 B 广告系统', match: 'phrase', cpc: 3.2 },
      { campaign: 'Google Search', group: '通用词组', keyword: '广告投放', match: 'broad', cpc: 1.5 },
      { campaign: 'Google Search', group: '通用词组', keyword: '获客工具', match: 'phrase', cpc: 1.8 },
      { campaign: 'Google Search', group: '通用词组', keyword: 'ROI 优化', match: 'phrase', cpc: 2.0 }
    ];
    
    for (const kw of keywords) {
      const campResult = await client.query(`
        SELECT c.campaign_id FROM ads_schema.campaigns c
        JOIN ads_schema.ad_groups ag ON c.campaign_id = ag.campaign_id
        WHERE c.campaign_name LIKE $1 AND ag.ad_group_name LIKE $2
        LIMIT 1
      `, [`%${kw.campaign}%`, `%${kw.group}%`]);
      
      if (campResult.rows.length > 0) {
        const campaignId = campResult.rows[0].campaign_id;
        await client.query(`
          INSERT INTO ads_schema.keywords (
            campaign_id, keyword_text, match_type, status, max_cpc, is_negative
          ) VALUES ($1, $2, $3, 'active', $4, false)
        `, [campaignId, kw.keyword, kw.match, kw.cpc]);
        console.log(`   ✅ 已添加：[${kw.match}] ${kw.keyword} (max CPC: $${kw.cpc})`);
      }
    }
    console.log('');
    
    // 6. 添加否定关键词
    console.log('【6】添加否定关键词...');
    
    const negativeKeywords = [
      { campaign: 'Google Search', keyword: '免费', match: 'exact' },
      { campaign: 'Google Search', keyword: '破解版', match: 'exact' },
      { campaign: 'Google Search', keyword: '教程', match: 'phrase' },
      { campaign: 'Google Search', keyword: '培训', match: 'phrase' },
      { campaign: 'Google Search', keyword: '招聘', match: 'exact' }
    ];
    
    for (const nk of negativeKeywords) {
      const campResult = await client.query(`
        SELECT campaign_id FROM ads_schema.campaigns WHERE campaign_name LIKE $1
      `, [`%${nk.campaign}%`]);
      
      if (campResult.rows.length > 0) {
        const campaignId = campResult.rows[0].campaign_id;
        await client.query(`
          INSERT INTO ads_schema.negative_keywords (
            campaign_id, keyword_text, match_type
          ) VALUES ($1, $2, $3)
        `, [campaignId, nk.keyword, nk.match]);
        console.log(`   ✅ 已添加否定词：[${nk.match}] ${nk.keyword}`);
      }
    }
    console.log('');
    
    // 7. 汇总报告
    console.log('【7】活动创建汇总...');
    
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM ads_schema.campaigns) as campaigns,
        (SELECT COUNT(*) FROM ads_schema.ad_groups) as ad_groups,
        (SELECT COUNT(*) FROM ads_schema.creatives) as creatives,
        (SELECT COUNT(*) FROM ads_schema.keywords) as keywords,
        (SELECT COUNT(*) FROM ads_schema.negative_keywords) as negative_keywords
    `);
    
    const s = stats.rows[0];
    console.log(`
    📊 本次活动创建汇总:
    ─────────────────────────────
       广告活动 (Campaigns):    ${s.campaigns} 个
       广告组 (Ad Groups):      ${s.ad_groups} 个
       广告素材 (Creatives):    ${s.creatives} 个
       关键词 (Keywords):       ${s.keywords} 个
       否定关键词:              ${s.negative_keywords} 个
    ─────────────────────────────
       总预算：$95,000
       周期：2026-03-24 至 2026-06-30 (99 天)
    `);
    
    console.log('=== 广告投放活动创建完成 ===\n');
    console.log('下一步：');
    console.log('  1. 审核并激活广告素材 (creatives.status = \'active\')');
    console.log('  2. 开始投放，记录每日效果数据');
    console.log('  3. 定期分析 ROI，优化关键词和出价策略');
    
  } catch (e) {
    console.error('❌ 创建失败:', e.message);
    console.error('堆栈:', e.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

createCampaign();
