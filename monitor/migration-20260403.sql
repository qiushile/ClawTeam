-- ==========================================
-- 迁移脚本：将现有数据库升级到 init.sql 最新版本
-- 日期：2026-04-03
-- 原则：保留现有数据，增量更新
-- ==========================================

\c openclaw_db;

-- ==========================================
-- 1. 新增 5 个部门用户和 Schema
-- ==========================================

-- 学术部 (Academic)
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'academic_user') THEN
    CREATE USER academic_user WITH PASSWORD 'academic_pass_123';
  END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS academic_schema AUTHORIZATION academic_user;
ALTER ROLE academic_user SET search_path TO academic_schema, shared, public;

-- 财务部 (Finance)
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'finance_user') THEN
    CREATE USER finance_user WITH PASSWORD 'finance_pass_123';
  END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS finance_schema AUTHORIZATION finance_user;
ALTER ROLE finance_user SET search_path TO finance_schema, shared, public;

-- 人事部 (HR)
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'hr_user') THEN
    CREATE USER hr_user WITH PASSWORD 'hr_pass_123';
  END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS hr_schema AUTHORIZATION hr_user;
ALTER ROLE hr_user SET search_path TO hr_schema, shared, public;

-- 合规部 (Legal)
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'legal_user') THEN
    CREATE USER legal_user WITH PASSWORD 'legal_pass_123';
  END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS legal_schema AUTHORIZATION legal_user;
ALTER ROLE legal_user SET search_path TO legal_schema, shared, public;

-- 供应链部 (Supply Chain)
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supply_chain_user') THEN
    CREATE USER supply_chain_user WITH PASSWORD 'supply_chain_pass_123';
  END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS supply_chain_schema AUTHORIZATION supply_chain_user;
ALTER ROLE supply_chain_user SET search_path TO supply_chain_schema, shared, public;

-- ==========================================
-- 2. 新增部门注册信息
-- ==========================================
INSERT INTO shared.department_registry (code, db_username, name, capabilities) VALUES
('academic', 'academic_user', '学术部', '学术前沿调研、论文库检索、知识沉淀与学术合规审计'),
('finance', 'finance_user', '财务部', '预算控制、报销审计、财务分析、税务合规及资金调度策略'),
('hr', 'hr_user', '人事部', '人才画像、简历初筛、面试协调、绩效考核管理与企业文化建设'),
('legal', 'legal_user', '合规部', '合同合规审查、知识产权保护、法律风险评估及隐私政策审计'),
('supply-chain', 'supply_chain_user', '供应链部', '供应商管理、物流跟踪、仓储优化与跨国贸易合规')
ON CONFLICT (code) DO NOTHING;

-- ==========================================
-- 3. 授予新用户 shared schema 权限
-- ==========================================
GRANT USAGE ON SCHEMA shared TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;

-- shared 表权限
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.tasks TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.collaboration_events TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.knowledge_base TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;
GRANT SELECT ON shared.department_registry TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.agent_heartbeats TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.inter_agent_messages TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.shared_artifacts TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON shared.task_comments TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA shared TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;

-- pg_notify 权限
GRANT EXECUTE ON FUNCTION pg_notify(text, text) TO academic_user, finance_user, hr_user, legal_user, supply_chain_user;

-- ==========================================
-- 4. 更新 RLS 策略（加入新用户）
-- ==========================================

-- 4.1 tasks 表
DROP POLICY IF EXISTS department_task_policy ON shared.tasks;
CREATE POLICY department_task_policy ON shared.tasks
    FOR ALL
    TO dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user
    USING (assignee = CURRENT_USER OR requester = CURRENT_USER)
    WITH CHECK (assignee = CURRENT_USER OR requester = CURRENT_USER);

-- 4.2 agent_heartbeats 表
DROP POLICY IF EXISTS dept_heartbeats_select ON shared.agent_heartbeats;
DROP POLICY IF EXISTS dept_heartbeats_modify ON shared.agent_heartbeats;
CREATE POLICY dept_heartbeats_select ON shared.agent_heartbeats
    FOR SELECT
    TO dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user
    USING (true);
CREATE POLICY dept_heartbeats_modify ON shared.agent_heartbeats
    FOR ALL
    TO dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user
    USING (db_username = CURRENT_USER) WITH CHECK (db_username = CURRENT_USER);

-- 4.3 inter_agent_messages 表
DROP POLICY IF EXISTS dept_messages_policy ON shared.inter_agent_messages;
CREATE POLICY dept_messages_policy ON shared.inter_agent_messages
    FOR ALL
    TO dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user
    USING (from_agent = CURRENT_USER OR to_agent = CURRENT_USER OR to_agent IS NULL)
    WITH CHECK (from_agent = CURRENT_USER);

-- 4.4 shared_artifacts 表
DROP POLICY IF EXISTS dept_artifacts_select ON shared.shared_artifacts;
DROP POLICY IF EXISTS dept_artifacts_modify ON shared.shared_artifacts;
CREATE POLICY dept_artifacts_select ON shared.shared_artifacts
    FOR SELECT
    TO dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user
    USING (true);
CREATE POLICY dept_artifacts_modify ON shared.shared_artifacts
    FOR ALL
    TO dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user
    USING (owner = CURRENT_USER) WITH CHECK (owner = CURRENT_USER);

