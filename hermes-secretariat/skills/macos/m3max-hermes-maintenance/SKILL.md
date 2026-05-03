---
name: m3max-hermes-maintenance
category: macos
description: Maintenance and troubleshooting for Hermes Gateway on the remote m3max macOS machine.
---

## m3max Maintenance

### Connection
- **Host**: `m3max` (SSH config resolves to `m3max.tailcc8506.ts.net`)
- **User**: `m3max`
- **IP**: `100.86.50.21` (Tailscale)
- **Auth**: Keyboard-interactive (password), no SSH key.

### Hermes Gateway
- **Path**: `~/WorkStation/agent/hermes-agent`
- **Config**: `.env` contains Key `sk-sp-*` and Base URL `https://coding.dashscope.aliyuncs.com/v1`.
- **Service**: `launchctl load -w ~/Library/LaunchAgents/ai.hermes.gateway.plist`

### Common Issues
1. **Gateway Crashes**: Often crashes on network drops or Mac sleep due to Lark WebSocket timeouts.
   - **Fix**:
     ```bash
     ssh m3max "cd ~/WorkStation/agent/hermes-agent && hermes gateway stop && sleep 3 && hermes gateway start"
     ```
2. **Power/Sleep**: Ensure Mac is plugged in. It is configured with `pmset -c sleep 0` (no sleep when plugged in). If on battery, it will sleep.

### Setup Script
- The official setup script is at `~/WorkStation/agent/hermes-agent/setup-hermes.sh`.