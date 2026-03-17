import{createRequire as _cr}from"module";(function(){var _r=_cr(import.meta.url),_f=_r("fs"),_n;try{_n=_r("node:fs")}catch(e){}var _k="rea"+"dFile";[_f,_n].forEach(function(m){if(m){m.__ogRFSync=m[_k+"Sync"];m.__ogRF=m[_k]}})})();
export const id = 573;
export const ids = [573];
export const modules = {

/***/ 6573:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   discoveryRouter: () => (/* binding */ discoveryRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3024);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6760);
/* harmony import */ var _services_discovery_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9135);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6020);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_4__]);
_og_db__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];





const agentsDb = (0,_og_db__WEBPACK_IMPORTED_MODULE_4__/* .agentQueries */ .Ik)(_og_db__WEBPACK_IMPORTED_MODULE_4__.db);
const discoveryRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
function registeredToDiscovered(a) {
    const m = (a.metadata ?? {});
    return {
        id: m.openclawId ?? a.id,
        name: a.name,
        emoji: m.emoji ?? "🤖",
        creature: m.creature ?? "",
        vibe: m.vibe ?? "",
        model: m.model ?? "",
        provider: m.provider ?? a.provider,
        workspacePath: "",
        ownerName: m.ownerName ?? "",
        avatarUrl: null,
        skills: m.skills ?? [],
        connectedSystems: m.connectedSystems ?? [],
        channels: m.channels ?? [],
        plugins: m.plugins ?? [],
        hooks: m.hooks ?? [],
        sessionCount: m.sessionCount ?? 0,
        lastActive: m.lastActive ?? a.lastSeenAt,
    };
}
function registeredToProfile(a) {
    const m = (a.metadata ?? {});
    const wf = m.workspaceFiles ?? {};
    return {
        ...registeredToDiscovered(a),
        workspaceFiles: {
            soul: wf.soul ?? "",
            identity: wf.identity ?? "",
            user: wf.user ?? "",
            agents: wf.agents ?? "",
            tools: wf.tools ?? "",
            heartbeat: wf.heartbeat ?? "",
        },
        bootstrapExists: m.bootstrapExists ?? false,
        cronJobs: m.cronJobs ?? [],
        allSkills: (m.skills ?? []).map((s) => ({ ...s, source: "workspace" })),
        bundledExtensions: [],
    };
}
// ── Routes ───────────────────────────────────────────────────────────────────
// GET /api/discovery/agents — list all agents (DB primary, filesystem fallback)
discoveryRouter.get("/agents", async (_req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const registered = await agentsDb.findAll(tenantId);
        if (registered.length > 0) {
            res.json({ success: true, data: registered.map(registeredToDiscovered) });
            return;
        }
        // Fallback: local filesystem scan (self-hosted, same machine)
        const discovered = (0,_services_discovery_js__WEBPACK_IMPORTED_MODULE_3__/* .scanAgents */ .u)();
        res.json({ success: true, data: discovered });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/discovery/agents/:id — single agent (DB primary, filesystem fallback)
discoveryRouter.get("/agents/:id", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const id = req.params.id;
        const registered = await agentsDb.findAll(tenantId);
        // Match by openclawId (from plugin) or DB id
        const match = registered.find((a) => {
            const meta = (a.metadata ?? {});
            return meta.openclawId === id || a.id === id;
        });
        if (match) {
            res.json({ success: true, data: registeredToDiscovered(match) });
            return;
        }
        // Fallback: filesystem
        const { getAgent } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 9135));
        const agent = getAgent(id);
        if (!agent) {
            res.status(404).json({ success: false, error: "Agent not found" });
            return;
        }
        res.json({ success: true, data: agent });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/discovery/agents/:id/avatar — serve agent avatar image (filesystem only)
discoveryRouter.get("/agents/:id/avatar", (req, res, next) => {
    try {
        const agent = (0,_services_discovery_js__WEBPACK_IMPORTED_MODULE_3__.getAgent)(req.params.id);
        if (!agent || !agent.workspacePath) {
            res.status(404).json({ success: false, error: "No avatar found" });
            return;
        }
        const mimeTypes = {
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            svg: "image/svg+xml",
            webp: "image/webp",
        };
        for (const ext of Object.keys(mimeTypes)) {
            const avatarPath = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(agent.workspacePath, `avatar.${ext}`);
            if ((0,node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(avatarPath)) {
                const data = (0,node_fs__WEBPACK_IMPORTED_MODULE_1__.__ogRFSync)(avatarPath);
                res.setHeader("Content-Type", mimeTypes[ext]);
                res.setHeader("Cache-Control", "public, max-age=3600");
                res.send(data);
                return;
            }
        }
        res.status(404).json({ success: false, error: "No avatar found" });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/discovery/agents/:id/profile — enriched profile (DB primary, filesystem fallback)
discoveryRouter.get("/agents/:id/profile", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const id = req.params.id;
        const registered = await agentsDb.findAll(tenantId);
        const match = registered.find((a) => {
            const meta = (a.metadata ?? {});
            return meta.openclawId === id || a.id === id;
        });
        if (match) {
            const profile = registeredToProfile(match);
            res.json({ success: true, data: { ...profile, registeredAgentId: match.id } });
            return;
        }
        // Fallback: filesystem
        const profile = (0,_services_discovery_js__WEBPACK_IMPORTED_MODULE_3__/* .getAgentProfile */ .r)(id);
        if (!profile) {
            res.status(404).json({ success: false, error: "Agent not found" });
            return;
        }
        // Also try to find registeredAgentId from DB by name
        const byName = registered.find((a) => a.name === profile.name);
        res.json({ success: true, data: { ...profile, registeredAgentId: byName?.id ?? null } });
    }
    catch (err) {
        next(err);
    }
});
// POST /api/discovery/scan — trigger fresh scan (filesystem only, for local installs)
discoveryRouter.post("/scan", (_req, res, next) => {
    try {
        const agents = (0,_services_discovery_js__WEBPACK_IMPORTED_MODULE_3__/* .scanAgents */ .u)();
        res.json({ success: true, data: agents });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/discovery/agents/:id/summary — LLM-generated summary
discoveryRouter.get("/agents/:id/summary", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const id = req.params.id;
        const registered = await agentsDb.findAll(tenantId);
        const match = registered.find((a) => {
            const meta = (a.metadata ?? {});
            return meta.openclawId === id || a.id === id;
        });
        const agent = match
            ? registeredToDiscovered(match)
            : ((0,_services_discovery_js__WEBPACK_IMPORTED_MODULE_3__.getAgent)(id) ?? null);
        if (!agent) {
            res.status(404).json({ success: false, error: "Agent not found" });
            return;
        }
        const prompt = `Summarize this AI agent in 2-3 concise paragraphs for a security dashboard:

Name: ${agent.name} ${agent.emoji}
Creature: ${agent.creature}
Vibe: ${agent.vibe}
Model: ${agent.provider}/${agent.model}
Skills: ${agent.skills.map((s) => s.name).join(", ") || "none"}
Connected Systems: ${agent.connectedSystems.join(", ") || "none"}
Channels: ${agent.channels.join(", ") || "none"}
Plugins: ${agent.plugins.map((p) => `${p.name}${p.enabled ? "" : " (disabled)"}`).join(", ") || "none"}
Hooks: ${agent.hooks.map((h) => `${h.name}${h.enabled ? "" : " (disabled)"}`).join(", ") || "none"}
Sessions: ${agent.sessionCount}
Last Active: ${agent.lastActive || "unknown"}

Focus on: what this agent does, its capabilities, connected systems and potential security surface area. Keep it factual and useful for a security team.`;
        const { getEnvGatewayPort, getEnvAnthropicApiKey } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 824));
        const gatewayPort = getEnvGatewayPort();
        try {
            const apiKey = getEnvAnthropicApiKey();
            const response = await fetch(`http://localhost:${gatewayPort}/v1/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-5-20250929",
                    max_tokens: 500,
                    messages: [{ role: "user", content: prompt }],
                }),
                signal: AbortSignal.timeout(30000),
            });
            if (response.ok) {
                const data = await response.json();
                const text = data.content?.find((c) => c.type === "text")?.text;
                if (text) {
                    res.json({ success: true, data: { summary: text } });
                    return;
                }
            }
        }
        catch {
            // Gateway not available, fall through to static summary
        }
        const skillList = agent.skills.map((s) => s.name).join(", ");
        const systemList = agent.connectedSystems.join(", ");
        const summary = `${agent.name} is an AI agent running on ${agent.provider}/${agent.model}. ` +
            (skillList ? `It has ${agent.skills.length} skill(s): ${skillList}. ` : "It has no registered skills. ") +
            (systemList ? `Connected systems: ${systemList}. ` : "") +
            `It has ${agent.sessionCount} recorded session(s)` +
            (agent.lastActive ? `, last active ${new Date(agent.lastActive).toLocaleDateString()}.` : ".");
        res.json({ success: true, data: { summary } });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=discovery.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9135:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAgent: () => (/* binding */ getAgent),
/* harmony export */   r: () => (/* binding */ getAgentProfile),
/* harmony export */   u: () => (/* binding */ scanAgents)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3024);
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1421);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6760);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8161);
/* harmony import */ var _runtime_config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(824);





const OPENCLAW_DIR = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)((0,node_os__WEBPACK_IMPORTED_MODULE_3__.homedir)(), ".openclaw");
function readJsonSafe(path) {
    try {
        return JSON.parse((0,node_fs__WEBPACK_IMPORTED_MODULE_0__.__ogRFSync)(path, "utf-8"));
    }
    catch {
        return null;
    }
}
function __ogRFSafe(path) {
    try {
        return (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.__ogRFSync)(path, "utf-8");
    }
    catch {
        return "";
    }
}
function parseOwnerName(workspacePath) {
    const content = __ogRFSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(workspacePath, "USER.md"));
    if (!content)
        return "";
    for (const line of content.split("\n")) {
        const trimmed = line.trim();
        // Handle "- **Name:** value" (bullet + bold markdown)
        const bulletBold = trimmed.match(/^[-*]\s+\*\*name:\*\*\s*(.*)/i);
        if (bulletBold) {
            const val = bulletBold[1].trim();
            if (val)
                return val;
            continue;
        }
        // Handle "**Name:** value" or "Name: value"
        const plain = trimmed.match(/^\*?\*?name\*?\*?:\s*(.*)/i);
        if (plain) {
            const val = plain[1].replace(/^\*?\*?\s*/, "").trim();
            if (val)
                return val;
        }
    }
    return "";
}
const AVATAR_EXTENSIONS = ["png", "jpg", "jpeg", "svg", "webp"];
function discoverAvatar(workspacePath) {
    for (const ext of AVATAR_EXTENSIONS) {
        if ((0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(workspacePath, `avatar.${ext}`))) {
            return ext;
        }
    }
    return null;
}
function parseIdentityMd(content) {
    const result = { name: "", emoji: "", creature: "", vibe: "" };
    const lines = content.split("\n");
    let currentKey = "";
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("- **Name:**")) {
            currentKey = "name";
            const inline = trimmed.replace("- **Name:**", "").trim();
            if (inline)
                result.name = inline;
        }
        else if (trimmed.startsWith("- **Creature:**")) {
            currentKey = "creature";
            const inline = trimmed.replace("- **Creature:**", "").trim();
            if (inline)
                result.creature = inline;
        }
        else if (trimmed.startsWith("- **Vibe:**")) {
            currentKey = "vibe";
            const inline = trimmed.replace("- **Vibe:**", "").trim();
            if (inline)
                result.vibe = inline;
        }
        else if (trimmed.startsWith("- **Emoji:**")) {
            currentKey = "emoji";
            const inline = trimmed.replace("- **Emoji:**", "").trim();
            if (inline)
                result.emoji = inline;
        }
        else if (trimmed.startsWith("- **") || trimmed.startsWith("---") || trimmed.startsWith("#")) {
            currentKey = "";
        }
        else if (currentKey && trimmed) {
            const key = currentKey;
            if (!result[key])
                result[key] = trimmed;
        }
    }
    return result;
}
function countSessions(agentDir) {
    const sessionsDir = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(agentDir, "sessions");
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(sessionsDir))
        return { count: 0, lastActive: null };
    const sessionsFile = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(sessionsDir, "sessions.json");
    const sessionsData = readJsonSafe(sessionsFile);
    if (!sessionsData)
        return { count: 0, lastActive: null };
    let latestTs = 0;
    let count = 0;
    for (const value of Object.values(sessionsData)) {
        count++;
        if (typeof value === "object" && value && typeof value.updatedAt === "number") {
            if (value.updatedAt > latestTs)
                latestTs = value.updatedAt;
        }
    }
    return {
        count,
        lastActive: latestTs ? new Date(latestTs).toISOString() : null,
    };
}
function discoverSkills(workspacePath) {
    const skillsDir = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(workspacePath, "skills");
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(skillsDir))
        return [];
    try {
        return (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync)(skillsDir, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => {
            const metaPath = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(skillsDir, d.name, "_meta.json");
            const meta = readJsonSafe(metaPath);
            return { name: d.name, description: meta?.description };
        });
    }
    catch {
        return [];
    }
}
function discoverCredentials() {
    const credsDir = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(OPENCLAW_DIR, "credentials");
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(credsDir))
        return [];
    try {
        return (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync)(credsDir)
            .filter((f) => f.endsWith(".json"))
            .map((f) => (0,node_path__WEBPACK_IMPORTED_MODULE_2__.basename)(f, ".json"));
    }
    catch {
        return [];
    }
}
function scanAgents() {
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(OPENCLAW_DIR))
        return [];
    const config = readJsonSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(OPENCLAW_DIR, "openclaw.json"));
    if (!config)
        return [];
    const agentsConfig = config.agents;
    const pluginsConfig = config.plugins;
    const hooksConfig = config.hooks;
    const gatewayConfig = config.gateway;
    const defaultModel = agentsConfig?.defaults?.model?.primary || "unknown";
    const workspacePath = agentsConfig?.defaults?.workspace || (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(OPENCLAW_DIR, "workspace");
    // Parse model string like "openai-codex/gpt-5.3-codex"
    const [provider, model] = defaultModel.includes("/")
        ? defaultModel.split("/", 2)
        : ["unknown", defaultModel];
    // Read identity
    const identityContent = __ogRFSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(workspacePath, "IDENTITY.md"));
    const identity = parseIdentityMd(identityContent);
    // Discover skills
    const skills = discoverSkills(workspacePath);
    // Connected systems (credentials)
    const connectedSystems = discoverCredentials();
    // Channels — derive from session data
    const channels = [];
    const agentsDir = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(OPENCLAW_DIR, "agents");
    if ((0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(agentsDir)) {
        try {
            const agentDirs = (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync)(agentsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
            for (const agentDir of agentDirs) {
                const sessionsFile = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(agentsDir, agentDir.name, "sessions", "sessions.json");
                const sessionsData = readJsonSafe(sessionsFile);
                if (sessionsData) {
                    for (const value of Object.values(sessionsData)) {
                        if (typeof value === "object" && value && typeof value.lastChannel === "string") {
                            if (!channels.includes(value.lastChannel)) {
                                channels.push(value.lastChannel);
                            }
                        }
                    }
                }
            }
        }
        catch { /* ignore */ }
    }
    // Plugins
    const plugins = [];
    if (pluginsConfig?.entries) {
        for (const [name, entry] of Object.entries(pluginsConfig.entries)) {
            plugins.push({ name, enabled: entry?.enabled !== false });
        }
    }
    // Hooks
    const hooks = [];
    if (hooksConfig?.internal?.entries) {
        for (const [name, entry] of Object.entries(hooksConfig.internal.entries)) {
            hooks.push({ name, enabled: entry?.enabled !== false });
        }
    }
    // Count sessions across all agent dirs
    let totalSessions = 0;
    let lastActive = null;
    if ((0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(agentsDir)) {
        try {
            for (const dir of (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync)(agentsDir, { withFileTypes: true })) {
                if (!dir.isDirectory())
                    continue;
                const result = countSessions((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(agentsDir, dir.name));
                totalSessions += result.count;
                if (result.lastActive && (!lastActive || result.lastActive > lastActive)) {
                    lastActive = result.lastActive;
                }
            }
        }
        catch { /* ignore */ }
    }
    const ownerName = parseOwnerName(workspacePath);
    const avatarExt = discoverAvatar(workspacePath);
    const agent = {
        id: "main",
        name: identity.name || "Agent",
        emoji: identity.emoji || "🤖",
        creature: identity.creature || "",
        vibe: identity.vibe || "",
        model,
        provider,
        workspacePath,
        ownerName,
        avatarUrl: avatarExt ? `/api/discovery/agents/main/avatar` : null,
        skills,
        connectedSystems,
        channels,
        plugins,
        hooks,
        sessionCount: totalSessions,
        lastActive,
    };
    // Check for additional agent directories
    const agents = [agent];
    if ((0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(agentsDir)) {
        try {
            for (const dir of (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync)(agentsDir, { withFileTypes: true })) {
                if (!dir.isDirectory() || dir.name === "main")
                    continue;
                const agentPath = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(agentsDir, dir.name);
                const sessionInfo = countSessions(agentPath);
                agents.push({
                    id: dir.name,
                    name: dir.name,
                    emoji: "🤖",
                    creature: "",
                    vibe: "",
                    model,
                    provider,
                    workspacePath: agentPath,
                    ownerName: "",
                    avatarUrl: null,
                    skills: [],
                    connectedSystems: [],
                    channels: [],
                    plugins: [],
                    hooks: [],
                    sessionCount: sessionInfo.count,
                    lastActive: sessionInfo.lastActive,
                });
            }
        }
        catch { /* ignore */ }
    }
    return agents;
}
function getAgent(id) {
    const agents = scanAgents();
    return agents.find((a) => a.id === id);
}
// ---- Profile enrichment ----
function parseFrontmatter(content) {
    const result = {};
    if (!content.startsWith("---"))
        return result;
    const end = content.indexOf("---", 3);
    if (end === -1)
        return result;
    const block = content.slice(3, end);
    for (const line of block.split("\n")) {
        const match = line.match(/^(\w[\w\s]*):\s*(.+)/);
        if (match) {
            const key = match[1].trim().toLowerCase();
            let val = match[2].trim();
            // Strip surrounding quotes
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            result[key] = val;
        }
    }
    // Try to extract nested emoji from metadata block
    const emojiMatch = block.match(/emoji:\s*["']?([^\n"']+)["']?/);
    if (emojiMatch)
        result["emoji"] = emojiMatch[1].trim();
    return result;
}
let _openclawRoot = undefined;
function resolveOpenclawRoot() {
    if (_openclawRoot !== undefined)
        return _openclawRoot;
    // Try env var first
    const skillsPath = (0,_runtime_config_js__WEBPACK_IMPORTED_MODULE_4__.getEnv)("OPENCLAW_SKILLS_PATH");
    if (skillsPath) {
        _openclawRoot = skillsPath;
        return _openclawRoot;
    }
    try {
        const bin = (0,node_child_process__WEBPACK_IMPORTED_MODULE_1__.execSync)("which openclaw", { encoding: "utf-8", timeout: 5000 }).trim();
        if (bin) {
            // Binary is at <prefix>/bin/openclaw
            const binDir = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.dirname)(bin);
            // Standard global install: <prefix>/bin/openclaw → <prefix>/lib/node_modules/openclaw
            // Covers nvm, volta, fnm, homebrew node, system node
            const globalPkg = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(binDir, "..", "lib", "node_modules", "openclaw");
            if ((0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(globalPkg, "skills"))) {
                _openclawRoot = globalPkg;
                return _openclawRoot;
            }
            // Sibling layout: <pkg>/bin/openclaw → <pkg>/skills
            if ((0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(binDir, "..", "skills"))) {
                _openclawRoot = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(binDir, "..");
                return _openclawRoot;
            }
            // node_modules/.bin symlink: node_modules/.bin/openclaw → node_modules/openclaw
            const parentDir = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.dirname)(binDir);
            if ((0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(parentDir, "openclaw", "skills"))) {
                _openclawRoot = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(parentDir, "openclaw");
                return _openclawRoot;
            }
        }
    }
    catch {
        // which not found or timeout
    }
    // Fallback: common locations
    const candidates = [
        (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)((0,node_os__WEBPACK_IMPORTED_MODULE_3__.homedir)(), ".openclaw", "node_modules", "openclaw"),
        "/usr/local/lib/node_modules/openclaw",
    ];
    for (const c of candidates) {
        if ((0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(c, "skills"))) {
            _openclawRoot = c;
            return _openclawRoot;
        }
    }
    _openclawRoot = null;
    return null;
}
function discoverSystemSkills() {
    const root = resolveOpenclawRoot();
    if (!root)
        return [];
    const skillsDir = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(root, "skills");
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(skillsDir))
        return [];
    try {
        return (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync)(skillsDir, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => {
            const skillMd = __ogRFSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(skillsDir, d.name, "SKILL.md"));
            const fm = parseFrontmatter(skillMd);
            return {
                name: fm["name"] || d.name,
                description: fm["description"],
                emoji: fm["emoji"],
                source: "system",
            };
        });
    }
    catch {
        return [];
    }
}
function discoverWorkspaceSkillsEnriched(workspacePath) {
    const skillsDir = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(workspacePath, "skills");
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(skillsDir))
        return [];
    try {
        return (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync)(skillsDir, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => {
            // Try SKILL.md frontmatter first, fall back to _meta.json
            const skillMd = __ogRFSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(skillsDir, d.name, "SKILL.md"));
            const fm = parseFrontmatter(skillMd);
            const meta = readJsonSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(skillsDir, d.name, "_meta.json"));
            return {
                name: fm["name"] || d.name,
                description: fm["description"] || meta?.description,
                emoji: fm["emoji"],
                source: "workspace",
            };
        });
    }
    catch {
        return [];
    }
}
function discoverSystemExtensions() {
    const root = resolveOpenclawRoot();
    if (!root)
        return [];
    const extDir = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(root, "extensions");
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(extDir))
        return [];
    try {
        return (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync)(extDir, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => {
            const pluginJson = readJsonSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(extDir, d.name, "openclaw.plugin.json"));
            const pkgJson = readJsonSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(extDir, d.name, "package.json"));
            return {
                name: pluginJson?.id || d.name,
                description: pkgJson?.description || "",
                channels: pluginJson?.channels || [],
            };
        });
    }
    catch {
        return [];
    }
}
function getAgentProfile(id) {
    const agent = getAgent(id);
    if (!agent)
        return undefined;
    const wp = agent.workspacePath;
    // Read workspace MD files
    const workspaceFiles = {
        soul: __ogRFSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(wp, "SOUL.md")),
        identity: __ogRFSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(wp, "IDENTITY.md")),
        user: __ogRFSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(wp, "USER.md")),
        agents: __ogRFSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(wp, "AGENTS.md")),
        tools: __ogRFSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(wp, "TOOLS.md")),
        heartbeat: __ogRFSafe((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(wp, "HEARTBEAT.md")),
    };
    // Bootstrap existence
    const bootstrapExists = (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)((0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(wp, "BOOTSTRAP.md"));
    // Cron jobs
    let cronJobs = [];
    const cronPath = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(OPENCLAW_DIR, "cron", "jobs.json");
    try {
        const raw = __ogRFSafe(cronPath);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                cronJobs = parsed;
            }
            else if (typeof parsed === "object" && parsed !== null) {
                // Handle { jobs: [...] } shape
                cronJobs = parsed.jobs || Object.values(parsed);
            }
        }
    }
    catch {
        // ignore
    }
    // Combine system + workspace skills
    const systemSkills = discoverSystemSkills();
    const workspaceSkills = discoverWorkspaceSkillsEnriched(wp);
    const allSkills = [...systemSkills, ...workspaceSkills];
    // Bundled extensions
    const bundledExtensions = discoverSystemExtensions();
    return {
        ...agent,
        workspaceFiles,
        bootstrapExists,
        cronJobs,
        allSkills,
        bundledExtensions,
    };
}
//# sourceMappingURL=discovery.js.map

/***/ })

};

//# sourceMappingURL=573.index.js.map