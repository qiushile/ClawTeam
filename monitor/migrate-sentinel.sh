#!/bin/bash

# 哨兵配置完全整合脚本
# 将 /root/.openclaw 的内容迁移到 /opt/openclaw-team/sentinel/
# 并创建符号链接保持向后兼容

set -e

# 配置
SOURCE_DIR="/root/.openclaw"
TARGET_DIR="/opt/openclaw-team/sentinel"
BACKUP_DIR="/root/.openclaw.backup.$(date +%Y%m%d_%H%M%S)"
LOG_FILE="/var/log/openclaw-migration.log"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_color() {
    local color=$1
    local message=$2
    echo -e "${color}[$(date '+%Y-%m-%d %H:%M:%S')] ${message}${NC}" | tee -a "$LOG_FILE"
}

# 错误处理
handle_error() {
    log_color "$RED" "❌ 错误：$1"
    log_color "$YELLOW" "🔄 开始回滚..."
    
    # 恢复备份
    if [ -d "$BACKUP_DIR" ]; then
        log "恢复备份..."
        rm -rf "$SOURCE_DIR"
        mv "$BACKUP_DIR" "$SOURCE_DIR"
        log_color "$GREEN" "✅ 已回滚到迁移前状态"
    fi
    
    exit 1
}

trap 'handle_error "脚本执行失败"' ERR

