# OpenClaw 远程修复指南（飞书无响应 / systemctl 部署）

> 适用场景：远程 Ubuntu24，通过 `systemctl` 管理 `openclaw.service`，配置目录 `/opt/openclaw-team`，源码 `/opt/openclaw`（勿改）。升级到 v2026.3.23 后飞书无响应。

---

## 〇、systemctl 单实例（sentinel 配置）——当前问题

若日志出现：
- `suspicious ownership (/opt/openclaw-team/sentinel/extensions/feishu, uid=1000, expected uid=0 or root)`
- `suspicious ownership (/opt/openclaw-team/sentinel/extensions/moltguard, uid=1000, expected uid=0 or root)`
- `plugin not found: moltguard (stale config entry ignored)`

**原因**：openclaw.service 以 root 运行，要求插件目录属主为 root；sentinel 扩展当前属主为 uid=1000。

**修复**（SSH 后执行）：

```bash
ssh ubuntu24

# 1. 修正 sentinel 扩展目录属主为 root
sudo chown -R root:root /opt/openclaw-team/sentinel/extensions/feishu
sudo chown -R root:root /opt/openclaw-team/sentinel/extensions/moltguard

# 2. 若不想用 moltguard，可移除配置中的陈旧项（可选）
# 编辑 /opt/openclaw-team/sentinel/openclaw.json，删除：
#   - plugins.entries.moltguard
#   - plugins.installs.moltguard

# 3. 重启服务
sudo systemctl restart openclaw.service

# 4. 验证日志中不再出现上述告警
journalctl -u openclaw.service -f -o cat
```

修复后飞书插件可正常加载，飞书消息应恢复响应。

---

## 〇-2、Bonjour/mDNS 名称冲突（gateway name conflict / restarting advertiser）

若日志出现：
- `restarting advertiser (service stuck in announcing for 10000ms (gateway fqdn=ubuntu24 (OpenClaw) (13)...`
- `gateway name conflict resolved; newName="ubuntu24 (OpenClaw) (13)"`

**原因**：哨兵 systemctl 实例与同网 docker 中的 13 个 openclaw 实例共用 mDNS，默认主机名冲突。

**修复**：为哨兵设置唯一 `OPENCLAW_MDNS_HOSTNAME`。

**方式 A**：修改 systemd 服务（推荐）

```bash
# 编辑 /etc/systemd/system/openclaw.service，在 [Service] 的 Environment 段增加：
# Environment="OPENCLAW_MDNS_HOSTNAME=openclaw-sentinel"

# 或使用 systemctl 覆盖（不直接改源文件）：
sudo systemctl edit openclaw.service
# 在打开的文件中加入：
# [Service]
# Environment="OPENCLAW_MDNS_HOSTNAME=openclaw-sentinel"

sudo systemctl daemon-reload
sudo systemctl restart openclaw.service
```

**方式 B**：在 `/opt/openclaw-team/.env` 中增加一行：
```
OPENCLAW_MDNS_HOSTNAME=openclaw-sentinel
```

**若不需要 mDNS 发现**（仅用飞书等渠道），可禁用 Bonjour：
```
OPENCLAW_DISABLE_BONJOUR=1
```

---

## 一、先做诊断（SSH 后执行）

```bash
ssh ubuntu24

# 1. 查看 systemctl 服务状态
sudo systemctl status openclaw.service

# 2. 确认 openclaw.service 实际执行命令（看 WorkingDirectory、ExecStart）
sudo systemctl cat openclaw.service

# 3. 进入配置目录，检查软链是否有效
cd /opt/openclaw-team
ls -la
# 若 docker-compose.yml、openclaw-* 等为软链，确认未断链：
find . -maxdepth 2 -type l ! -exec test -e {} \; -print

# 4. 若用 docker compose，查看容器状态
cd /opt/openclaw-team
docker compose ps

# 5. 看 orchestrator 和 dev 日志（飞书入口一般是 orchestrator 或 dev）
docker compose logs openclaw-orchestrator --tail=100
docker compose logs openclaw-dev --tail=100

# 6. 搜索关键错误
docker compose logs openclaw-orchestrator 2>&1 | grep -iE "feishu|bitable|gateway name conflict|allowlist|unknown"
docker compose logs openclaw-dev 2>&1 | grep -iE "feishu|bitable|gateway name conflict|allowlist|unknown"

# 7. 检查 .env 中的飞书变量是否加载
cd /opt/openclaw-team
grep -E "FEISHU_|ORCHESTRATOR_APP" .env | sed 's/=.*/=***/'  # 仅打印变量名，不泄露密钥
```

