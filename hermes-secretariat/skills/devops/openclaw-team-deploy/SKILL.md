---
name: openclaw-team-deploy
description: Configure, deploy, and manage OpenClaw Team multi-agent deployment — model assignment, docker-compose config, remote deployment via SSH/Tailscale.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [openclaw, deployment, docker, model-config, devops]
    related_skills: [openclaw-troubleshooting]
---

# OpenClaw Team 部署配置

## 架构概览

- **源码目录（只读）**：`~/WorkStation/mine/claw/openclaw/`（本地），`/opt/openclaw/`（远程）
- **配置仓库（可改动）**：`~/WorkStation/mine/claw/ClawTeam/`（本地），`/opt/openclaw-team/`（远程）
- **本地 Secretariat**：`~/.openclaw/`，通过 LaunchAgent 管理
- **远程部署**：SSH `root@ubuntu24.tailcc8506.ts.net`（Tailscale）
- **远程 Sentinel**：systemd 服务 `openclaw.service`，EnvironmentFile=`/opt/openclaw-team/.env`
- **远程 Agents**：Docker Compose 管理，13+ 容器

## 模型分配模式

Team 使用两个主力模型：

| 模型 | 端点 | Agent（10个） |
|------|------|--------------|
| qwen3.6-plus | `coding.dashscope.aliyuncs.com/v1` | orchestrator, dev, ads, project, qa, spatial, game, finance, hr, supply-chain |
| GLM-5.1 (astron-code-latest) | `maas-coding-api.cn-huabei-1.xf-yun.com/v2` | pm, design, sales, marketing, support, expert, academic, legal |

### docker-compose.yml 配置模板

**qwen3.6-plus Agent：**
```yaml
environment:
  - OPENAI_API_KEY=${ALIYUN_API_KEY}
  - OPENAI_BASE_URL=${ALIYUN_BASE_URL}
  - OPENAI_MODEL=qwen3.6-plus
```

**GLM-5.1 Agent：**
```yaml
environment:
  - OPENAI_API_KEY=${IFLYTEK_API_KEY}
  - OPENAI_BASE_URL=${IFLYTEK_OPENAI_URL}
  - OPENAI_MODEL=${IFLYTEK_MODEL}
```

## .env 关键变量

```bash
# 阿里通义
ALIYUN_API_KEY=sk-sp-xxx
ALIYUN_BASE_URL=https://coding.dashscope.aliyuncs.com/v1

# 科大讯飞
IFLYTEK_API_KEY=app_id:api_secret
IFLYTEK_OPENAI_URL=https://maas-coding-api.cn-huabei-1.xf-yun.com/v2
IFLYTEK_ANTHROPIC_URL=https://maas-coding-api.cn-huabei-1.xf-yun.com/anthropic
IFLYTEK_MODEL=astron-code-latest

# 数据库
POSTGRES_PASSWORD=xxx
ORCHESTRATOR_DB_PASS=xxx
DEV_DB_PASS=xxx
# ... 各 Agent 独立 DB 密码
```

## 部署流程

### 1. 本地修改配置

```bash
cd ~/WorkStation/mine/claw/ClawTeam
# 编辑 .env 或 docker-compose.yml
```

### 2. 提交并推送

```bash
git add -A
git commit -m "chore: update config description"
git push
```

### 3. 部署到远程

```bash
scp .env docker-compose.yml root@ubuntu24.tailcc8506.ts.net:/opt/openclaw-team/
```

### 4. 远程重启

```bash
ssh root@ubuntu24.tailcc8506.ts.net "cd /opt/openclaw-team && docker compose up -d"
```

### 5. 验证

```bash
# 检查容器状态
ssh root@ubuntu24.tailcc8506.ts.net "docker ps --format 'table {{.Names}}\t{{.Status}}'"

# 检查 Sentinel
ssh root@ubuntu24.tailcc8506.ts.net "systemctl status openclaw.service --no-pager"

# 查看日志
ssh root@ubuntu24.tailcc8506.ts.net "docker logs --tail 50 openclaw-dev"
```

## ⚠️ 关键陷阱

### API Key 端点兼容性
- `sk-sp-*` 前缀的 Key **仅**对 `coding.dashscope.aliyuncs.com/v1` 有效
- 用于 `dashscope.aliyuncs.com/compatible-mode/v1` 会返回 HTTP 401
- 两个端点**不共用**同一个 Key
- `.env` 中 `ALIYUN_BASE_URL` 和 `openclaw.json` 中 `models.providers.qwen.baseUrl` 必须保持一致

### 多模型切换注意事项
- OpenClaw 的 `OPENAI_API_KEY` + `OPENAI_BASE_URL` + `OPENAI_MODEL` 三个变量必须**匹配**
- 常见错误：使用阿里 Key 指向讯飞端点，或反过来
- 切换模型时三个变量必须**同时改**，不能只改模型名

### SSH/Tailscale 连接不稳定
- 远程服务器通过 Tailscale 访问，连接可能超时
- 大文件传输（如完整 docker-compose.yml）可能因网络波动中断
- 解决方案：
  - 使用 `scp` 前先用 `ssh -o ConnectTimeout=5` 测试连通性
  - 超时后等待 30-60 秒重试
  - 可考虑先 `git pull` 到远程再本地重建

## 本地 Secretariat 配置

编辑 `~/.openclaw/openclaw.json` 添加新模型 provider：

```json
{
  "models": {
    "providers": {
      "iflytek": {
        "baseUrl": "${IFLYTEK_OPENAI_URL}",
        "api": "openai-completions",
        "models": [{
          "id": "astron-code-latest",
          "name": "GLM-5.1",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 200000,
          "maxTokens": 65536,
          "api": "openai-completions"
        }]
      }
    }
  },
  "auth": {
    "profiles": {
      "iflytek:default": {
        "provider": "iflytek",
        "mode": "api_key"
      }
    }
  }
}
```

重启生效：`launchctl stop ai.openclaw.gateway && launchctl start ai.openclaw.gateway`

## 端口映射

| Agent | Gateway 端口 | Web 端口 |
|-------|:-----------:|:-------:|
| orchestrator | 18001 | 13001 |
| dev | 18002 | 13002 |
| pm | 18003 | 13003 |
| design | 18004 | 13004 |
| ads | 18005 | 13005 |
| sales | 18006 | 13006 |
| marketing | 18007 | 13007 |
| project | 18008 | 13008 |
| qa | 18009 | 13009 |
| support | 18010 | 13010 |
| spatial | 18011 | 13011 |
| expert | 18012 | 13012 |
| game | 18013 | 13013 |
| secretariat（本地） | 18789 | — |
