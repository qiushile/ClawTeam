# OpenClaw 自动模型切换指南

## 当前状态

打开 `/root/.openclaw/openclaw.json` 中的 `models` 部分可以看到可用的模型配置。

## 三种自动切换方案

### 方案 A：基于任务的智能路由（推荐）

创建一个自动模型路由脚本 `/root/.openclaw/scripts/model-router.py`：

```python
#!/usr/bin/env python3
import json

def route_model(task_type):
    """根据任务类型返回合适的模型"""
    routing = {
        'simple': 'qwen3.5-flash',      # 简单问答
        'code': 'claude-3-7-sonnet',     # 代码编写
        'longdoc': 'gemini-2.5-pro',     # 长文档
        'deepreasoning': 'qwen3.5-35b-a3b'  # 深度推理
    }
    return routing.get(task_type, 'qwen3.5-35b-a3b')
```

### 方案 B：基于时间段的定时轮换

在 `HEARTBEAT.md` 中添加：

```markdown
# HEARTBEAT.md

## 时间型模型轮换

每次心跳检查时，根据当前时间自动选择模型：

- 早上 (06:00-12:00): qwen3.5-flash - 快速响应
- 下午 (12:00-18:00): claude-3-7-sonnet - 强推理  
- 晚上 (18:00-24:00): gemini-2.5-pro - 长上下文
- 深夜 (00:00-06:00): qwen3.5-35b-a3b - 稳定模式

检查频率：每 2-4 小时一次
```

### 方案 C：混合模式自动切换

在 `openclaw.json` 中设置：

```json
{
  "models": {
    "mode": "merge",  // 混合格式，系统会自动选择最佳模型
    "providers": {
      "aliyun": { ... },
      "anthropic": { ... },
      "google": { ... }
    }
  }
}
```

## 手动切换方法

临时切换当前会话模型：
```
/status model:<model-id>
```

永久修改默认模型：编辑 `openclaw.json` 中的默认模型配置。

## 推荐实践

对于日常使用，**建议开启混合格式 (`mode: merge`)**：
- ✅ 系统会自动选择最合适的模型
- ✅ 无需手动维护切换逻辑
- ✅ 在不同任务间无缝切换
- ⚠️ 成本可能稍高（但质量更好）

如果想要更精细的控制，使用**方案 A** + **自定义路由规则**。
