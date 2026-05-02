OpenClaw 部署架构：
- 源码仓库：~/WorkStation/mine/claw/openclaw/（只读，不改动，纯部署用）
- 配置仓库：~/WorkStation/mine/claw/ClawTeam/（可改动的配置代码）
- 本机部署实例：openclaw-secretariat（位于 ClawTeam/openclaw-secretariat/）
- Gateway 通过 LaunchAgent (ai.openclaw.gateway.plist) 管理
- 配置：飞书通道（websocket），端口 18789，主模型 qwen3.6-plus（通过 coding.dashscope）
§
DashScope API Key 端点兼容性：`sk-sp-*` 前缀的 Key 仅对 `coding.dashscope.aliyuncs.com/v1` 有效，用于 `dashscope.aliyuncs.com/compatible-mode/v1` 会返回 HTTP 401 "Incorrect API key provided"。两个端点不共用同一个 Key。OpenClaw 的 `.env` 中 `ALIYUN_BASE_URL` 和 `openclaw.json` 中 `models.providers.qwen.baseUrl` 必须保持一致。
§
openclaw-team 部署架构：
- 远程服务器：ssh root@ubuntu24.tailcc8506.ts.net
- 源码/构建基础目录：/opt/openclaw/（sentinel 运行目录，Docker 镜像构建源）
- 配置仓库目录：/opt/openclaw-team/（.env、docker-compose.yml、sentinel 配置等）
- sentinel：systemctl 管理，服务名 openclaw.service，运行于 /opt/openclaw/，EnvironmentFile=/opt/openclaw-team/.env
- openclaw-dev/pm/design/sales/qa/support/marketing/game/spatial/expert/orchestrator/ads 等：Docker 容器，镜像由 /opt/openclaw/ 构建
- openclaw-secretariat：本地 LaunchAgent 部署（本机 ~/.openclaw/）
- Node.js 路径：/www/server/nodejs/v24.14.0/bin/node
§
Team 模型分配：qwen3.6-plus（DashScope coding端点）和 GLM-5.1（讯飞 coding端点）。
qwen3.6-plus: orchestrator/dev/ads/project/qa/spatial/game/finance/hr/supply-chain（10个Agent）
GLM-5.1 (astron-code-latest): pm/design/sales/marketing/support/expert/academic/legal（8个Agent）
讯飞端点: openai_url=`https://maas-coding-api.cn-huabei-1.xf-yun.com/v2`, anthropic_url=`https://maas-coding-api.cn-huabei-1.xf-yun.com/anthropic`, 上下文200k
本地 openclaw.json 已添加 iflytek provider，models 列表中有 iflytek/astron-code-latest
§
ClawTeam 仓库分工：
- 远端（ubuntu24）：真正部署 OpenClaw Team 所有 Agent + sentinel 的运行环境，1.1G 工作目录
- 本地（macOS）：主要用于编辑源码 + 部署 openclaw-secretariat + 部署 hermes-secretariat
- 两边的 .env 不同（各自有独立的 API keys 和配置），均被 .gitignore 排除
§
用户有一台 m3max 的 macOS 主机作为 OrbStack VM（hostname M3Max, 用户 m3max, 内网IP 198.18.0.187, 解析名为 m3max）。从本机 SSH 到 m3max@m3max 会被直接关闭连接（TCP 握手成功但无 SSH banner），本机 ssh config 无 m3max 条目，连接走的是 OrbStack 内部网络。m3max 上 macOS 防火墙已启用。m3max 上也运行了一个 Hermes agent 实例，API Key 配置有误，需要修复。