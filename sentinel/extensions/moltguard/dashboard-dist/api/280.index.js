export const id = 280;
export const ids = [280];
export const modules = {

/***/ 5280:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectionRouter: () => (/* binding */ detectionRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6020);
/* harmony import */ var _services_core_client_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6808);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_1__, _services_core_client_js__WEBPACK_IMPORTED_MODULE_2__]);
([_og_db__WEBPACK_IMPORTED_MODULE_1__, _services_core_client_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



const scanners = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .scannerQueries */ .nk)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const policies = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .policyQueries */ .Lz)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const usage = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .usageQueries */ .gB)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const detectionResults = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .detectionResultQueries */ .xd)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const settings = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .settingsQueries */ .sz)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const detectionRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
/**
 * POST /api/detect
 * Detection proxy endpoint.
 * Flow:
 * 1. Check core key is configured
 * 2. Get scanner config
 * 3. Call core /v1/detect
 * 4. Evaluate policies
 * 5. Record usage + detection result
 * 6. Return response
 */
detectionRouter.post("/", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        // 1. Check core key
        const coreKey = await settings.get("og_core_key");
        if (!coreKey) {
            res.status(503).json({
                success: false,
                error: "core key not configured. Go to Settings to add your key.",
            });
            return;
        }
        // 2. Get scanner config
        const allScanners = await scanners.getAll(tenantId);
        const coreScanners = allScanners.map((s) => ({
            scannerId: s.scannerId,
            name: s.name,
            description: s.description,
            isEnabled: s.isEnabled,
        }));
        // Validate request body
        const { messages, format, role, agentId } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            res.status(400).json({ success: false, error: "messages array is required and must not be empty" });
            return;
        }
        // 3. Call core
        const coreResult = await (0,_services_core_client_js__WEBPACK_IMPORTED_MODULE_2__/* .callCoreDetect */ .l)(messages, coreScanners, { format, role });
        // 4. Evaluate policies
        let policyAction = null;
        if (!coreResult.safe) {
            const enabledPolicies = await policies.getEnabled(tenantId);
            for (const policy of enabledPolicies) {
                const policyScannerIds = policy.scannerIds;
                const matchesCategory = coreResult.categories.some((c) => policyScannerIds.includes(c));
                if (matchesCategory && coreResult.sensitivity_score >= policy.sensitivityThreshold) {
                    policyAction = policy.action;
                    break;
                }
            }
        }
        // 5. Record usage + detection result
        await usage.log({
            agentId: agentId || null,
            endpoint: "/api/detect",
            statusCode: 200,
            responseSafe: coreResult.safe,
            categories: coreResult.categories,
            latencyMs: coreResult.latency_ms,
            requestId: coreResult.request_id,
            tenantId,
        });
        await detectionResults.create({
            agentId: agentId || null,
            safe: coreResult.safe,
            categories: coreResult.categories,
            sensitivityScore: coreResult.sensitivity_score,
            findings: coreResult.findings,
            latencyMs: coreResult.latency_ms,
            requestId: coreResult.request_id,
            tenantId,
        });
        // 6. Return response with policy action
        const response = {
            ...coreResult,
            ...(policyAction && { policy_action: policyAction }),
        };
        if (policyAction === "block") {
            res.status(403).json({ success: true, data: response, blocked: true });
            return;
        }
        res.json({ success: true, data: response });
    }
    catch (err) {
        if (err instanceof Error && (err.message.includes("ECONNREFUSED") || err.message.includes("fetch failed"))) {
            res.status(503).json({ success: false, error: "Detection service is temporarily unavailable. Please try again later." });
            return;
        }
        next(err);
    }
});
//# sourceMappingURL=detection.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6808:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ callCoreDetect)
/* harmony export */ });
/* unused harmony export checkCoreHealth */
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6020);
/* harmony import */ var _runtime_config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(824);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_0__]);
_og_db__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const settings = (0,_og_db__WEBPACK_IMPORTED_MODULE_0__/* .settingsQueries */ .sz)(_og_db__WEBPACK_IMPORTED_MODULE_0__.db);
/** Get core URL from settings or env */
async function getCoreUrl() {
    return (await settings.get("og_core_url")) || (0,_runtime_config_js__WEBPACK_IMPORTED_MODULE_1__/* .getEnvCoreUrl */ .i)();
}
/** Get core key from settings */
async function getCoreKey() {
    return (await settings.get("og_core_key")) || "";
}
/**
 * Call core detection API.
 * Uses core key from settings for authentication.
 */
async function callCoreDetect(messages, scanners, options) {
    const coreUrl = await getCoreUrl();
    const coreKey = await getCoreKey();
    const body = {
        messages,
        scanners,
        format: options?.format,
        role: options?.role,
    };
    const headers = {
        "Content-Type": "application/json",
    };
    if (coreKey) {
        headers["Authorization"] = `Bearer ${coreKey}`;
    }
    const res = await fetch(`${coreUrl}/v1/detect`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`core returned ${res.status}: ${text}`);
    }
    const json = await res.json();
    if (!json.success) {
        throw new Error(`core error: ${json.error}`);
    }
    return json.data;
}
/** Check core health with timeout */
async function checkCoreHealth() {
    try {
        const coreUrl = await getCoreUrl();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        const res = await fetch(`${coreUrl}/health`, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const json = await res.json();
        return json.status === "ok";
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=core-client.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=280.index.js.map