# Heartbeat Configuration

## 销售线索跟进与任务同步（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 检查分配给 `sales` 的新客户线索或跟进任务。
  2. 汇总昨日的关键转化数据。
  3. 报告今日的高优待办清单。
