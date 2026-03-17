export const id = 104;
export const ids = [104];
export const modules = {

/***/ 1994:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   zM: () => (/* binding */ boolean)
/* harmony export */ });
/* unused harmony exports MySqlBoolean, MySqlBooleanBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9498);


class MySqlBooleanBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumnBuilder */ .Ew {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "MySqlBoolean");
  }
  /** @internal */
  build(table) {
    return new MySqlBoolean(
      table,
      this.config
    );
  }
}
class MySqlBoolean extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumn */ .rI {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlBoolean";
  getSQLType() {
    return "boolean";
  }
  mapFromDriverValue(value) {
    if (typeof value === "boolean") {
      return value;
    }
    return value === 1;
  }
}
function boolean(name) {
  return new MySqlBooleanBuilder(name ?? "");
}

//# sourceMappingURL=boolean.js.map

/***/ }),

/***/ 9498:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  rI: () => (/* binding */ MySqlColumn),
  Ew: () => (/* binding */ MySqlColumnBuilder),
  WZ: () => (/* binding */ MySqlColumnBuilderWithAutoIncrement),
  $r: () => (/* binding */ MySqlColumnWithAutoIncrement)
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/column-builder.js
var column_builder = __webpack_require__(5099);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/column.js
var column = __webpack_require__(2345);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(9724);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/table.utils.js
var table_utils = __webpack_require__(7340);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/foreign-keys.js


class ForeignKeyBuilder {
  static [entity/* entityKind */.i] = "MySqlForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate;
  /** @internal */
  _onDelete;
  constructor(config, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action;
    return this;
  }
  /** @internal */
  build(table) {
    return new ForeignKey(table, this);
  }
}
class ForeignKey {
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  static [entity/* entityKind */.i] = "MySqlForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[table_utils/* TableName */.E],
      ...columnNames,
      foreignColumns[0].table[table_utils/* TableName */.E],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
}
function foreignKey(config) {
  function mappedConfig() {
    const { name, columns, foreignColumns } = config;
    return {
      name,
      columns,
      foreignColumns
    };
  }
  return new ForeignKeyBuilder(mappedConfig);
}

//# sourceMappingURL=foreign-keys.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/unique-constraint.js


function unique(name) {
  return new UniqueOnConstraintBuilder(name);
}
function uniqueKeyName(table, columns) {
  return `${table[table_utils/* TableName */.E]}_${columns.join("_")}_unique`;
}
class UniqueConstraintBuilder {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [entity/* entityKind */.i] = (/* unused pure expression or super */ null && ("MySqlUniqueConstraintBuilder"));
  /** @internal */
  columns;
  /** @internal */
  build(table) {
    return new UniqueConstraint(table, this.columns, this.name);
  }
}
class UniqueOnConstraintBuilder {
  static [entity/* entityKind */.i] = (/* unused pure expression or super */ null && ("MySqlUniqueOnConstraintBuilder"));
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
}
class UniqueConstraint {
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
  }
  static [entity/* entityKind */.i] = (/* unused pure expression or super */ null && ("MySqlUniqueConstraint"));
  columns;
  name;
  nullsNotDistinct = false;
  getName() {
    return this.name;
  }
}

//# sourceMappingURL=unique-constraint.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/common.js





class MySqlColumnBuilder extends column_builder/* ColumnBuilder */.Q {
  static [entity/* entityKind */.i] = "MySqlColumnBuilder";
  foreignKeyConfigs = [];
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  generatedAlwaysAs(as, config) {
    this.config.generated = {
      as,
      type: "always",
      mode: config?.mode ?? "virtual"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return ((ref2, actions2) => {
        const builder = new ForeignKeyBuilder(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table);
      })(ref, actions);
    });
  }
}
class MySqlColumn extends column/* Column */.V {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [entity/* entityKind */.i] = "MySqlColumn";
}
class MySqlColumnBuilderWithAutoIncrement extends MySqlColumnBuilder {
  static [entity/* entityKind */.i] = "MySqlColumnBuilderWithAutoIncrement";
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  autoincrement() {
    this.config.autoIncrement = true;
    this.config.hasDefault = true;
    return this;
  }
}
class MySqlColumnWithAutoIncrement extends MySqlColumn {
  static [entity/* entityKind */.i] = "MySqlColumnWithAutoIncrement";
  autoIncrement = this.config.autoIncrement;
}

