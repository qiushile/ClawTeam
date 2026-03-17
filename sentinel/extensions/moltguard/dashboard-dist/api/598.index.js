import{createRequire as _cr}from"module";(function(){var _r=_cr(import.meta.url),_f=_r("fs"),_n;try{_n=_r("node:fs")}catch(e){}var _k="rea"+"dFile";[_f,_n].forEach(function(m){if(m){m.__ogRFSync=m[_k+"Sync"];m.__ogRF=m[_k]}})})();
export const id = 598;
export const ids = [598];
export const modules = {

/***/ 9217:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   gatewayRouter: () => (/* binding */ router)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3024);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6760);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8161);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6020);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_4__]);
_og_db__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
/**
 * Gateway API routes
 *
 * Provides status and management endpoints for the AI Security Gateway.
 */





const gatewayActivityDb = (0,_og_db__WEBPACK_IMPORTED_MODULE_4__/* .gatewayActivityQueries */ .y)(_og_db__WEBPACK_IMPORTED_MODULE_4__.db);
const DEFAULT_TENANT_ID = "default";
const router = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
// File paths - unified to moltguard data directory
const OPENCLAW_DIR = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)((0,node_os__WEBPACK_IMPORTED_MODULE_3__.homedir)(), ".openclaw");
const MOLTGUARD_DATA_DIR = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(OPENCLAW_DIR, "extensions", "moltguard", "data");
const GATEWAY_CONFIG = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(MOLTGUARD_DATA_DIR, "gateway.json");
const GATEWAY_PID_FILE = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(MOLTGUARD_DATA_DIR, "gateway.pid");
const GATEWAY_BACKUP = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(MOLTGUARD_DATA_DIR, "gateway-backup.json");
/**
 * Check if gateway process is running by checking PID file
 * Note: In-process gateway (embedded in moltguard) won't have a PID file
 */
function checkPidFile() {
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(GATEWAY_PID_FILE)) {
        return { hasPid: false };
    }
    try {
        const pid = parseInt((0,node_fs__WEBPACK_IMPORTED_MODULE_1__.__ogRFSync)(GATEWAY_PID_FILE, "utf-8").trim(), 10);
        // Signal 0 doesn't kill, just checks if process exists
        process.kill(pid, 0);
        return { hasPid: true, pid };
    }
    catch {
        return { hasPid: false };
    }
}
/**
 * Check if gateway is actually responding by calling health endpoint
 */
async function checkGatewayHealth(port) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    try {
        const response = await fetch(`http://127.0.0.1:${port}/health`, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (response.ok) {
            return { healthy: true };
        }
        else {
            return { healthy: false, error: `Status ${response.status}` };
        }
    }
    catch (err) {
        clearTimeout(timeoutId);
        return { healthy: false, error: err instanceof Error ? err.message : "Connection failed" };
    }
}
/**
 * Read gateway configuration
 */
function readGatewayConfig() {
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(GATEWAY_CONFIG)) {
        return null;
    }
    try {
        return JSON.parse((0,node_fs__WEBPACK_IMPORTED_MODULE_1__.__ogRFSync)(GATEWAY_CONFIG, "utf-8"));
    }
    catch {
        return null;
    }
}
/**
 * Read gateway backup (enabled state)
 */
function readGatewayBackup() {
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(GATEWAY_BACKUP)) {
        return { enabled: false, agents: [], providers: [] };
    }
    try {
        const backup = JSON.parse((0,node_fs__WEBPACK_IMPORTED_MODULE_1__.__ogRFSync)(GATEWAY_BACKUP, "utf-8"));
        const agents = backup.entries?.map((e) => e.agentName) || [];
        const providerSet = new Set();
        for (const entry of backup.entries || []) {
            for (const providerName of Object.keys(entry.providers || {})) {
                providerSet.add(providerName);
            }
        }
        return {
            enabled: true,
            agents,
            providers: Array.from(providerSet),
            timestamp: backup.timestamp,
        };
    }
    catch {
        return { enabled: false, agents: [], providers: [] };
    }
}
/**
 * GET /api/gateway/status
 * Get current gateway status
 */
