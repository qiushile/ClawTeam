#!/usr/bin/env node
/**
 * task-scheduler.js — 统一任务查询与优先级调度
 * 
 * 功能:
 * 1. 统一查询 shared.tasks + dev_schema.dev_tasks
 * 2. P0>P1>P2>P3 自动排序
 * 3. 超时检测 (IN_PROGRESS > 48h)
 * 4. 任务认领/更新/完成封装
 * 
 * 用法:
 *   const scheduler = require('./lib/task-scheduler');
 *   const pending = await scheduler.getPendingTasks();
 *   await scheduler.claimTask(taskId, 'dev_user');
 */

const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(__dirname, '..', '.dev-config.json');
const DB_NAME = 'dev_db';
const DB_USER = 'dev_user';
const DB_PASS = process.env.DEV_DB_PASS || 'dev_password';

// ─── Priority Mapping ──────────────────────────────────────

const PRIORITY_ORDER = { URGENT: 0, HIGH: 1, P0: 0, P1: 1, P2: 2, P3: 3, NORMAL: 2, MEDIUM: 2, LOW: 3 };
const PRIORITY_NAMES = { 0: 'P0', 1: 'P1', 2: 'P2', 3: 'P3' };

function priorityNum(p) {
  if (!p) return 2;
  return PRIORITY_ORDER[p.toUpperCase()] ?? 2;
}

// ─── Client Factory ────────────────────────────────────────

function getClient() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  return new Client({
    host: config.db_host || '172.23.0.14',
    port: config.db_port || 5432,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
  });
}

// ─── Task Queries ──────────────────────────────────────────

async function getPendingTasks(assignee = null) {
  const client = getClient();
  try {
    await client.connect();

    // shared.tasks (no priority column)
    let sharedWhere = "status = 'PENDING'";
    let sharedParams = [];
    if (assignee) {
      sharedWhere += ' AND assignee = $1';
      sharedParams = [assignee];
    }
    const shared = await client.query(
      `SELECT id, title, description, assignee, requester, status, 'NORMAL' as priority, created_at, updated_at, 'shared' as source FROM shared.tasks WHERE ${sharedWhere}`,
      sharedParams
    );

    // dev_schema.dev_tasks
    let devWhere = "status = 'PENDING'";
    let devParams = [];
    if (assignee) {
      devWhere += ' AND assignee = $1';
      devParams = [assignee];
    }
    const dev = await client.query(
      `SELECT id, title, description, assignee, requester, status, priority, created_at, updated_at, 'dev' as source FROM dev_schema.dev_tasks WHERE ${devWhere}`,
      devParams
    );

    // Note: shared.tasks may not have 'priority' column; query uses COALESCE default

    // Merge and sort by priority
    const all = [...shared.rows, ...dev.rows];
    all.sort((a, b) => priorityNum(a.priority) - priorityNum(b.priority));
    return all;
  } finally {
    try { await client.end(); } catch {}
  }
}

async function getInProgressTasks() {
  const client = getClient();
  try {
    await client.connect();
    const dev = await client.query(
      `SELECT id, title, assignee, status, priority, created_at, updated_at, result FROM dev_schema.dev_tasks WHERE status = 'IN_PROGRESS'`
    );
    const shared = await client.query(
      `SELECT id, title, assignee, status, 'NORMAL' as priority, created_at, updated_at, result FROM shared.tasks WHERE status = 'IN_PROGRESS'`
    );
    return [...shared.rows, ...dev.rows];
  } finally {
    try { await client.end(); } catch {}
  }
}

async function getTimeoutTasks(hours = 48) {
  const client = getClient();
  try {
    await client.connect();
    const r = await client.query(
      `SELECT id, title, assignee, status, updated_at,
         EXTRACT(EPOCH FROM (NOW() - updated_at)) / 3600 as hours_in_progress
       FROM dev_schema.dev_tasks
       WHERE status = 'IN_PROGRESS'
         AND updated_at < NOW() - interval '${hours} hours'
       ORDER BY updated_at`
    );
    return r.rows;
  } finally {
    try { await client.end(); } catch {}
  }
}

// ─── Task Mutations ────────────────────────────────────────

async function claimTask(taskId, assignee, source = 'dev') {
  const client = getClient();
  try {
    await client.connect();
    const table = source === 'shared' ? 'shared.tasks' : 'dev_schema.dev_tasks';
    await client.query(
      `UPDATE ${table} SET status = 'IN_PROGRESS', assignee = $1, updated_at = NOW() WHERE id = $2`,
      [assignee, taskId]
    );
    return { success: true, taskId, assignee };
  } finally {
    try { await client.end(); } catch {}
  }
}

async function completeTask(taskId, result, source = 'dev') {
  const client = getClient();
  try {
    await client.connect();
    const table = source === 'shared' ? 'shared.tasks' : 'dev_schema.dev_tasks';
    await client.query(
      `UPDATE ${table} SET status = 'COMPLETED', result = $1, updated_at = NOW() WHERE id = $2`,
      [result, taskId]
    );
    return { success: true, taskId };
  } finally {
    try { await client.end(); } catch {}
  }
}

async function createTask(title, description, assignee = 'dev_user', priority = 'NORMAL', source = 'dev') {
  const client = getClient();
  try {
    await client.connect();
    const table = source === 'shared' ? 'shared.tasks' : 'dev_schema.dev_tasks';
    // shared.tasks may not have priority column
    if (source === 'shared') {
      const r = await client.query(
        `INSERT INTO shared.tasks (title, description, assignee, status, created_at, updated_at)
         VALUES ($1, $2, $3, 'PENDING', NOW(), NOW()) RETURNING id`,
        [title, description, assignee]
      );
      return { success: true, taskId: r.rows[0].id };
    }
    const cols = ['title', 'description', 'assignee', 'priority', 'status', 'created_at', 'updated_at'];
    const vals = [`$${cols.indexOf('title')+1}`, `$${cols.indexOf('description')+1}`, `$${cols.indexOf('assignee')+1}`, `$${cols.indexOf('priority')+1}`, `'PENDING'`, `NOW()`, `NOW()`];
    const r = await client.query(
      `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${vals.join(', ')}) RETURNING id`,
      [title, description, assignee, priority.toUpperCase()]
    );
    return { success: true, taskId: r.rows[0].id };
  } finally {
    try { await client.end(); } catch {}
  }
}

// ─── Summary ───────────────────────────────────────────────

async function getSummary() {
  const client = getClient();
  try {
    await client.connect();
    const dev = await client.query('SELECT status, count(*) FROM dev_schema.dev_tasks GROUP BY status');
    const shared = await client.query('SELECT status, count(*) FROM shared.tasks GROUP BY status');
    return {
      dev: Object.fromEntries(dev.rows.map(r => [r.status, parseInt(r.count)])),
      shared: Object.fromEntries(shared.rows.map(r => [r.status, parseInt(r.count)])),
    };
  } finally {
    try { await client.end(); } catch {}
  }
}

module.exports = {
  getPendingTasks,
  getInProgressTasks,
  getTimeoutTasks,
  claimTask,
  completeTask,
  createTask,
  getSummary,
  priorityNum,
};
