#!/bin/bash
#
# 哨兵升级脚本 - 升级 /opt/openclaw (哨兵自己)
# 用途：通过 Git 操作升级 OpenClaw 源码（不创建任何新文件）
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
NC='\033[0m' # No Color

# 配置
OPENCLAW_DIR="/opt/openclaw"
LOG_FILE="/opt/openclaw-team/monitor/sentinel-upgrade-$(date +%Y%m%d-%H%M%S).log"

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
    git tag --list "v2026*" | sort -V | tail -20
}

# 函数：显示当前版本
show_current_version() {
    cd "$OPENCLAW_DIR"
    local current=$(git describe --tags --always 2>/dev/null || git rev-parse --short HEAD)
    local branch=$(git branch --show-current 2>/dev/null || echo "detached")
    local commit=$(git rev-parse --short HEAD 2>/dev/null || echo "未知")
    local date=$(git log -1 --format=%cd --date=short 2>/dev/null || echo "未知")
    
    echo -e "${BLUE}当前版本:${NC} $current"
    echo -e "${BLUE}当前分支:${NC} $branch"
    echo -e "${BLUE}提交哈希:${NC} $commit"
    echo -e "${BLUE}提交日期:${NC} $date"
}

# 函数：检查是否有未提交的更改
check_clean_workspace() {
    cd "$OPENCLAW_DIR"
    local status=$(git status --porcelain 2>/dev/null || echo "")
    if [ -n "$status" ]; then
        warn "工作区有未提交的更改:"
        echo "$status" | head -10
        if [ "$(echo "$status" | wc -l)" -gt 10 ]; then
            echo "... 还有更多未显示"
        fi
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
    
    header "开始升级到 $target_version"
    
    # 获取最新标签
    info "获取远程标签..."
    git fetch --tags --quiet
    
    # 检查版本是否存在
    if ! git rev-parse "$target_version" &>/dev/null; then
        error "版本 $target_version 不存在"
        list_versions
        exit 1
    fi
    
    # 切换版本
    info "切换到版本：$target_version"
    git checkout -q "$target_version"
    
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
    else
        warn "openclaw 命令不可用，可能需要重新安装"
    fi
    
    success "验证完成"
}

# 函数：显示升级日志
show_changelog() {
    local target_version=$1
    cd "$OPENCLAW_DIR"
    
    local current=$(git describe --tags --always 2>/dev/null || git rev-parse --short HEAD)
    
    if [ "$current" != "$target_version" ]; then
        info "版本变更日志 ($current → $target_version):"
        git log --oneline --no-decorate "$current..$target_version" 2>/dev/null | head -20 || true
    fi
}

# 函数：显示帮助
show_help() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════╗${NC}
${CYAN}║${NC}       ${GREEN}哨兵升级脚本 - 升级 /opt/openclaw${NC}              ${CYAN}║${NC}
${CYAN}╚══════════════════════════════════════════════════════════╝${NC}

用法：$0 [选项] [目标版本]

${BLUE}选项:${NC}
  -h, --help          显示此帮助信息
  -l, --list          列出可用版本
  -c, --current       显示当前版本
  -u, --upgrade VER   升级到指定版本
  -v, --verify        验证当前安装
  --changelog VER     显示到指定版本的变更日志
  --latest            升级到最新版本
  --dry-run           模拟升级（不实际执行）

${BLUE}示例:${NC}
  $0 --list                    # 列出所有可用版本
  $0 --current                 # 显示当前版本
  $0 --upgrade v2026.3.28      # 升级到 v2026.3.28
  $0 --latest                  # 升级到最新版本
  $0 --changelog v2026.3.28    # 查看变更日志
  $0 --dry-run --latest        # 模拟升级

${BLUE}注意:${NC}
  - 此脚本通过 Git 操作升级 /opt/openclaw 源码
  - 允许：git checkout/fetch/pull 等 Git 操作
  - 不允许：创建新文件/文件夹（如 backup 目录）
  - 日志保存到：/opt/openclaw-team/monitor/
  - 需要 root 权限运行

${BLUE}升级团队容器:${NC}
  请使用：/opt/openclaw-team/monitor/upgrade-team.sh

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
        --changelog)
            if [ -z "${2:-}" ]; then
                error "请指定目标版本"
                show_help
                exit 1
            fi
            show_changelog "$2"
            ;;
        --dry-run)
            header "模拟升级模式"
            show_current_version
            echo ""
            if [ -n "${2:-}" ] && [ "$2" == "--latest" ]; then
                cd "$OPENCLAW_DIR"
                local latest=$(git tag --list "v2026*" | sort -V | tail -1)
                info "检测到最新版本：$latest"
                show_changelog "$latest"
            elif [ -n "${2:-}" ]; then
                info "目标版本：$2"
                show_changelog "$2"
            fi
            info "模拟完成 - 未执行实际升级"
            ;;
        --latest)
            cd "$OPENCLAW_DIR"
            local latest=$(git tag --list "v2026*" | sort -V | tail -1)
            if [ -n "$latest" ]; then
                header "检测到最新版本：$latest"
                show_changelog "$latest"
                echo ""
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
            header "准备升级到 $2"
            show_changelog "$2"
            echo ""
            read -p "确认升级到 $2? (y/N): " confirm
            if [ "$confirm" == "y" ] || [ "$confirm" == "Y" ]; then
                check_clean_workspace
                upgrade "$2"
                verify_upgrade
            else
                info "升级已取消"
            fi
            ;;
        "")
            # 无参数时显示状态
            echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
            echo -e "${CYAN}║${NC}       ${GREEN}哨兵升级工具 - Sentinel Upgrade Tool${NC}          ${CYAN}║${NC}"
            echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}\n"
            show_current_version
            echo ""
            list_versions
            echo ""
            echo -e "${YELLOW}使用 --help 查看完整用法${NC}"
            echo -e "${YELLOW}使用 --latest 一键升级${NC}"
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
