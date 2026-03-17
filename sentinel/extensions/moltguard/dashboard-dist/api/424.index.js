export const id = 424;
export const ids = [424];
export const modules = {

/***/ 3424:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observationsRouter: () => (/* binding */ observationsRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6020);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_1__]);
_og_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const observations = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .observationQueries */ .T_)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const observationsRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
// POST /api/observations — Record one or more tool call observations
observationsRouter.post("/", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const body = req.body;
        // Accept single object or array
        const items = Array.isArray(body) ? body : [body];
        for (const item of items) {
            if (!item.agentId || !item.toolName || !item.phase) {
                res.status(400).json({
                    success: false,
                    error: "agentId, toolName, and phase are required",
                });
                return;
            }
            await observations.record({
                agentId: item.agentId,
                sessionKey: item.sessionKey,
                toolName: item.toolName,
                params: item.params,
                phase: item.phase,
                result: item.result,
                error: item.error,
                durationMs: item.durationMs,
                blocked: item.blocked,
                blockReason: item.blockReason,
                tenantId,
            });
        }
        res.status(201).json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/observations — Recent observations (optional ?agentId= filter)
observationsRouter.get("/", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const agentId = req.query.agentId;
        const limit = parseInt(req.query.limit) || 50;
        const data = await observations.findRecent({ agentId, limit, tenantId });
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/observations/permissions — All permissions across all agents
observationsRouter.get("/permissions", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const data = await observations.getAllPermissions(tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/observations/anomalies — First-seen tool calls
observationsRouter.get("/anomalies", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const limit = parseInt(req.query.limit) || 20;
        const data = await observations.findAnomalies(tenantId, limit);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/observations/summary — Per-agent summary
observationsRouter.get("/summary", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const data = await observations.summary(tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/agents/:id/permissions — Permission profile for an agent
observationsRouter.get("/agents/:id/permissions", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const agentId = req.params.id;
        const data = await observations.getPermissions(agentId, tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/agents/:id/observations — Observations for a specific agent
observationsRouter.get("/agents/:id/observations", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const agentId = req.params.id;
        const limit = parseInt(req.query.limit) || 50;
        const data = await observations.findRecent({ agentId, limit, tenantId });
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=observations.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=424.index.js.map