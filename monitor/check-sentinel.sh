#!/bin/bash
#
# 哨兵检查脚本 - 检查 /opt/openclaw 版本信息（只读，不修改任何东西）
# 用途：查看 OpenClaw 源码版本和可用升级版本
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
LOG_FILE="/opt/openclaw-team/monitor/sentinel-check-$(date +%Y%m%d-%H%M%S).log"

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

# 函数：显示当前版本（只读）
show_current_version() {
    if [ ! -d "$OPENCLAW_DIR/.git" ]; then
        error "OpenClaw 目录不是 Git 仓库：$OPENCLAW_DIR"
        exit 1
    fi
    
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

# 函数：获取可用版本（只读）
list_versions() {
    if [ ! -d "$OPENCLAW_DIR/.git" ]; then
        error "OpenClaw 目录不是 Git 仓库"
        exit 1
    fi
    
    cd "$OPENCLAW_DIR"
    echo -e "${CYAN}可用版本 (最近 20 个):${NC}"
    git tag --list "v2026*" | sort -V | tail -20
}

# 函数：显示版本差异（只读）
show_diff() {
    local target_version=$1
    
    if [ ! -d "$OPENCLAW_DIR/.git" ]; then
        error "OpenClaw 目录不是 Git 仓库"
        exit 1
    fi
    
    cd "$OPENCLAW_DIR"
    local current=$(git describe --tags --always 2>/dev/null || git rev-parse --short HEAD)
    
    if [ "$current" == "$target_version" ]; then
        echo -e "${GREEN}已经是最新版本${NC}"
        return
    fi
    
    echo -e "${CYAN}版本变更 ($current → $target_version):${NC}"
    git log --oneline --no-decorate "$current..$target_version" 2>/dev/null | head -20 || {
        warn "无法获取变更日志"
    }
}

# 函数：验证升级脚本
check_upgrade_script() {
    local team_script="/opt/openclaw-team/monitor/upgrade-team.sh"
    
    if [ -x "$team_script" ]; then
        echo -e "${GREEN}升级脚本:${NC} 可用 ($team_script)"
    else
        echo -e "${YELLOW}升级脚本:${NC} 不可用或无执行权限"
    fi
}

# 函数：显示帮助
show_help() {
    cat << EOF
${CYAN}╔══════════════════════════════════════════════════════════╗${NC}
${CYAN}║${NC}       ${GREEN}哨兵检查脚本 - 只读模式${NC}                        ${CYAN}║${NC}
${CYAN}╚══════════════════════════════════════════════════════════╝${NC}

用法：$0 [选项]

${BLUE}选项:${NC}
  -h, --help          显示此帮助信息
  -c, --current       显示当前版本（只读）
  -l, --list          列出可用版本（只读）
  -v, --verify        验证当前安装（只读）
  -d, --diff VER      显示到指定版本的变更（只读）
  --latest            显示最新版本信息
  --status            显示完整状态报告

${BLUE}示例:${NC}
  $0 --current                 # 显示当前版本
  $0 --list                    # 列出可用版本
  $0 --diff v2026.3.28         # 显示到 v2026.3.28 的变更
  $0 --status                  # 完整状态报告

${BLUE}注意:${NC}
  - 此脚本是**只读**的，不会修改 /opt/openclaw 的任何内容
  - 所有日志保存到 /opt/openclaw-team/monitor/
  - 不需要 root 权限

${BLUE}升级团队容器:${NC}
  请使用：/opt/openclaw-team/monitor/upgrade-team.sh

EOF
}

# 函数：显示完整状态
show_status() {
    header "哨兵状态报告"
    echo ""
    
    echo -e "${CYAN}1. 当前版本:${NC}"
    show_current_version
    echo ""
    
    echo -e "${CYAN}2. 最新版本:${NC}"
    cd "$OPENCLAW_DIR"
    local latest=$(git tag --list "v2026*" | sort -V | tail -1)
    local current=$(git describe --tags --always 2>/dev/null || git rev-parse --short HEAD)
    
    if [ "$current" == "$latest" ]; then
        echo -e "${GREEN}已是最新版本：$latest${NC}"
    else
        echo -e "${YELLOW}当前版本:$current${NC}"
        echo -e "${GREEN}最新版本:$latest${NC}"
        echo -e "${YELLOW}可以升级${NC}"
    fi
    echo ""
    
    echo -e "${CYAN}3. 升级脚本:${NC}"
    check_upgrade_script
    echo ""
    
    echo -e "${CYAN}4. 团队容器状态:${NC}"
    docker ps --filter "name=openclaw-orchestrator" --format "  {{.Names}}: {{.Status}} ({{.Image}})" 2>/dev/null || echo "  无法获取容器状态"
    echo ""
}

# 主程序
main() {
    # 检查 OpenClaw 目录
    if [ ! -d "$OPENCLAW_DIR" ]; then
        error "OpenClaw 目录不存在：$OPENCLAW_DIR"
        exit 1
    fi
    
    case "${1:-}" in
        -h|--help)
            show_help
            ;;
        -c|--current)
            header "当前版本"
            show_current_version
            ;;
        -l|--list)
            list_versions
            ;;
        -v|--verify)
            header "验证安装"
            if [ -d "$OPENCLAW_DIR/.git" ]; then
                echo -e "${GREEN}Git 仓库:${NC} 正常"
            else
                echo -e "${YELLOW}Git 仓库:${NC} 未找到"
            fi
            
            if [ -f "$OPENCLAW_DIR/package.json" ]; then
                echo -e "${GREEN}package.json:${NC} 存在"
            else
                echo -e "${YELLOW}package.json:${NC} 未找到"
            fi
            
            if command -v openclaw &> /dev/null; then
                local cli_version=$(openclaw --version 2>/dev/null || echo "未知")
                echo -e "${GREEN}CLI 命令:${NC} 可用 ($cli_version)"
            else
                echo -e "${YELLOW}CLI 命令:${NC} 不可用"
            fi
            success "验证完成"
            ;;
        -d|--diff)
            if [ -z "${2:-}" ]; then
                error "请指定目标版本"
                show_help
                exit 1
            fi
            header "版本变更"
            show_diff "$2"
            ;;
        --latest)
            header "最新版本信息"
            cd "$OPENCLAW_DIR"
            local latest=$(git tag --list "v2026*" | sort -V | tail -1)
            local current=$(git describe --tags --always 2>/dev/null || git rev-parse --short HEAD)
            
            echo -e "${BLUE}当前版本:${NC} $current"
            echo -e "${GREEN}最新版本:${NC} $latest"
            
            if [ "$current" != "$latest" ]; then
                echo ""
                echo -e "${YELLOW}可以升级到 $latest${NC}"
                echo -e "${BLUE}使用命令:${NC} /opt/openclaw-team/monitor/upgrade-team.sh --upgrade $latest"
            fi
            ;;
        --status)
            show_status
            ;;
        "")
            # 无参数时显示状态
            echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
            echo -e "${CYAN}║${NC}       ${GREEN}哨兵检查工具 - Sentinel Check Tool${NC}            ${CYAN}║${NC}"
            echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}\n"
            show_current_version
            echo ""
            echo -e "${YELLOW}使用 --help 查看完整用法${NC}"
            echo -e "${YELLOW}使用 --status 查看完整报告${NC}"
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