//# sourceMappingURL=common.js.map

/***/ }),

/***/ 2913:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   w$: () => (/* binding */ datetime)
/* harmony export */ });
/* unused harmony exports MySqlDateTime, MySqlDateTimeBuilder, MySqlDateTimeString, MySqlDateTimeStringBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9498);



class MySqlDateTimeBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumnBuilder */ .Ew {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlDateTimeBuilder";
  constructor(name, config) {
    super(name, "date", "MySqlDateTime");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlDateTime(
      table,
      this.config
    );
  }
}
class MySqlDateTime extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumn */ .rI {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlDateTime";
  fsp;
  constructor(table, config) {
    super(table, config);
    this.fsp = config.fsp;
  }
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `datetime${precision}`;
  }
  mapToDriverValue(value) {
    return value.toISOString().replace("T", " ").replace("Z", "");
  }
  mapFromDriverValue(value) {
    return /* @__PURE__ */ new Date(value.replace(" ", "T") + "Z");
  }
}
class MySqlDateTimeStringBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumnBuilder */ .Ew {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlDateTimeStringBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlDateTimeString");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlDateTimeString(
      table,
      this.config
    );
  }
}
class MySqlDateTimeString extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumn */ .rI {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlDateTimeString";
  fsp;
  constructor(table, config) {
    super(table, config);
    this.fsp = config.fsp;
  }
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `datetime${precision}`;
  }
}
function datetime(a, b) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .getColumnNameAndConfig */ .Ll)(a, b);
  if (config?.mode === "string") {
    return new MySqlDateTimeStringBuilder(name, config);
  }
  return new MySqlDateTimeBuilder(name, config);
}

//# sourceMappingURL=datetime.js.map

/***/ }),

/***/ 8220:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fV: () => (/* binding */ float)
/* harmony export */ });
/* unused harmony exports MySqlFloat, MySqlFloatBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9498);



class MySqlFloatBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumnBuilderWithAutoIncrement */ .WZ {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlFloatBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlFloat");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlFloat(table, this.config);
  }
}
class MySqlFloat extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumnWithAutoIncrement */ .$r {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlFloat";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `float(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "float";
    } else {
      type += `float(${this.precision})`;
    }
    return this.unsigned ? `${type} unsigned` : type;
  }
}
function float(a, b) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .getColumnNameAndConfig */ .Ll)(a, b);
  return new MySqlFloatBuilder(name, config);
}

//# sourceMappingURL=float.js.map

/***/ }),

