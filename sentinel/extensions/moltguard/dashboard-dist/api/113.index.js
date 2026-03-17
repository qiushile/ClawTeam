export const id = 113;
export const ids = [113];
export const modules = {

/***/ 3853:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DV: () => (/* binding */ haveSameKeys),
/* harmony export */   He: () => (/* binding */ orderSelectedFields),
/* harmony export */   Ll: () => (/* binding */ getColumnNameAndConfig),
/* harmony export */   Lq: () => (/* binding */ isConfig),
/* harmony export */   XJ: () => (/* binding */ applyMixins),
/* harmony export */   YD: () => (/* binding */ getTableColumns),
/* harmony export */   a6: () => (/* binding */ mapResultRow),
/* harmony export */   q: () => (/* binding */ mapUpdateSet),
/* harmony export */   zN: () => (/* binding */ getTableLikeName)
/* harmony export */ });
/* harmony import */ var _column_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2345);
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9724);
/* harmony import */ var _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(183);
/* harmony import */ var _subquery_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6453);
/* harmony import */ var _table_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8407);
/* harmony import */ var _view_common_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6146);






function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path, field }, columnIndex) => {
      let decoder;
      if ((0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _column_js__WEBPACK_IMPORTED_MODULE_1__/* .Column */ .V)) {
        decoder = field;
      } else if ((0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .SQL */ .Xs)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _column_js__WEBPACK_IMPORTED_MODULE_1__/* .Column */ .V) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? (0,_table_js__WEBPACK_IMPORTED_MODULE_3__/* .getTableName */ .Io)(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== (0,_table_js__WEBPACK_IMPORTED_MODULE_3__/* .getTableName */ .Io)(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if ((0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _column_js__WEBPACK_IMPORTED_MODULE_1__/* .Column */ .V) || (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .SQL */ .Xs) || (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .SQL */ .Xs.Aliased)) {
      result.push({ path: newPath, field });
    } else if ((0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(field, _table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .XI)) {
      result.push(...orderSelectedFields(field[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .XI.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index, key] of leftKeys.entries()) {
    if (key !== rightKeys[index]) {
      return false;
    }
  }
  return true;
}
function mapUpdateSet(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if ((0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(value, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .SQL */ .Xs) || (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(value, _column_js__WEBPACK_IMPORTED_MODULE_1__/* .Column */ .V)) {
      return [key, value];
    } else {
      return [key, new _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .Param */ .Iw(value, table[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .XI.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor")
        continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
function getTableColumns(table) {
  return table[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .XI.Symbol.Columns];
}
function getTableLikeName(table) {
  return (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(table, _subquery_js__WEBPACK_IMPORTED_MODULE_4__/* .Subquery */ .n) ? table._.alias : (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(table, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .View */ .Ss) ? table[_view_common_js__WEBPACK_IMPORTED_MODULE_5__/* .ViewBaseConfig */ .n].name : (0,_entity_js__WEBPACK_IMPORTED_MODULE_0__.is)(table, _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .SQL */ .Xs) ? void 0 : table[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .XI.Symbol.IsAlias] ? table[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .XI.Symbol.Name] : table[_table_js__WEBPACK_IMPORTED_MODULE_3__/* .Table */ .XI.Symbol.BaseName];
}
function getColumnNameAndConfig(a, b) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b
  };
}
const _ = {};
const __ = {};
function isConfig(data) {
  if (typeof data !== "object" || data === null)
    return false;
  if (data.constructor.name !== "Object")
    return false;
  if ("logger" in data) {
    const type = typeof data["logger"];
    if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined")
      return false;
    return true;
  }
  if ("schema" in data) {
    const type = typeof data["logger"];
    if (type !== "object" && type !== "undefined")
      return false;
    return true;
  }
  if ("casing" in data) {
    const type = typeof data["logger"];
    if (type !== "string" && type !== "undefined")
      return false;
    return true;
  }
  if ("mode" in data) {
    if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0)
      return false;
    return true;
  }
  if ("connection" in data) {
    const type = typeof data["connection"];
    if (type !== "string" && type !== "object" && type !== "undefined")
      return false;
    return true;
  }
  if ("client" in data) {
    const type = typeof data["client"];
    if (type !== "object" && type !== "function" && type !== "undefined")
      return false;
    return true;
  }
  if (Object.keys(data).length === 0)
    return true;
  return false;
}

//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5518:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  agentPermissions: () => (/* binding */ agentPermissions),
  agenticHoursLocal: () => (/* binding */ agenticHoursLocal),
  agents: () => (/* binding */ agents),
  detectionResults: () => (/* binding */ detectionResults),
  gatewayActivity: () => (/* binding */ gatewayActivity),
  magicLinks: () => (/* binding */ magicLinks),
  policies: () => (/* binding */ policies),
  scannerDefinitions: () => (/* binding */ scannerDefinitions),
  settings: () => (/* binding */ settings),
  toolCallObservations: () => (/* binding */ toolCallObservations),
  usageLogs: () => (/* binding */ usageLogs),
  userSessions: () => (/* binding */ userSessions)
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/table.js + 19 modules
var table = __webpack_require__(2104);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/varchar.js
var varchar = __webpack_require__(9499);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/text.js
var columns_text = __webpack_require__(4195);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/datetime.js
var datetime = __webpack_require__(2913);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/json.js
var json = __webpack_require__(2298);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(9724);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/indexes.js

class IndexBuilderOn {
  constructor(name, unique) {
    this.name = name;
    this.unique = unique;
  }
  static [entity/* entityKind */.i] = "MySqlIndexBuilderOn";
  on(...columns) {
    return new IndexBuilder(this.name, columns, this.unique);
  }
}
class IndexBuilder {
  static [entity/* entityKind */.i] = "MySqlIndexBuilder";
  /** @internal */
  config;
  constructor(name, columns, unique) {
    this.config = {
      name,
      columns,
      unique
    };
  }
  using(using) {
    this.config.using = using;
    return this;
  }
  algorythm(algorythm) {
    this.config.algorythm = algorythm;
    return this;
  }
  lock(lock) {
    this.config.lock = lock;
    return this;
  }
  /** @internal */
  build(table) {
    return new Index(this.config, table);
  }
}
class Index {
  static [entity/* entityKind */.i] = "MySqlIndex";
  config;
  constructor(config, table) {
    this.config = { ...config, table };
  }
}
function index(name) {
  return new IndexBuilderOn(name, false);
}
function uniqueIndex(name) {
  return new IndexBuilderOn(name, true);
}

//# sourceMappingURL=indexes.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/boolean.js
var columns_boolean = __webpack_require__(1994);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/float.js
var columns_float = __webpack_require__(8220);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/int.js
var columns_int = __webpack_require__(2475);
;// CONCATENATED MODULE: ../../packages/db/dist/schema/mysql.js

// ─── Settings ─────────────────────────────────────────────────
const settings = (0,table/* mysqlTable */.Nn)("settings", {
    key: (0,varchar/* varchar */.yf)("key", { length: 255 }).primaryKey(),
    value: (0,columns_text/* text */.Qq)("value").notNull(),
    updatedAt: (0,datetime/* datetime */.w$)("updated_at").notNull().$defaultFn(() => new Date()),
});
// ─── Agents ─────────────────────────────────────────────────────
const agents = (0,table/* mysqlTable */.Nn)("agents", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    name: (0,varchar/* varchar */.yf)("name", { length: 255 }).notNull(),
    description: (0,columns_text/* text */.Qq)("description"),
    provider: (0,varchar/* varchar */.yf)("provider", { length: 50 }).notNull().default("custom"),
    status: (0,varchar/* varchar */.yf)("status", { length: 50 }).notNull().default("inactive"),
    lastSeenAt: (0,datetime/* datetime */.w$)("last_seen_at"),
    metadata: (0,json/* json */.Pq)("metadata").notNull().default({}),
    createdAt: (0,datetime/* datetime */.w$)("created_at").notNull().$defaultFn(() => new Date()),
    updatedAt: (0,datetime/* datetime */.w$)("updated_at").notNull().$defaultFn(() => new Date()),
}, (table) => ({
    statusIdx: index("idx_agents_status").on(table.status),
    tenantIdIdx: index("idx_agents_tenant_id").on(table.tenantId),
}));
// ─── Scanner Definitions ────────────────────────────────────────
const scannerDefinitions = (0,table/* mysqlTable */.Nn)("scanner_definitions", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    scannerId: (0,varchar/* varchar */.yf)("scanner_id", { length: 10 }).notNull(),
    name: (0,varchar/* varchar */.yf)("name", { length: 255 }).notNull(),
    description: (0,columns_text/* text */.Qq)("description").notNull(),
    config: (0,json/* json */.Pq)("config").notNull().default({}),
    isEnabled: (0,columns_boolean/* boolean */.zM)("is_enabled").notNull().default(true),
    isDefault: (0,columns_boolean/* boolean */.zM)("is_default").notNull().default(false),
}, (table) => ({
    scannerIdIdx: index("idx_scanner_defs_scanner_id").on(table.scannerId),
    tenantIdIdx: index("idx_scanner_defs_tenant_id").on(table.tenantId),
}));
// ─── Policies ───────────────────────────────────────────────────
const policies = (0,table/* mysqlTable */.Nn)("policies", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    name: (0,varchar/* varchar */.yf)("name", { length: 255 }).notNull(),
    description: (0,columns_text/* text */.Qq)("description"),
    scannerIds: (0,json/* json */.Pq)("scanner_ids").notNull().default([]),
    action: (0,varchar/* varchar */.yf)("action", { length: 50 }).notNull().default("log"),
    sensitivityThreshold: (0,columns_float/* float */.fV)("sensitivity_threshold").notNull().default(0.5),
    isEnabled: (0,columns_boolean/* boolean */.zM)("is_enabled").notNull().default(true),
    createdAt: (0,datetime/* datetime */.w$)("created_at").notNull().$defaultFn(() => new Date()),
    updatedAt: (0,datetime/* datetime */.w$)("updated_at").notNull().$defaultFn(() => new Date()),
}, (table) => ({
    tenantIdIdx: index("idx_policies_tenant_id").on(table.tenantId),
}));
// ─── Usage Logs ─────────────────────────────────────────────────
const usageLogs = (0,table/* mysqlTable */.Nn)("usage_logs", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    agentId: (0,varchar/* varchar */.yf)("agent_id", { length: 36 }),
    endpoint: (0,varchar/* varchar */.yf)("endpoint", { length: 255 }).notNull(),
    statusCode: (0,columns_int/* int */.Wh)("status_code").notNull(),
    responseSafe: (0,columns_boolean/* boolean */.zM)("response_safe"),
    categories: (0,json/* json */.Pq)("categories").notNull().default([]),
    latencyMs: (0,columns_int/* int */.Wh)("latency_ms").notNull(),
    requestId: (0,varchar/* varchar */.yf)("request_id", { length: 64 }).notNull(),
    createdAt: (0,datetime/* datetime */.w$)("created_at").notNull().$defaultFn(() => new Date()),
}, (table) => ({
    agentIdIdx: index("idx_usage_logs_agent_id").on(table.agentId),
    createdAtIdx: index("idx_usage_logs_created_at").on(table.createdAt),
    tenantIdIdx: index("idx_usage_logs_tenant_id").on(table.tenantId),
}));
// ─── Detection Results ──────────────────────────────────────────
const detectionResults = (0,table/* mysqlTable */.Nn)("detection_results", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    agentId: (0,varchar/* varchar */.yf)("agent_id", { length: 36 }),
    safe: (0,columns_boolean/* boolean */.zM)("safe").notNull(),
    categories: (0,json/* json */.Pq)("categories").notNull().default([]),
    sensitivityScore: (0,columns_float/* float */.fV)("sensitivity_score").notNull().default(0),
    findings: (0,json/* json */.Pq)("findings").notNull().default([]),
    latencyMs: (0,columns_int/* int */.Wh)("latency_ms").notNull(),
    requestId: (0,varchar/* varchar */.yf)("request_id", { length: 64 }).notNull(),
    // Static scan fields
    scanType: (0,varchar/* varchar */.yf)("scan_type", { length: 16 }).notNull().default("dynamic"), // "static" or "dynamic"
    filePath: (0,columns_text/* text */.Qq)("file_path"), // Relative path from workspace for static scans
    fileType: (0,varchar/* varchar */.yf)("file_type", { length: 16 }), // "soul", "agent", "memory", "task", "skill", "plugin", "other"
    createdAt: (0,datetime/* datetime */.w$)("created_at").notNull().$defaultFn(() => new Date()),
}, (table) => ({
    agentIdIdx: index("idx_detection_results_agent_id").on(table.agentId),
    createdAtIdx: index("idx_detection_results_created_at").on(table.createdAt),
    tenantIdIdx: index("idx_detection_results_tenant_id").on(table.tenantId),
    scanTypeIdx: index("idx_detection_results_scan_type").on(table.scanType),
}));
// ─── Tool Call Observations ─────────────────────────────────────
const toolCallObservations = (0,table/* mysqlTable */.Nn)("tool_call_observations", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    agentId: (0,varchar/* varchar */.yf)("agent_id", { length: 36 }).notNull(),
    sessionKey: (0,varchar/* varchar */.yf)("session_key", { length: 255 }),
    toolName: (0,varchar/* varchar */.yf)("tool_name", { length: 255 }).notNull(),
    category: (0,varchar/* varchar */.yf)("category", { length: 64 }),
    accessPattern: (0,varchar/* varchar */.yf)("access_pattern", { length: 32 }),
    paramsJson: (0,json/* json */.Pq)("params_json"),
    phase: (0,varchar/* varchar */.yf)("phase", { length: 16 }).notNull(),
    resultJson: (0,json/* json */.Pq)("result_json"),
    error: (0,columns_text/* text */.Qq)("error"),
    durationMs: (0,columns_int/* int */.Wh)("duration_ms"),
    blocked: (0,columns_boolean/* boolean */.zM)("blocked").notNull().default(false),
    blockReason: (0,columns_text/* text */.Qq)("block_reason"),
    timestamp: (0,datetime/* datetime */.w$)("timestamp").notNull().$defaultFn(() => new Date()),
}, (table) => ({
    agentIdIdx: index("idx_tool_obs_agent_id").on(table.agentId),
    toolNameIdx: index("idx_tool_obs_tool_name").on(table.toolName),
    timestampIdx: index("idx_tool_obs_timestamp").on(table.timestamp),
    tenantIdIdx: index("idx_tool_obs_tenant_id").on(table.tenantId),
}));
// ─── Gateway Activity ─────────────────────────────────────────
// Records of gateway sanitization and restoration events
const gatewayActivity = (0,table/* mysqlTable */.Nn)("gateway_activity", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    eventId: (0,varchar/* varchar */.yf)("event_id", { length: 128 }).notNull(), // From gateway: gw-timestamp-counter-type
    requestId: (0,varchar/* varchar */.yf)("request_id", { length: 64 }).notNull(), // gw-timestamp-counter
    timestamp: (0,datetime/* datetime */.w$)("timestamp").notNull(),
    type: (0,varchar/* varchar */.yf)("type", { length: 16 }).notNull(), // "sanitize" or "restore"
    direction: (0,varchar/* varchar */.yf)("direction", { length: 16 }).notNull(), // "request" or "response"
    backend: (0,varchar/* varchar */.yf)("backend", { length: 32 }).notNull(), // "openai", "anthropic", "gemini"
    endpoint: (0,varchar/* varchar */.yf)("endpoint", { length: 255 }).notNull(), // e.g., "/v1/chat/completions"
    model: (0,varchar/* varchar */.yf)("model", { length: 128 }),
    redactionCount: (0,columns_int/* int */.Wh)("redaction_count").notNull().default(0),
    categories: (0,json/* json */.Pq)("categories").notNull().default({}), // { email: 2, secret: 1 }
    durationMs: (0,columns_int/* int */.Wh)("duration_ms"),
    createdAt: (0,datetime/* datetime */.w$)("created_at").notNull().$defaultFn(() => new Date()),
}, (table) => ({
    requestIdIdx: index("idx_gateway_activity_request_id").on(table.requestId),
    timestampIdx: index("idx_gateway_activity_timestamp").on(table.timestamp),
    typeIdx: index("idx_gateway_activity_type").on(table.type),
    tenantIdIdx: index("idx_gateway_activity_tenant_id").on(table.tenantId),
}));
// ─── Agent Permissions ────────────────────────────────────────
const agentPermissions = (0,table/* mysqlTable */.Nn)("agent_permissions", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    agentId: (0,varchar/* varchar */.yf)("agent_id", { length: 36 }).notNull(),
    toolName: (0,varchar/* varchar */.yf)("tool_name", { length: 255 }).notNull(),
    category: (0,varchar/* varchar */.yf)("category", { length: 64 }),
    accessPattern: (0,varchar/* varchar */.yf)("access_pattern", { length: 32 }),
    targetsJson: (0,json/* json */.Pq)("targets_json").notNull().default([]),
    callCount: (0,columns_int/* int */.Wh)("call_count").notNull().default(0),
    errorCount: (0,columns_int/* int */.Wh)("error_count").notNull().default(0),
    firstSeen: (0,datetime/* datetime */.w$)("first_seen").notNull().$defaultFn(() => new Date()),
    lastSeen: (0,datetime/* datetime */.w$)("last_seen").notNull().$defaultFn(() => new Date()),
}, (table) => ({
    agentIdIdx: index("idx_agent_perms_agent_id").on(table.agentId),
    toolNameIdx: index("idx_agent_perms_tool_name").on(table.toolName),
    tenantIdIdx: index("idx_agent_perms_tenant_id").on(table.tenantId),
    uniqueAgentTool: index("idx_agent_perms_unique").on(table.tenantId, table.agentId, table.toolName),
}));
// ─── Magic Links ─────────────────────────────────────────────
const magicLinks = (0,table/* mysqlTable */.Nn)("magic_links", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey(),
    email: (0,varchar/* varchar */.yf)("email", { length: 255 }).notNull(),
    token: (0,columns_text/* text */.Qq)("token").notNull(),
    expiresAt: (0,varchar/* varchar */.yf)("expires_at", { length: 32 }).notNull(),
    usedAt: (0,varchar/* varchar */.yf)("used_at", { length: 32 }),
    createdAt: (0,varchar/* varchar */.yf)("created_at", { length: 32 }).notNull(),
}, (table) => ({
    tokenIdx: index("idx_magic_links_token").on(table.token),
    emailIdx: index("idx_magic_links_email").on(table.email),
}));
// ─── User Sessions ────────────────────────────────────────────
const userSessions = (0,table/* mysqlTable */.Nn)("user_sessions", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey(),
    email: (0,varchar/* varchar */.yf)("email", { length: 255 }).notNull(),
    token: (0,columns_text/* text */.Qq)("token").notNull(),
    expiresAt: (0,varchar/* varchar */.yf)("expires_at", { length: 32 }).notNull(),
    createdAt: (0,varchar/* varchar */.yf)("created_at", { length: 32 }).notNull(),
}, (table) => ({
    tokenIdx: index("idx_user_sessions_token").on(table.token),
    emailIdx: index("idx_user_sessions_email").on(table.email),
}));
// ─── Agentic Hours ──────────────────────────────────────────────
// Daily aggregated duration metrics per agent
const agenticHoursLocal = (0,table/* mysqlTable */.Nn)("agentic_hours_local", {
    id: (0,varchar/* varchar */.yf)("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    agentId: (0,varchar/* varchar */.yf)("agent_id", { length: 36 }).notNull(),
    date: (0,varchar/* varchar */.yf)("date", { length: 10 }).notNull(), // YYYY-MM-DD
    toolCallDurationMs: (0,columns_int/* int */.Wh)("tool_call_duration_ms").notNull().default(0),
    llmDurationMs: (0,columns_int/* int */.Wh)("llm_duration_ms").notNull().default(0),
    totalDurationMs: (0,columns_int/* int */.Wh)("total_duration_ms").notNull().default(0),
    toolCallCount: (0,columns_int/* int */.Wh)("tool_call_count").notNull().default(0),
    llmCallCount: (0,columns_int/* int */.Wh)("llm_call_count").notNull().default(0),
    sessionCount: (0,columns_int/* int */.Wh)("session_count").notNull().default(0),
    blockCount: (0,columns_int/* int */.Wh)("block_count").notNull().default(0),
    riskEventCount: (0,columns_int/* int */.Wh)("risk_event_count").notNull().default(0),
    createdAt: (0,datetime/* datetime */.w$)("created_at").notNull().$defaultFn(() => new Date()),
    updatedAt: (0,datetime/* datetime */.w$)("updated_at").notNull().$defaultFn(() => new Date()),
}, (table) => ({
    agentDateIdx: index("idx_agentic_hours_agent_date").on(table.tenantId, table.agentId, table.date),
    tenantDateIdx: index("idx_agentic_hours_tenant_date").on(table.tenantId, table.date),
}));
//# sourceMappingURL=mysql.js.map

/***/ })

};

//# sourceMappingURL=113.index.js.map