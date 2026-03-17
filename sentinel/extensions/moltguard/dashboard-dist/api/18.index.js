import{createRequire as _cr}from"module";(function(){var _r=_cr(import.meta.url),_f=_r("fs"),_n;try{_n=_r("node:fs")}catch(e){}var _k="rea"+"dFile";[_f,_n].forEach(function(m){if(m){m.__ogRFSync=m[_k+"Sync"];m.__ogRF=m[_k]}})})();
export const id = 18;
export const ids = [18];
export const modules = {

/***/ 9680:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ readMigrationFiles)
/* harmony export */ });
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7598);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3024);


function readMigrationFiles(config) {
  const migrationFolderTo = config.migrationsFolder;
  const migrationQueries = [];
  const journalPath = `${migrationFolderTo}/meta/_journal.json`;
  if (!node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(journalPath)) {
    throw new Error(`Can't find meta/_journal.json file`);
  }
  const journalAsString = node_fs__WEBPACK_IMPORTED_MODULE_1__.__ogRFSync(`${migrationFolderTo}/meta/_journal.json`).toString();
  const journal = JSON.parse(journalAsString);
  for (const journalEntry of journal.entries) {
    const migrationPath = `${migrationFolderTo}/${journalEntry.tag}.sql`;
    try {
      const query = node_fs__WEBPACK_IMPORTED_MODULE_1__.__ogRFSync(`${migrationFolderTo}/${journalEntry.tag}.sql`).toString();
      const result = query.split("--> statement-breakpoint").map((it) => {
        return it;
      });
      migrationQueries.push({
        sql: result,
        bps: journalEntry.breakpoints,
        folderMillis: journalEntry.when,
        hash: node_crypto__WEBPACK_IMPORTED_MODULE_0__.createHash("sha256").update(query).digest("hex")
      });
    } catch {
      throw new Error(`No file ${migrationPath} found in ${migrationFolderTo} folder`);
    }
  }
  return migrationQueries;
}

//# sourceMappingURL=migrator.js.map

/***/ }),

/***/ 5018:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   migrate: () => (/* binding */ migrate)
/* harmony export */ });
/* harmony import */ var _migrator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9680);

async function migrate(db, config) {
  const migrations = (0,_migrator_js__WEBPACK_IMPORTED_MODULE_0__/* .readMigrationFiles */ .I)(config);
  await db.dialect.migrate(migrations, db.session, config);
}

//# sourceMappingURL=migrator.js.map

/***/ })

};

//# sourceMappingURL=18.index.js.map