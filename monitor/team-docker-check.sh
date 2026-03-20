#!/bin/bash

# Team Docker 容器状态检查脚本
# 用于手动/定时检查 openclaw-team 所有容器的运行状态
# 支持 --plain 模式用于定时任务输出

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
TEAM_DIR="/opt/openclaw-team"
COMPOSE_FILE="$TEAM_DIR/docker-compose.yml"
STATE_FILE="$TEAM_DIR/monitor/health-state.json"
KNOWN_CONTAINERS_FILE="/tmp/openclaw-known-containers"
ENV_FILE="$TEAM_DIR/.env"
ENV_BACKUP_DIR="$TEAM_DIR/backups/env"
ENV_STATE_FILE="/tmp/openclaw-env-backup-state"
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

# 打印标题
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# 打印状态
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "ok")
            echo -e "${GREEN}✅${NC} $message"
            ;;
        "warn")
            echo -e "${YELLOW}⚠️${NC} $message"
            ;;
        "error")
            echo -e "${RED}❌${NC} $message"
            ;;
        "info")
            echo -e "${BLUE}ℹ️${NC} $message"
            ;;
    esac
}

# 检查 Docker 是否运行
check_docker() {
    if [ "$PLAIN_MODE" = true ]; then
        # 简洁模式：不输出
        if ! command -v docker &> /dev/null; then
            DOCKER_STATUS="not_installed"
            return 1
        fi
        
        if ! docker info &> /dev/null; then
            DOCKER_STATUS="not_running"
            return 1
        fi
        
        DOCKER_STATUS="ok"
    else
        # 详细模式：完整输出
        print_header "Docker 服务状态"
        
        if ! command -v docker &> /dev/null; then
            print_status "error" "Docker 未安装"
            return 1
        fi
        
        if ! docker info &> /dev/null; then
            print_status "error" "Docker 服务未运行"
            return 1
        fi
        
        print_status "ok" "Docker 服务正常运行"
        echo ""
    fi
}

# 检查容器状态
check_containers() {
    print_header "容器运行状态"
    
    # 获取所有 openclaw 相关容器
    containers=$(docker ps -a --filter "name=openclaw" --format "{{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "")
    
    if [ -z "$containers" ]; then
        print_status "warn" "未找到 openclaw 相关的容器"
        echo ""
        return 0
    fi
    
    echo -e "${BLUE}容器名称\t\t\t状态\t\t\t端口${NC}"
    echo "------------------------------------------------------------"
    
    while IFS=$'\t' read -r name status ports; do
        if [ -n "$name" ]; then
            # 判断状态
            if echo "$status" | grep -q "Up"; then
                status_icon="✅"
            elif echo "$status" | grep -q "Exited"; then
                status_icon="❌"
            elif echo "$status" | grep -q "Restarting"; then
                status_icon="⚠️"
            else
                status_icon="ℹ️"
            fi
            
            # 格式化输出
            printf "%-30s %s %-20s %s\n" "$name" "$status_icon" "$status" "$ports"
        fi
    done <<< "$containers"
    
    echo ""
}

# 检查端口可用性
check_ports() {
    print_header "端口可用性"
    
    # 定义需要检查的端口
    declare -A ports=(
        ["18789"]="orchestrator API"
        ["18790"]="dev API"
        ["18791"]="pm API"
        ["5432"]="PostgreSQL"
    )
    
    for port in "${!ports[@]}"; do
        service_name="${ports[$port]}"
        
        if netstat -tuln 2>/dev/null | grep -q ":$port " || ss -tuln 2>/dev/null | grep -q ":$port "; then
            print_status "ok" "端口 $port ($service_name) 正在监听"
        else
            print_status "warn" "端口 $port ($service_name) 未监听"
        fi
    done
    
    echo ""
}

# 检查容器资源使用
check_resources() {
    print_header "容器资源使用"
    
    stats=$(docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" 2>/dev/null | grep "openclaw" || echo "")
    
    if [ -z "$stats" ]; then
        print_status "info" "无正在运行的 openclaw 容器"
        echo ""
        return 0
    fi
    
    echo -e "${BLUE}容器名称\t\tCPU\t\t内存\t\t网络${NC}"
    echo "------------------------------------------------------------"
    echo "$stats" | while IFS=$'\t' read -r name cpu mem net; do
        if [ -n "$name" ]; then
            printf "%-25s %-12s %-15s %s\n" "$name" "$cpu" "$mem" "$net"
        fi
    done
    
    echo ""
}

# 检查最近日志
check_logs() {
    print_header "最近日志（每个容器最后 5 条）"
    
    containers=$(docker ps --filter "name=openclaw" --format "{{.Names}}" 2>/dev/null || echo "")
    
    if [ -z "$containers" ]; then
        print_status "info" "无正在运行的 openclaw 容器"
        echo ""
        return 0
    fi
    
    while read -r container; do
        if [ -n "$container" ]; then
            echo -e "${BLUE}[$container]${NC}"
            docker logs --tail 5 "$container" 2>&1 | head -5 | while read -r line; do
                if echo "$line" | grep -qi "error"; then
                    echo -e "${RED}  $line${NC}"
                elif echo "$line" | grep -qi "warn"; then
                    echo -e "${YELLOW}  $line${NC}"
                else
                    echo "  $line"
                fi
            done
            echo ""
        fi
    done <<< "$containers"
}

# 检查容器健康状态
check_health() {
    print_header "容器健康检查"
    
    containers=$(docker ps --filter "name=openclaw" --format "{{.Names}}" 2>/dev/null || echo "")
    
    if [ -z "$containers" ]; then
        print_status "info" "无正在运行的 openclaw 容器"
        echo ""
        return 0
    fi
    
    while read -r container; do
        if [ -n "$container" ]; then
            health=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$container" 2>/dev/null || echo "unknown")
            
            case $health in
                "healthy")
                    print_status "ok" "$container: 健康"
                    ;;
                "unhealthy")
                    print_status "error" "$container: 不健康"
                    ;;
                "starting")
                    print_status "warn" "$container: 检查中"
                    ;;
                "none")
                    print_status "info" "$container: 无健康检查配置"
                    ;;
                *)
                    print_status "info" "$container: 状态未知 ($health)"
                    ;;
            esac
        fi
    done <<< "$containers"
    
    echo ""
}

