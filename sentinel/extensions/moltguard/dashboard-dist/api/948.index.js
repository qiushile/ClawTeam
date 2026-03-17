export const id = 948;
export const ids = [948];
export const modules = {

/***/ 948:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   usageRouter: () => (/* binding */ usageRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6020);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_1__]);
_og_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const usage = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .usageQueries */ .gB)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const usageRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
// GET /api/usage/summary
usageRouter.get("/summary", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        // Default to last 30 days
        const end = new Date();
        const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        const stats = await usage.summary(start.toISOString(), end.toISOString(), tenantId);
        res.json({
            success: true,
            data: {
                totalCalls: stats.totalCalls,
                safeCount: stats.safeCount ?? 0,
                unsafeCount: stats.unsafeCount ?? 0,
                periodStart: start.toISOString(),
                periodEnd: end.toISOString(),
            },
        });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/usage/daily
usageRouter.get("/daily", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const end = new Date();
        const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        const data = await usage.daily(start.toISOString(), end.toISOString(), tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=usage.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=948.index.js.map