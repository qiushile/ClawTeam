#!/bin/bash
# =============================================================================
# PostgreSQL LISTEN/NOTIFY 完整初始化脚本
# 执行者：数据库管理员 (root)
# 用途：为所有部门配置实时任务通知机制
# =============================================================================

set -e

DB_HOST="${OPENCLAW_DB_HOST:-postgres-db}"
DB_PORT="${OPENCLAW_DB_PORT:-5432}"
DB_NAME="${OPENCLAW_DB_NAME:-openclaw_db}"
DB_USER="${OPENCLAW_DB_USER:-dev_user}"
DB_PASSWORD="${OPENCLAW_DB_PASSWORD:?set OPENCLAW_DB_PASSWORD}"
export PGPASSWORD="$DB_PASSWORD"

echo "=========================================="
echo "PostgreSQL LISTEN/NOTIFY 初始化"
echo "=========================================="

# 1. 执行 SQL 初始化脚本
echo "步骤 1: 创建触发器和函数..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" <<'SQL'
-- 删除已存在的对象（可选，用于重置）
DROP TRIGGER IF EXISTS tasks_notify_trigger ON shared.tasks;
DROP FUNCTION IF EXISTS notify_task_change();

-- 创建通知函数
CREATE OR REPLACE FUNCTION notify_task_change()
RETURNS trigger AS $$
DECLARE
  notify_payload jsonb;
  target_user TEXT;
BEGIN
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
    
    target_user = NEW.assignee;
    IF target_user IS NOT NULL THEN
      PERFORM pg_notify('task_channel', jsonb_build_object(
        'target_user', target_user,
        'notification', notify_payload
      )::text);
    END IF;
    
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
    IF OLD.status != NEW.status THEN
      notify_payload = jsonb_build_object(
        'event', 'TASK_STATUS_CHANGED',
        'task_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
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
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 绑定触发器
CREATE TRIGGER tasks_notify_trigger
AFTER INSERT OR UPDATE ON shared.tasks
FOR EACH ROW 
WHEN (PG_TRIGGER_DEPTH() = 0)
EXECUTE FUNCTION notify_task_change();

SELECT '✅ 触发器创建成功' as status;
SQL

echo ""
echo "步骤 2: 验证触发器是否存在..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT tgname, tgrelid::regclass 
FROM pg_trigger 
WHERE tgname = 'tasks_notify_trigger';
"

echo ""
echo "=========================================="
echo "✅ 初始化完成！"
echo "=========================================="
echo ""
echo "下一步：Agent 端 LISTEN 逻辑已在 postgres-tool 中实现"
echo "启动 Gateway 后自动监听，无需额外操作"
echo ""
echo "测试通知："
echo "  UPDATE shared.tasks SET status = status WHERE id = <task_id>;"
echo ""
echo "查看通知："
echo "  tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log"
echo ""
unset PGPASSWORD
