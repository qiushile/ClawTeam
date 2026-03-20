# Heartbeat Configuration

## 市场活动与内容发布监控（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 检查分配给 `marketing` 的新策划或文案任务。
  2. 监控核心社群与自媒体账号的活跃状态。
  3. 报告今日的内容分发计划。
