/**
 * Task Notifier Plugin for OpenClaw
 * 监听 LISTEN/NOTIFY 并推送飞书消息
 * 
 * v2: 增加 db_username → feishu_session_key 查表映射
 *     增加部门专属 channel (task_spatial 等) 监听
 *     增加 Agent 会话唤醒能力
 */
import { Pool } from 'pg';
import { execFile } from 'child_process';

let dbPool = null;
let listenerClient = null;
let logger = null;
let listenerReconnectTimer = null;
let reconnectAttempts = 0;
const RECONNECT_BASE_MS = 3000;
const RECONNECT_MAX_MS = 60000;

// 缓存: db_username -> feishu_session_key 映射
let sessionKeyCache = {};
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 分钟刷新

async function loadSessionKeyCache() {
  if (!dbPool) return;
  try {
    const res = await dbPool.query(
      'SELECT db_username, feishu_session_key, openclaw_agent_id FROM shared.department_registry WHERE is_active = true AND feishu_session_key IS NOT NULL'
    );
    sessionKeyCache = {};
    for (const row of res.rows) {
      sessionKeyCache[row.db_username] = row.feishu_session_key;
      if (row.openclaw_agent_id) {
        sessionKeyCache[row.openclaw_agent_id] = row.feishu_session_key;
      }
    }
    cacheLoadedAt = Date.now();
    logger?.info(`[TASK NOTIFIER] Session key cache loaded: ${Object.keys(sessionKeyCache).length} entries`);
  } catch (e) {
    logger?.error(`[TASK NOTIFIER] Failed to load session key cache: ${e.message}`);
  }
}

async function ensureCacheFresh() {
  if (Date.now() - cacheLoadedAt > CACHE_TTL_MS) {
    await loadSessionKeyCache();
  }
}

