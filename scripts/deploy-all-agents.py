import os
import json
import shutil
from pathlib import Path

CLAW_TEAM_DIR = Path(__file__).parent.parent.absolute()

def load_agent_role_mapping():
    mapping_file = CLAW_TEAM_DIR.parent / ".antigravity" / "Agent 角色对照表.md"
    mapping = {}
    if mapping_file.exists():
        with open(mapping_file, "r", encoding="utf-8") as f:
            for line in f:
                # | 1 | 前端开发人员 | `frontend-developer` | `agency-frontend-developer` |
                if line.startswith("|") and "`" in line:
                    parts = [p.strip() for p in line.split("|")]
                    if len(parts) >= 5:
                        role_name = parts[2].strip()
                        # Remove backticks from agent ID
                        agent_id = parts[3].replace("`", "").strip()
                        if agent_id:
                            mapping[agent_id] = role_name
    return mapping

def main():
    print(f"Starting deployment script in {CLAW_TEAM_DIR}")
    
    # Load mapping
    role_mapping = load_agent_role_mapping()
    
    # 遍历所有 openclaw-* 目录
    for dept_dir in CLAW_TEAM_DIR.glob("openclaw-*"):
        if not dept_dir.is_dir():
            continue
            
        dept = dept_dir.name.replace("openclaw-", "")
        # orchestrator 的默认 agent name 也是 orchestrator 还是 main? 
        # 用户要求："每个部门的默认agent叫main，改成部门英文，即dev/pm/design，每个子agent名称🈶部门英文名加agent英文标识组成"
        # 所以 default agent id 应该就是 dept
        
        print(f"\nProcessing department: {dept}")
        
        agents_source_dir = dept_dir / "workspace" / "agents"
        agent_ids = []
        
        # 如果存在 agents 目录，收集所有的 agent id
        if agents_source_dir.exists() and agents_source_dir.is_dir():
            for agent_dir in agents_source_dir.iterdir():
                if agent_dir.is_dir() and not agent_dir.name.startswith("."):
                    agent_ids.append(agent_dir.name)
        
        # 1 & 2: 创建 sub agent workspace 目录，并复制 SOUL.md
        for original_agent_id in agent_ids:
            sub_agent_id = f"{dept}-{original_agent_id}"
            sub_workspace_dir = dept_dir / f"workspace-{sub_agent_id}"
            sub_workspace_dir.mkdir(parents=True, exist_ok=True)
            
            # 复制原 agent 目录下的所有文件 (主要是 SOUL.md)
            original_dir = agents_source_dir / original_agent_id
            for item in original_dir.iterdir():
                if item.is_file():
                    target_file = sub_workspace_dir / item.name
                    # 只有当目标文件不存在时才复制，或者覆盖？为了安全起见覆盖
                    shutil.copy2(item, target_file)
            print(f"  Initialized workspace for: {sub_agent_id}")

        # 3: 更新 openclaw.json
        config_file = dept_dir / "openclaw.json"
        if config_file.exists():
            with open(config_file, "r", encoding="utf-8") as f:
                config = json.load(f)
            
            if "agents" not in config:
                config["agents"] = {}
                
            agents_list = [
                {
                    "id": dept,
                    "default": True,
                    "workspace": "/home/node/.openclaw/workspace",
                    "subagents": {
                        "allowAgents": ["*"]
                    }
                }
            ]
            
            for original_agent_id in agent_ids:
                sub_agent_id = f"{dept}-{original_agent_id}"
                agents_list.append({
                    "id": sub_agent_id,
                    "workspace": f"/home/node/.openclaw/workspace-{sub_agent_id}"
                })
                
            config["agents"]["list"] = agents_list
            
            # 如果配置了 bindings，更新它
            # 用户文档说 "保障飞书消息只路由到 main agent"
            # 现在 default 改为了 dept
            if "bindings" not in config:
                config["bindings"] = []
                
            # 检查是否已存在 feishu 的 binding
            has_feishu_binding = False
            for binding in config["bindings"]:
                if binding.get("match", {}).get("channel") == "feishu":
                    binding["agentId"] = dept
                    has_feishu_binding = True
                    break
                    
            if not has_feishu_binding:
                config["bindings"].append({
                    "agentId": dept,
                    "match": {
                        "channel": "feishu"
                    }
                })
                
            with open(config_file, "w", encoding="utf-8") as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            print(f"  Updated openclaw.json for {dept}")

        # 4: 更新 main agent 的 AGENTS.md (如果存在 agents 子目录)
        if agent_ids:
            agents_md_file = dept_dir / "workspace" / "AGENTS.md"
            
            # 读取原有内容，尝试保留开头直到 "可调度的子 Agent" 或类似字样
            content = ""
            if agents_md_file.exists():
                with open(agents_md_file, "r", encoding="utf-8") as f:
                    content = f.read()
            
            # 简单追加调度说明
            append_content = "\n\n## 可调度的专业子 Agent\n\n"
            append_content += f"作为 `{dept}` 部门的主 Agent，当遇到需要特定领域专业能力的复杂任务时，**你必须主动使用 `sessions_spawn` 调度以下专业子 Agent 协同完成工作**：\n\n"
            append_content += "| Agent ID | 描述 |\n|---|---|\n"
            
            for original_agent_id in agent_ids:
                sub_agent_id = f"{dept}-{original_agent_id}"
                role_name = role_mapping.get(original_agent_id, f"专业能力单元 ({original_agent_id})")
                append_content += f"| `{sub_agent_id}` | {role_name} |\n"
                
            append_content += f"""
### 🚨 子 Agent 跨部门协作约定及调度规范

当你面临当前部门子 Agent 无法解决的跨领域问题时，按照以下原则：
1. **不要伪造或虚构其他部门的能力**，也不要通过系统环境去操作不属于自己部门的工具。
2. 明确回答用户：「当前任务涉及 [领域]，我将为您联系对应的 [Agent名称] 继续处理」。
3. 你不需要负责跨部门请求的调度（当前只支持部门内容器的衍生调用），在回答中给出明确分工界限即可，用户会在对应的部门对话框中自行发起后续请求。

同部门内调度示例：

```javascript
sessions_spawn(
  agentId="{dept}-{agent_ids[0] if agent_ids else 'example'}",
  task="请执行具体的专业检查... 附带当前的上下文",
  mode="run"
)
```
"""
            # 如果里面已经包含了旧的说明，这里做粗糙替换，或者直接覆盖
            # 简单起见，我们直接覆写/生成一段规范的结尾
            
            # 查找是否已经有 "可调度的" 或者 "调度示例" 相关的内容
            import re
            content = re.sub(r'## 可调度的专业子 Agent.*', '', content, flags=re.DOTALL)
            content = re.sub(r'## 可调度的子 Agent.*', '', content, flags=re.DOTALL)
            
            with open(agents_md_file, "w", encoding="utf-8") as f:
                f.write(content.strip() + append_content)
            print(f"  Updated AGENTS.md for {dept}")

    print("\nDeployment script fully executed!")

if __name__ == "__main__":
    main()
