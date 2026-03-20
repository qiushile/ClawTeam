# Heartbeat Configuration

## 用户工单与故障任务监控（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 检查是否有分配给 `support` 的高优先级故障任务。
  2. 针对 `COMPLETED` 的技术协助请求，准备最终回复。
  3. 在飞书中汇报今日的服务保障状态。
