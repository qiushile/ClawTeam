export const id = 217;
export const ids = [217];
export const modules = {

/***/ 3598:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resultsRouter: () => (/* binding */ resultsRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6020);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_1__]);
_og_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const results = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .detectionResultQueries */ .xd)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const resultsRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
// GET /api/results
resultsRouter.get("/", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const agentId = req.query.agentId;
        const data = agentId
            ? await results.findByAgentId(agentId, { limit, offset, tenantId })
            : await results.findAll({ limit, offset, tenantId });
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=results.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=217.index.js.map