# 检查是否有新容器加入
check_new_containers() {
    # 获取当前所有 openclaw 容器
    current_containers=$(docker ps -a --filter "name=openclaw" --format "{{.Names}}" 2>/dev/null | sort || echo "")
    
    # 读取已知的容器列表
    if [ -f "$KNOWN_CONTAINERS_FILE" ]; then
        known_containers=$(cat "$KNOWN_CONTAINERS_FILE" | sort || echo "")
    else
        known_containers=""
    fi
    
    # 找出新容器
    new_containers=""
    while read -r container; do
        if [ -n "$container" ] && ! echo "$known_containers" | grep -q "^${container}$"; then
            if [ -z "$new_containers" ]; then
                new_containers="$container"
            else
                new_containers="$new_containers\n  - $container"
            fi
        fi
    done <<< "$current_containers"
    
    # 更新已知容器列表
    echo "$current_containers" > "$KNOWN_CONTAINERS_FILE"
    
    NEW_CONTAINERS="$new_containers"
}

# 检查并备份 .env 文件
check_env_backup() {
    # 确保备份目录存在
    mkdir -p "$ENV_BACKUP_DIR"
    
    # 检查 .env 文件是否存在
    if [ ! -f "$ENV_FILE" ]; then
        ENV_BACKUP_STATUS="not_found"
        return
    fi
    
    # 计算当前哈希
    current_hash=$(md5sum "$ENV_FILE" 2>/dev/null | awk '{print $1}' || echo "unknown")
    
    # 读取上次备份的哈希
    if [ -f "$ENV_STATE_FILE" ]; then
        last_hash=$(cat "$ENV_STATE_FILE" 2>/dev/null || echo "")
    else
        last_hash=""
    fi
    
    # 比较哈希
    if [ "$current_hash" = "$last_hash" ]; then
        # 无变更
        ENV_BACKUP_STATUS="unchanged"
    else
        # 有变更，执行备份
        local timestamp=$(date '+%Y%m%d_%H%M%S')
        local backup_file="$ENV_BACKUP_DIR/.env.backup.$timestamp"
        
        cp "$ENV_FILE" "$backup_file"
        
        # 更新状态
        echo "$current_hash" > "$ENV_STATE_FILE"
        
        ENV_BACKUP_STATUS="backed_up"
        ENV_BACKUP_FILE="$backup_file"
    fi
}

