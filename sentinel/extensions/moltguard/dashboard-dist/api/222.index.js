export const id = 222;
export const ids = [222];
export const modules = {

/***/ 9222:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   settingsRouter: () => (/* binding */ settingsRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(316);
/* harmony import */ var _og_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6020);
/* harmony import */ var _og_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1792);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_og_db__WEBPACK_IMPORTED_MODULE_1__]);
_og_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



const settings = (0,_og_db__WEBPACK_IMPORTED_MODULE_1__/* .settingsQueries */ .sz)(_og_db__WEBPACK_IMPORTED_MODULE_1__.db);
const settingsRouter = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
// GET /api/settings
settingsRouter.get("/", async (_req, res, next) => {
    try {
        const all = await settings.getAll();
        // Mask sensitive values
        const masked = {};
        for (const [key, value] of Object.entries(all)) {
            if (key === "og_core_key" || key === "session_token") {
                masked[key] = (0,_og_shared__WEBPACK_IMPORTED_MODULE_2__/* .maskSecret */ .$l)(value);
            }
            else {
                masked[key] = value;
            }
        }
        res.json({ success: true, data: masked });
    }
    catch (err) {
        next(err);
    }
});
// PUT /api/settings
settingsRouter.put("/", async (req, res, next) => {
    try {
        const updates = req.body;
        if (!updates || typeof updates !== "object") {
            res.status(400).json({ success: false, error: "Request body must be a key-value object" });
            return;
        }
        // Prevent overwriting session_token via this endpoint
        delete updates.session_token;
        for (const [key, value] of Object.entries(updates)) {
            await settings.set(key, value);
        }
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/settings/connection-status
settingsRouter.get("/connection-status", async (_req, res, next) => {
    try {
        const ogCoreKey = await settings.get("og_core_key");
        // Agent is always connected to Core (auto-registered)
        // The only difference is whether it's linked to a user account (claimed) or not (autonomous)
        const mode = ogCoreKey ? "claimed" : "autonomous";
        res.json({
            success: true,
            data: {
                mode,
                message: mode === "claimed"
                    ? "Agent is linked to your account"
                    : "Agent is running in autonomous mode",
            },
        });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=settings.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};

//# sourceMappingURL=222.index.js.map