# Heartbeat Configuration

## 全局任务验收与结果汇总（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 识别由你（orchestrator）发起且状态为 `COMPLETED` 的任务。
  2. 汇总这些任务的 `result` 以及 `shared.shared_artifacts` 中的相关产物。
  3. 在飞书中向用户报告最终的交付成果。
