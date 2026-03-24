# OpenClaw 语义检索配置指南

**文档版本：** 1.0  
**更新日期：** 2026-03-23  
**Embedding 模型：** 阿里云 text-embedding-v4

---

## 📋 概述

本文档说明如何为 OpenClaw Agent 团队配置阿里云 text-embedding-v4 语义检索功能。

### 功能说明

- **语义搜索** - 支持自然语言查询记忆（如"上周讨论的项目"）
- **向量索引** - 使用 1024 维向量存储记忆
- **自动索引** - 记忆文件变更后自动更新索引
- **混合检索** - 支持向量 + 关键词混合搜索

---

## 🔧 前置条件

### 1. 阿里云 API Key

确保已获取有效的 DashScope API Key：
- 格式：`sk-<your-dashscope-api-key>`
- 权限：需开通 Embedding 服务
- 控制台：https://dashscope.console.aliyun.com/apiKey

### 2. memory-core 插件

确保已安装 memory-core 插件：
```bash
ls -la /opt/openclaw/extensions/memory-core/
```

---

## 📁 配置文件位置

每个 Agent 的配置文件位于：
```
/opt/openclaw-team/<agent-name>/.openclaw/openclaw.json
```

### Agent 目录列表

| Agent | 配置路径 |
|-------|----------|
| orchestrator | `/opt/openclaw-team/orchestrator/.openclaw/openclaw.json` |
| dev | `/opt/openclaw-team/dev/.openclaw/openclaw.json` |
| pm | `/opt/openclaw-team/pm/.openclaw/openclaw.json` |
| design | `/opt/openclaw-team/design/.openclaw/openclaw.json` |
| ads | `/opt/openclaw-team/ads/.openclaw/openclaw.json` |
| sales | `/opt/openclaw-team/sales/.openclaw/openclaw.json` |
| marketing | `/opt/openclaw-team/marketing/.openclaw/openclaw.json` |
| project | `/opt/openclaw-team/project/.openclaw/openclaw.json` |
| qa | `/opt/openclaw-team/qa/.openclaw/openclaw.json` |
| support | `/opt/openclaw-team/support/.openclaw/openclaw.json` |
| spatial | `/opt/openclaw-team/spatial/.openclaw/openclaw.json` |
| expert | `/opt/openclaw-team/expert/.openclaw/openclaw.json` |
| game | `/opt/openclaw-team/game/.openclaw/openclaw.json` |

---

## ⚙️ 配置步骤

### 步骤 1：备份配置

```bash
cd /opt/openclaw-team/<agent-name>/.openclaw/
cp openclaw.json openclaw.json.bak.$(date +%Y%m%d)
```

### 步骤 2：添加 memorySearch 配置

编辑 `openclaw.json`，在 `agents.defaults` 下添加：

```json
{
  "agents": {
    "defaults": {
      "workspace": "/opt/openclaw-team/<agent-name>/workspace",
      "memorySearch": {
        "provider": "openai",
        "model": "text-embedding-v4",
        "remote": {
          "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
          "apiKey": "${DASHSCOPE_API_KEY}"
        }
      }
    }
  }
}
```

### 步骤 3：配置插件

在 `plugins` 部分添加/修改：

```json
{
  "plugins": {
    "allow": [
      "memory-core",
      "其他已允许的插件..."
    ],
    "load": {
      "paths": [
        "/opt/openclaw/extensions/memory-core"
      ]
    },
    "slots": {
      "memory": "memory-core"
    },
    "entries": {
      "memory-core": {
        "enabled": true
      }
    }
  }
}
```

### 步骤 4：创建 memory 目录

```bash
mkdir -p /opt/openclaw-team/<agent-name>/workspace/memory
touch /opt/openclaw-team/<agent-name>/workspace/MEMORY.md
```

### 步骤 5：初始化索引

```bash
openclaw memory index --agent <agent-name> --verbose
```

### 步骤 6：验证配置

```bash
openclaw memory status --agent <agent-name>
```

**预期输出：**
```
Memory Search (<agent-name>)
Provider: openai (requested: openai)
Model: text-embedding-v4
Sources: memory
Indexed: 1/1 files · 1 chunks
Dirty: no
Embeddings: ready
Vector: ready
Vector dims: 1024
```

---

## 🚀 批量配置脚本

创建脚本 `/opt/openclaw-team/monitor/enable-memory-search.sh`：

