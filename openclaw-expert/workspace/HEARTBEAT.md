# Heartbeat Configuration

## 战略参谋与架构审计任务检查（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 检查分配给 `expert` 的高难攻坚或架构审计任务。
  2. 扫描并汇总团队内部的技术方案偏差。
  3. 执行今日的战略决策支持分析。
