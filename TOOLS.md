# ClawTeam 联邦工具治理手册 (TOOLS.md)

本文档是 ClawTeam 联邦 Agent 的核心能力蓝图与操作规范。所有 Agent 在执行任务时必须严格遵守本协议。

---

## 1. 联邦核心：语义协作工具 (Federated Semantic API)
这是 Agent 之间跨容器、跨部门协作的**首选方式**。由 `postgres-tool` 插件提供，底层操作 `shared` schema。

- **[Tool] Task Orchestrator (任务编排)**
  - `get_my_tasks`: 检索指派给当前角色的待办事项。建议在 `HEARTBEAT.md` 或任务触发时首选调用。
  - `update_task_status`: 任务生命周期管理 (`IN_PROGRESS` / `COMPLETED` / `FAILED`)。
  - `send_task`: 当需要其他部门（如从 PM 到 Dev）协助时，通过此工具创建新任务。
- **[Tool] Artifact Registry (产物登记)**
  - `post_artifact`: 提交最终的工作产物（如代码路径、PRD 链接、测试报告）。
- **[Tool] Messenger (异步通信)**
  - `send_message`: 跨部门询问细节或对齐信息，避免死锁等待。

---

## 2. 基础生存能力 (Native Framework Capabilities)
所有 Agent 均享有的 `OpenClaw` 基础工具，但受到宿主机的 RLS (行级安全) 与系统审计。

- **感知类 (Perception)**: `read_file`, `list_dir`, `grep_search`。
- **决策支持 (Decision Support)**: `web_search`, `read_url`。
- **主动汇报 (Report)**: `feishu.report_to_owner` (向人类汇报进展)。

---

## 3. 领域专家私有工具 (Domain-Specific Tools)
专属于特定部门的工具集，通常配置在各部门的容器环境中。

- **产品部 (PM)**: `tapd-tool` (需求同步)、`market-research-script`。
- **研发部 (Dev)**: `sandbox-exec` (沙箱代码执行)、`git-helper` (代码库管理)。
- **运维部 (Ops)**: `server-monitor`, `log-diagnostic`。

---

## 4. 安全治理与隔离协议 (Safety & Isolation)
- **沙箱准则**: 凡涉及代码执行 (`exec`, `bash`) 或浏览器自动化 (`playwright`) 的操作，必须在 `sandbox` 容器镜像中进行。
- **防 AI 痕迹**: 在与世乐沟通时，严禁暴露工具调用日志，仅输出简洁、专业的结论。
- **协作记录**: 所有的语义 API 调用会自动在 `shared.collaboration_events` 中留档，严禁绕过记录。

---

## 5. 工具链演进 (Evolution)
如需为当前 Agent 添加新工具：
1. **脚本化**: 在 `common/` 或对应的 `workspace/agents/` 下编写脚本。
2. **声明**: 在 `openclaw.json` 的 `plugins` 或 `nativeSkills` 中启用。
3. **注册**: 在本文件中更新该工具的职能描述。