export async function initTaskNotifier(api) {
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
      max: 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    logger.info('TaskNotifier: Connected to DB.');

    await loadSessionKeyCache();
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

  // 清理旧连接
  if (listenerClient) {
    try { listenerClient.release(); } catch (_) {}
    listenerClient = null;
  }

  try {
    listenerClient = await dbPool.connect();
    reconnectAttempts = 0;

    // 连接异常 → 自动重连
    listenerClient.on('error', (err) => {
      logger.error(`TaskNotifier: Listener connection error: ${err.message}`);
      scheduleReconnect();
    });
    listenerClient.on('end', () => {
      logger.warn('TaskNotifier: Listener connection ended unexpectedly.');
      scheduleReconnect();
    });

    listenerClient.on('notification', (msg) => {
      try {
        if (!msg.payload || msg.payload.trim() === '') return;
        
        let payload;
        try {
          payload = JSON.parse(msg.payload);
        } catch (err) {
          payload = { type: 'TEXT_NOTIFICATION', raw: msg.payload };
        }
        
        logger.info(`[TASK NOTIFIER] Channel: ${msg.channel} | Payload:`, payload);

        if (msg.channel === 'task_channel' || msg.channel.startsWith('task_')) {
          handleTaskNotification(payload);
        } else if (msg.channel === 'message_channel' || msg.channel.startsWith('msg_')) {
          handleMessageNotification(payload);
        }
      } catch (err) {
        logger.error(`[TASK NOTIFIER] Error in notification handler`, err);
      }
    });

    // 全局频道
    await listenerClient.query('LISTEN task_channel');
    await listenerClient.query('LISTEN message_channel');

    // 部门专属频道
    const connStr = process.env.DATABASE_URL || '';
    const match = connStr.match(/:\/\/([^:]+):/);
    if (match) {
      const deptCode = match[1].replace('_user', '');
      await listenerClient.query(`LISTEN task_${deptCode}`);
      await listenerClient.query(`LISTEN msg_${deptCode}`);
      await listenerClient.query(`LISTEN collab_${deptCode}`);
      await listenerClient.query(`LISTEN artifact_${deptCode}`);
      await listenerClient.query(`LISTEN comment_${deptCode}`);
      logger.info(`TaskNotifier: Listening to task_channel, message_channel + dept channels (${deptCode}).`);
    } else {
      logger.info('TaskNotifier: Listening to task_channel and message_channel.');
    }
  } catch (e) {
    logger.error(`TaskNotifier: Listener setup failed. Error: ${e.message}`);
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (listenerReconnectTimer) return;
  reconnectAttempts++;
  const delay = Math.min(RECONNECT_BASE_MS * Math.pow(2, reconnectAttempts - 1), RECONNECT_MAX_MS);
  logger.info(`TaskNotifier: Reconnecting listener in ${delay}ms (attempt #${reconnectAttempts})...`);
  listenerReconnectTimer = setTimeout(async () => {
    listenerReconnectTimer = null;
    try {
      await startListener();
    } catch (e) {
      logger.error(`TaskNotifier: Reconnect failed: ${e.message}`);
    }
  }, delay);
}

async function handleTaskNotification(payload) {
  logger.info(`[TASK NOTIFIER] Processing:`, payload);

  // 确保缓存新鲜
  await ensureCacheFresh();

  const feishuTarget = await resolveTargetUserId(payload);
  if (!feishuTarget) {
    logger?.warn(`[TASK NOTIFIER] Cannot resolve Feishu target for: ${payload.target || payload.assignee || 'unknown'}, skip sending.`);
    return;
  }

  switch (payload.type) {
    case 'TASK_ASSIGNED': {
      const message = `📝 [新任务分配]\n⚠️ 你被分配了新任务\n📌 标题: ${payload.title}\n🔢 ID: ${payload.task_id}\n📋 优先级: ${payload.priority || 'P2'}\n👤 来自: ${payload.requester || '未知'}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(feishuTarget, message);
      break;
    }

    case 'TASK_COMPLETED': {
      const message = `✅ [任务完成]\n📌 任务: ${payload.title}\n🔢 ID: ${payload.task_id}\n📊 结果: ${payload.result || '已完成'}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(feishuTarget, message);
      break;
    }

    case 'TASK_FAILED': {
      const message = `❌ [任务失败]\n📌 任务: ${payload.title}\n🔢 ID: ${payload.task_id}\n⚠️ 原因: ${payload.error || '未知错误'}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(feishuTarget, message);
      break;
    }

    case 'TASK_IN_PROGRESS': {
      const message = `🔄 [任务进行中]\n📌 任务: ${payload.title}\n🔢 ID: ${payload.task_id}\n👤 执行者: ${payload.assignee || '未知'}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(feishuTarget, message);
      break;
    }

    case 'TEST_NOTIFICATION': {
      const message = `🧪 [测试通知]\n${payload.message || '收到测试通知'}\n⏰ ${payload.timestamp || new Date().toISOString()}`;
      sendFeishuMessage(feishuTarget, message);
      break;
    }

    case 'TEXT_NOTIFICATION': {
      const raw = payload.raw || '';
      const message = `📋 [任务通知]\n${raw}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(feishuTarget, message);
      break;
    }

    default: {
      const message = `📋 [任务更新 - ${payload.type || '未知'}]\n📌 任务: ${payload.title || 'N/A'}\n🔢 ID: ${payload.task_id || 'N/A'}\n⏰ ${new Date().toISOString()}`;
      sendFeishuMessage(feishuTarget, message);
    }
  }
}

/**
 * 解析通知目标的飞书会话 key
 * 优先使用已经是 feishu 格式的值，否则查 department_registry 映射
 */
async function resolveTargetUserId(payload = {}) {
  // 1. 先检查 payload 中是否已有 feishu 格式的 ID
  const directCandidates = [
    payload.userId,
    payload.user_id,
    payload.targetUserId,
    payload.target_user_id,
    payload.feishuUserId,
    payload.feishu_user_id,
    payload.openId,
    payload.open_id,
    payload.receive_id
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim() !== '') {
      const val = candidate.trim();
      // 如果已经是 feishu 格式 (ou_ 或 user:ou_)，直接用
      if (val.startsWith('ou_') || val.startsWith('user:ou_')) {
        return val.startsWith('user:') ? val : `user:${val}`;
      }
    }
  }

  // 2. 从 target/assignee 字段获取 db_username，查缓存映射
  const roleTarget = payload.target || payload.assignee;
  if (typeof roleTarget === 'string' && roleTarget.trim() !== '') {
    const role = roleTarget.trim();

    // 已经是 feishu 格式
    if (role.startsWith('ou_') || role.startsWith('user:ou_')) {
      return role.startsWith('user:') ? role : `user:${role}`;
    }

    // 查缓存
    if (sessionKeyCache[role]) {
      logger?.info(`[TASK NOTIFIER] Resolved ${role} -> ${sessionKeyCache[role]} (from cache)`);
      return sessionKeyCache[role];
    }

    // 缓存没命中，尝试实时查库
    try {
      const res = await dbPool.query(
        'SELECT feishu_session_key FROM shared.department_registry WHERE db_username = $1 OR openclaw_agent_id = $1',
        [role]
      );
      if (res.rows.length > 0 && res.rows[0].feishu_session_key) {
        const key = res.rows[0].feishu_session_key;
        sessionKeyCache[role] = key; // 更新缓存
        logger?.info(`[TASK NOTIFIER] Resolved ${role} -> ${key} (from DB)`);
        return key;
      }
    } catch (e) {
      logger?.error(`[TASK NOTIFIER] DB lookup failed for ${role}: ${e.message}`);
    }
  }

  return null;
}

function handleMessageNotification(payload) {
  logger?.info(`[TASK NOTIFIER] Message notification received:`, payload);
}

function sendFeishuMessage(target, message) {
  logger?.info(`[Feishu] Sending to ${target}...`);
  execFile('openclaw', ['message', 'send', '--channel', 'feishu', '--target', target, '--message', message], { timeout: 30000 }, (error, stdout, stderr) => {
    if (error) {
      logger?.warn(`[Feishu] Failed to send to ${target}: ${error.message}`);
      if (stderr) logger?.warn(`[Feishu] stderr: ${stderr}`);
    } else {
      logger?.info(`[Feishu] Message sent to ${target}`);
    }
  });
}

export async function shutdownTaskNotifier() {
  if (listenerReconnectTimer) {
    clearTimeout(listenerReconnectTimer);
    listenerReconnectTimer = null;
  }
  if (listenerClient) {
    try {
      await listenerClient.query('UNLISTEN *');
      await listenerClient.release();
    } catch (e) {
      logger?.error(`[TASK NOTIFIER] Shutdown error: ${e.message}`);
    }
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
