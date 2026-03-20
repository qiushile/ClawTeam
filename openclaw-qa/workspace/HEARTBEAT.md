# Heartbeat Configuration

## 测试用例执行与质量检查（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 检查是否有分配给 `qa` 的待测试任务。
  2. 汇总当前所有 `IN_PROGRESS` 任务的质量风险。
  3. 在飞书中通报今日的测试计划。
