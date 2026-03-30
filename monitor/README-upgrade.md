# OpenClaw 升级指南

## 📋 概述

本项目提供两个独立的脚本：

| 脚本 | 用途 | 目标 | 写操作 |
|------|------|------|--------|
| `upgrade-sentinel.sh` | 升级哨兵源码 | `/opt/openclaw` | Git 操作 |
| `upgrade-team.sh` | 升级团队容器 | Docker OpenClaw 团队 | 配置文件 |

---

## 🛡️ 升级哨兵自己

**脚本路径**: `/opt/openclaw-team/monitor/upgrade-sentinel.sh`

**升级对象**: `/opt/openclaw` - OpenClaw 源码（哨兵自己）

**写操作**: 仅 Git 操作（checkout/fetch/pull），不创建新文件/文件夹

### 快速使用

```bash
# 查看当前版本
/opt/openclaw-team/monitor/upgrade-sentinel.sh --current

# 列出可用版本
/opt/openclaw-team/monitor/upgrade-sentinel.sh --list

# 升级到指定版本
/opt/openclaw-team/monitor/upgrade-sentinel.sh --upgrade v2026.3.28

# 一键升级到最新
/opt/openclaw-team/monitor/upgrade-sentinel.sh --latest

# 模拟升级（不实际执行）
/opt/openclaw-team/monitor/upgrade-sentinel.sh --dry-run --latest

# 查看变更日志
/opt/openclaw-team/monitor/upgrade-sentinel.sh --changelog v2026.3.28

# 验证升级
/opt/openclaw-team/monitor/upgrade-sentinel.sh --verify
```

### 完整帮助

```bash
/opt/openclaw-team/monitor/upgrade-sentinel.sh --help
```

### 输出示例

```
╔══════════════════════════════════════════════════════════╗
║       哨兵升级工具 - Sentinel Upgrade Tool               ║
╚══════════════════════════════════════════════════════════╝

当前版本：v2026.3.28
当前分支：v2026.3.28
提交哈希：f9b1079283
提交日期：2026-03-29

可用版本 (最近 20 个):
v2026.3.28
v2026.3.24
v2026.3.23-2
...
```

---

## 🐳 升级团队容器

**脚本路径**: `/opt/openclaw-team/monitor/upgrade-team.sh`

**升级对象**: `/opt/openclaw-team` - Docker OpenClaw 团队容器

**影响范围**: 停止并重启所有 OpenClaw 容器（约 30-60 秒停机）

### 快速使用

```bash
# 查看当前状态
/opt/openclaw-team/monitor/upgrade-team.sh --current

# 列出可用版本
/opt/openclaw-team/monitor/upgrade-team.sh --list

# 升级到指定版本
/opt/openclaw-team/monitor/upgrade-team.sh --upgrade v2026.3.28

# 从源码构建并升级
/opt/openclaw-team/monitor/upgrade-team.sh --rebuild v2026.3.28

# 验证容器健康
/opt/openclaw-team/monitor/upgrade-team.sh --verify

# 重启容器
/opt/openclaw-team/monitor/upgrade-team.sh --restart

# 停止容器
/opt/openclaw-team/monitor/upgrade-team.sh --stop

# 启动容器
/opt/openclaw-team/monitor/upgrade-team.sh --start

# 模拟升级
/opt/openclaw-team/monitor/upgrade-team.sh --dry-run --upgrade v2026.3.28
```

### 完整帮助

```bash
/opt/openclaw-team/monitor/upgrade-team.sh --help
```

---

## 🔒 安全特性

### 哨兵升级脚本

- ✅ **仅 Git 操作** - checkout/fetch/pull，不创建新文件
- ✅ Root 权限检查
- ✅ 工作区未提交更改检测
- ✅ 升级后自动验证
- ✅ 日志记录到 `/opt/openclaw-team/monitor/`

### 团队升级脚本

- ✅ Root 权限检查
- ✅ Docker/Docker Compose 检查
- ✅ 自动备份配置文件到 `/opt/openclaw-team/backups/`
- ✅ 容器健康状态验证
- ✅ 升级流程预览
- ✅ 详细日志记录

---

## 📊 升级流程对比