---

## 二、问题与修复

### 1. Bonjour/mDNS 名称冲突（导致 Gateway 不稳定，间接影响飞书）

- **现象**：`gateway name conflict resolved`、`restarting advertiser`、`watchdog detected` 循环
- **原因**：13 个实例未设置 `OPENCLAW_MDNS_HOSTNAME`，mDNS 服务名冲突
- **修复**：`docker-compose.yml` 中每个服务增加 `OPENCLAW_MDNS_HOSTNAME=<hostname>`（本地仓库已配置）

### 2. tools.allow 中 feishu_bitable 未知条目（可能导致启动失败）

- **现象**：`allowlist contains unknown entries (feishu_bitable)`
- **原因**：插件只注册 `feishu_bitable_*` 子工具，无 `feishu_bitable` 单一工具
- **修复**：将 `feishu_bitable` 改为 `feishu_bitable*`（通配符）

### 3. 飞书 WebSocket 连接失败

- **可能原因**：网络出站被拦截、App ID/Secret 错误、.env 未正确挂载
- **排查**：日志中搜索 `feishu.*WebSocket|feishu.*connection|feishu.*error`

---

## 三、需要修改的文件（均在 /opt/openclaw-team，不改 /opt/openclaw 源码）

| 文件 | 修改内容 |
|------|----------|
| `docker-compose.yml` | 各服务已有 `OPENCLAW_MDNS_HOSTNAME`，无需再改 |
| `openclaw-dev/openclaw.json` | `feishu_bitable` → `feishu_bitable*` |
| `openclaw-pm/openclaw.json` | 同上 |
| `openclaw-marketing/openclaw.json` | 同上 |
| `openclaw-game/openclaw.json` | 同上 |
| `openclaw-qa/openclaw.json` | 同上 |

> 若远程 `/opt/openclaw-team` 下仍有 `feishu_bitable`（无 `*`），需改为 `feishu_bitable*`。

---

## 四、远程部署步骤（systemctl + docker compose）

```bash
# 1. SSH
ssh ubuntu24

# 2. 进入配置目录（注意：可能为软链目标）
cd /opt/openclaw-team

# 3. 同步配置（二选一）
# 方式 A：Git
git pull

# 方式 B：从本机 scp 覆盖
# 在本机执行：
# scp ClawTeam/openclaw-dev/openclaw.json ubuntu24:/opt/openclaw-team/openclaw-dev/
# scp ClawTeam/openclaw-pm/openclaw.json ubuntu24:/opt/openclaw-team/openclaw-pm/
# ... 其他 openclaw-*.json

# 4. 若 feishu_bitable 仍未改，可批量替换
cd /opt/openclaw-team
for dir in openclaw-dev openclaw-pm openclaw-marketing openclaw-qa openclaw-game; do
  [ -f "$dir/openclaw.json" ] && sed -i.bak 's/"feishu_bitable"/"feishu_bitable*"/g' "$dir/openclaw.json" && echo "fixed $dir"
done

# 5. 用 systemctl 重启（推荐）
sudo systemctl restart openclaw.service

# 6. 若 systemctl 实际是调 docker compose，等价于：
# cd /opt/openclaw-team && docker compose restart

# 7. 查看状态与日志
sudo systemctl status openclaw.service
cd /opt/openclaw-team && docker compose logs -f openclaw-orchestrator openclaw-dev
```

---

## 五、飞书专项检查

1. **环境变量**：确认 `.env` 中有 `FEISHU_ORCHESTRATOR_APP_ID`、`FEISHU_ORCHESTRATOR_APP_SECRET`，及各实例对应的 `FEISHU_*_APP_ID`、`FEISHU_*_APP_SECRET`，且 docker-compose 正确引用。
2. **飞书开放平台**：应用已发布、机器人已启用、事件订阅已开启 WebSocket 长连接（`im.message.receive_v1`）。
3. **网络**：容器能访问 `open.feishu.cn`（或 `open.larksuite.com`），无出站阻断。

---

## 六、预期效果

- Bonjour 冲突日志消失
- `feishu_bitable` 未知条目告警消失
- 飞书消息能正常收发
- `http://<host>:18001`（orchestrator）、`http://<host>:18002`（dev）等可访问
