#!/bin/bash

# .env 文件备份脚本
# 检查 .env 文件变更，有变更时自动备份

set -e

# 配置
TEAM_DIR="/opt/openclaw-team"
ENV_FILE="$TEAM_DIR/.env"
BACKUP_DIR="$TEAM_DIR/backups/env"
STATE_FILE="/tmp/openclaw-env-backup-state"
PLAIN_MODE=false

# 解析参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --plain)
            PLAIN_MODE=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 确保备份目录存在
mkdir -p "$BACKUP_DIR"

# 计算文件哈希
get_file_hash() {
    if [ -f "$1" ]; then
        md5sum "$1" 2>/dev/null | awk '{print $1}'
    else
        echo "not_found"
    fi
}

# 备份文件
backup_env() {
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_file="$BACKUP_DIR/.env.backup.$timestamp"
    
    cp "$ENV_FILE" "$backup_file"
    echo "$backup_file"
}

# 主逻辑
main() {
    # 检查 .env 文件是否存在
    if [ ! -f "$ENV_FILE" ]; then
        if [ "$PLAIN_MODE" = true ]; then
            echo "⚠️ WARNING - .env 文件不存在"
        else
            echo -e "${YELLOW}⚠️ .env 文件不存在${NC}"
        fi
        exit 0
    fi
    
    # 获取当前哈希
    current_hash=$(get_file_hash "$ENV_FILE")
    
    # 读取上次备份的哈希
    if [ -f "$STATE_FILE" ]; then
        last_hash=$(cat "$STATE_FILE" 2>/dev/null || echo "")
    else
        last_hash=""
    fi
    
    # 比较哈希
    if [ "$current_hash" = "$last_hash" ]; then
        # 无变更
        if [ "$PLAIN_MODE" = true ]; then
            # 静默模式，无输出
            exit 0
        else
            echo -e "${GREEN}✅ .env 文件无变更${NC}"
            exit 0
        fi
    else
        # 有变更，执行备份
        backup_file=$(backup_env)
        
        # 更新状态
        echo "$current_hash" > "$STATE_FILE"
        
        # 输出结果
        if [ "$PLAIN_MODE" = true ]; then
            echo "📦 .env 已备份 - $(date '+%Y-%m-%d %H:%M:%S')"
            echo "备份文件：$backup_file"
        else
            echo -e "${BLUE}📦 .env 文件检测到变更${NC}"
            echo -e "  上次哈希：${YELLOW}${last_hash:-首次}${NC}"
            echo -e "  当前哈希：${GREEN}${current_hash}${NC}"
            echo -e "  备份文件：${GREEN}${backup_file}${NC}"
        fi
        
        exit 0
    fi
}

# 执行
main "$@"
