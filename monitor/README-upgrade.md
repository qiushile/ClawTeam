# OpenClaw 升级指南

## 📋 概述

此升级脚本用于升级 `/opt/openclaw` 源码，**不影响** `/opt/openclaw-team` 的 Docker 容器。

## 🚀 快速使用

### 查看当前版本
```bash
/opt/openclaw-team/monitor/upgrade-openclaw.sh --current
```

### 列出可用版本
```bash
/opt/openclaw-team/monitor/upgrade-openclaw.sh --list
```

### 升级到指定版本
```bash
# 升级到 v2026.3.28
/opt/openclaw-team/monitor/upgrade-openclaw.sh --upgrade v2026.3.28
```

### 升级到最新版本
```bash
/opt/openclaw-team/monitor/upgrade-openclaw.sh --latest
```

### 验证升级
```bash
/opt/openclaw-team/monitor/upgrade-openclaw.sh --verify
```

## 📝 完整帮助

```bash
/opt/openclaw-team/monitor/upgrade-openclaw.sh --help
```

## 🔒 安全特性

1. **自动备份** - 升级前自动备份到 `/opt/openclaw/backups/`
2. **工作区检查** - 检测未提交的更改并提示确认
3. **版本验证** - 升级后自动验证版本
4. **日志记录** - 所有操作记录到 `/opt/openclaw-team/monitor/upgrade-YYYYMMDD-HHMMSS.log`

## ⚠️ 注意事项

1. **需要 root 权限** - 使用 `sudo` 或直接以 root 运行
2. **不影响 Docker** - 此脚本只升级源码，Docker 容器需手动更新
3. **备份策略** - 建议定期清理旧备份释放空间

## 🔄 升级 Docker 容器（可选）

如需同时升级 Docker 容器：

```bash
cd /opt/openclaw-team

# 1. 停止容器
docker-compose down

# 2. 更新 docker-compose.yml 中的镜像版本
# 编辑文件，将 image: openclaw:v2026.3.23-2 改为目标版本

# 3. 启动容器
docker-compose up -d

# 4. 验证
docker ps | grep openclaw
```

## 📊 版本历史

| 版本 | 日期 | 关键变更 |
|------|------|----------|
| v2026.3.28 | 2026-03-28 | CJK 内存优化、安全修复 |
| v2026.3.23-2 | 2026-03-23 | 当前运行版本 |
| v2026.3.22 | 2026-03-22 | 稳定版 |

## 🛡️ 回滚

如需回滚到备份版本：

```bash
# 1. 找到备份目录
ls -la /opt/openclaw/backups/

# 2. 停止相关服务
docker-compose down

# 3. 恢复备份
rm -rf /opt/openclaw
cp -r /opt/openclaw/backups/openclaw-backup-<版本> /opt/openclaw

# 4. 重启服务
docker-compose up -d
```

---

*最后更新：2026-03-30*
