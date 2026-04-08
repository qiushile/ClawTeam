/**
 * Task Notifier Plugin for OpenClaw
 * 监听 LISTEN/NOTIFY 并推送飞书消息 + 唤醒 Agent 处理任务
 * 
 * v3: 增加 Agent 自动唤醒处理任务
 *     收到任务 → 1) 唤醒 Agent 处理  2) 飞书通知世乐
 *     增加 db_username → feishu_session_key 查表映射
 *     增加部门专属 channel (task_spatial 等) 监听
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

// 创始人的飞书 open_id（用于接收任务执行通知）
const FOUNDER_FEISHU_TARGET = 'user:ou_cce9fa7cfa2ef7779ae0cc7f0313f57d';

// 缓存: db_username -> feishu_session_key 映射
let sessionKeyCache = {};
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 分钟刷新

// 当前 Agent 的部门代码（从 DATABASE_URL 解析）
let currentDeptCode = null;

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

function parseDeptCode() {
  const connStr = process.env.DATABASE_URL || '';
  const match = connStr.match(/:\/\/([^:]+):/);
  if (match) {
    return match[1].replace('_user', '');
  }
  return null;
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
  currentDeptCode = parseDeptCode();

  try {
    dbPool = new Pool({
      connectionString,
      max: 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    logger.info(`TaskNotifier: Connected to DB. Dept: ${currentDeptCode}`);

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
          handleTaskNotification(payload, msg.channel);
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
    if (currentDeptCode) {
      await listenerClient.query(`LISTEN task_${currentDeptCode}`);
      await listenerClient.query(`LISTEN msg_${currentDeptCode}`);
      await listenerClient.query(`LISTEN collab_${currentDeptCode}`);
      await listenerClient.query(`LISTEN artifact_${currentDeptCode}`);
      await listenerClient.query(`LISTEN comment_${currentDeptCode}`);
      logger.info(`TaskNotifier: Listening to task_channel, message_channel + dept channels (${currentDeptCode}).`);
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

/**
 * 判断这个通知是否是发给当前 Agent 的
 */
function isForMe(payload) {
  if (!currentDeptCode) return false;
  const myDbUser = `${currentDeptCode}_user`;
  const assignee = payload.assignee || '';
  return assignee === myDbUser || assignee === currentDeptCode;
}

async function handleTaskNotification(payload, channel) {
  logger.info(`[TASK NOTIFIER] Processing:`, payload);

  // 确保缓存新鲜
  await ensureCacheFresh();

  // 判断是否是分配给我的任务
  const forMe = isForMe(payload);
  const isDeptChannel = channel === `task_${currentDeptCode}`;

  switch (payload.type || payload.action) {
    case 'TASK_ASSIGNED':
    case 'INSERT': {
      if (forMe || isDeptChannel) {
        // === 核心逻辑：唤醒 Agent 处理任务 ===
        wakeAgentForTask(payload);
        
        // 通知世乐：Agent 接到了任务
        notifyFounder(
          `📥 [${getDeptName()}接单]\n` +
          `📌 任务: ${payload.title || 'N/A'}\n` +
          `🔢 ID: ${payload.task_id || payload.id || 'N/A'}\n` +
          `📋 优先级: ${payload.priority || 'P2'}\n` +
          `👤 来自: ${payload.requester || '未知'}\n` +
          `🤖 执行者: ${getDeptName()}\n` +
          `⏰ ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
        );
      }
      
      // 也发给原来的 feishu 目标（如果有配置）
      const feishuTarget = await resolveTargetUserId(payload);
      if (feishuTarget) {
        const message = `📝 [新任务分配]\n⚠️ 你被分配了新任务\n📌 标题: ${payload.title}\n🔢 ID: ${payload.task_id || payload.id}\n📋 优先级: ${payload.priority || 'P2'}\n👤 来自: ${payload.requester || '未知'}\n⏰ ${new Date().toISOString()}`;
        sendFeishuMessage(feishuTarget, message);
      }
      break;
    }

    case 'TASK_COMPLETED': {
      // 通知世乐任务完成
      notifyFounder(
        `✅ [${payload.assignee || '未知'}完成任务]\n` +
        `📌 任务: ${payload.title || 'N/A'}\n` +
        `🔢 ID: ${payload.task_id || payload.id || 'N/A'}\n` +
        `📊 结果: ${(payload.result || '已完成').substring(0, 200)}\n` +
        `⏰ ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
      );
      
      const feishuTarget = await resolveTargetUserId(payload);
      if (feishuTarget) {
        const message = `✅ [任务完成]\n📌 任务: ${payload.title}\n🔢 ID: ${payload.task_id || payload.id}\n📊 结果: ${payload.result || '已完成'}\n⏰ ${new Date().toISOString()}`;
        sendFeishuMessage(feishuTarget, message);
      }
      break;
    }

    case 'TASK_FAILED': {
      notifyFounder(
        `❌ [${payload.assignee || '未知'}任务失败]\n` +
        `📌 任务: ${payload.title || 'N/A'}\n` +
        `🔢 ID: ${payload.task_id || payload.id || 'N/A'}\n` +
        `⚠️ 原因: ${(payload.error || '未知错误').substring(0, 200)}\n` +
        `⏰ ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
      );
      
      const feishuTarget = await resolveTargetUserId(payload);
      if (feishuTarget) {
        const message = `❌ [任务失败]\n📌 任务: ${payload.title}\n🔢 ID: ${payload.task_id || payload.id}\n⚠️ 原因: ${payload.error || '未知错误'}\n⏰ ${new Date().toISOString()}`;
        sendFeishuMessage(feishuTarget, message);
      }
      break;
    }

    case 'TASK_IN_PROGRESS': {
      if (forMe || isDeptChannel) {
        // Agent 已经在处理了，不需要再唤醒
        logger.info(`[TASK NOTIFIER] Task ${payload.task_id || payload.id} already in progress.`);
      }
      break;
    }

    case 'TEST_NOTIFICATION': {
      const feishuTarget = await resolveTargetUserId(payload);
      if (feishuTarget) {
        const message = `🧪 [测试通知]\n${payload.message || '收到测试通知'}\n⏰ ${payload.timestamp || new Date().toISOString()}`;
        sendFeishuMessage(feishuTarget, message);
      }
      break;
    }

    default: {
      // UPDATE 事件 - 检查是否是重新分配给我的
      if ((forMe || isDeptChannel) && payload.status === 'PENDING') {
        wakeAgentForTask(payload);
        notifyFounder(
          `📥 [${getDeptName()}接到更新任务]\n` +
          `📌 任务: ${payload.title || 'N/A'}\n` +
          `🔢 ID: ${payload.task_id || payload.id || 'N/A'}\n` +
          `⏰ ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
        );
      }
    }
  }
}

