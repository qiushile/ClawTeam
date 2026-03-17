export const id = 831;
export const ids = [831];
export const modules = {

/***/ 2831:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectionsRouter: () => (/* binding */ detectionsRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6020);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_1__]);
_og_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const detectionResults = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .detectionResultQueries */ .xd)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const detectionsRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
/**
 * POST /api/detections
 * Record detection results from the plugin
 */
detectionsRouter.post("/", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const { agentId, safe, categories, findings, sensitivityScore, latencyMs, quotaExceeded, quotaInfo, } = req.body;
        if (typeof safe !== "boolean") {
            res.status(400).json({ success: false, error: "safe (boolean) is required" });
            return;
        }
        await detectionResults.create({
            agentId: agentId || null,
            safe,
            categories: categories || [],
            sensitivityScore: sensitivityScore || 0,
            findings: findings || [],
            latencyMs: latencyMs || 0,
            requestId: crypto.randomUUID(),
            tenantId,
            // Store quota info in findings if exceeded
            ...(quotaExceeded && {
                findings: [{
                        scanner: "quota",
                        name: "quota_exceeded",
                        description: `Quota exceeded: ${quotaInfo?.used || 0}/${quotaInfo?.total || 0}`,
                    }],
            }),
        });
        res.status(201).json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
/**
 * GET /api/detections
 * Get recent detection results
 */
detectionsRouter.get("/", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const limit = parseInt(req.query.limit) || 50;
        const safeOnly = req.query.safe === "true";
        const unsafeOnly = req.query.unsafe === "true";
        const data = await detectionResults.findRecent({
            tenantId,
            limit,
            safe: safeOnly ? true : unsafeOnly ? false : undefined,
        });
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
/**
 * GET /api/detections/summary
 * Get detection summary stats
 */
detectionsRouter.get("/summary", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const data = await detectionResults.summary(tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=detections.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=831.index.js.map