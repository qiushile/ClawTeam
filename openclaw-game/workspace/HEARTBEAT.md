# Heartbeat Configuration

## 游戏逻辑与关卡设计任务同步（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 检查分配给 `game` 的玩法迭代、数值平衡或关卡任务。
  2. 扫描核心玩法逻辑库的异常报错。
  3. 报告今日的游戏版本迭代核心要点。
