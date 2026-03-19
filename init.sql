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
    priority VARCHAR(10) DEFAULT 'P2',       -- 优先级: P0, P1, P2, P3
    tags TEXT[],                             -- 标签数组
    requester VARCHAR(50) NOT NULL,          -- 需求发起方 (例如 'user', 'pm', 'orchestrator')
    assignee VARCHAR(50) NOT NULL,           -- 接收处理方 (例如 'dev', 'design')
    status VARCHAR(50) DEFAULT 'PENDING',    -- 状态: PENDING, IN_PROGRESS, REVIEW, COMPLETED, FAILED
    result TEXT,                             -- 最终执行结果或交付内容
    context_embedding vector(1536),          -- 任务上下文向量，用于相似任务搜索
    due_date TIMESTAMP,                      -- 截止时间
    parent_task_id INTEGER REFERENCES shared.tasks(id) ON DELETE CASCADE, -- 父任务关联
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

-- (3) 共享知识/资产表：跨部门共享方案、文档、模板等
CREATE TABLE shared.knowledge_base (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    department VARCHAR(50) NOT NULL,         -- 来源部门
    category VARCHAR(50),                    -- 知识分类 (如 'PRD', 'API_DOC', 'DESIGN_FILE')
    tags TEXT[],
    content_embedding vector(1536),          -- 内容向量用于语义检索
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (4) 部门元数据注册表：记录联邦内各组织信息，帮助 Orchestrator 路由
CREATE TABLE shared.department_registry (
    code VARCHAR(50) PRIMARY KEY,            -- 部门代码 (与 username 对应去前缀，如 pm)
    name VARCHAR(100) NOT NULL,              -- 显示名称
    capabilities TEXT,                       -- 职责或能力描述
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 为触发器更新 updated_at
-- ==========================================
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

CREATE TRIGGER update_shared_kb_modtime
    BEFORE UPDATE ON shared.knowledge_base
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 建立性能索引
-- ==========================================
CREATE INDEX idx_tasks_assignee_status ON shared.tasks(assignee, status);
CREATE INDEX idx_tasks_requester ON shared.tasks(requester);
CREATE INDEX idx_tasks_status_priority ON shared.tasks(status, priority);
CREATE INDEX idx_tasks_created_at ON shared.tasks(created_at DESC);
CREATE INDEX idx_events_task_id_created ON shared.collaboration_events(task_id, created_at DESC);
CREATE INDEX idx_kb_department_category ON shared.knowledge_base(department, category);

-- 向量索引示例 (HNSW，根据数据量可能需要 tuning m/ef_construction)
CREATE INDEX idx_kb_embedding ON shared.knowledge_base USING hnsw (content_embedding vector_cosine_ops);
CREATE INDEX idx_tasks_embedding ON shared.tasks USING hnsw (context_embedding vector_cosine_ops);

-- ==========================================
-- LISTEN/NOTIFY 触发器机制 (实时任务状态推送)
-- ==========================================
CREATE OR REPLACE FUNCTION notify_task_status_change()
RETURNS TRIGGER AS $$
DECLARE
  payload json;
BEGIN
  -- 当任务新建，或者状态/处理人发生变化时发送通知
  IF (TG_OP = 'INSERT' OR NEW.status <> OLD.status OR NEW.assignee <> OLD.assignee) THEN
    payload = json_build_object(
      'task_id', NEW.id,
      'title', NEW.title,
      'status', NEW.status,
      'assignee', NEW.assignee,
      'requester', NEW.requester,
      'action', TG_OP
    );
    -- 频道名称固定为 'task_channel'
    PERFORM pg_notify('task_channel', payload::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_status_notifier
  AFTER INSERT OR UPDATE ON shared.tasks
  FOR EACH ROW EXECUTE FUNCTION notify_task_status_change();

-- ==========================================
-- 3. 创建所有部门专属 Schema, 用户和权限
-- ==========================================

-- 指挥中枢 (Orchestrator)
CREATE SCHEMA orchestrator_schema;
CREATE USER orchestrator_user WITH PASSWORD 'orchestrator_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA orchestrator_schema TO orchestrator_user;
ALTER ROLE orchestrator_user SET search_path TO orchestrator_schema, shared, public;

-- 研发部 (Dev)
CREATE SCHEMA dev_schema;
CREATE USER dev_user WITH PASSWORD 'dev_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA dev_schema TO dev_user;
ALTER ROLE dev_user SET search_path TO dev_schema, shared, public;

-- 产品部 (PM)
CREATE SCHEMA pm_schema;
CREATE USER pm_user WITH PASSWORD 'pm_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA pm_schema TO pm_user;
ALTER ROLE pm_user SET search_path TO pm_schema, shared, public;

-- 设计部 (Design)
CREATE SCHEMA design_schema;
CREATE USER design_user WITH PASSWORD 'design_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA design_schema TO design_user;
ALTER ROLE design_user SET search_path TO design_schema, shared, public;

-- 投放部 (Ads)
CREATE SCHEMA ads_schema;
CREATE USER ads_user WITH PASSWORD 'ads_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA ads_schema TO ads_user;
ALTER ROLE ads_user SET search_path TO ads_schema, shared, public;

-- 销售部 (Sales)
CREATE SCHEMA sales_schema;
CREATE USER sales_user WITH PASSWORD 'sales_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA sales_schema TO sales_user;
ALTER ROLE sales_user SET search_path TO sales_schema, shared, public;

-- 市场部 (Marketing)
CREATE SCHEMA marketing_schema;
CREATE USER marketing_user WITH PASSWORD 'marketing_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA marketing_schema TO marketing_user;
ALTER ROLE marketing_user SET search_path TO marketing_schema, shared, public;

-- 项目部 (Project)
CREATE SCHEMA project_schema;
CREATE USER project_user WITH PASSWORD 'project_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA project_schema TO project_user;
ALTER ROLE project_user SET search_path TO project_schema, shared, public;

-- 测试部 (QA)
CREATE SCHEMA qa_schema;
CREATE USER qa_user WITH PASSWORD 'qa_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA qa_schema TO qa_user;
ALTER ROLE qa_user SET search_path TO qa_schema, shared, public;

-- 支撑部 (Support)
CREATE SCHEMA support_schema;
CREATE USER support_user WITH PASSWORD 'support_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA support_schema TO support_user;
ALTER ROLE support_user SET search_path TO support_schema, shared, public;

-- 空间部 (Spatial)
CREATE SCHEMA spatial_schema;
CREATE USER spatial_user WITH PASSWORD 'spatial_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA spatial_schema TO spatial_user;
ALTER ROLE spatial_user SET search_path TO spatial_schema, shared, public;

-- 专家组 (Expert)
CREATE SCHEMA expert_schema;
CREATE USER expert_user WITH PASSWORD 'expert_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA expert_schema TO expert_user;
ALTER ROLE expert_user SET search_path TO expert_schema, shared, public;

-- 游戏部 (Game)
CREATE SCHEMA game_schema;
CREATE USER game_user WITH PASSWORD 'game_pass_123';
GRANT ALL PRIVILEGES ON SCHEMA game_schema TO game_user;
ALTER ROLE game_user SET search_path TO game_schema, shared, public;

-- ==========================================
-- 预填部门注册信息
-- ==========================================
INSERT INTO shared.department_registry (code, name, capabilities) VALUES
('orchestrator', '指挥中枢', '意图识别、总体任务拆解、路由分发、资源协调'),
('dev', '研发部', '全栈系统开发、架构设计、技术实现与代码审查'),
('pm', '产品部', '市场调研、竞品分析、需求定义、PRD撰写、产品路线图管理'),
('design', '设计部', 'UI/UX设计、交互原型制作、品牌视觉输出、设计资产管理'),
('qa', '测试部', '自动化测试用例编写、质量保障、缺陷追踪与性能测试'),
('ads', '投放部', '广告投放策略制定、ROI分析、跨平台账户优化与素材测试'),
('sales', '销售部', '线索转化、B2B客户跟进、营收增长、销售话术优化'),
('marketing', '市场部', '品牌推广、社群运营、内容营销与市场活动策划'),
('project', '项目部', '项目进度推进、资源分配、风险管理与跨部门协调'),
('support', '支撑部', '客户成功、工单处理、用户支持与常见问题知识库维护'),
('spatial', '空间部', 'AR/VR/XR 开发、三维资产管理、空间交互设计'),
('expert', '专家组', '复杂难题攻坚、高管战略参谋、架构审计与行业技术前瞻'),
('game', '游戏部', '游戏引擎(Unity/UE)开发、数值平衡、关卡设计与核心玩法迭代');

-- ==========================================
-- 统一授予所有用户对 shared 协作表的基础权限
-- ==========================================
GRANT USAGE ON SCHEMA shared TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;

-- 对 shared 对象授权
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.tasks TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.collaboration_events TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.knowledge_base TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;
GRANT SELECT ON shared.department_registry TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA shared TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;

-- 授予 pg_notify 权限，使得各部门都可以发送和监听事件
-- (通常默认就有权限，显式处理以防万一)
GRANT EXECUTE ON FUNCTION pg_notify(text, text) TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user;

-- ==========================================
-- 开启并设置行级安全 (RLS) 
-- (当前限定每个部门只能看/改自己负责或发起的任务)
-- ==========================================
ALTER TABLE shared.tasks ENABLE ROW LEVEL SECURITY;

-- 允许 orchestrator (指挥中枢) 查看并管理所有任务
CREATE POLICY orchestrator_task_policy ON shared.tasks
    FOR ALL
    TO orchestrator_user
    USING (true)
    WITH CHECK (true);

-- 其他各部门：只能看到 assignee 或 requester 等于当前登录账号名的任务
CREATE POLICY department_task_policy ON shared.tasks
    FOR ALL
    USING (
        assignee = CURRENT_USER
        OR requester = CURRENT_USER
    )
    WITH CHECK (
        assignee = CURRENT_USER
        OR requester = CURRENT_USER
    );