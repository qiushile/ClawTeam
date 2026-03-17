export const id = 720;
export const ids = [720];
export const modules = {

/***/ 2720:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   agenticHoursRouter: () => (/* binding */ agenticHoursRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6020);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_1__]);
_og_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const hours = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .agenticHoursQueries */ .jw)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const agenticHoursRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
// POST /api/agentic-hours — Accumulate agentic hours
agenticHoursRouter.post("/", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const body = req.body;
        if (!body.agentId) {
            res.status(400).json({ success: false, error: "agentId is required" });
            return;
        }
        const date = body.date ?? new Date().toISOString().slice(0, 10);
        await hours.accumulate({
            agentId: body.agentId,
            date,
            toolCallDurationMs: body.toolCallDurationMs,
            llmDurationMs: body.llmDurationMs,
            totalDurationMs: body.totalDurationMs,
            toolCallCount: body.toolCallCount,
            llmCallCount: body.llmCallCount,
            sessionCount: body.sessionCount,
            blockCount: body.blockCount,
            riskEventCount: body.riskEventCount,
            tenantId,
        });
        res.status(201).json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/agentic-hours/today — Today's summary
agenticHoursRouter.get("/today", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const data = await hours.todaySummary(tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/agentic-hours/daily — Daily breakdown
agenticHoursRouter.get("/daily", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const start = req.query.from ?? thirtyDaysAgo.toISOString().slice(0, 10);
        const end = req.query.to ?? now.toISOString().slice(0, 10);
        const data = await hours.daily(start, end, tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/agentic-hours/by-agent — Per-agent breakdown
agenticHoursRouter.get("/by-agent", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const start = req.query.from ?? thirtyDaysAgo.toISOString().slice(0, 10);
        const end = req.query.to ?? now.toISOString().slice(0, 10);
        const data = await hours.byAgent(start, end, tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=agentic-hours.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=720.index.js.map