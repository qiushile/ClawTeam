const { Client } = require('pg');
const client = new Client({
  host: 'postgres-db',
  port: 5432,
  database: 'openclaw_db',
  user: 'design_user',
  password: 'design_pass_123'
});

async function main() {
  await client.connect();
  
  // 发送消息给项目部
  const payload1 = JSON.stringify({
    message: "【状态同步请求】创始人询问物业投票系统现状。设计部已查询数据库未发现相关任务记录。请问项目部是否持有投票系统相关任务？当前状态如何？请同步最新进展。"
  });
  
  await client.query(`
    INSERT INTO shared.inter_agent_messages (from_agent, to_agent, channel, msg_type, payload, ref_task_id, is_read, created_at)
    VALUES ('design_user', 'project_user', 'default', 'INQUIRY', $1, null, false, NOW())
  `, [payload1]);
  
  console.log('✅ 消息已发送给 project_user');
  
  // 同时发送给 PM 部门
  const payload2 = JSON.stringify({
    message: "【状态同步请求】创始人询问物业投票系统现状。发现3月25日PM部门曾有'物业管理开源方案'记录（状态：已完成）。请问当前是否有投票系统相关任务？请同步最新进展。"
  });
  
  await client.query(`
    INSERT INTO shared.inter_agent_messages (from_agent, to_agent, channel, msg_type, payload, ref_task_id, is_read, created_at)
    VALUES ('design_user', 'pm_user', 'default', 'INQUIRY', $1, null, false, NOW())
  `, [payload2]);
  
  console.log('✅ 消息已发送给 pm_user');
  
  // 记录协作事件
  const eventPayload = JSON.stringify({
    action: "查询投票系统状态",
    status: "已发送跨部门询问",
    timestamp: new Date().toISOString()
  });
  
  await client.query(`
    INSERT INTO shared.collaboration_events (event_type, from_role, to_role, message, created_at)
    VALUES ('STATUS_INQUIRY', 'design_user', 'project_user,pm_user', $1, NOW())
  `, [eventPayload]);
  
  console.log('✅ 协作事件已记录');
  
  await client.end();
}

main().catch(err => {
  console.error('发送失败:', err.message);
  process.exit(1);
});
