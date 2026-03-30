#!/bin/bash
#
# 团队升级脚本 - 升级 Docker OpenClaw 团队容器
# 用途：升级 /opt/openclaw-team 的 Docker 容器到新版本
# 作者：哨兵 (Sentinel)
# 创建：2026-03-30
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# 配置
TEAM_DIR="/opt/openclaw-team"
BACKUP_DIR="/opt/openclaw-team/backups"
COMPOSE_FILE="$TEAM_DIR/docker-compose.yml"
LOG_FILE="/opt/openclaw-team/monitor/team-upgrade-$(date +%Y%m%d-%H%M%S).log"

# 函数：打印日志
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

info()    { log "${BLUE}INFO${NC}" "$1"; }
success() { log "${GREEN}SUCCESS${NC}" "$1"; }
warn()    { log "${YELLOW}WARN${NC}" "$1"; }
error()   { log "${RED}ERROR${NC}" "$1"; }
header()  { log "${CYAN}════${NC}" "$1"; }

# 函数：检查权限
check_root() {
    if [ "$EUID" -ne 0 ]; then
        error "请使用 root 权限运行此脚本"
        exit 1
    fi
}

# 函数：检查 Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker 未安装"
        exit 1
    fi
    if ! command -v docker-compose &> /dev/null && ! docker compose version &>/dev/null; then
        error "Docker Compose 未安装"
        exit 1
    fi
}

# 函数：检查 docker-compose.yml
check_compose_file() {
    if [ ! -f "$COMPOSE_FILE" ]; then
        error "docker-compose.yml 不存在：$COMPOSE_FILE"
        exit 1
    fi
}

# 函数：获取当前镜像版本
get_current_image_version() {
    grep -E "^\s*image:" "$COMPOSE_FILE" | head -1 | sed 's/.*image:\s*//' | tr -d ' '
}

# 函数：获取运行中的容器版本
get_running_version() {
    docker ps --filter "name=openclaw-orchestrator" --format "{{.Image}}" 2>/dev/null || echo "未运行"
}

# 函数：显示当前状态
show_current_status() {
    echo -e "${BLUE}当前配置镜像:${NC} $(get_current_image_version)"
    echo -e "${BLUE}运行中镜像:${NC} $(get_running_version)"
    
    # 显示容器状态
    echo ""
    echo -e "${CYAN}容器状态:${NC}"
    docker ps --filter "name=openclaw" --format "table {{.Names}}\t{{.Status}}\t{{.Image}}" 2>/dev/null || warn "无法获取容器状态"
}

# 函数：列出可用版本
list_versions() {
    info "从 Git 获取可用版本..."
    cd /opt/openclaw 2>/dev/null && git tag --list "v2026*" | sort -V | tail -20 || {
        # 如果无法从 git 获取，提供常见版本
        cat << EOF
v2026.3.28
v2026.3.24
v2026.3.23-2
v2026.3.23
v2026.3.22
v2026.3.21
v2026.3.20
v2026.3.19
v2026.3.18
v2026.3.17
EOF
    }
}

# 函数：创建备份
create_backup() {
    local backup_path="$BACKUP_DIR/team-backup-$(date +%Y%m%d-%H%M%S)"
    
    info "创建备份到：$backup_path"
    mkdir -p "$BACKUP_DIR"
    
    # 备份 docker-compose.yml
    cp "$COMPOSE_FILE" "$backup_path.docker-compose.yml"
    
    # 备份 .env 文件
    if [ -f "$TEAM_DIR/.env" ]; then
        cp "$TEAM_DIR/.env" "$backup_path.env"
    fi
    
    # 记录备份信息
    cat > "$backup_path.info" << EOF
备份时间：$(date)
配置镜像：$(get_current_image_version)
运行镜像：$(get_running_version)
备份文件:
  - $backup_path.docker-compose.yml
  - $backup_path.env (如果存在)
EOF
    
    success "备份完成"
    echo "$backup_path"
}

# 函数：停止容器
stop_containers() {
    info "停止 Docker 容器..."
    cd "$TEAM_DIR"
    
    if docker-compose ps &>/dev/null; then
        docker-compose down --remove-orphans
        success "容器已停止"
    else
        warn "没有运行中的容器"
    fi
}

# 函数：启动容器
start_containers() {
    info "启动 Docker 容器..."
    cd "$TEAM_DIR"
    
    docker-compose up -d
    success "容器已启动"
}

# 函数：更新 docker-compose.yml 中的镜像版本
update_image_version() {
    local target_version=$1
    local current_version=$(get_current_image_version)
    
    info "更新镜像版本：$current_version → $target_version"
    
    # 创建备份
    cp "$COMPOSE_FILE" "$COMPOSE_FILE.bak.$(date +%Y%m%d-%H%M%S)"
    
    # 替换镜像版本
    sed -i "s|image: openclaw:.*|image: openclaw:$target_version|g" "$COMPOSE_FILE"
    
    # 验证修改
    local new_version=$(get_current_image_version)
    if [[ "$new_version" == *"$target_version"* ]]; then
        success "镜像版本已更新为：$target_version"
    else
        error "版本更新失败"
        cp "$COMPOSE_FILE.bak."* "$COMPOSE_FILE" 2>/dev/null || true
        exit 1
    fi
}

# 函数：构建新镜像（可选）
build_image() {
    local target_version=$1
    
    info "是否需要从源码构建镜像？"
    read -p "从 /opt/openclaw 构建 openclaw:$target_version? (y/N): " build
    if [ "$build" == "y" ] || [ "$build" == "Y" ]; then
        cd /opt/openclaw
        docker build -t openclaw:$target_version -f docker/Dockerfile .
        success "镜像构建完成"
        return 0
    fi
    return 1
}

