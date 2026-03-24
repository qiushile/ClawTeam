#!/bin/bash
#
# OpenClaw Team 每日检查脚本
# 运行时间：每天 7:50, 11:50, 17:50
# 功能：检查 git 变更、敏感信息、自动提交必要内容
#

set -e

WORKSPACE="/opt/openclaw-team"
LOG_DIR="/opt/openclaw-team/monitor/logs"
STATE_FILE="/opt/openclaw-team/monitor/daily-check-state.json"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
DATE=$(date '+%Y-%m-%d')

# 创建日志目录
mkdir -p "$LOG_DIR"

# 日志函数
log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_DIR/daily-check-${DATE}.log"
}

log "=== 开始每日检查 ==="

cd "$WORKSPACE"

# 检查 git 状态
log "检查 git 状态..."
MODIFIED_FILES=$(git status --porcelain | grep "^ M" | awk '{print $2}' || echo "")
UNTRACKED_FILES=$(git status --porcelain | grep "^??" | awk '{print $2}' || echo "")
STAGED_FILES=$(git status --porcelain | grep "^M " | awk '{print $2}' || echo "")

# 统计文件数量
MODIFIED_COUNT=$(echo "$MODIFIED_FILES" | grep -c . || echo 0)
UNTRACKED_COUNT=$(echo "$UNTRACKED_FILES" | grep -c . || echo 0)

log "修改的文件：$MODIFIED_COUNT 个"
log "未跟踪的文件：$UNTRACKED_COUNT 个"

# 敏感信息检查 - 真实密钥模式（排除变量引用）
SENSITIVE_KEY_PATTERNS=(
    "sk-[a-zA-Z0-9]{20,}"
    "ghp_[a-zA-Z0-9]{36}"
    "glpat-[a-zA-Z0-9]{20,}"
    "gho_[a-zA-Z0-9]{36}"
    "github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}"
)

# 检查敏感信息
log "检查敏感信息泄漏..."
SENSITIVE_FOUND=()
SENSITIVE_UNIQUE=()

for file in $MODIFIED_FILES $UNTRACKED_FILES; do
    if [ -f "$file" ]; then
        # 排除 .gitignore 中的文件
        if git check-ignore -q "$file" 2>/dev/null; then
            continue
        fi
        
        # 排除示例文件和配置文件
        if [[ "$file" =~ \.(example|sample|template|dist)$ ]] || [[ "$file" =~ \.env\.example$ ]]; then
            continue
        fi
        
        # 排除 workspace 中的配置文件（已添加到 .gitignore）
        if [[ "$file" =~ workspace/.*-config\.json$ ]] || [[ "$file" =~ workspace/memory-.*\.json$ ]]; then
            continue
        fi
        
        # 检查是否是实际的密钥值
        for pattern in "${SENSITIVE_KEY_PATTERNS[@]}"; do
            if grep -qE "$pattern" "$file" 2>/dev/null; then
                # 去重
                if [[ ! " ${SENSITIVE_UNIQUE[*]} " =~ " ${file} " ]]; then
                    SENSITIVE_UNIQUE+=("$file")
                    log "⚠️  警告：$file 包含真实密钥值"
                fi
                break
            fi
        done
    fi
done

SENSITIVE_FOUND=("${SENSITIVE_UNIQUE[@]}")

# 分类文件
log "对变更进行分类..."

# 必要提交的文件（自动提交）
NECESSARY_PATTERNS=(
    "openclaw\.json$"
    "docker-compose\.yml$"
    "\.env$"
    "init\.sql$"
    "monitor/.*\.sh$"
    "monitor/heartbeat-trigger\.sh$"
    "monitor/daily-report\.sh$"
)

# 需要确认的文件（非必要）
OPTIONAL_PATTERNS=(
    "workspace/.*\.md$"
    "workspace/.*\.log$"
    "workspace/.*\.json$"
    "memory/.*\.md$"
    "skills/.*/"
    "extensions/.*/"
    ".*\.bak[0-9]*$"
    ".*\.tmp$"
)

NECESSARY_FILES=()
OPTIONAL_FILES=()

for file in $MODIFIED_FILES; do
    IS_OPTIONAL=false
    
    # 检查是否是可选文件
    for pattern in "${OPTIONAL_PATTERNS[@]}"; do
        if [[ "$file" =~ $pattern ]]; then
            IS_OPTIONAL=true
            OPTIONAL_FILES+=("$file")
            break
        fi
    done
    
    # 如果不是可选，就是必要
    if [ "$IS_OPTIONAL" = false ]; then
        NECESSARY_FILES+=("$file")
    fi
