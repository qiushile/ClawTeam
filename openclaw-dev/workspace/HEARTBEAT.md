# Heartbeat Configuration

## 研发任务进度扫描与接单（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 检查是否有分配给 `dev` 的 `PENDING` 任务。
  2. 如果有新任务，将其更新为 `IN_PROGRESS` 并汇报初步处理计划。
  3. 检查是否有已完成的任务并准备提交产物。
