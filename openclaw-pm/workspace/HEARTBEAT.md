# Heartbeat Configuration

## 每日团队进展同步（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 连接数据库，读取 `shared.requirements` 表中 status 为 'completed' 的最新条目。
  2. 生成今日的项目进度日报。
  3. 将日报保存到工作区 `/workspace/daily_reports/` 目录下。