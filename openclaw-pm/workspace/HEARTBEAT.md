# Heartbeat Configuration

## 每日团队进展同步（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 或查询 `shared.tasks` 表，获取 `status` 为 'COMPLETED' 的最新任务条目，以及可从 `shared.shared_artifacts` 获取相关产物。
  2. 生成今日的项目进度日报。
  3. 将日报保存到工作区 `/workspace/daily_reports/` 目录下。