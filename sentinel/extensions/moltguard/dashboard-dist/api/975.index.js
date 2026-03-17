export const id = 975;
export const ids = [975];
export const modules = {

/***/ 975:
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

// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/table.js + 22 modules
var table = __webpack_require__(698);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/varchar.js
var varchar = __webpack_require__(890);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/text.js
var columns_text = __webpack_require__(3524);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/timestamp.js
var timestamp = __webpack_require__(8631);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/uuid.js
var uuid = __webpack_require__(1848);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/jsonb.js
var jsonb = __webpack_require__(1343);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sql/sql.js + 1 modules
var sql = __webpack_require__(183);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(9724);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/common.js + 3 modules
var common = __webpack_require__(2414);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/indexes.js



class IndexBuilderOn {
  constructor(unique, name) {
    this.unique = unique;
    this.name = name;
  }
  static [entity/* entityKind */.i] = "PgIndexBuilderOn";
  on(...columns) {
    return new IndexBuilder(
      columns.map((it) => {
        if ((0,entity.is)(it, sql/* SQL */.Xs)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new common/* IndexedColumn */.ae(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }),
      this.unique,
      false,
      this.name
    );
  }
  onOnly(...columns) {
    return new IndexBuilder(
      columns.map((it) => {
        if ((0,entity.is)(it, sql/* SQL */.Xs)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new common/* IndexedColumn */.ae(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = it.defaultConfig;
        return clonedIndexedColumn;
      }),
      this.unique,
      true,
      this.name
    );
  }
  /**
   * Specify what index method to use. Choices are `btree`, `hash`, `gist`, `spgist`, `gin`, `brin`, or user-installed access methods like `bloom`. The default method is `btree.
   *
   * If you have the `pg_vector` extension installed in your database, you can use the `hnsw` and `ivfflat` options, which are predefined types.
   *
   * **You can always specify any string you want in the method, in case Drizzle doesn't have it natively in its types**
   *
   * @param method The name of the index method to be used
   * @param columns
   * @returns
   */
  using(method, ...columns) {
    return new IndexBuilder(
      columns.map((it) => {
        if ((0,entity.is)(it, sql/* SQL */.Xs)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new common/* IndexedColumn */.ae(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }),
      this.unique,
      true,
      this.name,
      method
    );
  }
}
class IndexBuilder {
  static [entity/* entityKind */.i] = "PgIndexBuilder";
  /** @internal */
  config;
  constructor(columns, unique, only, name, method = "btree") {
    this.config = {
      name,
      columns,
      unique,
      only,
      method
    };
  }
  concurrently() {
    this.config.concurrently = true;
    return this;
  }
  with(obj) {
    this.config.with = obj;
    return this;
  }
  where(condition) {
    this.config.where = condition;
    return this;
  }
  /** @internal */
  build(table) {
    return new Index(this.config, table);
  }
}
class Index {
  static [entity/* entityKind */.i] = "PgIndex";
  config;
  constructor(config, table) {
    this.config = { ...config, table };
  }
}
function index(name) {
  return new IndexBuilderOn(false, name);
}
function uniqueIndex(name) {
  return new IndexBuilderOn(true, name);
}

//# sourceMappingURL=indexes.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/boolean.js
var columns_boolean = __webpack_require__(1419);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/real.js
var real = __webpack_require__(7483);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/integer.js
var integer = __webpack_require__(2917);
;// CONCATENATED MODULE: ../../packages/db/dist/schema/pg.js

// ─── Settings ─────────────────────────────────────────────────
const settings = (0,table/* pgTable */.cJ)("settings", {
    key: (0,varchar/* varchar */.yf)("key", { length: 255 }).primaryKey(),
    value: (0,columns_text/* text */.Qq)("value").notNull(),
    updatedAt: (0,timestamp/* timestamp */.vE)("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
// ─── Agents ─────────────────────────────────────────────────────
const agents = (0,table/* pgTable */.cJ)("agents", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    name: (0,varchar/* varchar */.yf)("name", { length: 255 }).notNull(),
    description: (0,columns_text/* text */.Qq)("description"),
    provider: (0,varchar/* varchar */.yf)("provider", { length: 50 }).notNull().default("custom"),
    status: (0,varchar/* varchar */.yf)("status", { length: 50 }).notNull().default("inactive"),
    lastSeenAt: (0,timestamp/* timestamp */.vE)("last_seen_at", { withTimezone: true }),
    metadata: (0,jsonb/* jsonb */.Fx)("metadata").notNull().default({}),
    createdAt: (0,timestamp/* timestamp */.vE)("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0,timestamp/* timestamp */.vE)("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    statusIdx: index("idx_agents_status").on(table.status),
    tenantIdIdx: index("idx_agents_tenant_id").on(table.tenantId),
}));
// ─── Scanner Definitions ────────────────────────────────────────
const scannerDefinitions = (0,table/* pgTable */.cJ)("scanner_definitions", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    scannerId: (0,varchar/* varchar */.yf)("scanner_id", { length: 10 }).notNull(),
    name: (0,varchar/* varchar */.yf)("name", { length: 255 }).notNull(),
    description: (0,columns_text/* text */.Qq)("description").notNull(),
    config: (0,jsonb/* jsonb */.Fx)("config").notNull().default({}),
    isEnabled: (0,columns_boolean/* boolean */.zM)("is_enabled").notNull().default(true),
    isDefault: (0,columns_boolean/* boolean */.zM)("is_default").notNull().default(false),
}, (table) => ({
    scannerIdIdx: index("idx_scanner_defs_scanner_id").on(table.scannerId),
    tenantIdIdx: index("idx_scanner_defs_tenant_id").on(table.tenantId),
}));
// ─── Policies ───────────────────────────────────────────────────
const policies = (0,table/* pgTable */.cJ)("policies", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    name: (0,varchar/* varchar */.yf)("name", { length: 255 }).notNull(),
    description: (0,columns_text/* text */.Qq)("description"),
    scannerIds: (0,jsonb/* jsonb */.Fx)("scanner_ids").notNull().default([]),
    action: (0,varchar/* varchar */.yf)("action", { length: 50 }).notNull().default("log"),
    sensitivityThreshold: (0,real/* real */.x)("sensitivity_threshold").notNull().default(0.5),
    isEnabled: (0,columns_boolean/* boolean */.zM)("is_enabled").notNull().default(true),
    createdAt: (0,timestamp/* timestamp */.vE)("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0,timestamp/* timestamp */.vE)("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    tenantIdIdx: index("idx_policies_tenant_id").on(table.tenantId),
}));
// ─── Usage Logs ─────────────────────────────────────────────────
const usageLogs = (0,table/* pgTable */.cJ)("usage_logs", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    agentId: (0,uuid/* uuid */.uR)("agent_id"),
    endpoint: (0,varchar/* varchar */.yf)("endpoint", { length: 255 }).notNull(),
    statusCode: (0,integer/* integer */.nd)("status_code").notNull(),
    responseSafe: (0,columns_boolean/* boolean */.zM)("response_safe"),
    categories: (0,jsonb/* jsonb */.Fx)("categories").notNull().default([]),
    latencyMs: (0,integer/* integer */.nd)("latency_ms").notNull(),
    requestId: (0,varchar/* varchar */.yf)("request_id", { length: 64 }).notNull(),
    createdAt: (0,timestamp/* timestamp */.vE)("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    agentIdIdx: index("idx_usage_logs_agent_id").on(table.agentId),
    createdAtIdx: index("idx_usage_logs_created_at").on(table.createdAt),
    tenantIdIdx: index("idx_usage_logs_tenant_id").on(table.tenantId),
}));
// ─── Detection Results ──────────────────────────────────────────
const detectionResults = (0,table/* pgTable */.cJ)("detection_results", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    agentId: (0,uuid/* uuid */.uR)("agent_id"),
    safe: (0,columns_boolean/* boolean */.zM)("safe").notNull(),
    categories: (0,jsonb/* jsonb */.Fx)("categories").notNull().default([]),
    sensitivityScore: (0,real/* real */.x)("sensitivity_score").notNull().default(0),
    findings: (0,jsonb/* jsonb */.Fx)("findings").notNull().default([]),
    latencyMs: (0,integer/* integer */.nd)("latency_ms").notNull(),
    requestId: (0,varchar/* varchar */.yf)("request_id", { length: 64 }).notNull(),
    // Static scan fields
    scanType: (0,varchar/* varchar */.yf)("scan_type", { length: 16 }).notNull().default("dynamic"), // "static" or "dynamic"
    filePath: (0,columns_text/* text */.Qq)("file_path"), // Relative path from workspace for static scans
    fileType: (0,varchar/* varchar */.yf)("file_type", { length: 16 }), // "soul", "agent", "memory", "task", "skill", "plugin", "other"
    createdAt: (0,timestamp/* timestamp */.vE)("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    agentIdIdx: index("idx_detection_results_agent_id").on(table.agentId),
    createdAtIdx: index("idx_detection_results_created_at").on(table.createdAt),
    tenantIdIdx: index("idx_detection_results_tenant_id").on(table.tenantId),
    scanTypeIdx: index("idx_detection_results_scan_type").on(table.scanType),
}));
// ─── Tool Call Observations ─────────────────────────────────────
const toolCallObservations = (0,table/* pgTable */.cJ)("tool_call_observations", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    agentId: (0,uuid/* uuid */.uR)("agent_id").notNull(),
    sessionKey: (0,varchar/* varchar */.yf)("session_key", { length: 255 }),
    toolName: (0,varchar/* varchar */.yf)("tool_name", { length: 255 }).notNull(),
    category: (0,varchar/* varchar */.yf)("category", { length: 64 }),
    accessPattern: (0,varchar/* varchar */.yf)("access_pattern", { length: 32 }),
    paramsJson: (0,jsonb/* jsonb */.Fx)("params_json"),
    phase: (0,varchar/* varchar */.yf)("phase", { length: 16 }).notNull(),
    resultJson: (0,jsonb/* jsonb */.Fx)("result_json"),
    error: (0,columns_text/* text */.Qq)("error"),
    durationMs: (0,integer/* integer */.nd)("duration_ms"),
    blocked: (0,columns_boolean/* boolean */.zM)("blocked").notNull().default(false),
    blockReason: (0,columns_text/* text */.Qq)("block_reason"),
    timestamp: (0,timestamp/* timestamp */.vE)("timestamp", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    agentIdIdx: index("idx_tool_obs_agent_id").on(table.agentId),
    toolNameIdx: index("idx_tool_obs_tool_name").on(table.toolName),
    timestampIdx: index("idx_tool_obs_timestamp").on(table.timestamp),
    tenantIdIdx: index("idx_tool_obs_tenant_id").on(table.tenantId),
}));
// ─── Gateway Activity ─────────────────────────────────────────
// Records of gateway sanitization and restoration events
const gatewayActivity = (0,table/* pgTable */.cJ)("gateway_activity", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    eventId: (0,varchar/* varchar */.yf)("event_id", { length: 128 }).notNull(), // From gateway: gw-timestamp-counter-type
    requestId: (0,varchar/* varchar */.yf)("request_id", { length: 64 }).notNull(), // gw-timestamp-counter
    timestamp: (0,timestamp/* timestamp */.vE)("timestamp", { withTimezone: true }).notNull(),
    type: (0,varchar/* varchar */.yf)("type", { length: 16 }).notNull(), // "sanitize" or "restore"
    direction: (0,varchar/* varchar */.yf)("direction", { length: 16 }).notNull(), // "request" or "response"
    backend: (0,varchar/* varchar */.yf)("backend", { length: 32 }).notNull(), // "openai", "anthropic", "gemini"
    endpoint: (0,varchar/* varchar */.yf)("endpoint", { length: 255 }).notNull(), // e.g., "/v1/chat/completions"
    model: (0,varchar/* varchar */.yf)("model", { length: 128 }),
    redactionCount: (0,integer/* integer */.nd)("redaction_count").notNull().default(0),
    categories: (0,jsonb/* jsonb */.Fx)("categories").notNull().default({}), // { email: 2, secret: 1 }
    durationMs: (0,integer/* integer */.nd)("duration_ms"),
    createdAt: (0,timestamp/* timestamp */.vE)("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    requestIdIdx: index("idx_gateway_activity_request_id").on(table.requestId),
    timestampIdx: index("idx_gateway_activity_timestamp").on(table.timestamp),
    typeIdx: index("idx_gateway_activity_type").on(table.type),
    tenantIdIdx: index("idx_gateway_activity_tenant_id").on(table.tenantId),
}));
// ─── Agent Permissions ────────────────────────────────────────
const agentPermissions = (0,table/* pgTable */.cJ)("agent_permissions", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    agentId: (0,uuid/* uuid */.uR)("agent_id").notNull(),
    toolName: (0,varchar/* varchar */.yf)("tool_name", { length: 255 }).notNull(),
    category: (0,varchar/* varchar */.yf)("category", { length: 64 }),
    accessPattern: (0,varchar/* varchar */.yf)("access_pattern", { length: 32 }),
    targetsJson: (0,jsonb/* jsonb */.Fx)("targets_json").notNull().default([]),
    callCount: (0,integer/* integer */.nd)("call_count").notNull().default(0),
    errorCount: (0,integer/* integer */.nd)("error_count").notNull().default(0),
    firstSeen: (0,timestamp/* timestamp */.vE)("first_seen", { withTimezone: true }).notNull().defaultNow(),
    lastSeen: (0,timestamp/* timestamp */.vE)("last_seen", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    agentIdIdx: index("idx_agent_perms_agent_id").on(table.agentId),
    toolNameIdx: index("idx_agent_perms_tool_name").on(table.toolName),
    tenantIdIdx: index("idx_agent_perms_tenant_id").on(table.tenantId),
    uniqueAgentTool: index("idx_agent_perms_unique").on(table.tenantId, table.agentId, table.toolName),
}));
// ─── Magic Links ─────────────────────────────────────────────
const magicLinks = (0,table/* pgTable */.cJ)("magic_links", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    email: (0,varchar/* varchar */.yf)("email", { length: 255 }).notNull(),
    token: (0,columns_text/* text */.Qq)("token").notNull().unique(),
    expiresAt: (0,timestamp/* timestamp */.vE)("expires_at", { withTimezone: true }).notNull(),
    usedAt: (0,timestamp/* timestamp */.vE)("used_at", { withTimezone: true }),
    createdAt: (0,timestamp/* timestamp */.vE)("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    tokenIdx: index("idx_magic_links_token").on(table.token),
    emailIdx: index("idx_magic_links_email").on(table.email),
}));
// ─── User Sessions ────────────────────────────────────────────
const userSessions = (0,table/* pgTable */.cJ)("user_sessions", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    email: (0,varchar/* varchar */.yf)("email", { length: 255 }).notNull(),
    token: (0,columns_text/* text */.Qq)("token").notNull().unique(),
    expiresAt: (0,timestamp/* timestamp */.vE)("expires_at", { withTimezone: true }).notNull(),
    createdAt: (0,timestamp/* timestamp */.vE)("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    tokenIdx: index("idx_user_sessions_token").on(table.token),
    emailIdx: index("idx_user_sessions_email").on(table.email),
}));
// ─── Agentic Hours ──────────────────────────────────────────────
// Daily aggregated duration metrics per agent
const agenticHoursLocal = (0,table/* pgTable */.cJ)("agentic_hours_local", {
    id: (0,uuid/* uuid */.uR)("id").primaryKey().defaultRandom(),
    tenantId: (0,varchar/* varchar */.yf)("tenant_id", { length: 64 }).notNull().default("default"),
    agentId: (0,uuid/* uuid */.uR)("agent_id").notNull(),
    date: (0,varchar/* varchar */.yf)("date", { length: 10 }).notNull(), // YYYY-MM-DD
    toolCallDurationMs: (0,integer/* integer */.nd)("tool_call_duration_ms").notNull().default(0),
    llmDurationMs: (0,integer/* integer */.nd)("llm_duration_ms").notNull().default(0),
    totalDurationMs: (0,integer/* integer */.nd)("total_duration_ms").notNull().default(0),
    toolCallCount: (0,integer/* integer */.nd)("tool_call_count").notNull().default(0),
    llmCallCount: (0,integer/* integer */.nd)("llm_call_count").notNull().default(0),
    sessionCount: (0,integer/* integer */.nd)("session_count").notNull().default(0),
    blockCount: (0,integer/* integer */.nd)("block_count").notNull().default(0),
    riskEventCount: (0,integer/* integer */.nd)("risk_event_count").notNull().default(0),
    createdAt: (0,timestamp/* timestamp */.vE)("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0,timestamp/* timestamp */.vE)("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
    agentDateIdx: index("idx_agentic_hours_agent_date").on(table.tenantId, table.agentId, table.date),
    tenantDateIdx: index("idx_agentic_hours_tenant_date").on(table.tenantId, table.date),
}));
//# sourceMappingURL=pg.js.map

/***/ })

};

//# sourceMappingURL=975.index.js.map