/***/ 2475:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Wh: () => (/* binding */ int)
/* harmony export */ });
/* unused harmony exports MySqlInt, MySqlIntBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9498);



class MySqlIntBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumnBuilderWithAutoIncrement */ .WZ {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlIntBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new MySqlInt(table, this.config);
  }
}
class MySqlInt extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumnWithAutoIncrement */ .$r {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlInt";
  getSQLType() {
    return `int${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function int(a, b) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .getColumnNameAndConfig */ .Ll)(a, b);
  return new MySqlIntBuilder(name, config);
}

//# sourceMappingURL=int.js.map

/***/ }),

/***/ 2298:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Pq: () => (/* binding */ json)
/* harmony export */ });
/* unused harmony exports MySqlJson, MySqlJsonBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9498);


class MySqlJsonBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumnBuilder */ .Ew {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlJsonBuilder";
  constructor(name) {
    super(name, "json", "MySqlJson");
  }
  /** @internal */
  build(table) {
    return new MySqlJson(table, this.config);
  }
}
class MySqlJson extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumn */ .rI {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlJson";
  getSQLType() {
    return "json";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
}
function json(name) {
  return new MySqlJsonBuilder(name ?? "");
}

//# sourceMappingURL=json.js.map

/***/ }),

/***/ 4195:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Qq: () => (/* binding */ text)
/* harmony export */ });
/* unused harmony exports MySqlText, MySqlTextBuilder, longtext, mediumtext, tinytext */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9498);



class MySqlTextBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumnBuilder */ .Ew {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlTextBuilder";
  constructor(name, textType, config) {
    super(name, "string", "MySqlText");
    this.config.textType = textType;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new MySqlText(table, this.config);
  }
}
class MySqlText extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumn */ .rI {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlText";
  textType = this.config.textType;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.textType;
  }
}
function text(a, b = {}) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .getColumnNameAndConfig */ .Ll)(a, b);
  return new MySqlTextBuilder(name, "text", config);
}
function tinytext(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlTextBuilder(name, "tinytext", config);
}
function mediumtext(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlTextBuilder(name, "mediumtext", config);
}
function longtext(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new MySqlTextBuilder(name, "longtext", config);
}

//# sourceMappingURL=text.js.map

/***/ }),

/***/ 9499:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   yf: () => (/* binding */ varchar)
/* harmony export */ });
/* unused harmony exports MySqlVarChar, MySqlVarCharBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9498);



class MySqlVarCharBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumnBuilder */ .Ew {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlVarCharBuilder";
  /** @internal */
  constructor(name, config) {
    super(name, "string", "MySqlVarChar");
    this.config.length = config.length;
    this.config.enum = config.enum;
  }
  /** @internal */
  build(table) {
    return new MySqlVarChar(
      table,
      this.config
    );
  }
}
class MySqlVarChar extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .MySqlColumn */ .rI {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "MySqlVarChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
  }
}
function varchar(a, b) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .getColumnNameAndConfig */ .Ll)(a, b);
  return new MySqlVarCharBuilder(name, config);
}

//# sourceMappingURL=varchar.js.map

/***/ }),

/***/ 2104:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  B$: () => (/* binding */ MySqlTable),
  Nn: () => (/* binding */ mysqlTable)
});

// UNUSED EXPORTS: InlineForeignKeys, mysqlTableCreator, mysqlTableWithSchema

// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(9724);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/table.js
var drizzle_orm_table = __webpack_require__(8407);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/utils.js
var utils = __webpack_require__(3853);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/common.js + 2 modules
var common = __webpack_require__(9498);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/bigint.js



class MySqlBigInt53Builder extends common/* MySqlColumnBuilderWithAutoIncrement */.WZ {
  static [entity/* entityKind */.i] = "MySqlBigInt53Builder";
  constructor(name, unsigned = false) {
    super(name, "number", "MySqlBigInt53");
    this.config.unsigned = unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlBigInt53(
      table,
      this.config
    );
  }
}
class MySqlBigInt53 extends common/* MySqlColumnWithAutoIncrement */.$r {
  static [entity/* entityKind */.i] = "MySqlBigInt53";
  getSQLType() {
    return `bigint${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
}
class MySqlBigInt64Builder extends common/* MySqlColumnBuilderWithAutoIncrement */.WZ {
  static [entity/* entityKind */.i] = "MySqlBigInt64Builder";
  constructor(name, unsigned = false) {
    super(name, "bigint", "MySqlBigInt64");
    this.config.unsigned = unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlBigInt64(
      table,
      this.config
    );
  }
}
class MySqlBigInt64 extends common/* MySqlColumnWithAutoIncrement */.$r {
  static [entity/* entityKind */.i] = "MySqlBigInt64";
  getSQLType() {
    return `bigint${this.config.unsigned ? " unsigned" : ""}`;
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
}
function bigint(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  if (config.mode === "number") {
    return new MySqlBigInt53Builder(name, config.unsigned);
  }
  return new MySqlBigInt64Builder(name, config.unsigned);
}

//# sourceMappingURL=bigint.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/binary.js



class MySqlBinaryBuilder extends common/* MySqlColumnBuilder */.Ew {
  static [entity/* entityKind */.i] = "MySqlBinaryBuilder";
  constructor(name, length) {
    super(name, "string", "MySqlBinary");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new MySqlBinary(table, this.config);
  }
}
class MySqlBinary extends common/* MySqlColumn */.rI {
  static [entity/* entityKind */.i] = "MySqlBinary";
  length = this.config.length;
  getSQLType() {
    return this.length === void 0 ? `binary` : `binary(${this.length})`;
  }
}
function binary(a, b = {}) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new MySqlBinaryBuilder(name, config.length);
}

//# sourceMappingURL=binary.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/boolean.js
var columns_boolean = __webpack_require__(1994);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/char.js



class MySqlCharBuilder extends common/* MySqlColumnBuilder */.Ew {
  static [entity/* entityKind */.i] = "MySqlCharBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlChar");
    this.config.length = config.length;
    this.config.enum = config.enum;
  }
  /** @internal */
  build(table) {
    return new MySqlChar(
      table,
      this.config
    );
  }
}
class MySqlChar extends common/* MySqlColumn */.rI {
  static [entity/* entityKind */.i] = "MySqlChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
}
function char_char(a, b = {}) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new MySqlCharBuilder(name, config);
}

