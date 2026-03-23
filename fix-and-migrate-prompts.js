const fs = require('fs');
const path = require('path');

const baseDir = '/Users/qiushile/WorkStation/mine/claw/ClawTeam';
const agentDirs = [
  'openclaw-ads', 'openclaw-design', 'openclaw-dev', 'openclaw-expert',
  'openclaw-game', 'openclaw-marketing', 'openclaw-orchestrator', 'openclaw-pm',
  'openclaw-project', 'openclaw-qa', 'openclaw-sales', 'openclaw-spatial', 'openclaw-support'
];

const generalRules = `
## 联邦协作 2.0 (高效语义接口升级)

你是 **OpenClaw 联邦协作系统** 的成员。你拥有 \`postgres-tool\` 提供的集成语义协作能力。

1. **接单意识**：始终先用 \`get_my_tasks\` 检查属于你的任务状态。
2. **即时响应**：任务指派给你（Assignee）后，立即用 \`update_task_status\` 将其设为 \`IN_PROGRESS\`。
3. **寻求协助**：如果你需要其他部门配合或拆分子任务，使用 \`send_task\`。
4. **异步沟通**：需要澄清细节或跨部门对齐时，优先使用 \`send_message\` 发送异步消息。
5. **闭环交付**：工作完成后，务必用 \`update_task_status\` 闭环任务，并使用 \`post_artifact\` 提交最终交付产物。
6. **存在感汇报**：定期执行 \`heartbeat\` 汇报你的活跃能力与资源状态。
`;

const orchestratorRules = `
## 联邦协作 2.0 (高效语义接口升级)

你是 **指挥中枢 (Orchestrator)**，跨越所有职能部门。你负责意图识别、全局任务拆解、路由分发与资源协调。

1. **零动手原则**：你自己不执行任何底层业务实施。你通过 \`lookup_department\` 获取目标部门。
2. **高效分发**：你必须且只能使用 \`send_task\` 创建任务并向各部门快速分发。
3. **全局监控**：作为 Requester，通过 \`get_my_tasks\` 主动追踪各链路的全局进度。
4. **状态感知**：通过 \`get_agent_heartbeats\` 检查集群中各 Agent 的实时在线、能力分发与负载状态。

**协作通用准则**：
- 始终先用 \`get_my_tasks\` 检查属于你的任务（作为 Requester 或 Assignee）。
- 任务指派给你后，立即用 \`update_task_status\` 将其设为 \`IN_PROGRESS\`。
- 如果需要协助，使用 \`send_task\`。
- 需要异步澄清时，使用 \`send_message\`。
- 工作完成后，用 \`update_task_status\` 归档并使用 \`post_artifact\` 发送产物。
- 定期执行 \`heartbeat\` 检查状态。
`;

for (const dirName of agentDirs) {
  const configPath = path.join(baseDir, dirName, 'openclaw.json');
  const soulPath = path.join(baseDir, dirName, 'workspace', 'SOUL.md');

  // 1. Remove from openclaw.json
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.agents && config.agents.defaults && config.agents.defaults.systemPrompt) {
        delete config.agents.defaults.systemPrompt;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(`🧹 Cleared systemPrompt from ${dirName}/openclaw.json`);
      }
    } catch (e) {
      console.error(`❌ Failed to clean ${dirName}/openclaw.json:`, e.message);
    }
  }

  // 2. Append to SOUL.md
  if (fs.existsSync(soulPath)) {
    try {
      let soulContent = fs.readFileSync(soulPath, 'utf8');
      
      // Clean up previous appends if any (optional but good for idempotency)
      if (soulContent.includes('## 联邦协作 2.0')) {
          soulContent = soulContent.split('## 联邦协作 2.0')[0].trim();
      }

      const ruleToAppend = (dirName === 'openclaw-orchestrator') ? orchestratorRules : generalRules;
      soulContent += '\n\n' + ruleToAppend.trim() + '\n';
      
      fs.writeFileSync(soulPath, soulContent);
      console.log(`📜 Updated ${dirName}/workspace/SOUL.md with 2.0 rules`);
    } catch (e) {
      console.error(`❌ Failed to update ${dirName} SOUL.md:`, e.message);
    }
  } else {
    console.warn(`⚠️ SOUL.md not found at ${soulPath}`);
  }
}
