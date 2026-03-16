CREATE DATABASE openclaw_db;
\c openclaw_db;

-- 1. 安装核心扩展 (用于向量检索和模糊检索)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. 创建公共 Schema
CREATE SCHEMA shared;

-- ==========================================
-- 建立跨 Agent 协作表
-- ==========================================
-- (1) 任务管理表：用于跨 Agent 分发、追踪和交接任务
CREATE TABLE shared.tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requester VARCHAR(50) NOT NULL,  -- 需求发起方 (例如 'user', 'pm', 'orchestrator')
    assignee VARCHAR(50) NOT NULL,   -- 接收处理方 (例如 'dev', 'design')
    status VARCHAR(50) DEFAULT 'PENDING',  -- 状态: PENDING, IN_PROGRESS, REVIEW, COMPLETED, FAILED
    result TEXT,                     -- 最终执行结果或交付内容
    context_embedding vector(1536),  -- 任务上下文向量，用于相似任务搜索
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (2) 协作事件/消息表：跟踪交互过程，如通知用户、确认收到、提交结果等
CREATE TABLE shared.collaboration_events (
    id SERIAL PRIMARY KEY,
    task_id integer REFERENCES shared.tasks(id) ON DELETE CASCADE,
    from_role VARCHAR(50),
    to_role VARCHAR(50),
    event_type VARCHAR(50), -- 事件类型：如 'RECEIVED_ACK', 'NOTIFIED_USER', 'DELIVERED_TO_REQUESTER'
    message TEXT,           -- 具体的通知文本或沟通内容
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 为触发器更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shared_tasks_modtime
    BEFORE UPDATE ON shared.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 3. 创建所有部门专属 Schema, 用户和权限
-- ==========================================

-- 指挥中枢 (Orchestrator)
CREATE SCHEMA orchestrator_schema;
CREATE USER orchestrator_user WITH PASSWORD 'orchestrator_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA orchestrator_schema TO orchestrator_user;

-- 研发部 (Dev)
CREATE SCHEMA dev_schema;
CREATE USER dev_user WITH PASSWORD 'dev_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA dev_schema TO dev_user;

-- 产品部 (PM)
CREATE SCHEMA pm_schema;
CREATE USER pm_user WITH PASSWORD 'pm_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA pm_schema TO pm_user;

-- 设计部 (Design)
CREATE SCHEMA design_schema;
CREATE USER design_user WITH PASSWORD 'design_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA design_schema TO design_user;

-- 投放部 (Ads)
CREATE SCHEMA ads_schema;
CREATE USER ads_user WITH PASSWORD 'ads_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA ads_schema TO ads_user;

-- 销售部 (Sales)
CREATE SCHEMA sales_schema;
CREATE USER sales_user WITH PASSWORD 'sales_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA sales_schema TO sales_user;

-- 市场部 (Marketing)
CREATE SCHEMA marketing_schema;
CREATE USER marketing_user WITH PASSWORD 'marketing_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA marketing_schema TO marketing_user;

-- 项目部 (Project)
CREATE SCHEMA project_schema;
CREATE USER project_user WITH PASSWORD 'project_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA project_schema TO project_user;

-- 测试部 (QA)
CREATE SCHEMA qa_schema;
CREATE USER qa_user WITH PASSWORD 'qa_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA qa_schema TO qa_user;

-- 支撑部 (Support)
CREATE SCHEMA support_schema;
CREATE USER support_user WITH PASSWORD 'support_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA support_schema TO support_user;

-- 空间部 (Spatial)
CREATE SCHEMA spatial_schema;
CREATE USER spatial_user WITH PASSWORD 'spatial_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA spatial_schema TO spatial_user;

-- 专家组 (Expert)
CREATE SCHEMA expert_schema;
CREATE USER expert_user WITH PASSWORD 'expert_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA expert_schema TO expert_user;

-- 游戏部 (Game)
CREATE SCHEMA game_schema;
CREATE USER game_user WITH PASSWORD 'game_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA game_schema TO game_user;

-- ==========================================
-- 统一授予所有用户对 shared 协作表的基础权限
-- ==========================================
GRANT USAGE ON SCHEMA shared TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;

GRANT SELECT, INSERT, UPDATE, DELETE ON shared.tasks TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.collaboration_events TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA shared TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;

-- 如果开启 RLS，可按部门隔离，允许每方读取自己作为 assignee 和 requester 的数据 (可选，目前为快速协作暂不强制)
-- ALTER TABLE shared.tasks ENABLE ROW LEVEL SECURITY;