done

# 自动提交必要文件
if [ ${#NECESSARY_FILES[@]} -gt 0 ]; then
    log "自动提交必要文件..."
    git add "${NECESSARY_FILES[@]}"
    
    # 检查是否有暂存的变更
    if ! git diff --cached --quiet; then
        COMMIT_MSG="chore(auto): 自动提交配置变更 - ${DATE}

自动提交的文件：
$(printf '  - %s\n' "${NECESSARY_FILES[@]}")

此提交由每日检查脚本自动生成。"
        
        git commit -m "$COMMIT_MSG"
        
        # 尝试推送
        if git push origin master 2>/dev/null; then
            log "✅ 成功推送 ${#NECESSARY_FILES[@]} 个必要文件"
        else
            log "⚠️  推送失败，可能需要手动处理"
        fi
    else
        log "ℹ️  没有实际变更需要提交"
    fi
else
    log "ℹ️  没有需要自动提交的必要文件"
fi

# 生成报告
REPORT_FILE="$LOG_DIR/daily-check-${DATE}.md"

cat > "$REPORT_FILE" << EOF
# OpenClaw Team 每日检查报告

**检查时间：** ${TIMESTAMP}
**检查周期：** 每日 3 次 (7:50, 11:50, 17:50)

## 📊 概览

- 修改的文件：${#NECESSARY_FILES[@]} 个必要 + ${#OPTIONAL_FILES[@]} 个可选
- 未跟踪的文件：${UNTRACKED_COUNT} 个
- 敏感信息警告：${#SENSITIVE_FOUND[@]} 个

## ✅ 已自动提交

$(if [ ${#NECESSARY_FILES[@]} -gt 0 ]; then
    printf '  - %s\n' "${NECESSARY_FILES[@]}"
else
    echo "  无"
fi)

## ⚠️  需要确认的文件

$(if [ ${#OPTIONAL_FILES[@]} -gt 0 ]; then
    printf '  - %s\n' "${OPTIONAL_FILES[@]}"
else
    echo "  无"
fi)

## 🚨 敏感信息警告

$(if [ ${#SENSITIVE_FOUND[@]} -gt 0 ]; then
    printf '  - %s\n' "${SENSITIVE_FOUND[@]}"
else
    echo "  未发现敏感信息泄漏"
fi)

## 📝 未跟踪文件（部分）

$(echo "$UNTRACKED_FILES" | head -20 | sed 's/^/  - /')
$(if [ $UNTRACKED_COUNT -gt 20 ]; then echo "  ... 还有 $(($UNTRACKED_COUNT - 20)) 个文件"; fi)

---
*此报告由 /opt/openclaw-team/monitor/daily-check.sh 自动生成*
EOF

log "报告已保存到：$REPORT_FILE"

# 更新状态文件
cat > "$STATE_FILE" << EOF
{
    "lastCheck": "${TIMESTAMP}",
    "date": "${DATE}",
    "modifiedCount": ${MODIFIED_COUNT},
    "untrackedCount": ${UNTRACKED_COUNT},
    "necessaryFiles": $(printf '%s\n' "${NECESSARY_FILES[@]}" | jq -R . | jq -s .),
    "optionalFiles": $(printf '%s\n' "${OPTIONAL_FILES[@]}" | jq -R . | jq -s .),
    "sensitiveFound": $(printf '%s\n' "${SENSITIVE_FOUND[@]}" | jq -R . | jq -s .),
    "reportFile": "${REPORT_FILE}"
}
EOF

log "=== 检查完成 ==="

# 如果有敏感信息或需要确认的文件，输出摘要
if [ ${#SENSITIVE_FOUND[@]} -gt 0 ] || [ ${#OPTIONAL_FILES[@]} -gt 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 需要用户确认的事项："
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ ${#SENSITIVE_FOUND[@]} -gt 0 ]; then
        echo ""
        echo "🚨 敏感信息警告（请检查）："
        printf '  - %s\n' "${SENSITIVE_FOUND[@]}"
    fi
    
    if [ ${#OPTIONAL_FILES[@]} -gt 0 ]; then
        echo ""
        echo "📁 可选文件（需要确认是否提交）："
        printf '  - %s\n' "${OPTIONAL_FILES[@]}"
        echo ""
        echo "💡 提示：这些文件通常是 workspace 中的技能、文档、日志等"
        echo "   如需提交，请运行：git add <文件> && git commit -m '消息'"
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

exit 0
