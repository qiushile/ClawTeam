# Heartbeat Configuration

## 项目进度追踪与瓶颈分析（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 或查询 `shared.tasks` 检查所有 `IN_PROGRESS` 且可能超时的任务。
  2. 识别跨部门协作中的阻塞点（如 PM 等待 Dev 产出）。
  3. 在飞书中向 Orchestrator 或相关负责人推送进度风险提示。
