#!/bin/bash

# OpenClaw Heartbeat 健康检查触发器
# 被 heartbeat 调用，执行健康检查并发送飞书通知

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HEALTH_SCRIPT="$SCRIPT_DIR/health-check.sh"
STATE_FILE="$SCRIPT_DIR/health-state.json"

# 执行健康检查（纯文本输出）
check_output=$("$HEALTH_SCRIPT" --plain 2>&1) || true
exit_code=$?

# 解析检查结果
if echo "$check_output" | grep -q "CRITICAL"; then
    status="CRITICAL"
    emoji="🚨"
elif echo "$check_output" | grep -q "WARNING"; then
    status="WARNING"
    emoji="⚠️"
else
    status="HEALTHY"
    emoji="✅"
fi

# 提取关键信息
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
issues=$(echo "$check_output" | grep "^  - " | head -5 | tr '\n' '\n')

# 生成飞书消息
if [ "$status" = "CRITICAL" ]; then
    # 严重问题，立即通知
    message="【Agent 团队健康告警】$emoji

时间：$timestamp
状态：$status

问题摘要：
$issues

完整输出：
\`\`\`
$check_output
\`\`\`"
    
    # 发送到飞书（通过 OpenClaw message 工具）
    echo "$message"
    
    # 记录状态
    echo "{\"timestamp\":\"$timestamp\",\"status\":\"$status\",\"exitCode\":$exit_code}" > "$STATE_FILE"
    
    exit 1
    
elif [ "$status" = "WARNING" ]; then
    # 警告，记录但不一定通知
    message="【Agent 团队健康检查】$emoji

时间：$timestamp
状态：$status

警告摘要：
$issues

完整输出：
\`\`\`
$check_output
\`\`\`"
    
    echo "$message"
    echo "{\"timestamp\":\"$timestamp\",\"status\":\"$status\",\"exitCode\":$exit_code}" > "$STATE_FILE"
    
    exit 0
    
else
    # 正常，只记录状态
    echo "{\"timestamp\":\"$timestamp\",\"status\":\"$status\",\"exitCode\":0}" > "$STATE_FILE"
    
    # 可选：定期（如每天第一次）发送正常报告
    # 这里只返回简洁状态
    echo "✅ Agent 团队健康检查通过 - $timestamp"
    
    exit 0
fi