/**
 * 唤醒当前 Agent 处理任务
 * 通过 openclaw system event 注入系统事件，触发 Agent 处理
 */
function wakeAgentForTask(payload) {
  const taskId = payload.task_id || payload.id || 'unknown';
  const title = payload.title || '未知任务';
  const priority = payload.priority || 'P2';
  const requester = payload.requester || '未知';

  const eventText = [
    `🚨 新任务到达，请立即处理！`,
    ``,
    `任务ID: ${taskId}`,
    `标题: ${title}`,
    `优先级: ${priority}`,
    `来自: ${requester}`,
    ``,
    `请执行以下步骤：`,
    `1. 查询 shared.tasks 获取任务详情（WHERE id = ${taskId}）`,
    `2. 将任务状态更新为 IN_PROGRESS`,
    `3. 根据任务描述开始执行`,
    `4. 通过飞书私聊向创始人汇报：接到了什么任务、谁给的`,
    `5. 完成后更新任务状态为 COMPLETED 并填写 result`
  ].join('\n');

  logger.info(`[TASK NOTIFIER] Waking agent for task #${taskId}: ${title}`);

  execFile('openclaw', [
    'system', 'event',
    '--text', eventText,
    '--mode', 'now',
    '--timeout', '60000'
  ], { timeout: 65000 }, (error, stdout, stderr) => {
    if (error) {
      logger.warn(`[TASK NOTIFIER] Failed to wake agent for task #${taskId}: ${error.message}`);
      if (stderr) logger.warn(`[TASK NOTIFIER] stderr: ${stderr}`);
    } else {
      logger.info(`[TASK NOTIFIER] Agent woken for task #${taskId}. stdout: ${stdout}`);
    }
  });
}

/**
 * 获取当前部门名称
 */
function getDeptName() {
  const deptNames = {
    'orchestrator': '指挥中枢', 'dev': '研发部', 'pm': '产品部',
    'design': '设计部', 'qa': '测试部', 'project': '项目部',
    'sales': '销售部', 'marketing': '市场部', 'ads': '投放部',
    'game': '游戏部', 'expert': '专家组', 'spatial': '空间部',
    'support': '支撑部', 'hr': '人事部', 'finance': '财务部',
    'legal': '合规部', 'academic': '学术部', 'supply_chain': '供应链部'
  };
  return deptNames[currentDeptCode] || currentDeptCode || '未知部门';
}

/**
 * 通知创始人（世乐）
 */
function notifyFounder(message) {
  logger.info(`[TASK NOTIFIER] Notifying founder...`);
  sendFeishuMessage(FOUNDER_FEISHU_TARGET, message);
}

/**
 * 解析通知目标的飞书会话 key
 */
async function resolveTargetUserId(payload = {}) {
  const directCandidates = [
    payload.userId, payload.user_id, payload.targetUserId,
    payload.target_user_id, payload.feishuUserId, payload.feishu_user_id,
    payload.openId, payload.open_id, payload.receive_id
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim() !== '') {
      const val = candidate.trim();
      if (val.startsWith('ou_') || val.startsWith('user:ou_')) {
        return val.startsWith('user:') ? val : `user:${val}`;
      }
    }
  }

  const roleTarget = payload.target || payload.assignee;
  if (typeof roleTarget === 'string' && roleTarget.trim() !== '') {
    const role = roleTarget.trim();

    if (role.startsWith('ou_') || role.startsWith('user:ou_')) {
      return role.startsWith('user:') ? role : `user:${role}`;
    }

    if (sessionKeyCache[role]) {
      logger?.info(`[TASK NOTIFIER] Resolved ${role} -> ${sessionKeyCache[role]} (from cache)`);
      return sessionKeyCache[role];
    }

    try {
      const res = await dbPool.query(
        'SELECT feishu_session_key FROM shared.department_registry WHERE db_username = $1 OR openclaw_agent_id = $1',
        [role]
      );
      if (res.rows.length > 0 && res.rows[0].feishu_session_key) {
        const key = res.rows[0].feishu_session_key;
        sessionKeyCache[role] = key;
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
      logger?.info('TaskNotifier v3: registered successfully (with agent wake + founder notify)');
    }).catch(err => {
      logger?.error(`TaskNotifier: Registration failed. Error: ${err.message}`);
    });

    return { initPromise };
  }
};