# 开始迁移
main() {
    log ""
    log "=========================================="
    log "=== 哨兵配置完全整合开始 ==="
    log "=========================================="
    log ""
    
    # 步骤 0: 预检查
    log_color "$YELLOW" "【步骤 0/8】预检查..."
    
    if [ ! -d "$SOURCE_DIR" ]; then
        handle_error "源目录不存在：$SOURCE_DIR"
    fi
    
    if [ ! -d "/opt/openclaw-team" ]; then
        handle_error "Team 目录不存在：/opt/openclaw-team"
    fi
    
    # 检查是否有进行中的迁移
    if [ -d "$TARGET_DIR" ]; then
        log_color "$YELLOW" "⚠️  目标目录已存在：$TARGET_DIR"
        read -p "是否继续？这将覆盖现有目录 (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "迁移已取消"
            exit 0
        fi
    fi
    
    log_color "$GREEN" "✅ 预检查通过"
    
    # 步骤 1: 停止所有容器
    log_color "$YELLOW" "【步骤 1/8】停止所有 OpenClaw 容器..."
    
    if [ -f "/opt/openclaw-team/docker-compose.yml" ]; then
        cd /opt/openclaw-team
        docker-compose down 2>/dev/null || true
        log_color "$GREEN" "✅ 容器已停止"
    else
        log_color "$YELLOW" "⚠️  未找到 docker-compose.yml，跳过"
    fi
    
    # 步骤 2: 创建备份
    log_color "$YELLOW" "【步骤 2/8】创建备份..."
    
    log "备份目录：$BACKUP_DIR"
    cp -r "$SOURCE_DIR" "$BACKUP_DIR"
    
    if [ -d "$BACKUP_DIR" ]; then
        log_color "$GREEN" "✅ 备份完成：$(du -sh "$BACKUP_DIR" | cut -f1)"
    else
        handle_error "备份失败"
    fi
    
    # 步骤 3: 创建目标目录
    log_color "$YELLOW" "【步骤 3/8】创建目标目录..."
    
    mkdir -p "$TARGET_DIR"
    log_color "$GREEN" "✅ 目标目录已创建：$TARGET_DIR"
    
    # 步骤 4: 迁移数据
    log_color "$YELLOW" "【步骤 4/8】迁移数据..."
    
    # 迁移 workspace
    if [ -d "$SOURCE_DIR/workspace" ]; then
        log "  - 迁移 workspace/"
        mv "$SOURCE_DIR/workspace" "$TARGET_DIR/"
    fi
    
    # 迁移 extensions
    if [ -d "$SOURCE_DIR/extensions" ]; then
        log "  - 迁移 extensions/"
        mv "$SOURCE_DIR/extensions" "$TARGET_DIR/"
    fi
    
    # 迁移 credentials（敏感数据，单独处理）
    if [ -d "$SOURCE_DIR/credentials" ]; then
        log "  - 迁移 credentials/"
        mv "$SOURCE_DIR/credentials" "$TARGET_DIR/"
        chmod 700 "$TARGET_DIR/credentials"
    fi
    
    # 迁移 openclaw.json
    if [ -f "$SOURCE_DIR/openclaw.json" ]; then
        log "  - 迁移 openclaw.json"
        mv "$SOURCE_DIR/openclaw.json" "$TARGET_DIR/"
    fi
    
    # 迁移其他配置文件
    for file in AGENTS.md SOUL.md USER.md IDENTITY.md HEARTBEAT.md TOOLS.md MEMORY.md; do
        if [ -f "$SOURCE_DIR/workspace/$file" ]; then
            log "  - 迁移 $file"
            cp "$SOURCE_DIR/workspace/$file" "$TARGET_DIR/" 2>/dev/null || true
        fi
    done
    
    log_color "$GREEN" "✅ 数据迁移完成"
    
    # 步骤 5: 创建符号链接
    log_color "$YELLOW" "【步骤 5/8】创建符号链接..."
    
    # 删除原目录（已备份）
    rm -rf "$SOURCE_DIR/workspace"
    rm -rf "$SOURCE_DIR/extensions"
    rm -rf "$SOURCE_DIR/credentials"
    
    # 创建 workspace 链接
    ln -s "$TARGET_DIR/workspace" "$SOURCE_DIR/workspace"
    log "  - workspace -> $TARGET_DIR/workspace"
    
    # 创建 extensions 链接
    ln -s "$TARGET_DIR/extensions" "$SOURCE_DIR/extensions"
    log "  - extensions -> $TARGET_DIR/extensions"
    
    # 创建 credentials 链接
    ln -s "$TARGET_DIR/credentials" "$SOURCE_DIR/credentials"
    log "  - credentials -> $TARGET_DIR/credentials"
    
    log_color "$GREEN" "✅ 符号链接已创建"
    
    # 步骤 6: 更新 docker-compose.yml
    log_color "$YELLOW" "【步骤 6/8】更新 docker-compose.yml..."
    
    COMPOSE_FILE="/opt/openclaw-team/docker-compose.yml"
    if [ -f "$COMPOSE_FILE" ]; then
        # 备份 docker-compose.yml
        cp "$COMPOSE_FILE" "${COMPOSE_FILE}.bak"
        
        # 检查是否已有 sentinel 挂载配置
        if grep -q "sentinel" "$COMPOSE_FILE"; then
            log "  - docker-compose.yml 已包含 sentinel 配置"
        else
            # 添加 sentinel 挂载配置到 orchestrator
            sed -i "s|- ./openclaw-orchestrator:/home/node/.openclaw|- ./openclaw-orchestrator:/home/node/.openclaw\n      - ./sentinel/workspace:/home/node/.openclaw/workspace\n      - ./sentinel/extensions:/home/node/.openclaw/extensions\n      - ./sentinel/credentials:/home/node/.openclaw/credentials|g" "$COMPOSE_FILE"
            log "  - 已添加 sentinel 挂载配置"
        fi
        
        # 同样更新 dev 和 pm
        for agent in openclaw-dev openclaw-pm; do
            sed -i "s|- ./$agent:/home/node/.openclaw|- ./$agent:/home/node/.openclaw\n      - ./sentinel/workspace:/home/node/.openclaw/workspace\n      - ./sentinel/extensions:/home/node/.openclaw/extensions|g" "$COMPOSE_FILE"
        done
        
        log_color "$GREEN" "✅ docker-compose.yml 已更新"
    else
        log_color "$YELLOW" "⚠️  未找到 docker-compose.yml，跳过"
    fi
    
    # 步骤 7: 验证符号链接
    log_color "$YELLOW" "【步骤 7/8】验证符号链接..."
    
    for link in workspace extensions credentials; do
        if [ -L "$SOURCE_DIR/$link" ]; then
            target=$(readlink "$SOURCE_DIR/$link")
            if [ -d "$target" ]; then
                log_color "$GREEN" "  ✅ $link -> $target (有效)"
            else
                handle_error "符号链接目标不存在：$target"
            fi
        else
            handle_error "符号链接创建失败：$SOURCE_DIR/$link"
        fi
    done
    
    # 步骤 8: 清理和总结
    log_color "$YELLOW" "【步骤 8/8】清理和总结..."
    
    # 设置正确的权限
    chmod 755 "$TARGET_DIR"
    chmod 700 "$TARGET_DIR/credentials"
    chmod 600 "$TARGET_DIR/openclaw.json" 2>/dev/null || true
    
    log ""
    log "=========================================="
    log "=== 迁移完成 ==="
    log "=========================================="
    log ""
    log "📁 新目录结构："
    log "  源目录：$SOURCE_DIR"
    log "  目标目录：$TARGET_DIR"
    log "  备份目录：$BACKUP_DIR"
    log ""
    log "🔗 符号链接："
    log "  $SOURCE_DIR/workspace -> $TARGET_DIR/workspace"
    log "  $SOURCE_DIR/extensions -> $TARGET_DIR/extensions"
    log "  $SOURCE_DIR/credentials -> $TARGET_DIR/credentials"
    log ""
    log "📝 下一步操作："
    log "  1. 检查 docker-compose.yml 配置"
    log "  2. 启动容器：cd /opt/openclaw-team && docker-compose up -d"
    log "  3. 验证功能：openclaw status"
    log "  4. 确认无误后删除备份：rm -rf $BACKUP_DIR"
    log ""
    log_color "$GREEN" "✅ 迁移成功完成！"
}

# 执行
main "$@"