-- 4.5 task_comments 表
DROP POLICY IF EXISTS dept_comments_select ON shared.task_comments;
DROP POLICY IF EXISTS dept_comments_modify ON shared.task_comments;
CREATE POLICY dept_comments_select ON shared.task_comments
    FOR SELECT
    TO dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user
    USING (true);
CREATE POLICY dept_comments_modify ON shared.task_comments
    FOR ALL
    TO dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user
    USING (author = CURRENT_USER) WITH CHECK (author = CURRENT_USER);

-- ==========================================
-- 5. 更新触发函数（notify_task_status_change）
--    新版增加了 event_type 和 target 字段
-- ==========================================
CREATE OR REPLACE FUNCTION notify_task_status_change()
RETURNS TRIGGER AS $$
DECLARE
  payload json;
  should_notify boolean := false;
  event_type text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    should_notify := true;
    event_type := 'TASK_ASSIGNED';
  ELSIF (NEW.status <> OLD.status OR NEW.assignee <> OLD.assignee) THEN
    should_notify := true;
    IF NEW.status = 'COMPLETED' THEN
      event_type := 'TASK_COMPLETED';
    ELSIF NEW.status = 'FAILED' THEN
      event_type := 'TASK_FAILED';
    ELSIF NEW.status = 'IN_PROGRESS' THEN
      event_type := 'TASK_IN_PROGRESS';
    ELSIF NEW.status = 'PENDING' AND NEW.assignee <> OLD.assignee THEN
      event_type := 'TASK_ASSIGNED';
    ELSE
      event_type := 'TASK_UPDATED';
    END IF;
  END IF;

  IF should_notify THEN
    payload = json_build_object(
      'type', event_type,
      'task_id', NEW.id,
      'title', NEW.title,
      'status', NEW.status,
      'assignee', NEW.assignee,
      'requester', NEW.requester,
      'action', TG_OP,
      'target', CASE WHEN event_type IN ('TASK_COMPLETED', 'TASK_FAILED') THEN NEW.requester ELSE NEW.assignee END
    );
    PERFORM pg_notify('task_channel', payload::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 6. 更新触发函数（notify_new_message）
--    新版增加了 target 字段
-- ==========================================
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('message_channel', json_build_object(
    'id', NEW.id,
    'from', NEW.from_agent,
    'to', NEW.to_agent,
    'type', NEW.msg_type,
    'channel', NEW.channel,
    'target', NEW.to_agent
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 7. 清理多余的触发器和函数
--    init.sql 只保留 task_status_notifier 和 update_shared_tasks_modtime
--    移除 tasks_notify_trigger（notify_task_change）和 dept_task_notifier（notify_task_to_department）
-- ==========================================
DROP TRIGGER IF EXISTS tasks_notify_trigger ON shared.tasks;
DROP TRIGGER IF EXISTS dept_task_notifier ON shared.tasks;

-- 保留函数定义以防其他地方引用，但移除触发器绑定
-- 如果确认不再需要可以后续 DROP FUNCTION

-- ==========================================
-- 8. 清理多余的触发器（非 init.sql 中定义的）
--    collaboration_event_notifier, shared_artifact_notifier, task_comment_notifier
--    这些是额外增强，init.sql 没有，但有用，保留
-- ==========================================
-- 保留：collaboration_event_notifier, shared_artifact_notifier, task_comment_notifier
-- 这些是运行时增强功能，不影响 init.sql 的兼容性

-- ==========================================
-- 9. 更新默认权限（确保未来新建表/序列自动授权给所有用户）
-- ==========================================
ALTER DEFAULT PRIVILEGES IN SCHEMA shared
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO
    orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA shared
    GRANT USAGE, SELECT ON SEQUENCES TO
    orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user;

-- ==========================================
-- 10. 更新 team_directory 视图
--     （删除旧视图并重建，确保新部门也可见）
-- ==========================================
DROP VIEW IF EXISTS shared.team_directory;
CREATE VIEW shared.team_directory AS
SELECT 
  d.code,
  d.name AS dept_name,
  d.capabilities,
  d.db_username,
  h.status AS online_status,
  h.last_seen_at,
  h.current_task_id
FROM shared.department_registry d
LEFT JOIN shared.agent_heartbeats h ON d.db_username = h.db_username
WHERE d.is_active = true;

GRANT SELECT ON shared.team_directory TO orchestrator_user, dev_user, pm_user, design_user, ads_user, sales_user, marketing_user, project_user, qa_user, support_user, spatial_user, expert_user, game_user, academic_user, finance_user, hr_user, legal_user, supply_chain_user;

-- ==========================================
-- 11. 更新知识库索引（确保存在）
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_kb_department_category ON shared.knowledge_base(department, category);
CREATE INDEX IF NOT EXISTS idx_kb_tags ON shared.knowledge_base USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_kb_embedding ON shared.knowledge_base USING hnsw (content_embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_heartbeats_status ON shared.agent_heartbeats(status);
CREATE INDEX IF NOT EXISTS idx_artifacts_task ON shared.shared_artifacts(task_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_type ON shared.shared_artifacts(artifact_type);
CREATE INDEX IF NOT EXISTS idx_comments_task ON shared.task_comments(task_id, created_at);

-- ==========================================
-- 完成！
-- ==========================================
SELECT '迁移完成！' AS result;
