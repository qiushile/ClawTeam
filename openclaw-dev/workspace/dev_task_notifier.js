#!/usr/bin/env node
/**
 * Dev Task Notifier - 监听 LISTEN/NOTIFY 并推送飞书消息
 * 使用 psql 命令行工具进行 LISTEN/NOTIFY 通信
 */

const { exec } = require('child_process');
const path = require('path');

const dbPassword = process.env.OPENCLAW_DB_PASSWORD;
const feishuTargetUserId = process.env.OPENCLAW_FEISHU_TARGET_USER_ID;

if (!dbPassword) {
  console.error('OPENCLAW_DB_PASSWORD environment variable is required');
  process.exit(1);
}

// 数据库配置
const DB_CONFIG = {
  host: process.env.OPENCLAW_DB_HOST || 'localhost',
  port: process.env.OPENCLAW_DB_PORT || '5432',
  database: process.env.OPENCLAW_DB_NAME || 'openclaw_db',
  user: process.env.OPENCLAW_DB_USER || 'dev_user',
  password: dbPassword,
};

function sendFeishuMessage(userId, message) {
  if (!userId) {
    console.warn('[Feishu] OPENCLAW_FEISHU_TARGET_USER_ID is not set, skipping message');
    return;
  }
  const cmd = `openclaw message send --channel feishu --target ${userId} --message "${message.replace(/"/g, '\\"')}"`;
  
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`[Feishu] Failed to send message: ${error.message}`);
    } else {
      console.log(`[Feishu] Message sent to ${userId}`);
    }
  });
}

async function startListener() {
  console.log('[NOTIFIER] Starting Dev Task Notifier...');
  
  // 设置环境变量
  const env = {
    ...process.env,
    PGPASSWORD: DB_CONFIG.password,
  };
  
  // 构建 psql LISTEN 命令
  const psqlCmd = [
    'psql',
    `-h ${DB_CONFIG.host}`,
    `-p ${DB_CONFIG.port}`,
    `-U ${DB_CONFIG.user}`,
    `-d ${DB_CONFIG.database}`,
    '-c "LISTEN task_channel; LISTEN message_channel;"',
  ].join(' ');
  
  console.log('[NOTIFIER] Running:', psqlCmd);
  console.log('[NOTIFIER] Waiting for notifications...');
  console.log('[NOTIFIER] Press Ctrl+C to stop');
  
  // 保持进程运行
  process.on('SIGINT', () => {
    console.log('[NOTIFIER] Shutting down...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('[NOTIFIER] Shutting down...');
    process.exit(0);
  });
  
  // 使用 forever-run 或持续运行的进程
  // 由于 psql LISTEN 是阻塞的，我们用一个独立进程
  const child = exec(psqlCmd, { env });
  
  child.stdout.on('data', (data) => {
    console.log('[NOTIFIER] Output:', data.toString());
  });
  
  child.stderr.on('data', (data) => {
    const output = data.toString();
    console.error('[NOTIFIER] Error:', output);
    
    // 尝试解析 NOTIFY 消息
    // PostgreSQL NOTIFY 输出格式类似: Notify received with payload: "..."
    if (output.includes('Notify')) {
      parseAndHandleNotify(output);
    }
  });
  
  child.on('exit', (code) => {
    console.log(`[NOTIFIER] Process exited with code ${code}`);
    if (code !== 0) {
      // 5秒后重试
      setTimeout(startListener, 5000);
    }
  });
  
  child.on('error', (err) => {
    console.error('[NOTIFIER] Process error:', err);
  });
}

function parseAndHandleNotify(output) {
  // 解析 psql NOTIFY 输出
  // 格式: Notify received with payload: "..." on channel: task_channel
  const payloadMatch = output.match(/Notify received with payload: "([^"]*)"/);
  const channelMatch = output.match(/on channel: (\w+)/);
  
  if (!payloadMatch || !channelMatch) {
    console.log('[NOTIFIER] Could not parse notification');
    return;
  }
  
  const payloadStr = payloadMatch[1];
  const channel = channelMatch[1];
  
  console.log(`[NOTIFIER] Received on channel: ${channel}`);
  console.log(`[NOTIFIER] Payload: ${payloadStr}`);
  
  try {
    let payload = {};
    if (payloadStr && payloadStr.trim() !== '') {
      try {
        payload = JSON.parse(payloadStr);
      } catch (parseErr) {
        payload = { raw: payloadStr, type: 'TEXT_NOTIFICATION' };
      }
    }
    
    if (channel === 'task_channel') {
      handleTaskNotification(payload);
    }
    
  } catch (err) {
    console.error('[NOTIFIER] Error processing notification:', err);
  }
}

function handleTaskNotification(payload) {
  console.log('[TASK NOTIFIER] Processing task notification:', payload);
  
  // 根据通知类型推送飞书消息
  switch (payload.type) {
    case 'TASK_ASSIGNED': {
      const message = `📝 [新任务分配]\n⚠️ 你被分配了新任务\n📌 标题: ${payload.title}\n🔢 ID: ${payload.task_id}\n📋 优先级: ${payload.priority || 'P2'}\n⏰ 收到时间: ${new Date().toISOString()}`;
      sendFeishuMessage(feishuTargetUserId, message);
      break;
    }
    
    case 'TASK_COMPLETED': {
      const message = `✅ [任务完成]\n📌 任务: ${payload.title}\n🔢 ID: ${payload.task_id}\n📊 结果: ${payload.result || '已完成'}\n⏰ 完成时间: ${new Date().toISOString()}`;
      sendFeishuMessage(feishuTargetUserId, message);
      break;
    }
    
    case 'TASK_FAILED': {
      const message = `❌ [任务失败]\n📌 任务: ${payload.title}\n🔢 ID: ${payload.task_id}\n⚠️ 原因: ${payload.error || '未知错误'}\n⏰ 失败时间: ${new Date().toISOString()}`;
      sendFeishuMessage(feishuTargetUserId, message);
      break;
    }
    
    case 'TEST_NOTIFICATION': {
      const message = `🧪 [测试通知]\n${payload.message || '收到测试通知'}\n⏰ ${payload.timestamp || new Date().toISOString()}`;
      sendFeishuMessage(feishuTargetUserId, message);
      break;
    }
    
    default: {
      const message = `📋 [未知通知]\n类型: ${payload.type}\n内容: ${JSON.stringify(payload)}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(feishuTargetUserId, message);
    }
  }
}

// 启动监听器
startListener();
