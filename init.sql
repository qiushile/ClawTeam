CREATE DATABASE openclaw_db;
\c openclaw_db;

-- 1. 安装核心扩展
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. 创建不同的 Schema 分区
CREATE SCHEMA shared;
CREATE SCHEMA pm_schema;
CREATE SCHEMA dev_schema;

-- 3. 创建不同 Agent 的专属账号
CREATE USER orchestrator_user WITH PASSWORD 'orch_pass_123';
CREATE USER pm_user WITH PASSWORD 'pm_pass_123';
CREATE USER dev_user WITH PASSWORD 'dev_pass_123';

-- 4. 建立共享需求表并配置 RLS 行级安全
CREATE TABLE shared.requirements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    embedding vector(1536),
    status VARCHAR(50),
    owner_role VARCHAR(50)
);

ALTER TABLE shared.requirements ENABLE ROW LEVEL SECURITY;

-- PM 可以完全读写 requirements 表
GRANT ALL PRIVILEGES ON shared.requirements TO pm_user;
-- Dev 只能读取 requirements 表
GRANT SELECT ON shared.requirements TO dev_user;

-- 赋予各用户对自身 schema 的完全控制权
GRANT ALL PRIVILEGES ON SCHEMA pm_schema TO pm_user;
GRANT ALL PRIVILEGES ON SCHEMA dev_schema TO dev_user;