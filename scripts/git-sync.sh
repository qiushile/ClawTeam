#!/bin/bash
# Git 双向同步脚本 — 检测本地和远程变更，自动 push/pull
# 用法：git-sync.sh [local|remote]
#   local:  本地模式（~/WorkStation/mine/claw/ClawTeam）
#   remote: 远端模式（通过 SSH 在 ubuntu24 上执行）

set -euo pipefail

MODE="${1:-local}"
REPO_DIR=""
LOG_FILE=""

if [ "$MODE" = "local" ]; then
    REPO_DIR="$HOME/WorkStation/mine/claw/ClawTeam"
    LOG_FILE="$HOME/.hermes/logs/git-sync-local.log"
    REMOTE_SSH="ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@ubuntu24.tailcc8506.ts.net"
elif [ "$MODE" = "remote" ]; then
    REPO_DIR="/opt/openclaw-team"
    LOG_FILE="/var/log/git-sync-remote.log"
else
    echo "Usage: $0 [local|remote]"
    exit 1
fi

log() {
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [$MODE] $*" | tee -a "$LOG_FILE"
}

cd "$REPO_DIR"

# 检查是否有未提交的变更
has_uncommitted() {
    [ -n "$(git status --porcelain)" ]
}

# 检查本地是否有未推送的 commit
has_unpushed() {
    git fetch origin --quiet 2>/dev/null
    [ -n "$(git log origin/master..HEAD --oneline 2>/dev/null)" ]
}

# 检查远端是否有新的 commit
has_unpulled() {
    git fetch origin --quiet 2>/dev/null
    [ -n "$(git log HEAD..origin/master --oneline 2>/dev/null)" ]
}

# 推送本地变更
do_push() {
    if has_uncommitted; then
        log "发现未提交的变更，自动 commit + push"
        git add -A
        git commit -m "auto-sync: $(date '+%Y-%m-%d %H:%M:%S') 自动同步变更" 2>/dev/null || true
    fi
    if has_unpushed; then
        log "推送本地 commit 到 origin"
        git push origin master 2>&1 | tee -a "$LOG_FILE"
        log "推送完成"
    else
        log "本地无未推送的变更"
    fi
}

# 拉取远端变更
do_pull() {
    if has_unpulled; then
        if has_uncommitted; then
            log "有本地未提交变更，先 stash"
            git stash --include-untracked --quiet
            STASHED=true
        else
            STASHED=false
        fi
        log "拉取远端变更"
        git pull origin master --no-edit 2>&1 | tee -a "$LOG_FILE"
        if [ "$STASHED" = true ]; then
            log "恢复本地 stash"
            git stash pop --quiet 2>/dev/null || log "stash pop 有冲突，已保留在 stash 中"
        fi
        log "拉取完成"
    else
        log "远端无新变更"
    fi
}

# 主流程：先 push 再 pull（避免 pull 产生不必要的 merge）
log "=== 开始同步检查 ==="
do_push
do_pull
log "=== 同步完成 ==="