//# sourceMappingURL=char.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/custom.js



class MySqlCustomColumnBuilder extends common/* MySqlColumnBuilder */.Ew {
  static [entity/* entityKind */.i] = "MySqlCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "MySqlCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new MySqlCustomColumn(
      table,
      this.config
    );
  }
}
class MySqlCustomColumn extends common/* MySqlColumn */.rI {
  static [entity/* entityKind */.i] = "MySqlCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table, config) {
    super(table, config);
    this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
    this.mapTo = config.customTypeParams.toDriver;
    this.mapFrom = config.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
}
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
    return new MySqlCustomColumnBuilder(name, config, customTypeParams);
  };
}

//# sourceMappingURL=custom.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/date.js



class MySqlDateBuilder extends common/* MySqlColumnBuilder */.Ew {
  static [entity/* entityKind */.i] = "MySqlDateBuilder";
  constructor(name) {
    super(name, "date", "MySqlDate");
  }
  /** @internal */
  build(table) {
    return new MySqlDate(table, this.config);
  }
}
class MySqlDate extends common/* MySqlColumn */.rI {
  static [entity/* entityKind */.i] = "MySqlDate";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `date`;
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
}
class MySqlDateStringBuilder extends common/* MySqlColumnBuilder */.Ew {
  static [entity/* entityKind */.i] = "MySqlDateStringBuilder";
  constructor(name) {
    super(name, "string", "MySqlDateString");
  }
  /** @internal */
  build(table) {
    return new MySqlDateString(
      table,
      this.config
    );
  }
}
class MySqlDateString extends common/* MySqlColumn */.rI {
  static [entity/* entityKind */.i] = "MySqlDateString";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `date`;
  }
}
function date(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  if (config?.mode === "string") {
    return new MySqlDateStringBuilder(name);
  }
  return new MySqlDateBuilder(name);
}

//# sourceMappingURL=date.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/datetime.js
var datetime = __webpack_require__(2913);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/decimal.js



class MySqlDecimalBuilder extends common/* MySqlColumnBuilderWithAutoIncrement */.WZ {
  static [entity/* entityKind */.i] = "MySqlDecimalBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlDecimal");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlDecimal(
      table,
      this.config
    );
  }
}
class MySqlDecimal extends common/* MySqlColumnWithAutoIncrement */.$r {
  static [entity/* entityKind */.i] = "MySqlDecimal";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `decimal(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "decimal";
    } else {
      type += `decimal(${this.precision})`;
    }
    type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
    return this.unsigned ? `${type} unsigned` : type;
  }
}
function decimal(a, b = {}) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new MySqlDecimalBuilder(name, config);
}

//# sourceMappingURL=decimal.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/double.js



class MySqlDoubleBuilder extends common/* MySqlColumnBuilderWithAutoIncrement */.WZ {
  static [entity/* entityKind */.i] = "MySqlDoubleBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlDouble");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new MySqlDouble(table, this.config);
  }
}
class MySqlDouble extends common/* MySqlColumnWithAutoIncrement */.$r {
  static [entity/* entityKind */.i] = "MySqlDouble";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `double(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "double";
    } else {
      type += `double(${this.precision})`;
    }
    return this.unsigned ? `${type} unsigned` : type;
  }
}
function double_double(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new MySqlDoubleBuilder(name, config);
}

