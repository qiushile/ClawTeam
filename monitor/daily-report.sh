#!/bin/bash
# 每日汇报脚本 - 检查 openclaw-team 代码和状态变更
# 输出格式：Markdown，适合发送到 Feishu/其他渠道

set -e

REPORT_DIR="/opt/openclaw-team/monitor"
REPORT_FILE="$REPORT_DIR/daily-report-$(date +%Y-%m-%d).md"
STATE_FILE="$REPORT_DIR/daily-report-state.json"

cd /opt/openclaw-team

echo "# 📋 OpenClaw Team 每日汇报" > "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "**日期：** $(date +%Y-%m-%d)" >> "$REPORT_FILE"
echo "**生成时间：** $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# ========== 1. Git 状态检查 ==========
echo "## 1. 📦 代码仓库状态" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 检查是否有未提交的变更
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l)
if [ "$UNCOMMITTED" -gt 0 ]; then
    echo "⚠️ **有未提交的变更：**" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    git status --porcelain >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # 列出具体变更文件
    echo "**变更文件列表：**" >> "$REPORT_FILE"
    git status --porcelain | while read line; do
        FILE=$(echo "$line" | awk '{print $2}')
        STATUS=$(echo "$line" | awk '{print $1}')
        case "$STATUS" in
            M*) echo "- 📝 修改：\`$FILE\`" >> "$REPORT_FILE" ;;
            A*) echo "- ➕ 新增：\`$FILE\`" >> "$REPORT_FILE" ;;
            D*) echo "- ❌ 删除：\`$FILE\`" >> "$REPORT_FILE" ;;
            R*) echo "- 🔄 重命名：\`$FILE\`" >> "$REPORT_FILE" ;;
            ??) echo "- 🆕 未跟踪：\`$FILE\`" >> "$REPORT_FILE" ;;
        esac
    done
    echo "" >> "$REPORT_FILE"
else
    echo "✅ **工作区干净，无未提交变更**" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
fi

# 检查是否有未推送的提交
UNPUSHED=$(git rev-list origin/master..master 2>/dev/null | wc -l)
if [ "$UNPUSHED" -gt 0 ]; then
    echo "⚠️ **有 $UNPUSHED 个本地提交未推送到远程：**" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    git log --oneline origin/master..master | while read line; do
        echo "- $line" >> "$REPORT_FILE"
    done
    echo "" >> "$REPORT_FILE"
else
    echo "✅ **本地与远程同步**" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
fi

# 检查是否有远程有新提交
UNPULLED=$(git rev-list master..origin/master 2>/dev/null | wc -l)
if [ "$UNPULLED" -gt 0 ]; then
    echo "⚠️ **远程有 $UNPULLED 个新提交未拉取：**" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    git log --oneline master..origin/master | while read line; do
        echo "- $line" >> "$REPORT_FILE"
    done
    echo "" >> "$REPORT_FILE"
fi

# ========== 2. 最近提交历史 ==========
echo "## 2. 📜 最近 10 条提交记录" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
git log --oneline -10 | while read line; do
    echo "- $line" >> "$REPORT_FILE"
done
echo "" >> "$REPORT_FILE"

# ========== 3. Docker 容器状态 ==========
echo "## 3. 🐳 Agent 容器状态" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 检查容器状态
CONTAINERS=("openclaw-orchestrator" "openclaw-dev" "openclaw-pm" "openclaw-postgres")
for CONTAINER in "${CONTAINERS[@]}"; do
    STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER" 2>/dev/null || echo "不存在")
    if [ "$STATUS" = "running" ]; then
        echo "- ✅ \`$CONTAINER\` - 运行中" >> "$REPORT_FILE"
    elif [ "$STATUS" = "exited" ]; then
        echo "- ❌ \`$CONTAINER\` - 已停止" >> "$REPORT_FILE"
    else
        echo "- ⚪ \`$CONTAINER\` - $STATUS" >> "$REPORT_FILE"
    fi
done
echo "" >> "$REPORT_FILE"

# ========== 4. 端口检查 ==========
echo "## 4. 🔌 端口可用性" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

PORTS=("18001:orchestrator" "18002:dev" "18003:pm" "15432:postgres")
for PORT_INFO in "${PORTS[@]}"; do
    PORT=$(echo "$PORT_INFO" | cut -d: -f1)
    SERVICE=$(echo "$PORT_INFO" | cut -d: -f2)
    if nc -z localhost "$PORT" 2>/dev/null; then
        echo "- ✅ 端口 \`$PORT\` ($SERVICE) - 可访问" >> "$REPORT_FILE"
    else
        echo "- ❌ 端口 \`$PORT\` ($SERVICE) - 不可访问" >> "$REPORT_FILE"
    fi
done
echo "" >> "$REPORT_FILE"

# ========== 5. 健康状态文件 ==========
echo "## 5. 🏥 健康状态" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ -f "$REPORT_DIR/health-state.json" ]; then
    echo '```json' >> "$REPORT_FILE"
    cat "$REPORT_DIR/health-state.json" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
