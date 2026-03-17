export const id = 369;
export const ids = [369];
export const modules = {

/***/ 8369:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   agentsRouter: () => (/* binding */ agentsRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6020);
/* harmony import */ var _og_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1792);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_1__]);
_og_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



const agents = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .agentQueries */ .Ik)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const agentsRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
// GET /api/agents
agentsRouter.get("/", async (_req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const data = await agents.findAll(tenantId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
});
// POST /api/agents
agentsRouter.post("/", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const { name, description, provider, metadata } = req.body;
        if (!name) {
            res.status(400).json({ success: false, error: "name is required" });
            return;
        }
        const currentCount = await agents.countAll(tenantId);
        if (currentCount >= _og_shared__WEBPACK_IMPORTED_MODULE_2__/* .MAX_AGENTS */ .cZ) {
            res.status(403).json({
                success: false,
                error: `Agent limit reached (${_og_shared__WEBPACK_IMPORTED_MODULE_2__/* .MAX_AGENTS */ .cZ}).`,
            });
            return;
        }
        const agent = await agents.create({
            name,
            description: description || null,
            provider: provider || "custom",
            metadata: metadata || {},
            tenantId,
        });
        res.status(201).json({ success: true, data: agent });
    }
    catch (err) {
        next(err);
    }
});
// PUT /api/agents/:id
agentsRouter.put("/:id", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        const { name, description, provider, status, metadata } = req.body;
        const agent = await agents.update(req.params.id, {
            ...(name && { name }),
            ...(description !== undefined && { description }),
            ...(provider && { provider }),
            ...(status && { status }),
            ...(metadata && { metadata }),
        }, tenantId);
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
// DELETE /api/agents/:id
agentsRouter.delete("/:id", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        await agents.delete(req.params.id, tenantId);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
// POST /api/agents/:id/heartbeat
agentsRouter.post("/:id/heartbeat", async (req, res, next) => {
    try {
        const tenantId = res.locals.tenantId;
        await agents.heartbeat(req.params.id, tenantId);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=agents.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=369.index.js.map