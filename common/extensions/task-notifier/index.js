/**
 * Task Notifier Plugin for OpenClaw
 * 监听 LISTEN/NOTIFY 并推送飞书消息
 */
import { Pool } from 'pg';
import { execFile } from 'child_process';

let dbPool = null;
let listenerClient = null;
let logger = null;

export async function initTaskNotifier(api) {
  // 防止重复初始化
  if (dbPool) {
    api.logger.info('TaskNotifier: Already initialized, skipping.');
    return true;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    api.logger.warn('TaskNotifier: DATABASE_URL not found.');
    return null;
  }

  logger = api.logger;

  try {
    dbPool = new Pool({
      connectionString,
      max: 2,                    // 通知器只需 2 个连接（1 监听 + 1 备用）
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    logger.info('TaskNotifier: Connected to DB.');

    // 启动监听器
    await startListener();
  } catch (e) {
    logger.error(`TaskNotifier: Initialization failed. Error: ${e.message}`);
    return null;
  }

  return true;
}

async function startListener() {
  if (!dbPool) {
    logger.error('TaskNotifier: dbPool not initialized.');
    return;
  }

  try {
    listenerClient = await dbPool.connect();

    listenerClient.on('notification', (msg) => {
      try {
        let payload = {};
        if (msg.payload && msg.payload.trim() !== '') {
          try {
            payload = JSON.parse(msg.payload);
          } catch (err) {
            // 如果不是JSON，创建TEXT_NOTIFICATION类型
            payload = { type: 'TEXT_NOTIFICATION', raw: msg.payload };
          }
        }
        logger.info(`[TASK NOTIFIER] Channel: ${msg.channel} | Payload:`, payload);

        if (msg.channel === 'task_channel') {
          handleTaskNotification(payload);
        }
      } catch (err) {
        logger.error(`[TASK NOTIFIER] Failed to parse notification: ${msg.payload}`, err);
      }
    });

    await listenerClient.query('LISTEN task_channel');
    await listenerClient.query('LISTEN message_channel');
    logger.info('TaskNotifier: Listening to task_channel and message_channel.');
  } catch (e) {
    logger.error(`TaskNotifier: Listener setup failed. Error: ${e.message}`);
  }
}

async function handleTaskNotification(payload) {
  logger.info(`[TASK NOTIFIER] Processing:`, payload);

  const userId = resolveTargetUserId(payload);
  if (!userId) {
    logger?.warn('[TASK NOTIFIER] Missing Feishu userId in notification payload, skip sending.');
    return;
  }

  switch (payload.type) {
    case 'TASK_ASSIGNED': {
      const message = `📝 [新任务分配]\n⚠️ 你被分配了新任务\n📌 标题: ${payload.title}\n🔢 ID: ${payload.task_id}\n📋 优先级: ${payload.priority || 'P2'}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(userId, message);
      break;
    }

    case 'TASK_COMPLETED': {
      const message = `✅ [任务完成]\n📌 任务: ${payload.title}\n🔢 ID: ${payload.task_id}\n📊 结果: ${payload.result || '已完成'}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(userId, message);
      break;
    }

    case 'TASK_FAILED': {
      const message = `❌ [任务失败]\n📌 任务: ${payload.title}\n🔢 ID: ${payload.task_id}\n⚠️ 原因: ${payload.error || '未知错误'}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(userId, message);
      break;
    }

    case 'TEST_NOTIFICATION': {
      const message = `🧪 [测试通知]\n${payload.message || '收到测试通知'}\n⏰ ${payload.timestamp || new Date().toISOString()}`;
      sendFeishuMessage(userId, message);
      break;
    }

    case 'TEXT_NOTIFICATION': {
      // 处理纯文本消息（非JSON格式的NOTIFY）
      const raw = payload.raw || '';
      const message = `📋 [任务通知]\n${raw}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(userId, message);
      break;
    }

    default: {
      const message = `📋 [未知通知]\n类型: ${payload.type}\n内容: ${JSON.stringify(payload)}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(userId, message);
    }
  }
}

function resolveTargetUserId(payload = {}) {
  const candidates = [
    payload.userId,
    payload.user_id,
    payload.targetUserId,
    payload.target_user_id,
    payload.feishuUserId,
    payload.feishu_user_id,
    payload.openId,
    payload.open_id,
    payload.receive_id,
    payload.target
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim() !== '') {
      return candidate.trim();
    }
  }

  return null;
}

function sendFeishuMessage(userId, message) {
  execFile('openclaw', ['message', 'send', '--channel', 'feishu', '--target', userId, '--message', message], (error) => {
    if (error) {
      logger?.warn(`[Feishu] Failed to send message: ${error.message}`);
    } else {
      logger?.info(`[Feishu] Message sent to ${userId}`);
    }
  });
}

export async function shutdownTaskNotifier() {
  if (listenerClient) {
    await listenerClient.query('UNLISTEN task_channel');
    await listenerClient.query('UNLISTEN message_channel');
    await listenerClient.release();
    listenerClient = null;
  }
  if (dbPool) {
    await dbPool.end();
    dbPool = null;
  }
}

export default {
  id: "task-notifier",
  register(api) {
    const initPromise = initTaskNotifier(api);

    // Register shutdown hook
    process.on('SIGTERM', async () => {
      logger?.info('[TASK NOTIFIER] Shutdown signal received');
      await shutdownTaskNotifier();
      process.exit(0);
    });

    initPromise.then(() => {
      logger?.info('TaskNotifier: registered successfully');
    }).catch(err => {
      logger?.error(`TaskNotifier: Registration failed. Error: ${err.message}`);
    });

    return { initPromise };
  }
};
