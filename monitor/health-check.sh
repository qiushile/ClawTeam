#!/bin/bash

# OpenClaw Agent Team 健康检查脚本
# 用于 heartbeat 定期检查容器状态
# 用法：./health-check.sh [--plain]  # --plain 输出纯文本（无 ANSI 颜色）

set -e

# 容器配置
SERVICES=("openclaw-orchestrator" "openclaw-dev" "openclaw-pm")
GATEWAY_PORTS=("18001" "18002" "18003")  # Gateway 端口
WEBUI_PORTS=("13000" "13001" "13002")    # Web UI 端口
DB_CONTAINER="openclaw-postgres"
ALERT_THRESHOLD=3
TIMEOUT=2

# 检测是否支持颜色输出
if [ "$1" = "--plain" ] || [ -t 1 ]; then
    # 纯文本模式或非终端输出
    RED=''
    GREEN=''
    YELLOW=''
    NC=''
else
    # 颜色输出
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    NC='\033[0m'
fi

# 检查结果存储
declare -a ISSUES=()
declare -a WARNINGS=()

echo "=== OpenClaw Agent Team 健康检查 ==="
echo "时间：$(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 1. 检查 Docker 是否可用
if ! docker ps >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker 不可用${NC}"
    exit 1
fi

# 2. 检查容器状态
echo "📦 容器状态检查:"
for i in "${!SERVICES[@]}"; do
    svc="${SERVICES[$i]}"
    port="${PORTS[$i]}"
    
    # 检查容器是否存在
    exists=$(docker inspect --format '{{.State.Status}}' "$svc" 2>/dev/null || echo "not_found")
    
    if [ "$exists" = "not_found" ]; then
        echo -e "  ${RED}❌ $svc: 容器不存在${NC}"
        ISSUES+=("$svc 容器不存在")
        continue
    fi
    
    # 检查容器状态
    status=$(docker inspect --format '{{.State.Status}}' "$svc")
    restarts=$(docker inspect --format '{{.RestartCount}}' "$svc")
    running=$(docker inspect --format '{{.State.Running}}' "$svc")
    
    if [ "$status" != "running" ]; then
        echo -e "  ${RED}❌ $svc: 状态异常 ($status)${NC}"
        ISSUES+=("$svc 状态异常：$status")
    elif [ "$restarts" -gt "$ALERT_THRESHOLD" ]; then
        echo -e "  ${YELLOW}⚠️ $svc: 重启次数过多 ($restarts)${NC}"
        WARNINGS+=("$svc 重启次数：$restarts")
    else
        echo -e "  ${GREEN}✅ $svc: 正常运行${NC}"
    fi
done

echo ""

# 3. 检查端口监听
echo "🔌 端口检查:"

# 检查 Gateway 端口（所有容器）- 使用 TCP 检查
echo "  Gateway 端口:"
for i in "${!SERVICES[@]}"; do
    svc="${SERVICES[$i]}"
    port="${GATEWAY_PORTS[$i]}"
    
    # 使用 nc 进行 TCP 连接检查（比 curl 更可靠）
    if echo "" | nc -w $TIMEOUT 127.0.0.1 $port >/dev/null 2>&1; then
        echo -e "    ${GREEN}✅ 端口 $port ($svc): 正常${NC}"
    else
        echo -e "    ${RED}❌ 端口 $port ($svc): 无法连接${NC}"
        ISSUES+=("$svc Gateway 端口 $port 无法连接")
    fi
done

# 检查 Web UI 端口（所有容器）- 使用 TCP 检查
echo "  Web UI 端口:"
for i in "${!SERVICES[@]}"; do
    svc="${SERVICES[$i]}"
    port="${WEBUI_PORTS[$i]}"
    
    if echo "" | nc -w $TIMEOUT 127.0.0.1 $port >/dev/null 2>&1; then
        echo -e "    ${GREEN}✅ 端口 $port ($svc): 正常${NC}"
    else
        echo -e "    ${YELLOW}⚠️ 端口 $port ($svc): 无法连接 (可选)${NC}"
        # Web UI 不作为严重问题
    fi
done

echo ""

# 4. 检查最近日志错误（最近 5 分钟）
echo "📋 日志错误扫描 (最近 5 分钟):"
for svc in "${SERVICES[@]}"; do
    errors=$(docker logs --since 5m "$svc" 2>&1 | grep -ciE "error|fatal|exception" 2>/dev/null || true)
    errors=${errors:-0}
    # 取第一行数字（防止多行输出）
    errors=$(echo "$errors" | head -1 | tr -d '[:space:]')
    if ! [[ "$errors" =~ ^[0-9]+$ ]]; then
        errors=0
    fi
    if [ "$errors" -gt 0 ]; then
        echo -e "  ${YELLOW}⚠️ $svc: 发现 $errors 条错误日志${NC}"
        WARNINGS+=("$svc 错误日志：$errors 条")
    else
        echo -e "  ${GREEN}✅ $svc: 无错误日志${NC}"
    fi
done

echo ""

# 5. 检查资源使用
echo "💾 资源使用:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null | \
while read -r line; do
    if [[ "$line" == *"openclaw-"* ]]; then
        echo "  $line"
    fi
done

echo ""

# 6. 检查数据库容器
echo "🗄️ 数据库状态:"
db_status=$(docker inspect --format '{{.State.Status}}' "$DB_CONTAINER" 2>/dev/null || echo "not_found")
if [ "$db_status" = "running" ]; then
    echo -e "  ${GREEN}✅ PostgreSQL: 正常运行${NC}"
else
    echo -e "  ${RED}❌ PostgreSQL: 状态异常 ($db_status)${NC}"
    ISSUES+=("PostgreSQL 状态异常：$db_status")
fi

echo ""

# 7. 汇总结果
echo "=== 检查汇总 ==="
if [ ${#ISSUES[@]} -eq 0 ] && [ ${#WARNINGS[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ 所有服务正常${NC}"
    echo "HEALTHY"
    exit 0
elif [ ${#ISSUES[@]} -gt 0 ]; then
    echo -e "${RED}❌ 发现 ${#ISSUES[@]} 个严重问题:${NC}"
    for issue in "${ISSUES[@]}"; do
        echo "  - $issue"
    done
    if [ ${#WARNINGS[@]} -gt 0 ]; then
        echo -e "${YELLOW}⚠️ 以及 ${#WARNINGS[@]} 个警告:${NC}"
        for warning in "${WARNINGS[@]}"; do
            echo "  - $warning"
        done
    fi
    echo "CRITICAL"
    exit 1
else
    echo -e "${YELLOW}⚠️ 发现 ${#WARNINGS[@]} 个警告:${NC}"
    for warning in "${WARNINGS[@]}"; do
        echo "  - $warning"
    done
    echo "WARNING"
    exit 0
fi
