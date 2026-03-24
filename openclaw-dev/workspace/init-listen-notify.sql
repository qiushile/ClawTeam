-- =============================================================================
-- PostgreSQL LISTEN/NOTIFY 初始化脚本
-- 用途：为多部门协作提供任务实时通知机制
-- 执行者：数据库管理员 (root/dba)
-- 执行时间：数据库初始化/首次部署时
-- =============================================================================

-- 删除已存在的对象（可选，用于重置）
DROP TRIGGER IF EXISTS tasks_notify_trigger ON shared.tasks;
DROP FUNCTION IF EXISTS notify_task_change();

-- 1. 创建通知函数
CREATE OR REPLACE FUNCTION notify_task_change()
RETURNS trigger AS $$
DECLARE
  notify_payload jsonb;
  target_user TEXT;
BEGIN
  -- 根据操作类型构建通知内容
  IF TG_OP = 'INSERT' THEN
    notify_payload = jsonb_build_object(
      'event', 'TASK_CREATED',
      'task_id', NEW.id,
      'assignee', NEW.assignee,
      'requester', NEW.requester,
      'title', NEW.title,
      'priority', NEW.priority,
      'timestamp', NOW()
    );
    
    -- 通知任务接收人 (assignee)
    target_user = NEW.assignee;
    IF target_user IS NOT NULL THEN
      PERFORM pg_notify('task_channel', jsonb_build_object(
        'target_user', target_user,
        'notification', notify_payload
      )::text);
    END IF;
    
    -- 通知任务发送人 (requester) - 确认任务已创建
    target_user = NEW.requester;
    IF target_user IS NOT NULL AND target_user != NEW.assignee THEN
      PERFORM pg_notify('task_channel', jsonb_build_object(
        'target_user', target_user,
        'notification', jsonb_build_object(
          'event', 'TASK_CONFIRMED',
          'task_id', NEW.id,
          'title', NEW.title,
          'timestamp', NOW()
        )
      )::text);
    END IF;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- 状态变更时通知
    IF OLD.status != NEW.status THEN
      notify_payload = jsonb_build_object(
        'event', 'TASK_STATUS_CHANGED',
        'task_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'result', NEW.result,
        'timestamp', NOW()
      );
      
      -- 通知任务接收人
      target_user = NEW.assignee;
      IF target_user IS NOT NULL THEN
        PERFORM pg_notify('task_channel', jsonb_build_object(
          'target_user', target_user,
          'notification', notify_payload
        )::text);
      END IF;
      
      -- 任务完成/失败时通知发送人
      IF NEW.status = 'COMPLETED' OR NEW.status = 'FAILED' OR NEW.status = 'REJECTED' THEN
        target_user = NEW.requester;
        IF target_user IS NOT NULL THEN
          PERFORM pg_notify('task_channel', jsonb_build_object(
            'target_user', target_user,
            'notification', notify_payload
          )::text);
        END IF;
      END IF;
    END IF;
    
    -- 结果更新时通知接收人
    IF (OLD.result IS DISTINCT FROM NEW.result) AND NEW.status = 'COMPLETED' THEN
      notify_payload = jsonb_build_object(
        'event', 'TASK_RESULT_READY',
        'task_id', NEW.id,
        'result', NEW.result,
        'timestamp', NOW()
      );
      
      target_user = NEW.assignee;
      IF target_user IS NOT NULL THEN
        PERFORM pg_notify('task_channel', jsonb_build_object(
          'target_user', target_user,
          'notification', notify_payload
        )::text);
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 绑定触发器到任务表
CREATE TRIGGER tasks_notify_trigger
AFTER INSERT OR UPDATE ON shared.tasks
FOR EACH ROW 
WHEN (PG_TRIGGER_DEPTH() = 0) -- 避免递归触发
EXECUTE FUNCTION notify_task_change();

-- 3. 可选：为消息表也添加通知（如果需要）
-- DROP TRIGGER IF EXISTS messages_notify_trigger ON shared.inter_agent_messages;
-- CREATE OR REPLACE FUNCTION notify_message_change()
-- RETURNS trigger AS $$
-- BEGIN
--   IF TG_OP = 'INSERT' THEN
--     PERFORM pg_notify('message_channel', jsonb_build_object(
--       'event', 'MESSAGE_RECEIVED',
--       'message_id', NEW.id,
--       'from_agent', NEW.from_agent,
--       'to_agent', NEW.to_agent,
--       'msg_type', NEW.msg_type,
--       'timestamp', NOW()
--     )::text);
--   END IF;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- 
-- CREATE TRIGGER messages_notify_trigger
-- AFTER INSERT ON shared.inter_agent_messages
-- FOR EACH ROW EXECUTE FUNCTION notify_message_change();

-- =============================================================================
-- 测试通知
-- =============================================================================
-- SELECT pg_notify('task_channel', '{"test": "notification works"}');

-- 手动测试触发器
-- UPDATE shared.tasks SET status = status WHERE id = 1;

-- 查看当前监听状态
-- SELECT * FROM pg_catalog.pg_stat_activity WHERE query LIKE '%LISTEN%';

-- =============================================================================
-- 注意事项
-- =============================================================================
-- 1. 每个 Agent 启动时执行: LISTEN task_channel;
-- 2. 通知 payload 格式: {"target_user": "xxx_user", "notification": {...}}
-- 3. Agent 应该只处理 target_user 匹配自己的通知
-- 4. 如需调试，可查看 PostgreSQL 日志: show log_min_messages; set log_min_messages = 'notice';
-- =============================================================================