```bash
#!/bin/bash
# OpenClaw Memory Search 批量配置脚本

set -e

API_KEY="${DASHSCOPE_API_KEY:?set DASHSCOPE_API_KEY}"
BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
MEMORY_CORE_PATH="/opt/openclaw/extensions/memory-core"

AGENTS=("orchestrator" "dev" "pm" "design" "ads" "sales" "marketing" "project" "qa" "support" "spatial" "expert" "game")

for agent in "${AGENTS[@]}"; do
    CONFIG_DIR="/opt/openclaw-team/${agent}/.openclaw"
    CONFIG_FILE="${CONFIG_DIR}/openclaw.json"
    WORKSPACE_DIR="/opt/openclaw-team/${agent}/workspace"
    
    echo "🔧 配置 Agent: ${agent}"
    
    # 备份配置
    if [ -f "${CONFIG_FILE}" ]; then
        cp "${CONFIG_FILE}" "${CONFIG_FILE}.bak.$(date +%Y%m%d)"
    else
        echo "⚠️ 配置文件不存在：${CONFIG_FILE}"
        continue
    fi
    
    # 创建 memory 目录
    mkdir -p "${WORKSPACE_DIR}/memory"
    touch "${WORKSPACE_DIR}/MEMORY.md"
    
    # 使用 jq 注入配置（需要先安装 jq）
    if command -v jq &> /dev/null; then
        jq --arg api_key "$API_KEY" --arg base_url "$BASE_URL" --arg mem_path "$MEMORY_CORE_PATH" '
        .agents.defaults.memorySearch = {
            "provider": "openai",
            "model": "text-embedding-v4",
            "dimensions": 1024,
            "remote": {
                "baseUrl": $base_url,
                "apiKey": $api_key
            }
        } |
        .plugins.allow = (.plugins.allow + ["memory-core"] | unique) |
        .plugins.load.paths = (.plugins.load.paths + [$mem_path] | unique) |
        .plugins.slots.memory = "memory-core" |
        .plugins.entries["memory-core"] = {"enabled": true}
        ' "${CONFIG_FILE}" > "${CONFIG_FILE}.tmp" && mv "${CONFIG_FILE}.tmp" "${CONFIG_FILE}"
        
        echo "✅ ${agent} 配置完成"
    else
        echo "⚠️ 需要安装 jq: apt install jq"
    fi
done

echo "🎉 批量配置完成！"
echo "运行以下命令初始化索引："
echo "  for agent in orchestrator dev pm; do openclaw memory index --agent \$agent; done"
```

**使用方式：**
```bash
chmod +x /opt/openclaw-team/monitor/enable-memory-search.sh
/opt/openclaw-team/monitor/enable-memory-search.sh
```

---

## 🧪 测试语义检索

### CLI 测试

```bash
# 搜索记忆
openclaw memory search "项目配置"

# 查看状态
openclaw memory status --agent dev

# 强制重新索引
openclaw memory index --force --agent dev
```

### Agent 工具测试

在对话中询问：
- "我之前说过什么关于项目配置的内容？"
- "搜索记忆中关于数据库的信息"

---

## ⚠️ 常见问题

### 1. API Key 无效

**错误：** `InvalidApiKey` 或 `401 Unauthorized`

**解决：**
- 检查 API Key 是否正确
- 确认已开通 Embedding 服务
- 测试 API 连通性：
  ```bash
  curl -X POST https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model": "text-embedding-v4", "input": ["test"]}'
  ```

### 2. 插件加载失败

**错误：** `plugin not found: memory-core`

**解决：**
```bash
# 检查插件是否存在
ls -la /opt/openclaw/extensions/memory-core/

# 修复权限
chown -R root:root /opt/openclaw/extensions/memory-core/

# 添加到 allow 列表
# 编辑 openclaw.json，确保 plugins.allow 包含 "memory-core"
```

### 3. 向量维度不匹配

**错误：** `vector dimension mismatch`

**解决：**
- 删除旧索引：`rm ~/.openclaw/memory/<agent>.sqlite`
- 重新索引：`openclaw memory index --force --agent <agent>`

### 4. 索引一直为 dirty

**原因：** 文件 watcher 检测到持续变更

**解决：**
- 检查 memory 目录是否有程序持续写入
- 重启 Agent 容器：`docker restart openclaw-<agent>`

---

## 📊 配置检查清单

| 检查项 | 命令 | 预期结果 |
|--------|------|----------|
| API Key 有效 | `curl` 测试 | 返回 embedding 数据 |
| 插件已加载 | `openclaw plugins list` | memory-core: loaded |
| 索引已创建 | `ls ~/.openclaw/memory/` | `<agent>.sqlite` 存在 |
| Embeddings 就绪 | `openclaw memory status` | Embeddings: ready |
| Vector 就绪 | `openclaw memory status` | Vector: ready, dims: 1024 |
| 文件已索引 | `openclaw memory status` | Indexed: X/X files |

---

## 🔗 相关文档

- [OpenClaw Memory 概念](/opt/openclaw/docs/concepts/memory.md)
- [CLI Memory 命令](/opt/openclaw/docs/cli/memory.md)
- [阿里云 DashScope 文档](https://help.aliyun.com/zh/dashscope/)

---

## 📝 更新日志

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-03-23 | 1.0 | 初始版本，基于 text-embedding-v4 |

---

**文档维护：** 哨兵 (Sentinel) 🛡️
