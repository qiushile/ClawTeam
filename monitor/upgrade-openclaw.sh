#!/bin/bash
#
# OpenClaw 升级脚本
# 用途：升级 /opt/openclaw 源码到指定版本（不影响 Docker 容器）
# 作者：哨兵 (Sentinel)
# 创建：2026-03-30
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
OPENCLAW_DIR="/opt/openclaw"
BACKUP_DIR="/opt/openclaw/backups"
LOG_FILE="/opt/openclaw-team/monitor/upgrade-$(date +%Y%m%d-%H%M%S).log"

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

# 函数：检查权限
check_root() {
    if [ "$EUID" -ne 0 ]; then
        error "请使用 root 权限运行此脚本"
        exit 1
    fi
}

# 函数：检查 Git
check_git() {
    if ! command -v git &> /dev/null; then
        error "Git 未安装，请先安装 git"
        exit 1
    fi
}

# 函数：获取可用版本
list_versions() {
    info "获取可用版本列表..."
    cd "$OPENCLAW_DIR"
    git tag | grep "v2026.3" | tail -20
}

# 函数：显示当前版本
show_current_version() {
    cd "$OPENCLAW_DIR"
    local current=$(git describe --tags --always 2>/dev/null || git rev-parse --short HEAD)
    local branch=$(git branch --show-current 2>/dev/null || echo "detached")
    echo -e "${BLUE}当前版本:${NC} $current"
    echo -e "${BLUE}当前分支:${NC} $branch"
}

# 函数：创建备份
create_backup() {
    local version=$1
    local backup_path="$BACKUP_DIR/openclaw-backup-${version}-$(date +%Y%m%d-%H%M%S)"
    
    info "创建备份到：$backup_path"
    mkdir -p "$BACKUP_DIR"
    
    # 备份关键配置
    cp -r "$OPENCLAW_DIR" "$backup_path" 2>/dev/null || {
        warn "完整备份失败，尝试备份配置..."
        mkdir -p "$backup_path"
        cp -r "$OPENCLAW_DIR/openclaw.json" "$backup_path/" 2>/dev/null || true
        cp -r "$OPENCLAW_DIR/.openclaw" "$backup_path/" 2>/dev/null || true
    }
    
    success "备份完成：$backup_path"
    echo "$backup_path"
}

# 函数：检查是否有未提交的更改
check_clean_workspace() {
    cd "$OPENCLAW_DIR"
    if [ -n "$(git status --porcelain)" ]; then
        warn "工作区有未提交的更改"
        read -p "是否继续？这将丢弃未提交的更改 (y/N): " confirm
        if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
            info "升级已取消"
            exit 0
        fi
    fi
}

# 函数：升级
upgrade() {
    local target_version=$1
    
    cd "$OPENCLAW_DIR"
    
    info "切换到版本：$target_version"
    git fetch --tags
    
    # 检查版本是否存在
    if ! git rev-parse "$target_version" &>/dev/null; then
        error "版本 $target_version 不存在"
        list_versions
        exit 1
    fi
    
    # 创建备份
    create_backup "$target_version"
    
    # 切换版本
    git checkout "$target_version"
    
    # 检查是否需要安装依赖
    if [ -f "package.json" ]; then
        info "检测 package.json，检查依赖..."
        
        # 检查 node_modules 是否存在
        if [ ! -d "node_modules" ]; then
            warn "node_modules 不存在，需要安装依赖"
            read -p "是否现在运行 npm install? (y/N): " install
            if [ "$install" == "y" ] || [ "$install" == "Y" ]; then
                npm install
            fi
        fi
    fi
    
    success "升级到 $target_version 完成"
}

# 函数：验证升级
verify_upgrade() {
    cd "$OPENCLAW_DIR"
    
    info "验证升级..."
    
    # 检查版本
    local version=$(git describe --tags --always 2>/dev/null || git rev-parse --short HEAD)
    echo -e "${GREEN}当前版本:${NC} $version"
    
    # 检查 openclaw 命令
    if command -v openclaw &> /dev/null; then
        local cli_version=$(openclaw --version 2>/dev/null || echo "未知")
        echo -e "${GREEN}CLI 版本:${NC} $cli_version"
    fi
    
    success "验证完成"
}

# 函数：显示帮助
show_help() {
    cat << EOF
${BLUE}OpenClaw 升级脚本${NC}

用法：$0 [选项] [目标版本]

选项:
  -h, --help          显示此帮助信息
  -l, --list          列出可用版本
  -c, --current       显示当前版本
  -u, --upgrade VER   升级到指定版本
  -v, --verify        验证当前安装
  --latest            升级到最新版本

示例:
  $0 --list                    # 列出所有可用版本
  $0 --current                 # 显示当前版本
  $0 --upgrade v2026.3.28      # 升级到 v2026.3.28
  $0 --latest                  # 升级到最新版本

注意:
  - 此脚本只升级 /opt/openclaw 源码，不影响 Docker 容器
  - 升级前会自动创建备份
  - 需要 root 权限运行

EOF
}

# 主程序
main() {
    check_root
    check_git
    
    # 检查 OpenClaw 目录
    if [ ! -d "$OPENCLAW_DIR" ]; then
        error "OpenClaw 目录不存在：$OPENCLAW_DIR"
        exit 1
    fi
    
    case "${1:-}" in
        -h|--help)
            show_help
            ;;
        -l|--list)
            list_versions
            ;;
        -c|--current)
            show_current_version
            ;;
        -v|--verify)
            verify_upgrade
            ;;
        --latest)
            cd "$OPENCLAW_DIR"
            local latest=$(git tag | grep "^v2026" | sort -V | tail -1)
            if [ -n "$latest" ]; then
                info "检测到最新版本：$latest"
                read -p "是否升级到 $latest? (y/N): " confirm
                if [ "$confirm" == "y" ] || [ "$confirm" == "Y" ]; then
                    check_clean_workspace
                    upgrade "$latest"
                    verify_upgrade
                else
                    info "升级已取消"
                fi
            else
                error "无法获取最新版本"
                exit 1
            fi
            ;;
        -u|--upgrade)
            if [ -z "${2:-}" ]; then
                error "请指定目标版本"
                show_help
                exit 1
            fi
            check_clean_workspace
            upgrade "$2"
            verify_upgrade
            ;;
        "")
            # 无参数时显示状态
            echo -e "${BLUE}=== OpenClaw 升级工具 ===${NC}\n"
            show_current_version
            echo ""
            list_versions
            echo ""
            echo -e "${YELLOW}使用 --help 查看用法${NC}"
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
