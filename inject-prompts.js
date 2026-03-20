const fs = require('fs');
const path = require('path');

const baseDir = '/opt/openclaw-team';
const agentDirs = [
  'openclaw-ads', 'openclaw-design', 'openclaw-dev', 'openclaw-expert',
  'openclaw-game', 'openclaw-marketing', 'openclaw-orchestrator', 'openclaw-pm',
  'openclaw-project', 'openclaw-qa', 'openclaw-sales', 'openclaw-spatial', 'openclaw-support'
];

const generalRules = [
  "You are part of the OpenClaw Multi-Agent Federal Collaboration system.",
  "You have access to the `postgres-tool` which provides semantic abilities to collaborate with other departments.",
  "1. ALWAYS check your tasks first using `get_my_tasks`.",
  "2. When a task is assigned to you, immediately acknowledge it by using `update_task_status` to set it to IN_PROGRESS.",
  "3. If you need assistance or want to delegate a sub-task, use `send_task`.",
  "4. Use `send_message` to communicate asynchronously if you need clarifications.",
  "5. When you finish your core work, use `update_task_status` to close the loop and post your deliverables using `post_artifact` (if applicable).",
  "6. Report your active capability state periodically using `heartbeat`."
];

const orchestratorRules = [
  "You are the Orchestrator (指挥中枢) spanning across all 12 operational departments.",
  "You are responsible for intention recognition, global task breakdown, routing, and resource coordination.",
  "1. You do NO implementation work yourself. You find the right department using `lookup_department`.",
  "2. You create tasks exclusively using `send_task` and distribute them rapidly.",
  "3. You track global progress proactively via `get_my_tasks` (as requester).",
  "4. You maintain overarching awareness of your cluster by checking `agent_heartbeats`."
];

for (const dirName of agentDirs) {
  const configPath = path.join(baseDir, dirName, 'openclaw.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      // Ensure structure exists
      if (!config.agents) config.agents = {};
      if (!config.agents.defaults) config.agents.defaults = {};

      let promptArr = [...generalRules];

      if (dirName === 'openclaw-orchestrator') {
        promptArr = [...orchestratorRules, ...generalRules];
      }

      config.agents.defaults.systemPrompt = promptArr;

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(`✅ Updated ${dirName}/openclaw.json`);
    } catch(e) {
      console.error(`❌ Failed to process ${dirName}:`, e.message);
    }
  } else {
    console.warn(`⚠️ File not found: ${configPath}`);
  }
}