//# sourceMappingURL=double.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/enum.js



class MySqlEnumColumnBuilder extends common/* MySqlColumnBuilder */.Ew {
  static [entity/* entityKind */.i] = "MySqlEnumColumnBuilder";
  constructor(name, values) {
    super(name, "string", "MySqlEnumColumn");
    this.config.enumValues = values;
  }
  /** @internal */
  build(table) {
    return new MySqlEnumColumn(
      table,
      this.config
    );
  }
}
class MySqlEnumColumn extends common/* MySqlColumn */.rI {
  static [entity/* entityKind */.i] = "MySqlEnumColumn";
  enumValues = this.config.enumValues;
  getSQLType() {
    return `enum(${this.enumValues.map((value) => `'${value}'`).join(",")})`;
  }
}
function mysqlEnum(a, b) {
  const { name, config: values } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  if (values.length === 0) {
    throw new Error(`You have an empty array for "${name}" enum values`);
  }
  return new MySqlEnumColumnBuilder(name, values);
}

//# sourceMappingURL=enum.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/float.js
var columns_float = __webpack_require__(8220);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/int.js
var columns_int = __webpack_require__(2475);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/json.js
var json = __webpack_require__(2298);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/mediumint.js



class MySqlMediumIntBuilder extends common/* MySqlColumnBuilderWithAutoIncrement */.WZ {
  static [entity/* entityKind */.i] = "MySqlMediumIntBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlMediumInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new MySqlMediumInt(
      table,
      this.config
    );
  }
}
class MySqlMediumInt extends common/* MySqlColumnWithAutoIncrement */.$r {
  static [entity/* entityKind */.i] = "MySqlMediumInt";
  getSQLType() {
    return `mediumint${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function mediumint(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new MySqlMediumIntBuilder(name, config);
}

//# sourceMappingURL=mediumint.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/real.js



class MySqlRealBuilder extends common/* MySqlColumnBuilderWithAutoIncrement */.WZ {
  static [entity/* entityKind */.i] = "MySqlRealBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlReal");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
  }
  /** @internal */
  build(table) {
    return new MySqlReal(table, this.config);
  }
}
class MySqlReal extends common/* MySqlColumnWithAutoIncrement */.$r {
  static [entity/* entityKind */.i] = "MySqlReal";
  precision = this.config.precision;
  scale = this.config.scale;
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `real(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "real";
    } else {
      return `real(${this.precision})`;
    }
  }
}
function real(a, b = {}) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new MySqlRealBuilder(name, config);
}

//# sourceMappingURL=real.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/serial.js


