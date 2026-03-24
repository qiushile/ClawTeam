# OpenClaw Team 定时检查系统

## 📅 检查时间

每天自动执行 3 次：
- **07:50** - 早晨检查
- **11:50** - 中午检查
- **17:50** - 傍晚检查

## 🎯 功能

### 1. Git 状态检查
- 检测修改的文件
- 检测未跟踪的文件
- 统计变更数量

### 2. 敏感信息检测
自动检测以下类型的敏感信息：
- OpenAI API Keys (`sk-...`)
- GitHub Tokens (`ghp_...`, `gho_...`)
- GitLab Tokens (`glpat-...`)
- 其他 API 密钥和凭证

**注意：** 已自动排除：
- `.gitignore` 中的文件
- `.example` / `.sample` 示例文件
- `workspace/*-config.json` 配置文件
- `workspace/memory-*.json` 记忆配置

### 3. 文件分类

#### 必要文件（自动提交）
- `openclaw.json` - Agent 配置文件
- `docker-compose.yml` - Docker 编排配置
- `.env` - 环境变量
- `init.sql` - 数据库初始化脚本
- `monitor/*.sh` - 监控脚本

#### 可选文件（需要确认）
- `workspace/*.md` - 文档
- `workspace/*.log` - 日志
- `memory/*.md` - 记忆文件
- `skills/` - 技能目录
- `extensions/` - 扩展目录
- `*.bak*` - 备份文件

### 4. 自动提交
- 必要文件自动提交并推送
- 提交信息包含日期和文件列表
- 推送失败时记录警告

### 5. 报告生成
每次检查生成详细报告：
- 位置：`/opt/openclaw-team/monitor/logs/daily-check-YYYY-MM-DD.md`
- 状态文件：`/opt/openclaw-team/monitor/daily-check-state.json`

## 📂 文件结构

```
/opt/openclaw-team/monitor/
├── daily-check.sh          # 主检查脚本
├── daily-check-state.json  # 检查状态
├── heartbeat-trigger.sh    # 健康检查触发器
├── daily-report.sh         # 每日汇报脚本
└── logs/
    ├── daily-check-YYYY-MM-DD.md  # 检查报告
    └── cron-daily-check.log       # Cron 日志
```

## 🔧 手动运行

```bash
# 手动执行检查
/opt/openclaw-team/monitor/daily-check.sh

# 查看最新报告
cat /opt/openclaw-team/monitor/logs/daily-check-$(date +%Y-%m-%d).md

# 查看 Cron 日志
tail -f /opt/openclaw-team/monitor/logs/cron-daily-check.log
```

## 📋 Cron 配置

```bash
# 查看当前配置
crontab -l | grep daily-check

# 配置内容
50 7 * * * /opt/openclaw-team/monitor/daily-check.sh
50 11 * * * /opt/openclaw-team/monitor/daily-check.sh
50 17 * * * /opt/openclaw-team/monitor/daily-check.sh
```

## ⚠️ 敏感信息处理

如果检测到敏感信息：
1. 脚本会发出警告
2. 不会自动提交该文件
3. 需要人工审查确认
4. 建议将敏感文件添加到 `.gitignore`

### 常见敏感文件位置
```
workspace/*-config.json      # 包含 API 配置
workspace/credentials/       # 凭证目录
workspace/.env              # 本地环境变量
*.key, *.pem                # 密钥文件
```

## 📊 报告示例

```markdown
# OpenClaw Team 每日检查报告

**检查时间：** 2026-03-24 11:26:36

## 📊 概览
- 修改的文件：1 个必要 + 0 个可选
- 未跟踪的文件：34 个
- 敏感信息警告：1 个

## ✅ 已自动提交
  - .gitignore

## 🚨 敏感信息警告
  - openclaw-marketing/workspace/memory-test-report.md
```

## 🔐 安全建议

1. **定期审查报告** - 每天查看检查报告
2. **及时处理警告** - 敏感信息警告需要立即处理
3. **完善 .gitignore** - 将敏感文件加入忽略列表
4. **使用环境变量** - 敏感配置使用 `${VAR}` 引用
5. **定期清理 workspace** - 删除不必要的测试文件

## 🛠️ 故障排除

### Cron 不执行
```bash
# 检查 cron 服务
systemctl status cron

# 查看 cron 日志
grep CRON /var/log/syslog | tail -20
```

### 脚本执行失败
```bash
# 检查脚本权限
ls -la /opt/openclaw-team/monitor/daily-check.sh

# 手动执行查看错误
bash -x /opt/openclaw-team/monitor/daily-check.sh
```

### Git 推送失败
```bash
# 检查 Git 配置
cd /opt/openclaw-team
git remote -v
git status

# 检查认证
gh auth status
```

---

*最后更新：2026-03-24*