| 步骤 | 哨兵升级 | 团队升级 |
|------|----------|----------|
| 1 | 检查权限和 Git | 检查权限和 Docker |
| 2 | 显示当前版本 | 显示容器状态 |
| 3 | Git fetch 标签 | 备份 docker-compose.yml |
| 4 | Git checkout 版本 | 停止容器 |
| 5 | 验证升级 | 更新镜像版本 |
| 6 | 完成（无停机） | 启动容器 |
| 7 | - | 验证健康（~60 秒停机） |

---

## 🎯 使用场景

### 场景 1: 只升级哨兵自己
```bash
# 适用于：获取最新的 OpenClaw 功能，不影响运行中的容器
/opt/openclaw-team/monitor/upgrade-sentinel.sh --latest
```
- ✅ 无停机
- ✅ 仅 Git 操作
- ✅ 不创建新文件

### 场景 2: 只升级团队容器
```bash
# 适用于：更新运行中的 Docker 容器镜像
/opt/openclaw-team/monitor/upgrade-team.sh --upgrade v2026.3.28
```
- ⚠️ 30-60 秒停机
- ✅ 容器镜像更新

### 场景 3: 完整升级（哨兵 + 团队）
```bash
# 1. 先升级哨兵
/opt/openclaw-team/monitor/upgrade-sentinel.sh --latest

# 2. 再升级团队
/opt/openclaw-team/monitor/upgrade-team.sh --upgrade v2026.3.28
```

### 场景 4: 从源码构建团队镜像
```bash
# 适用于：使用最新的未发布代码
/opt/openclaw-team/monitor/upgrade-team.sh --rebuild v2026.3.28
```

---

## ⚠️ 注意事项

### 哨兵升级
- ✅ 仅 Git 操作（checkout/fetch/pull）
- ✅ 不创建任何新文件/文件夹
- ✅ 无停机时间
- ⚠️ 需要 root 权限

### 团队升级
- ⚠️ **会导致服务短暂中断**（约 30-60 秒）
- ⚠️ 建议在业务低峰期执行
- ⚠️ 升级前确保重要任务已完成
- ⚠️ 升级后验证所有容器健康

---

## 🛡️ 回滚指南

### 哨兵回滚

```bash
# 1. 切换到旧版本
cd /opt/openclaw
git checkout v2026.3.23-2  # 替换为目标版本

# 2. 验证
/opt/openclaw-team/monitor/upgrade-sentinel.sh --verify
```

### 团队回滚

```bash
# 1. 找到备份配置
ls -la /opt/openclaw-team/backups/

# 2. 恢复 docker-compose.yml
cp /opt/openclaw-team/backups/team-backup-*.docker-compose.yml /opt/openclaw-team/docker-compose.yml

# 3. 重启容器
/opt/openclaw-team/monitor/upgrade-team.sh --restart
```

---

## 📝 日志文件

所有操作都会记录日志：

| 脚本 | 日志路径 |
|------|----------|
| 哨兵升级 | `/opt/openclaw-team/monitor/sentinel-upgrade-YYYYMMDD-HHMMSS.log` |
| 团队升级 | `/opt/openclaw-team/monitor/team-upgrade-YYYYMMDD-HHMMSS.log` |

---

## 🔧 故障排查

### 哨兵升级失败

```bash
# 检查 Git 状态
cd /opt/openclaw
git status

# 手动切换版本
git checkout v2026.3.28

# 验证
git describe --tags --always
```

### 团队升级失败

```bash
# 检查容器日志
docker logs openclaw-orchestrator --tail 50

# 检查容器状态
docker ps -a | grep openclaw

# 手动重启
cd /opt/openclaw-team
docker-compose down
docker-compose up -d
```

---

## 📊 版本历史

| 版本 | 日期 | 关键变更 |
|------|------|----------|
| v2026.3.28 | 2026-03-28 | CJK 内存优化、安全修复 |
| v2026.3.24 | 2026-03-24 | 稳定版 |
| v2026.3.23-2 | 2026-03-23 | 当前运行版本 |

---

## 📁 文件结构

```
/opt/openclaw-team/monitor/
├── upgrade-sentinel.sh    # 哨兵升级脚本（仅 Git 操作）
├── upgrade-team.sh        # 团队升级脚本
├── README-upgrade.md      # 此文档
├── daily-check.sh         # 日常检查脚本
├── daily-report.sh        # 每日汇报脚本
└── *.log                  # 日志文件
```

---

*最后更新：2026-03-30*  
*维护者：哨兵 (Sentinel) 🛡️*
