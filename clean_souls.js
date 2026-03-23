const fs = require('fs');
const path = require('path');

const baseDir = '/Users/qiushile/WorkStation/mine/claw/ClawTeam';
const agentDirs = [
  'openclaw-ads', 'openclaw-design', 'openclaw-dev', 'openclaw-expert',
  'openclaw-game', 'openclaw-marketing', 'openclaw-orchestrator', 'openclaw-pm',
  'openclaw-project', 'openclaw-qa', 'openclaw-sales', 'openclaw-spatial', 'openclaw-support'
];

for (const dirName of agentDirs) {
  const soulPath = path.join(baseDir, dirName, 'workspace', 'SOUL.md');
  if (!fs.existsSync(soulPath)) continue;

  let content = fs.readFileSync(soulPath, 'utf8');

  // We want to remove the block "## 核心职责（基于 PostgreSQL 跨 Agent 协作）"
  // up to "## 专业专家协作" or "## 严格限制" or "## 联邦协作 2.0"
  let cleanContent = content;

  if (dirName === 'openclaw-orchestrator') {
    // orchestrator has a specific structure
    const startIdx = cleanContent.indexOf('## 工作流与任务分发规则');
    const endIdx = cleanContent.indexOf('## 严格限制：');
    if (startIdx !== -1 && endIdx !== -1) {
       const sectionToRemove = cleanContent.substring(startIdx, endIdx);
       cleanContent = cleanContent.replace(sectionToRemove, '');
    }
  } else {
    // Other departments
    const startIdx = cleanContent.indexOf('## 核心职责');
    let endIdx = cleanContent.indexOf('## 专业专家协作：');
    if (endIdx === -1) endIdx = cleanContent.indexOf('## 联邦协作 2.0');
    
    if (startIdx !== -1 && endIdx !== -1) {
       // but we should keep "2. **专业执行**" if possible, or just rewrite it
       let textBefore = cleanContent.substring(0, startIdx);
       let textAfter = cleanContent.substring(endIdx);
       
       // extract schema name if possible
       const match = cleanContent.substring(startIdx, endIdx).match(/你的专属数据存放于 (\w+_schema)/);
       let replacement = '## 核心职责\n\n0. **高度独立**：在向人类汇报后，默认直接执行下一步或结束操作流转，绝不挂起等待人类的“确认”。\n1. **专业执行**：深入理解业务需求，输出行业最佳实践。';
       if (match) {
           replacement += `你的专属数据存放于 ${match[1]}，而全局任务表在 shared schema 中（通过语义接口访问）。`;
       }
       replacement += '\n\n';
       
       cleanContent = textBefore + replacement + textAfter;
    }
  }

  // Orchestrator needs to keep its specific role text
  if (dirName === 'openclaw-orchestrator') {
      const startIdx = cleanContent.indexOf('## 严格限制：');
      if (startIdx !== -1) {
          // just fine
      }
  }

  // Remove trailing multiple newlines
  cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(soulPath, cleanContent, 'utf8');
  console.log('Cleaned', soulPath);
}
