#!/bin/bash
# Git 双向同步脚本 — 智能分类 + 同步
# 用法：git-sync.sh [local|remote]
#   两边共用同一份脚本，由 cron 在各自环境触发

set -euo pipefail

MODE="${1:-local}"

if [ "$MODE" = "local" ]; then
    REPO_DIR="$HOME/WorkStation/mine/claw/ClawTeam"
elif [ "$MODE" = "remote" ]; then
    REPO_DIR="/opt/openclaw-team"
else
    echo "Usage: $0 [local|remote]"
    exit 1
fi

LOG_FILE="/tmp/git-sync-${MODE}.log"
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [$MODE] $*" | tee -a "$LOG_FILE"
}

cd "$REPO_DIR"

# ========== 忽略规则（运行态 / 敏感信息 / 临时文件） ==========
MUST_IGNORE_PATTERNS=(
    ".env"
    "*.key" "*.pem" "*.p12"
    "secrets/"
    "*.log"
    "*.pid" "*.tmp" "*.swp" "*.swo"
    ".openclaw/"
    "workspace-main/.openclaw/"
    "__pycache__/" "*.pyc"
    "node_modules/"
    ".venv/" "venv/"
    "*.db" "*.sqlite" "*.sqlite3"
    ".DS_Store" "Thumbs.db"
    ".vscode/" ".idea/"
)

# ========== 确保 .gitignore 包含基础规则 ==========
ensure_gitignore() {
    for pattern in "${MUST_IGNORE_PATTERNS[@]}"; do
        grep -qxF "$pattern" .gitignore 2>/dev/null || echo "$pattern" >> .gitignore
    done
    git rm -r --cached --ignore-unmatch \
        .env "*.key" "*.pem" "*.p12" "secrets/" \
        "*.log" "*.pid" "*.tmp" "*.swp" "*.swo" \
        ".openclaw/" "workspace-main/.openclaw/" \
        "__pycache__/" "*.pyc" "node_modules/" \
        ".venv/" "venv/" \
        "*.db" "*.sqlite" ".DS_Store" "Thumbs.db" \
        ".vscode/" ".idea/" \
        2>/dev/null || true
}

# ========== 主流程 ==========
log "=== 开始同步 ==="

# 1. 更新 .gitignore
ensure_gitignore

# 2. 拉取远端变更
git fetch origin --quiet 2>/dev/null

if [ -n "$(git log HEAD..origin/master --oneline 2>/dev/null)" ]; then
    log "远端有新 commit，执行 pull"
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        log "本地有变更，先 stash"
        git stash push --include-untracked -m "sync-$(date +%s)" --quiet
        STASHED=true
    else
        STASHED=false
    fi
    git pull origin master --no-edit 2>&1 | tee -a "$LOG_FILE"
    if [ "$STASHED" = true ]; then
        git stash pop --quiet 2>/dev/null || log "stash pop 冲突，需手动处理"
    fi
fi

# 3. 分类未跟踪文件
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null || true)
if [ -n "$UNTRACKED" ]; then
    TO_ADD=""
    TO_IGNORE=""

    while IFS= read -r file; do
        [ -z "$file" ] && continue
        ignore=false
        for pattern in "${MUST_IGNORE_PATTERNS[@]}"; do
            if [[ "$file" == $pattern ]] || [[ "$file" == *"$pattern"* ]] || [[ "$file" == */$pattern ]]; then
                ignore=true
                break
            fi
        done
        # 路径关键词检测
        if [[ "$file" == *".log/"* ]] || [[ "$file" == *"logs/"* ]] || \
           [[ "$file" == *".openclaw/"* ]] || [[ "$file" == *"/__pycache__/"* ]] || \
           [[ "$file" == *"node_modules/"* ]] || [[ "$file" == *".venv/"* ]] || \
           [[ "$file" == *"venv/"* ]] || [[ "$file" == *".bak" ]] || [[ "$file" == *".backup" ]]; then
            ignore=true
        fi

        if [ "$ignore" = true ]; then
            TO_IGNORE="${TO_IGNORE}${file}
"
        else
            TO_ADD="${TO_ADD}${file}
"
        fi
    done <<< "$UNTRACKED"

    # 处理应忽略的文件
    if [ -n "$TO_IGNORE" ]; then
        while IFS= read -r file; do
            [ -z "$file" ] && continue
            if [[ -d "$file" ]]; then
                entry="${file%/}/"
            else
                entry="$(basename "$file")"
            fi
            grep -qxF "$entry" .gitignore 2>/dev/null || echo "$entry" >> .gitignore
            git rm -r --cached --ignore-unmatch "$file" 2>/dev/null || true
            log "IGNORE: $file"
        done <<< "$TO_IGNORE"
    fi

    # 处理应提交的文件
    if [ -n "$TO_ADD" ]; then
        while IFS= read -r file; do
            [ -z "$file" ] && continue
            git add "$file" 2>/dev/null || true
            log "ADD: $file"
        done <<< "$TO_ADD"
    fi
fi

# 4. 提交并推送
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    dirs=$(git diff --cached --name-only 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null; git diff --name-only 2>/dev/null)
    prefix=$(echo "$dirs" | grep -v '^$' | awk -F'/' '{print $1}' | sort -u | head -3 | tr '\n' ',' | sed 's/,$//')
    [ -z "$prefix" ] && prefix="config"

    git add -A
    git commit -m "sync($prefix): $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || true

    if [ -n "$(git log origin/master..HEAD --oneline 2>/dev/null)" ]; then
        log "推送到 origin"
        git push origin master 2>&1 | tee -a "$LOG_FILE" || {
            log "push 被拒绝，先 pull 再重试"
            git pull origin master --no-edit 2>&1 | tee -a "$LOG_FILE" || true
            git push origin master 2>&1 | tee -a "$LOG_FILE" || log "push 仍然失败"
        }
        log "推送完成"
    fi
else
    log "无变更"
fi

log "=== 同步完成 ==="
