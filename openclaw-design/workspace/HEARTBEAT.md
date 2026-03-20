# Heartbeat Configuration

## 设计资产检查与任务同步（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 检查是否有分配给 `design` 的新设计需求。
  2. 确认已提交的 `shared.shared_artifacts` 设计稿是否需要进一步迭代。
  3. 报告今日的设计排期。
