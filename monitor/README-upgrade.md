# OpenClaw 升级指南

## 📋 概述

本项目提供两个独立的脚本：

| 脚本 | 用途 | 目标 | 是否修改 |
|------|------|------|----------|
| `check-sentinel.sh` | 检查哨兵版本（只读） | `/opt/openclaw` | ❌ 不修改 |
| `upgrade-team.sh` | 升级团队容器 | Docker OpenClaw 团队 | ✅ 修改配置 |

---

## 🛡️ 检查哨兵版本（只读）

**脚本路径**: `/opt/openclaw-team/monitor/check-sentinel.sh`

**用途**: 查看 `/opt/openclaw` 源码版本信息

**特点**: **完全只读**，不修改 `/opt/openclaw` 的任何内容

### 快速使用

```bash
# 查看当前版本
/opt/openclaw-team/monitor/check-sentinel.sh --current

# 列出可用版本
/opt/openclaw-team/monitor/check-sentinel.sh --list

# 查看完整状态报告
/opt/openclaw-team/monitor/check-sentinel.sh --status

# 查看到指定版本的变更
/opt/openclaw-team/monitor/check-sentinel.sh --diff v2026.3.28

# 查看最新版本信息
/opt/openclaw-team/monitor/check-sentinel.sh --latest

# 验证安装
/opt/openclaw-team/monitor/check-sentinel.sh --verify
```

### 完整帮助

```bash
/opt/openclaw-team/monitor/check-sentinel.sh --help
```

### 输出示例

```
╔══════════════════════════════════════════════════════════╗
║       哨兵检查工具 - Sentinel Check Tool                 ║
╚══════════════════════════════════════════════════════════╝

当前版本：v2026.3.28
当前分支：v2026.3.28
提交哈希：f9b1079283
提交日期：2026-03-28
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

### 从源码构建（可选）

```bash
# 从 /opt/openclaw 源码构建并升级
/opt/openclaw-team/monitor/upgrade-team.sh --rebuild v2026.3.28
```

**注意**: `--rebuild` 选项会读取 `/opt/openclaw` 源码构建 Docker 镜像

### 完整帮助

```bash
/opt/openclaw-team/monitor/upgrade-team.sh --help
```

---

## 🔒 安全特性

### 哨兵检查脚本

- ✅ **只读操作** - 不修改任何文件
- ✅ 无需 root 权限
- ✅ 日志保存到 `/opt/openclaw-team/monitor/`

### 团队升级脚本

- ✅ Root 权限检查
- ✅ Docker/Docker Compose 检查
- ✅ 自动备份配置文件到 `/opt/openclaw-team/backups/`
- ✅ 容器健康状态验证
- ✅ 升级流程预览
- ✅ 详细日志记录

---

## 📊 工作流程

```
1. 检查版本          check-sentinel.sh --current
                     ↓
2. 查看可用版本       check-sentinel.sh --list
                     ↓
3. 决定升级版本       (记录目标版本)
                     ↓
4. 升级团队容器       upgrade-team.sh --upgrade v2026.3.28
                     ↓
5. 验证升级          upgrade-team.sh --verify
```

---

## 🎯 使用场景

### 场景 1: 查看当前版本
```bash
# 只读检查，不影响任何服务
/opt/openclaw-team/monitor/check-sentinel.sh --current
```

### 场景 2: 查看是否可以升级
```bash
# 显示当前版本和最新版本的对比
/opt/openclaw-team/monitor/check-sentinel.sh --latest
```

### 场景 3: 升级团队容器
```bash
# 升级到最新版本
/opt/openclaw-team/monitor/upgrade-team.sh --upgrade v2026.3.28
```

### 场景 4: 从源码构建团队镜像
```bash
# 使用 /opt/openclaw 的最新源码构建镜像
/opt/openclaw-team/monitor/upgrade-team.sh --rebuild v2026.3.28
```

---

## ⚠️ 注意事项

### 哨兵检查
- ✅ 完全只读，可以随时运行
- ✅ 不影响任何服务
- ✅ 无需 root 权限

### 团队升级
- ⚠️ **会导致服务短暂中断**（约 30-60 秒）
- ⚠️ 建议在业务低峰期执行
- ⚠️ 升级前确保重要任务已完成
- ⚠️ 升级后验证所有容器健康

---

## 🛡️ 回滚指南

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
| 哨兵检查 | `/opt/openclaw-team/monitor/check-sentinel-YYYYMMDD-HHMMSS.log` |
| 团队升级 | `/opt/openclaw-team/monitor/team-upgrade-YYYYMMDD-HHMMSS.log` |

---

## 🔧 故障排查

### 容器启动失败

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

### 版本升级失败

```bash
# 查看备份
ls -la /opt/openclaw-team/backups/

# 恢复备份
cp /opt/openclaw-team/backups/team-backup-*.docker-compose.yml /opt/openclaw-team/docker-compose.yml

# 重启容器
docker-compose down && docker-compose up -d
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
├── check-sentinel.sh      # 哨兵检查脚本（只读）
├── upgrade-team.sh        # 团队升级脚本
├── README-upgrade.md      # 此文档
└── *.log                  # 日志文件
```

---

*最后更新：2026-03-30*  
*维护者：哨兵 (Sentinel) 🛡️*
