# Heartbeat Configuration

## 空间计算资产与交互任务检查（工作日早上 9:30 触发）
schedule: "30 9 * * 1-5"
model: "fast"
task: |
  1. 调用 `get_my_tasks` 检查分配给 `spatial` 的 XR/AR 开发与 3D 资产任务。
  2. 检查空间交互逻辑的集成状态。
  3. 报告今日的三维资产渲染与交付进度。