# 检查核心容器状态（用于告警判断）
check_critical_containers() {
    local critical_status="HEALTHY"
    local issues=""
    
    # 核心容器列表
    critical_containers=("openclaw-orchestrator" "openclaw-dev" "openclaw-pm" "openclaw-postgres")
    
    for container in "${critical_containers[@]}"; do
        status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "not_found")
        health=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}healthy{{end}}' "$container" 2>/dev/null || echo "unknown")
        
        if [ "$status" != "running" ]; then
            critical_status="CRITICAL"
            issues="$issues\n  - $container: 容器未运行 ($status)"
        elif [ "$health" = "unhealthy" ]; then
            critical_status="CRITICAL"
            issues="$issues\n  - $container: 健康检查失败"
        fi
    done
    
    # 检查重启中的容器
    restarting_count=$(docker ps --filter "status=restarting" --filter "name=openclaw" --format "{{.Names}}" 2>/dev/null | wc -l | tr -d '[:space:]')
    if [ "$restarting_count" -gt 0 ]; then
        if [ "$critical_status" != "CRITICAL" ]; then
            critical_status="WARNING"
        fi
        issues="$issues\n  - $restarting_count 个容器正在重启"
    fi
    
    # 保存状态
    local exit_code=0
    if [ "$critical_status" = "CRITICAL" ]; then
        exit_code=1
    fi
    
    echo "{\"timestamp\":\"$(date '+%Y-%m-%d %H:%M:%S')\",\"status\":\"$critical_status\",\"exitCode\":$exit_code}" > "$STATE_FILE"
    
    # 返回状态供主函数使用
    CRITICAL_STATUS="$critical_status"
    CRITICAL_ISSUES="$issues"
}

# 主函数
main() {
    # 初始化状态
    CRITICAL_STATUS="HEALTHY"
    CRITICAL_ISSUES=""
    NEW_CONTAINERS=""
    ENV_BACKUP_STATUS=""
    ENV_BACKUP_FILE=""
    
    if [ "$PLAIN_MODE" = true ]; then
        # 简洁模式：只输出关键信息
        check_docker
        check_new_containers
        check_env_backup
        check_critical_containers
        
        timestamp=$(date '+%Y-%m-%d %H:%M:%S')
        has_output=false
        
        # 检查是否有新容器
        if [ -n "$NEW_CONTAINERS" ]; then
            echo "🎉 发现新伙伴 - $timestamp"
            echo -e "新加入的容器：\n  - $NEW_CONTAINERS"
            has_output=true
        fi
        
        # 检查 .env 备份
        if [ "$ENV_BACKUP_STATUS" = "backed_up" ]; then
            echo "📦 .env 已备份 - $timestamp"
            echo "备份文件：$ENV_BACKUP_FILE"
            has_output=true
        fi
        
        # 告警输出
        if [ "$CRITICAL_STATUS" = "CRITICAL" ]; then
            echo "🚨 CRITICAL 告警 - $timestamp"
            echo -e "$CRITICAL_ISSUES"
            exit 1
        elif [ "$CRITICAL_STATUS" = "WARNING" ]; then
            echo "⚠️ WARNING - $timestamp"
            echo -e "$CRITICAL_ISSUES"
            exit 0
        elif [ "$has_output" = true ]; then
            # 有新容器或 .env 备份，已输出
            exit 0
        else
            # HEALTHY 且无新容器且无 .env 备份，静默
            exit 0
        fi
    else
        # 详细模式：完整输出
        echo ""
        print_header "OpenClaw Team Docker 状态检查"
        echo "检查时间：$(date '+%Y-%m-%d %H:%M:%S')"
        echo ""
        
        check_docker
        check_containers
        check_health
        check_ports
        check_resources
        check_logs
        check_new_containers
        check_env_backup
        check_critical_containers
        
        print_header "检查完成"
        
        if [ -n "$NEW_CONTAINERS" ]; then
            echo ""
            echo "🎉 发现新伙伴！"
            echo -e "新加入的容器：\n  - $NEW_CONTAINERS"
        fi
        
        if [ "$ENV_BACKUP_STATUS" = "backed_up" ]; then
            echo ""
            echo "📦 .env 文件已备份！"
            echo "备份文件：$ENV_BACKUP_FILE"
        fi
        
        if [ "$CRITICAL_STATUS" = "CRITICAL" ]; then
            exit 1
        fi
    fi
}

# 执行
main "$@"