class MySqlSerialBuilder extends common/* MySqlColumnBuilderWithAutoIncrement */.WZ {
  static [entity/* entityKind */.i] = "MySqlSerialBuilder";
  constructor(name) {
    super(name, "number", "MySqlSerial");
    this.config.hasDefault = true;
    this.config.autoIncrement = true;
  }
  /** @internal */
  build(table) {
    return new MySqlSerial(table, this.config);
  }
}
class MySqlSerial extends common/* MySqlColumnWithAutoIncrement */.$r {
  static [entity/* entityKind */.i] = "MySqlSerial";
  getSQLType() {
    return "serial";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function serial(name) {
  return new MySqlSerialBuilder(name ?? "");
}

//# sourceMappingURL=serial.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/smallint.js



class MySqlSmallIntBuilder extends common/* MySqlColumnBuilderWithAutoIncrement */.WZ {
  static [entity/* entityKind */.i] = "MySqlSmallIntBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlSmallInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new MySqlSmallInt(
      table,
      this.config
    );
  }
}
class MySqlSmallInt extends common/* MySqlColumnWithAutoIncrement */.$r {
  static [entity/* entityKind */.i] = "MySqlSmallInt";
  getSQLType() {
    return `smallint${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function smallint(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new MySqlSmallIntBuilder(name, config);
}

//# sourceMappingURL=smallint.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/text.js
var columns_text = __webpack_require__(4195);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/time.js



class MySqlTimeBuilder extends common/* MySqlColumnBuilder */.Ew {
  static [entity/* entityKind */.i] = "MySqlTimeBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlTime");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlTime(table, this.config);
  }
}
class MySqlTime extends common/* MySqlColumn */.rI {
  static [entity/* entityKind */.i] = "MySqlTime";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `time${precision}`;
  }
}
function time(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new MySqlTimeBuilder(name, config);
}

//# sourceMappingURL=time.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sql/sql.js + 1 modules
var sql = __webpack_require__(183);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/date.common.js



class MySqlDateColumnBaseBuilder extends common/* MySqlColumnBuilder */.Ew {
  static [entity/* entityKind */.i] = "MySqlDateColumnBuilder";
  defaultNow() {
    return this.default((0,sql/* sql */.ll)`(now())`);
  }
  // "on update now" also adds an implicit default value to the column - https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html
  onUpdateNow() {
    this.config.hasOnUpdateNow = true;
    this.config.hasDefault = true;
    return this;
  }
}
class MySqlDateBaseColumn extends common/* MySqlColumn */.rI {
  static [entity/* entityKind */.i] = "MySqlDateColumn";
  hasOnUpdateNow = this.config.hasOnUpdateNow;
}

//# sourceMappingURL=date.common.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/timestamp.js



class MySqlTimestampBuilder extends MySqlDateColumnBaseBuilder {
  static [entity/* entityKind */.i] = "MySqlTimestampBuilder";
  constructor(name, config) {
    super(name, "date", "MySqlTimestamp");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlTimestamp(
      table,
      this.config
    );
  }
}
class MySqlTimestamp extends MySqlDateBaseColumn {
  static [entity/* entityKind */.i] = "MySqlTimestamp";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `timestamp${precision}`;
  }
  mapFromDriverValue(value) {
    return /* @__PURE__ */ new Date(value + "+0000");
  }
  mapToDriverValue(value) {
    return value.toISOString().slice(0, -1).replace("T", " ");
  }
}
class MySqlTimestampStringBuilder extends MySqlDateColumnBaseBuilder {
  static [entity/* entityKind */.i] = "MySqlTimestampStringBuilder";
  constructor(name, config) {
    super(name, "string", "MySqlTimestampString");
    this.config.fsp = config?.fsp;
  }
  /** @internal */
  build(table) {
    return new MySqlTimestampString(
      table,
      this.config
    );
  }
}
class MySqlTimestampString extends MySqlDateBaseColumn {
  static [entity/* entityKind */.i] = "MySqlTimestampString";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
    return `timestamp${precision}`;
  }
}
function timestamp(a, b = {}) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  if (config?.mode === "string") {
    return new MySqlTimestampStringBuilder(name, config);
  }
  return new MySqlTimestampBuilder(name, config);
}

//# sourceMappingURL=timestamp.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/tinyint.js



class MySqlTinyIntBuilder extends common/* MySqlColumnBuilderWithAutoIncrement */.WZ {
  static [entity/* entityKind */.i] = "MySqlTinyIntBuilder";
  constructor(name, config) {
    super(name, "number", "MySqlTinyInt");
    this.config.unsigned = config ? config.unsigned : false;
  }
  /** @internal */
  build(table) {
    return new MySqlTinyInt(
      table,
      this.config
    );
  }
}
class MySqlTinyInt extends common/* MySqlColumnWithAutoIncrement */.$r {
  static [entity/* entityKind */.i] = "MySqlTinyInt";
  getSQLType() {
    return `tinyint${this.config.unsigned ? " unsigned" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
function tinyint(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new MySqlTinyIntBuilder(name, config);
}

//# sourceMappingURL=tinyint.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/varbinary.js



class MySqlVarBinaryBuilder extends common/* MySqlColumnBuilder */.Ew {
  static [entity/* entityKind */.i] = "MySqlVarBinaryBuilder";
  /** @internal */
  constructor(name, config) {
    super(name, "string", "MySqlVarBinary");
    this.config.length = config?.length;
  }
  /** @internal */
  build(table) {
    return new MySqlVarBinary(
      table,
      this.config
    );
  }
}
class MySqlVarBinary extends common/* MySqlColumn */.rI {
  static [entity/* entityKind */.i] = "MySqlVarBinary";
  length = this.config.length;
  getSQLType() {
    return this.length === void 0 ? `varbinary` : `varbinary(${this.length})`;
  }
}
function varbinary(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new MySqlVarBinaryBuilder(name, config);
}

//# sourceMappingURL=varbinary.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/varchar.js
var varchar = __webpack_require__(9499);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/year.js


class MySqlYearBuilder extends common/* MySqlColumnBuilder */.Ew {
  static [entity/* entityKind */.i] = "MySqlYearBuilder";
  constructor(name) {
    super(name, "number", "MySqlYear");
  }
  /** @internal */
  build(table) {
    return new MySqlYear(table, this.config);
  }
}
class MySqlYear extends common/* MySqlColumn */.rI {
  static [entity/* entityKind */.i] = "MySqlYear";
  getSQLType() {
    return `year`;
  }
}
function year(name) {
  return new MySqlYearBuilder(name ?? "");
}

//# sourceMappingURL=year.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/columns/all.js
























function getMySqlColumnBuilders() {
  return {
    bigint: bigint,
    binary: binary,
    boolean: columns_boolean/* boolean */.zM,
    char: char_char,
    customType: customType,
    date: date,
    datetime: datetime/* datetime */.w$,
    decimal: decimal,
    double: double_double,
    mysqlEnum: mysqlEnum,
    float: columns_float/* float */.fV,
    int: columns_int/* int */.Wh,
    json: json/* json */.Pq,
    mediumint: mediumint,
    real: real,
    serial: serial,
    smallint: smallint,
    text: columns_text/* text */.Qq,
    time: time,
    timestamp: timestamp,
    tinyint: tinyint,
    varbinary: varbinary,
    varchar: varchar/* varchar */.yf,
    year: year
  };
}

//# sourceMappingURL=all.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/mysql-core/table.js



const InlineForeignKeys = Symbol.for("drizzle:MySqlInlineForeignKeys");
class MySqlTable extends drizzle_orm_table/* Table */.XI {
  static [entity/* entityKind */.i] = "MySqlTable";
  /** @internal */
  static Symbol = Object.assign({}, drizzle_orm_table/* Table */.XI.Symbol, {
    InlineForeignKeys
  });
  /** @internal */
  [drizzle_orm_table/* Table */.XI.Symbol.Columns];
  /** @internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [drizzle_orm_table/* Table */.XI.Symbol.ExtraConfigBuilder] = void 0;
}
function mysqlTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new MySqlTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getMySqlColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[drizzle_orm_table/* Table */.XI.Symbol.Columns] = builtColumns;
  table[drizzle_orm_table/* Table */.XI.Symbol.ExtraConfigColumns] = builtColumns;
  if (extraConfig) {
    table[MySqlTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
const mysqlTable = (name, columns, extraConfig) => {
  return mysqlTableWithSchema(name, columns, extraConfig, void 0, name);
};
function mysqlTableCreator(customizeTableName) {
  return (name, columns, extraConfig) => {
    return mysqlTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
  };
}

//# sourceMappingURL=table.js.map

/***/ })

};

//# sourceMappingURL=104.index.js.map