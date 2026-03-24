const { Pool } = require('pg');

const postgresPassword = process.env.POSTGRES_PASSWORD;
if (!postgresPassword) {
  console.error('POSTGRES_PASSWORD environment variable is required');
  process.exit(1);
}

// 尝试使用超级用户权限初始化
const pool = new Pool({
  host: 'postgres-db',
  port: 5432,
  database: 'openclaw_db',
  user: 'postgres',
  password: postgresPassword
});

async function initAdsSchema() {
  const client = await pool.connect();
  
  try {
    console.log('=== 初始化 ads_schema 投放数据表 ===\n');
    console.log(`时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`);
    
    // 1. 创建 schema
    console.log('【1】创建 ads_schema...');
    await client.query('CREATE SCHEMA IF NOT EXISTS ads_schema');
    console.log('   ✅ ads_schema 已创建/存在\n');
    
    // 2. 创建渠道配置表
    console.log('【2】创建渠道配置表 (channels)...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ads_schema.channels (
        channel_id SERIAL PRIMARY KEY,
        channel_name VARCHAR(100) NOT NULL UNIQUE,
        platform VARCHAR(50) NOT NULL,
        account_id VARCHAR(100),
        status VARCHAR(20) DEFAULT 'active',
        daily_budget DECIMAL(12,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ channels 表已创建\n');
    
    // 3. 创建广告活动表
    console.log('【3】创建广告活动表 (campaigns)...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ads_schema.campaigns (
        campaign_id SERIAL PRIMARY KEY,
        campaign_name VARCHAR(200) NOT NULL,
        channel_id INTEGER REFERENCES ads_schema.channels(channel_id),
        objective VARCHAR(50),
        status VARCHAR(20) DEFAULT 'active',
        start_date DATE,
        end_date DATE,
        total_budget DECIMAL(12,2),
        daily_budget DECIMAL(12,2),
        bid_strategy VARCHAR(50),
        targeting_config JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ campaigns 表已创建\n');
    
    // 4. 创建广告组表
    console.log('【4】创建广告组表 (ad_groups)...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ads_schema.ad_groups (
        ad_group_id SERIAL PRIMARY KEY,
        ad_group_name VARCHAR(200) NOT NULL,
        campaign_id INTEGER REFERENCES ads_schema.campaigns(campaign_id),
        status VARCHAR(20) DEFAULT 'active',
        bid_amount DECIMAL(10,4),
        targeting_config JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ ad_groups 表已创建\n');
    
    // 5. 创建设计素材表
    console.log('【5】创建素材表 (creatives)...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ads_schema.creatives (
        creative_id SERIAL PRIMARY KEY,
        creative_name VARCHAR(200) NOT NULL,
        ad_group_id INTEGER REFERENCES ads_schema.ad_groups(ad_group_id),
        creative_type VARCHAR(30),
        status VARCHAR(20) DEFAULT 'pending_review',
        headline VARCHAR(100),
        description TEXT,
        image_url VARCHAR(500),
        video_url VARCHAR(500),
        landing_page_url VARCHAR(500),
        call_to_action VARCHAR(50),
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        ctr DECIMAL(5,4) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ creatives 表已创建\n');
    
    // 6. 创建每日效果表
    console.log('【6】创建每日效果表 (daily_performance)...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ads_schema.daily_performance (
        id SERIAL PRIMARY KEY,
        channel VARCHAR(50) NOT NULL,
        campaign_id INTEGER,
        ad_group_id INTEGER,
        creative_id INTEGER,
        date DATE NOT NULL,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        spend DECIMAL(12,2) DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        revenue DECIMAL(12,2) DEFAULT 0,
        roi DECIMAL(10,4) DEFAULT 0,
        ctr DECIMAL(5,4) DEFAULT 0,
        cpc DECIMAL(10,4) DEFAULT 0,
        cpa DECIMAL(10,4) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(channel, date, campaign_id, ad_group_id, creative_id)
      )
    `);
    console.log('   ✅ daily_performance 表已创建\n');
    
    // 7. 创建关键词表
    console.log('【7】创建关键词表 (keywords)...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ads_schema.keywords (
        keyword_id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES ads_schema.campaigns(campaign_id),
        keyword_text VARCHAR(200) NOT NULL,
        match_type VARCHAR(20),
        status VARCHAR(20) DEFAULT 'active',
        max_cpc DECIMAL(10,4),
        quality_score DECIMAL(3,1),
        is_negative BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ keywords 表已创建\n');
    
    // 8. 创建否定关键词表
    console.log('【8】创建否定关键词表 (negative_keywords)...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ads_schema.negative_keywords (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES ads_schema.campaigns(campaign_id),
        keyword_text VARCHAR(200) NOT NULL,
        match_type VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✅ negative_keywords 表已创建\n');
    
    // 9. 授予 ads_user 权限
    console.log('【9】授予 ads_user 访问权限...');
    await client.query('GRANT ALL PRIVILEGES ON SCHEMA ads_schema TO ads_user');
    await client.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ads_schema TO ads_user');
    await client.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA ads_schema TO ads_user');
    console.log('   ✅ 权限已授予\n');
    
    // 10. 插入示例渠道数据
    console.log('【10】插入示例渠道数据...');
    const sampleChannels = [
      { name: 'Google Search', platform: 'google_ads' },
      { name: 'Google Display', platform: 'google_ads' },
      { name: 'Meta Feed', platform: 'meta' },
      { name: 'Meta Stories', platform: 'meta' },
      { name: 'Bing Search', platform: 'bing_ads' },
      { name: 'TikTok Feed', platform: 'tiktok' }
    ];
    
    for (const ch of sampleChannels) {
      await client.query(`
        INSERT INTO ads_schema.channels (channel_name, platform, status)
        VALUES ($1, $2, 'active')
        ON CONFLICT (channel_name) DO NOTHING
      `, [ch.name, ch.platform]);
    }
    console.log(`   ✅ 已插入 ${sampleChannels.length} 个示例渠道\n`);
    
    // 11. 查询验证
    console.log('【11】验证表结构...');
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'ads_schema'
      ORDER BY table_name
    `);
    console.log(`   ✅ ads_schema 中共有 ${tables.rows.length} 张表:`);
    tables.rows.forEach(row => console.log(`      - ${row.table_name}`));
    
    const channelCount = await client.query('SELECT COUNT(*) FROM ads_schema.channels');
    console.log(`\n   ✅ 渠道数据：${channelCount.rows[0].count} 条\n`);
    
    console.log('=== ads_schema 初始化完成 ===\n');
    console.log('下一步建议：');
    console.log('  1. 创建广告活动 (campaigns)');
    console.log('  2. 配置广告组和素材');
    console.log('  3. 开始投放并记录每日效果数据');
    
  } catch (e) {
    console.error('❌ 初始化失败:', e.message);
    console.error('堆栈:', e.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

initAdsSchema();
