export const id = 84;
export const ids = [84];
export const modules = {

/***/ 4084:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scannersRouter: () => (/* binding */ scannersRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6020);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_1__]);
_og_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const scanners = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .scannerQueries */ .nk)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const scannersRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
// GET /api/scanners
scannersRouter.get("/", async (_req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const data = await scanners.getAll(tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
// PUT /api/scanners
scannersRouter.put("/", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const updates = req.body;
        if (!Array.isArray(updates)) {
            res.status(400).json({ success: false, error: "Request body must be an array of scanner updates" });
            return;
        }
        for (const update of updates) {
            await scanners.upsert({
                scannerId: update.scannerId,
                name: update.name,
                description: update.description,
                isEnabled: update.isEnabled,
                tenantId,
            });
        }
        const data = await scanners.getAll(tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=scanners.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=84.index.js.map