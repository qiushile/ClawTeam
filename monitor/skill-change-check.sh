#!/bin/bash

# Skill 变更检查脚本（智能配额感知 + Team 全目录）
# 检查哨兵工作区 + openclaw-team 主仓库的所有 skills 目录变更

set -e

# 配置
SENTINEL_SKILLS_DIR="/root/.openclaw/workspace"
TEAM_DIR="/opt/openclaw-team"
STATE_DIR="/tmp/skill-check-state"
LOG_FILE="/var/log/openclaw-skill-check.log"
QUOTA_CHECK_FILE="/tmp/moltguard-quota-status"

# 确保状态目录存在
mkdir -p "$STATE_DIR"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 检查 MoltGuard 配额状态
check_quota() {
    log "检查 MoltGuard 配额状态..."
    
    # 方法 1: 检查 credentials 中的配额信息
    CREDENTIALS_DIR="/root/.openclaw/credentials/moltguard"
    if [ -d "$CREDENTIALS_DIR" ]; then
        for f in "$CREDENTIALS_DIR"/*.json; do
            if [ -f "$f" ]; then
                QUOTA_AVAILABLE=$(cat "$f" 2>/dev/null | grep -c "quota" 2>/dev/null || echo "0")
                QUOTA_AVAILABLE=$(echo "$QUOTA_AVAILABLE" | tr -d '[:space:]')
                if [ "$QUOTA_AVAILABLE" -gt 0 ] 2>/dev/null; then
                    log "✅ MoltGuard 已配置，执行检查"
                    return 0
                fi
            fi
        done
    fi
    
    # 方法 2: 检查最近日志中是否有配额耗尽警告
    if [ -f "$LOG_FILE" ]; then
        LAST_QUOTA_WARNING=$(grep -c "quota-exceeded" "$LOG_FILE" 2>/dev/null || echo "0")
        LAST_QUOTA_WARNING=$(echo "$LAST_QUOTA_WARNING" | tr -d '[:space:]')
        if [ "$LAST_QUOTA_WARNING" -gt 0 ] 2>/dev/null; then
            TODAY=$(date '+%Y-%m-%d')
            if grep "$TODAY" "$LOG_FILE" | grep -q "quota-exceeded"; then
                log "⚠️ 今日配额已耗尽，跳过检查"
                return 1
            fi
        fi
    fi
    
    # 方法 3: 检查距上次检查是否超过 24 小时（配额重置）
    GLOBAL_STATE_FILE="$STATE_DIR/last-check-time"
    if [ -f "$GLOBAL_STATE_FILE" ]; then
        LAST_CHECK_TIME=$(cat "$GLOBAL_STATE_FILE" 2>/dev/null || echo "0")
        CURRENT_TIME=$(date +%s)
        HOURS_SINCE_CHECK=$(( (CURRENT_TIME - LAST_CHECK_TIME) / 3600 ))
        
        if [ "$HOURS_SINCE_CHECK" -ge 24 ]; then
            log "✅ 距上次检查已超过 24 小时，配额可能已重置"
            date +%s > "$GLOBAL_STATE_FILE"
            return 0
        else
            log "ℹ️ 距上次检查 ${HOURS_SINCE_CHECK} 小时，谨慎起见跳过检查"
            return 1
        fi
    fi
    
    # 首次运行，执行检查
    log "✅ 首次运行，执行检查"
    date +%s > "$GLOBAL_STATE_FILE"
    return 0
}

# 检查 Git 仓库的 skills 变更
check_git_skills() {
    local repo_dir="$1"
    local repo_name="$2"
    local state_suffix="$3"
    
    if [ ! -d "$repo_dir/.git" ]; then
        log "  ⚪ $repo_name: 非 git 仓库，跳过"
        return 0
    fi
    
    cd "$repo_dir"
    
    # 获取上次检查的 commit
    STATE_FILE="$STATE_DIR/git-${state_suffix}.hash"
    LAST_CHECK=$(cat "$STATE_FILE" 2>/dev/null || echo "HEAD~1")
    CURRENT_HEAD=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    
    # 检测 skills 目录变更
    CHANGES=$(git diff --name-only "$LAST_CHECK" HEAD 2>/dev/null | grep -E "(^|/)skills/" || echo "")
    
    if [ -z "$CHANGES" ]; then
        log "  ✅ $repo_name: 无 skill 变更"
    else
        log "  📝 $repo_name: 发现 skill 变更"
        echo "$CHANGES" | while read -r file; do
            if [ -n "$file" ]; then
                log "     - $file"
            fi
        done
        
        # 统计变更数量
        CHANGE_COUNT=$(echo "$CHANGES" | wc -l | tr -d '[:space:]')
        log "     共 $CHANGE_COUNT 个文件"
    fi
    
    # 更新状态
    echo "$CURRENT_HEAD" > "$STATE_FILE"
}

# 检查文件时间戳（非 git 目录）
check_file_timestamp() {
    local dir="$1"
    local dir_name="$2"
    local hours="${3:-24}"
    
    if [ ! -d "$dir" ]; then
        log "  ⚪ $dir_name: 目录不存在，跳过"
        return 0
    fi
    
    # 查找最近 N 小时内修改的文件
    RECENT_FILES=$(find "$dir" -name "*.md" -o -name "*.mjs" -o -name "*.js" -o -name "*.json" 2>/dev/null | while read -r f; do
        if [ -f "$f" ]; then
            FILE_AGE=$(( ($(date +%s) - $(stat -c %Y "$f" 2>/dev/null || echo "0")) / 3600 ))
            if [ "$FILE_AGE" -le "$hours" ]; then
                echo "$f"
            fi
        fi
    done || echo "")
    
    if [ -z "$RECENT_FILES" ]; then
        log "  ✅ $dir_name: 最近 ${hours}h 无变更"
    else
        log "  📝 $dir_name: 最近 ${hours}h 有变更"
        echo "$RECENT_FILES" | while read -r file; do
            if [ -n "$file" ]; then
                log "     - $file"
            fi
        done
    fi
}

# 主检查逻辑
main() {
    log ""
    log "=========================================="
    log "=== Skill 变更检查开始 ==="
    log "=========================================="
    
    # 检查配额
    if ! check_quota; then
        log "⏭️  配额不足，跳过本次检查"
        echo "SKIPPED: Quota exhausted at $(date '+%Y-%m-%d %H:%M:%S')" >> "$QUOTA_CHECK_FILE"
        exit 0
    fi
    
    echo "RUNNING: $(date '+%Y-%m-%d %H:%M:%S')" > "$QUOTA_CHECK_FILE"
    
    # 1. 检查哨兵工作区（Git）
    log ""
    log "【1/3】哨兵工作区"
    check_git_skills "$SENTINEL_SKILLS_DIR" "哨兵" "sentinel"
    
    # 2. 检查 Team 主仓库（Git）
    log ""
    log "【2/3】Team 主仓库 (/opt/openclaw-team)"
    check_git_skills "$TEAM_DIR" "Team 主仓库" "team-main"
    
    # 3. 检查各部门 skills 目录（文件时间戳，最近 24 小时）
    log ""
    log "【3/3】各部门 skills 目录（最近 24h 变更）"
    
    for agent_dir in "$TEAM_DIR"/openclaw-*/; do
        if [ -d "$agent_dir" ]; then
            agent_name=$(basename "$agent_dir")
            skills_dir="$agent_dir/skills"
            if [ -d "$skills_dir" ]; then
                check_file_timestamp "$skills_dir" "$agent_name" 24
            fi
        fi
    done
    
    # 汇总
    log ""
    log "=========================================="
    log "=== 检查完成 ==="
    log "=========================================="
    log "检查范围："
    log "  - 哨兵工作区 (Git): $SENTINEL_SKILLS_DIR"
    log "  - Team 主仓库 (Git): $TEAM_DIR"
    log "  - 各部门 skills (24h): $TEAM_DIR/openclaw-*/skills/"
    log "检查时间：$(date '+%Y-%m-%d %H:%M:%S')"
    
    # 输出建议
    log ""
    log "💡 提示："
    log "  - 查看 Git 变更：cd <目录> && git diff HEAD~1 HEAD -- skills/"
    log "  - 审查可疑变更：手动检查 SKILL.md 和脚本文件"
    log "  - 下次检查：手动运行本脚本或等待明日配额重置"
}

# 执行
main "$@"
