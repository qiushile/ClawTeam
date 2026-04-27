#!/bin/bash
# Git 双向同步脚本 — 智能分类 + 同步 + 线性 commit log
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

# ========== Rebase 冲突处理 ==========
handle_rebase_conflict() {
    log "rebase 冲突，尝试自动解决"
    # 检查是否只有脚本本身的冲突（auto-sync commit 互相冲突）
    local conflict_files
    conflict_files=$(git diff --name-only --diff-filter=U 2>/dev/null || true)
    local is_auto_sync=true

    for f in $conflict_files; do
        # 如果冲突文件不是脚本或 .gitignore，标记为真实冲突
        if [[ "$f" != "scripts/git-sync.sh" ]] && [[ "$f" != ".gitignore" ]]; then
            is_auto_sync=false
            break
        fi
    done

    if [ "$is_auto_sync" = true ]; then
        log "冲突仅限 auto-sync 文件，跳过冲突 commit"
        git rebase --skip 2>&1 | tee -a "$LOG_FILE"
    else
        log "真实文件冲突，中止 rebase 并以远端为准"
        git rebase --abort 2>/dev/null || true
        git reset --hard origin/master
        git clean -fd 2>/dev/null || true
    fi
}

# ========== 主流程 ==========
log "=== 开始同步 ==="

# 1. 更新 .gitignore
ensure_gitignore

# 2. 拉取远端变更（rebase 保持线性）
git fetch origin --quiet 2>/dev/null

if [ -n "$(git log HEAD..origin/master --oneline 2>/dev/null)" ]; then
    log "远端有新 commit，执行 pull --rebase"
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        log "本地有变更，先 stash"
        git stash push --include-untracked -m "sync-$(date +%s)" --quiet
        STASHED=true
    else
        STASHED=false
    fi

    git pull --rebase origin master --no-edit 2>&1 | tee -a "$LOG_FILE" || handle_rebase_conflict

    if [ "$STASHED" = true ]; then
        # stash pop 也用 rebase 模式
        git stash pop --quiet 2>/dev/null || {
            log "stash pop 冲突，丢弃 stash（变更已由远端覆盖）"
            git stash drop --quiet 2>/dev/null || true
        }
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
            log "push 被拒绝，rebase 后重试"
            git fetch origin --quiet
            git pull --rebase origin master --no-edit 2>&1 | tee -a "$LOG_FILE" || handle_rebase_conflict
            git push origin master 2>&1 | tee -a "$LOG_FILE" || log "push 仍然失败"
        }
        log "推送完成"
    fi
else
    log "无变更"
fi

log "=== 同步完成 ==="