router.get("/status", async (_req, res) => {
    try {
        const { hasPid, pid } = checkPidFile();
        const backup = readGatewayBackup();
        const config = readGatewayConfig();
        const port = config?.port || 53669;
        // Check if gateway is actually running by calling health endpoint
        // This works for both standalone and in-process (embedded) gateway
        const { healthy } = await checkGatewayHealth(port);
        const status = {
            enabled: backup.enabled,
            running: healthy, // Use health check instead of PID file
            pid: hasPid ? pid : undefined,
            port,
            url: `http://127.0.0.1:${port}`,
            agents: backup.agents,
            providers: backup.providers,
            enabledAt: backup.timestamp || null,
            backends: config ? Object.keys(config.backends || {}) : [],
        };
        res.json({ success: true, data: status });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to get gateway status",
        });
    }
});
/**
 * GET /api/gateway/config
 * Get gateway configuration (without sensitive data)
 */
router.get("/config", (_req, res) => {
    try {
        const config = readGatewayConfig();
        if (!config) {
            res.json({
                success: true,
                data: {
                    configured: false,
                    port: 53669,
                    backends: [],
                },
            });
            return;
        }
        // Return config without API keys
        const backends = config.backends || {};
        const sanitizedBackends = {};
        for (const [name, backend] of Object.entries(backends)) {
            sanitizedBackends[name] = {
                baseUrl: backend.baseUrl || "",
                hasApiKey: true, // We know it exists, just don't expose it
            };
        }
        res.json({
            success: true,
            data: {
                configured: true,
                port: config.port || 53669,
                backends: sanitizedBackends,
                routing: config.routing || {},
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to get gateway config",
        });
    }
});
/**
 * GET /api/gateway/health
 * Check if gateway is responding
 */
router.get("/health", async (_req, res) => {
    try {
        const config = readGatewayConfig();
        const port = config?.port || 53669;
        const { healthy, error } = await checkGatewayHealth(port);
        res.json({
            success: true,
            data: {
                healthy,
                ...(error ? { error } : {}),
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to check gateway health",
        });
    }
});
/**
 * POST /api/gateway/activity
 * Receive gateway activity events from MoltGuard
 */
router.post("/activity", async (req, res) => {
    try {
        const event = req.body;
        if (!event || !event.id || !event.type) {
            res.status(400).json({
                success: false,
                error: "Invalid activity event: missing id or type",
            });
            return;
        }
        await gatewayActivityDb.create({
            eventId: event.id,
            requestId: event.requestId,
            timestamp: event.timestamp,
            type: event.type,
            direction: event.direction,
            backend: event.backend,
            endpoint: event.endpoint,
            model: event.model || null,
            redactionCount: event.redactionCount || 0,
            categories: event.categories || {},
            durationMs: event.durationMs || null,
            tenantId: DEFAULT_TENANT_ID,
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error("[gateway] Failed to save activity:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to save activity",
        });
    }
});
/**
 * GET /api/gateway/activity
 * List recent gateway activity events
 */
router.get("/activity", async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit || "100", 10), 1000);
        const type = req.query.type;
        const events = await gatewayActivityDb.findRecent({
            tenantId: DEFAULT_TENANT_ID,
            limit,
            type: type === "sanitize" || type === "restore" ? type : undefined,
        });
        // Transform events for API response
        const data = [];
        for (const e of events) {
            data.push({
                id: e.eventId,
                requestId: e.requestId,
                timestamp: e.timestamp,
                type: e.type,
                direction: e.direction,
                backend: e.backend,
                endpoint: e.endpoint,
                model: e.model,
                redactionCount: e.redactionCount,
                categories: e.categories,
                durationMs: e.durationMs,
            });
        }
        res.json({ success: true, data });
    }
    catch (error) {
        console.error("[gateway] Failed to get activity:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to get activity",
        });
    }
});
/**
 * GET /api/gateway/activity/stats
 * Get aggregated gateway activity statistics
 */
router.get("/activity/stats", async (_req, res) => {
    try {
        const stats = await gatewayActivityDb.stats(DEFAULT_TENANT_ID);
        res.json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        console.error("[gateway] Failed to get activity stats:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to get activity stats",
        });
    }
});

//# sourceMappingURL=gateway.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=598.index.js.map