OpenClaw 部署架构：
- 源码仓库：~/WorkStation/mine/claw/openclaw/（只读，不改动，纯部署用）
- 配置仓库：~/WorkStation/mine/claw/ClawTeam/（可改动的配置代码）
- 本机部署实例：openclaw-secretariat（位于 ClawTeam/openclaw-secretariat/）
- Gateway 通过 LaunchAgent (ai.openclaw.gateway.plist) 管理
- 配置：飞书通道（websocket），端口 18789，主模型 qwen3.6-plus（通过 coding.dashscope）