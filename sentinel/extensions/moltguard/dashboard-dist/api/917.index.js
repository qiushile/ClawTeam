export const id = 917;
export const ids = [917];
export const modules = {

/***/ 6917:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   policiesRouter: () => (/* binding */ policiesRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6020);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_1__]);
_og_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const policies = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .policyQueries */ .Lz)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const policiesRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
// GET /api/policies
policiesRouter.get("/", async (_req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const data = await policies.findAll(tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
// POST /api/policies
policiesRouter.post("/", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const { name, description, scannerIds, action, sensitivityThreshold } = req.body;
        if (!name || !scannerIds || !action) {
            res.status(400).json({ success: false, error: "name, scannerIds, and action are required" });
            return;
        }
        const policy = await policies.create({
            name,
            description: description || null,
            scannerIds,
            action,
            sensitivityThreshold,
            tenantId,
        });
        res.status(201).json({ success: true, data: policy });
    }
    catch (err) {
        next(err);
    }
});
// PUT /api/policies/:id
policiesRouter.put("/:id", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const policy = await policies.update(req.params.id, req.body, tenantId);
        if (!policy) {
            res.status(404).json({ success: false, error: "Policy not found" });
            return;
        }
        res.json({ success: true, data: policy });
    }
    catch (err) {
        next(err);
    }
});
// DELETE /api/policies/:id
policiesRouter.delete("/:id", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        await policies.delete(req.params.id, tenantId);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=policies.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=917.index.js.map