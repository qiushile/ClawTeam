#!/usr/bin/env node
/**
 * db-health-monitor.js — PostgreSQL 健康检查与自动恢复
 * 
 * 功能:
 * 1. 每 30 分钟检查 DB 连接
 * 2. 连接失败时自动扫描子网寻找新 IP
 * 3. 成功后自动更新 .dev-config.json
 * 4. 连续失败记录告警
 * 
 * 用法: node scripts/db-health-monitor.js [--once]
 *   --once: 单次检查 (用于 cron/heartbeat 触发)
 */

const fs = require('fs');
const path = require('path');
const net = require('net');
const { Client } = require('pg');

const CONFIG_PATH = path.join(__dirname, '..', '.dev-config.json');
const WORKSPACE = path.join(__dirname, '..');
const DB_NAME = 'dev_db';
const DB_USER = 'dev_user';
const DB_PASS = process.env.DEV_DB_PASS || 'dev_password';
const MAX_RETRIES = 5;
const RETRY_BASE_MS = 1000;
const SUBNET_BASE = '172.23.0';

// ─── Logging ───────────────────────────────────────────────

function log(level, msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level}] ${msg}`);
}

// ─── Config ────────────────────────────────────────────────

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    return { db_host: '172.23.0.14', db_port: 5432, db_name: DB_NAME, db_user: DB_USER };
  }
}

function writeConfig(config) {
  config.last_updated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n');
  log('INFO', `Config updated: ${config.db_host}:${config.db_port}`);
}

// ─── DB Connection ─────────────────────────────────────────

async function testConnection(host, port) {
  const client = new Client({ host, port, database: DB_NAME, user: DB_USER, password: DB_PASS });
  try {
    await client.connect();
    const r = await client.query('SELECT 1 as ok;');
    return r.rows[0]?.ok === 1;
  } catch {
    return false;
  } finally {
    try { await client.end(); } catch {}
  }
}

// ─── IP Scanner ────────────────────────────────────────────

async function scanSubnet(base, port) {
  log('INFO', `Scanning ${base}.1-254:${port}...`);
  const hosts = Array.from({ length: 254 }, (_, i) => `${base}.${i + 1}`);
  let found = null;

  for (let b = 0; b < hosts.length; b += 50) {
    if (found) break;
    const batch = hosts.slice(b, b + 50);
    await Promise.all(batch.map(async (ip) => {
      if (found) return;
      const sock = new net.Socket();
      sock.setTimeout(300);
      await new Promise((resolve) => {
        sock.on('connect', () => { sock.destroy(); found = ip; resolve(); });
        sock.on('error', () => resolve());
        sock.connect(port, ip);
      });
    }));
  }
  return found;
}

// ─── Retry with Exponential Backoff ────────────────────────

async function retryConnect(host, port) {
  for (let i = 0; i < MAX_RETRIES; i++) {
    const delay = RETRY_BASE_MS * Math.pow(2, i);
    log('INFO', `Connection attempt ${i + 1}/${MAX_RETRIES} (backoff: ${delay}ms)`);
    if (await testConnection(host, port)) return true;
    if (i < MAX_RETRIES - 1) await new Promise(r => setTimeout(r, delay));
  }
  return false;
}

// ─── Main ──────────────────────────────────────────────────

async function run() {
  const config = readConfig();
  const { db_host, db_port } = config;

  log('INFO', `Health check: ${db_host}:${db_port}`);

  // Step 1: Try current host
  if (await testConnection(db_host, db_port)) {
    log('OK', `DB healthy: ${db_host}:${db_port}`);
    return { status: 'ok', host: db_host };
  }

  log('WARN', `Connection failed to ${db_host}:${db_port}, retrying...`);

  // Step 2: Retry with backoff
  if (await retryConnect(db_host, db_port)) {
    log('OK', `DB recovered after retries: ${db_host}:${db_port}`);
    return { status: 'recovered', host: db_host };
  }

  // Step 3: Scan subnet
  log('WARN', 'Retries exhausted, scanning subnet...');
  const newHost = await scanSubnet(SUBNET_BASE, db_port);

  if (!newHost) {
    log('ERROR', `No PostgreSQL found in ${SUBNET_BASE}.0/24`);
    return { status: 'down', host: null };
  }

  // Step 4: Verify and update config
  if (await testConnection(newHost, db_port)) {
    log('OK', `Found DB at ${newHost}:${db_port}`);
    config.db_host = newHost;
    writeConfig(config);
    return { status: 'relocated', host: newHost, prev_host: db_host };
  }

  log('ERROR', `Found port open at ${newHost} but connection failed`);
  return { status: 'down', host: null };
}

// ─── CLI ───────────────────────────────────────────────────

if (require.main === module) {
  const once = process.argv.includes('--once');
  run().then(result => {
    console.log(JSON.stringify(result));
    process.exit(result.status === 'ok' || result.status === 'recovered' ? 0 : 1);
  }).catch(e => {
    log('ERROR', e.message);
    process.exit(1);
  });

  if (!once) {
    log('INFO', 'Running as daemon (every 30 min)...');
    setInterval(async () => {
      const result = await run();
      if (result.status !== 'ok') {
        log('ALERT', JSON.stringify(result));
      }
    }, 30 * 60 * 1000);
  }
}

module.exports = { run, testConnection, scanSubnet };