# 函数：验证容器健康
verify_containers() {
    info "验证容器健康状态..."
    
    sleep 5  # 等待容器启动
    
    # 检查关键容器
    local containers=("openclaw-orchestrator" "openclaw-pm" "openclaw-dev" "openclaw-postgres")
    local all_healthy=true
    
    for container in "${containers[@]}"; do
        local status=$(docker inspect -f '{{.State.Status}}' "$container" 2>/dev/null || echo "不存在")
        local health=$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}N/A{{end}}' "$container" 2>/dev/null || echo "N/A")
        
        if [ "$status" == "running" ]; then
            echo -e "  ${GREEN}✓${NC} $container: $status ($health)"
        else
            echo -e "  ${RED}✗${NC} $container: $status"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" == true ]; then
        success "所有容器健康"
    else
        warn "部分容器异常，请检查日志"
    fi
}

# 函数：显示升级流程
show_upgrade_flow() {
    local target_version=$1
    
    cat << EOF
${CYAN}升级流程预览:${NC}
  1. 停止当前容器
  2. 更新 docker-compose.yml 镜像版本 → openclaw:$target_version
  3. 重新启动容器
  4. 验证容器健康状态

${YELLOW}预计停机时间:${NC} 约 30-60 秒
${YELLOW}影响范围:${NC} 所有 OpenClaw 团队容器

EOF
}

# 函数：显示帮助
show_help() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════╗${NC}
${CYAN}║${NC}       ${GREEN}团队升级脚本 - 升级 Docker OpenClaw 团队${NC}         ${CYAN}║${NC}
${CYAN}╚══════════════════════════════════════════════════════════╝${NC}

用法：$0 [选项] [目标版本]

${BLUE}选项:${NC}
  -h, --help          显示此帮助信息
  -l, --list          列出可用版本
  -c, --current       显示当前状态
  -u, --upgrade VER   升级到指定版本
  -v, --verify        验证容器健康
  -s, --start         启动容器
  -d, --stop          停止容器
  -r, --restart       重启容器
  --rebuild VER       从源码构建并升级到指定版本
  --dry-run           模拟升级（不实际执行）

${BLUE}示例:${NC}
  $0 --current                 # 显示当前状态
  $0 --list                    # 列出可用版本
  $0 --upgrade v2026.3.28      # 升级到 v2026.3.28
  $0 --rebuild v2026.3.28      # 从源码构建并升级
  $0 --verify                  # 验证容器健康
  $0 --stop                    # 停止容器
  $0 --start                   # 启动容器
  $0 --restart                 # 重启容器

${BLUE}注意:${NC}
  - 此脚本升级 /opt/openclaw-team 的 Docker 容器
  - 默认不修改 /opt/openclaw 的任何内容
  - --rebuild 选项会读取 /opt/openclaw 源码构建镜像
  - 升级前会自动备份配置
  - 需要 root 权限运行

${BLUE}升级哨兵自己:${NC}
  请使用：/opt/openclaw-team/monitor/upgrade-sentinel.sh

EOF
}

# 主程序
main() {
    check_root
    check_docker
    check_compose_file
    
    case "${1:-}" in
        -h|--help)
            show_help
            ;;
        -l|--list)
            list_versions
            ;;
        -c|--current)
            header "当前状态"
            show_current_status
            ;;
        -v|--verify)
            verify_containers
            ;;
        -s|--start)
            header "启动容器"
            start_containers
            verify_containers
            ;;
        -d|--stop)
            header "停止容器"
            stop_containers
            ;;
        -r|--restart)
            header "重启容器"
            stop_containers
            sleep 2
            start_containers
            verify_containers
            ;;
        --dry-run)
            header "模拟升级模式"
            show_current_status
            echo ""
            if [ -n "${2:-}" ]; then
                show_upgrade_flow "$2"
            fi
            info "模拟完成 - 未执行实际操作"
            ;;
        --rebuild)
            if [ -z "${2:-}" ]; then
                error "请指定目标版本"
                show_help
                exit 1
            fi
            header "从源码构建并升级到 $2"
            create_backup
            if build_image "$2"; then
                update_image_version "$2"
                stop_containers
                start_containers
                verify_containers
                success "构建并升级到 $2 完成"
            fi
            ;;
        -u|--upgrade)
            if [ -z "${2:-}" ]; then
                error "请指定目标版本"
                show_help
                exit 1
            fi
            header "准备升级到 $2"
            show_current_status
            echo ""
            show_upgrade_flow "$2"
            read -p "确认升级？这将导致服务短暂中断 (y/N): " confirm
            if [ "$confirm" == "y" ] || [ "$confirm" == "Y" ]; then
                create_backup
                stop_containers
                update_image_version "$2"
                start_containers
                verify_containers
                success "升级到 $2 完成"
            else
                info "升级已取消"
            fi
            ;;
        "")
            # 无参数时显示状态
            echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
            echo -e "${CYAN}║${NC}       ${GREEN}团队升级工具 - Team Upgrade Tool${NC}                ${CYAN}║${NC}"
            echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}\n"
            show_current_status
            echo ""
            echo -e "${YELLOW}使用 --help 查看完整用法${NC}"
            echo -e "${YELLOW}使用 --upgrade <版本> 升级${NC}"
            ;;
        *)
            error "未知选项：$1"
            show_help
            exit 1
            ;;
    esac
}

# 执行
main "$@"