else
    echo "⚪ 健康状态文件不存在" >> "$REPORT_FILE"
fi
echo "" >> "$REPORT_FILE"

# ========== 6. 推荐操作 ==========
echo "## 6. 💡 推荐操作" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

RECOMMENDATIONS=0

# 检查是否需要提交变更
if [ "$UNCOMMITTED" -gt 0 ]; then
    echo "### 📝 代码变更推荐" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    # 分析变更类型
    CONFIG_FILES=0
    CODE_FILES=0
    LOG_FILES=0
    
    git status --porcelain | while read line; do
        FILE=$(echo "$line" | awk '{print $2}')
        case "$FILE" in
            *.json|*.yml|*.yaml|.env*)
                echo "- ⚙️ 配置文件：\`$FILE\` **建议提交**" >> "$REPORT_FILE"
                ;;
            *.log|*.tmp|health-state.json|update-check.json)
                echo "- 📊 状态/日志文件：\`$FILE\` **建议忽略**" >> "$REPORT_FILE"
                ;;
            *)
                echo "- 📄 其他文件：\`$FILE\` **请审查后决定**" >> "$REPORT_FILE"
                ;;
        esac
    done
    echo "" >> "$REPORT_FILE"
    
    echo "**推荐命令：**" >> "$REPORT_FILE"
    echo '```bash' >> "$REPORT_FILE"
    echo "# 查看所有变更详情" >> "$REPORT_FILE"
    echo "git diff" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "# 提交配置文件变更" >> "$REPORT_FILE"
    echo "git add <配置文件路径>" >> "$REPORT_FILE"
    echo "git commit -m \"chore: 更新配置\"" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    RECOMMENDATIONS=$((RECOMMENDATIONS + 1))
fi

# 检查是否需要推送
if [ "$UNPUSHED" -gt 0 ]; then
    echo "### 🚀 推送推荐" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "有 $UNPUSHED 个本地提交待推送。" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "**推荐命令：**" >> "$REPORT_FILE"
    echo '```bash' >> "$REPORT_FILE"
    echo "git push origin master" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    RECOMMENDATIONS=$((RECOMMENDATIONS + 1))
fi

# 检查容器状态
for CONTAINER in "${CONTAINERS[@]}"; do
    STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER" 2>/dev/null || echo "不存在")
    if [ "$STATUS" != "running" ]; then
        echo "### ⚠️ 容器异常" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo "容器 \`$CONTAINER\` 状态：$STATUS" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo "**推荐命令：**" >> "$REPORT_FILE"
        echo '```bash' >> "$REPORT_FILE"
        echo "docker logs $CONTAINER --tail 50" >> "$REPORT_FILE"
        echo "docker restart $CONTAINER" >> "$REPORT_FILE"
        echo '```' >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        RECOMMENDATIONS=$((RECOMMENDATIONS + 1))
        break
    fi
done

if [ "$RECOMMENDATIONS" -eq 0 ]; then
    echo "✅ **一切正常，无需操作**" >> "$REPORT_FILE"
fi

# ========== 7. 汇总 ==========
echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "## 📊 汇总" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| 检查项 | 状态 |" >> "$REPORT_FILE"
echo "|--------|------|" >> "$REPORT_FILE"

# 仓库状态
if [ "$UNCOMMITTED" -eq 0 ] && [ "$UNPUSHED" -eq 0 ]; then
    echo "| 代码仓库 | ✅ 正常 |" >> "$REPORT_FILE"
else
    echo "| 代码仓库 | ⚠️ 有变更 |" >> "$REPORT_FILE"
fi

# 容器状态
ALL_RUNNING=true
for CONTAINER in "${CONTAINERS[@]}"; do
    STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER" 2>/dev/null || echo "不存在")
    if [ "$STATUS" != "running" ]; then
        ALL_RUNNING=false
        break
    fi
done

if [ "$ALL_RUNNING" = true ]; then
    echo "| Agent 容器 | ✅ 全部运行 |" >> "$REPORT_FILE"
else
    echo "| Agent 容器 | ❌ 有异常 |" >> "$REPORT_FILE"
fi

# 端口状态
ALL_PORTS_OK=true
for PORT_INFO in "${PORTS[@]}"; do
    PORT=$(echo "$PORT_INFO" | cut -d: -f1)
    if ! nc -z localhost "$PORT" 2>/dev/null; then
        ALL_PORTS_OK=false
        break
    fi
done

if [ "$ALL_PORTS_OK" = true ]; then
    echo "| 端口服务 | ✅ 全部可用 |" >> "$REPORT_FILE"
else
    echo "| 端口服务 | ❌ 有异常 |" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "**报告生成完毕**" >> "$REPORT_FILE"

# 保存状态
cat > "$STATE_FILE" << EOF
{
  "lastReport": "$(date -Iseconds)",
  "uncommitted": $UNCOMMITTED,
  "unpushed": $UNPUSHED,
  "containersOk": $ALL_RUNNING,
  "portsOk": $ALL_PORTS_OK
}
EOF

echo ""
echo "报告已生成：$REPORT_FILE"
cat "$REPORT_FILE"
