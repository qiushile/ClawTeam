#!/bin/bash

# 哨兵定时监控脚本
# 每 5 分钟执行一次团队健康检查

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/openclaw-sentinel.log"
STATE_FILE="$SCRIPT_DIR/health-state.json"

# 记录执行时间
echo "=== Sentinel Check: $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOG_FILE"

# 执行健康检查
check_output=$("$SCRIPT_DIR/health-check.sh" --plain 2>&1) || true
exit_code=$?

# 解析检查结果
if echo "$check_output" | grep -q "CRITICAL"; then
    status="CRITICAL"
    emoji="🚨"
    # CRITICAL 级别：记录并通知
    echo "[$emoji] CRITICAL 告警 detected!" >> "$LOG_FILE"
    echo "$check_output" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    
    # 更新状态文件
    cat > "$STATE_FILE" <<EOF
{"timestamp":"$(date '+%Y-%m-%d %H:%M:%S')","status":"CRITICAL","exitCode":$exit_code}
EOF
    
    # TODO: 发送飞书告警通知
    # curl -X POST "https://open.feishu.cn/open-apis/bot/v2/hook/..." -d "{\"msg_type\":\"text\",\"content\":{\"text\":\"🚨 OpenClaw Team CRITICAL 告警\\n\\n$check_output\"}}"
    
elif echo "$check_output" | grep -q "WARNING"; then
    status="WARNING"
    emoji="⚠️"
    # WARNING 级别：记录
    echo "[$emoji] WARNING detected!" >> "$LOG_FILE"
    echo "$check_output" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    
    # 更新状态文件
    cat > "$STATE_FILE" <<EOF
{"timestamp":"$(date '+%Y-%m-%d %H:%M:%S')","status":"WARNING","exitCode":$exit_code}
EOF
    
else
    status="HEALTHY"
    emoji="✅"
    # HEALTHY 级别：仅记录时间戳（减少日志量）
    echo "[$emoji] HEALTHY - All systems operational" >> "$LOG_FILE"
    
    # 更新状态文件
    cat > "$STATE_FILE" <<EOF
{"timestamp":"$(date '+%Y-%m-%d %H:%M:%S')","status":"HEALTHY","exitCode":0}
EOF
fi

# 日志轮转（保留最近 1000 行）
if [ $(wc -l < "$LOG_FILE") -gt 1000 ]; then
    tail -500 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi

exit $exit_code
