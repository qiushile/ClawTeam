export const id = 377;
export const ids = [377];
export const modules = {

/***/ 3824:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  v: () => (/* binding */ SQLiteColumn),
  o: () => (/* binding */ SQLiteColumnBuilder)
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/column-builder.js
var column_builder = __webpack_require__(5099);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/column.js
var column = __webpack_require__(2345);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(9724);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/table.utils.js
var table_utils = __webpack_require__(7340);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/foreign-keys.js


class ForeignKeyBuilder {
  static [entity/* entityKind */.i] = "SQLiteForeignKeyBuilder";
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
  static [entity/* entityKind */.i] = "SQLiteForeignKey";
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
    if (typeof config === "function") {
      const { name, columns, foreignColumns } = config();
      return {
        name,
        columns,
        foreignColumns
      };
    }
    return config;
  }
  return new ForeignKeyBuilder(mappedConfig);
}

//# sourceMappingURL=foreign-keys.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/unique-constraint.js


function uniqueKeyName(table, columns) {
  return `${table[table_utils/* TableName */.E]}_${columns.join("_")}_unique`;
}
function unique(name) {
  return new UniqueOnConstraintBuilder(name);
}
class UniqueConstraintBuilder {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [entity/* entityKind */.i] = (/* unused pure expression or super */ null && ("SQLiteUniqueConstraintBuilder"));
  /** @internal */
  columns;
  /** @internal */
  build(table) {
    return new UniqueConstraint(table, this.columns, this.name);
  }
}
class UniqueOnConstraintBuilder {
  static [entity/* entityKind */.i] = (/* unused pure expression or super */ null && ("SQLiteUniqueOnConstraintBuilder"));
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
  static [entity/* entityKind */.i] = (/* unused pure expression or super */ null && ("SQLiteUniqueConstraint"));
  columns;
  name;
  getName() {
    return this.name;
  }
}

//# sourceMappingURL=unique-constraint.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/common.js





class SQLiteColumnBuilder extends column_builder/* ColumnBuilder */.Q {
  static [entity/* entityKind */.i] = "SQLiteColumnBuilder";
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
class SQLiteColumn extends column/* Column */.V {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [entity/* entityKind */.i] = "SQLiteColumn";
}

//# sourceMappingURL=common.js.map

/***/ }),

/***/ 6654:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nd: () => (/* binding */ integer)
/* harmony export */ });
/* unused harmony exports SQLiteBaseInteger, SQLiteBaseIntegerBuilder, SQLiteBoolean, SQLiteBooleanBuilder, SQLiteInteger, SQLiteIntegerBuilder, SQLiteTimestamp, SQLiteTimestampBuilder, int */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(183);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3824);




class SQLiteBaseIntegerBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumnBuilder */ .o {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteBaseIntegerBuilder";
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  primaryKey(config) {
    if (config?.autoIncrement) {
      this.config.autoIncrement = true;
    }
    this.config.hasDefault = true;
    return super.primaryKey();
  }
}
class SQLiteBaseInteger extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumn */ .v {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteBaseInteger";
  autoIncrement = this.config.autoIncrement;
  getSQLType() {
    return "integer";
  }
}
class SQLiteIntegerBuilder extends SQLiteBaseIntegerBuilder {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteIntegerBuilder";
  constructor(name) {
    super(name, "number", "SQLiteInteger");
  }
  build(table) {
    return new SQLiteInteger(
      table,
      this.config
    );
  }
}
class SQLiteInteger extends SQLiteBaseInteger {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteInteger";
}
class SQLiteTimestampBuilder extends SQLiteBaseIntegerBuilder {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteTimestampBuilder";
  constructor(name, mode) {
    super(name, "date", "SQLiteTimestamp");
    this.config.mode = mode;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default((0,_sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .sql */ .ll)`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(table) {
    return new SQLiteTimestamp(
      table,
      this.config
    );
  }
}
class SQLiteTimestamp extends SQLiteBaseInteger {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteTimestamp";
  mode = this.config.mode;
  mapFromDriverValue(value) {
    if (this.config.mode === "timestamp") {
      return new Date(value * 1e3);
    }
    return new Date(value);
  }
  mapToDriverValue(value) {
    const unix = value.getTime();
    if (this.config.mode === "timestamp") {
      return Math.floor(unix / 1e3);
    }
    return unix;
  }
}
class SQLiteBooleanBuilder extends SQLiteBaseIntegerBuilder {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteBooleanBuilder";
  constructor(name, mode) {
    super(name, "boolean", "SQLiteBoolean");
    this.config.mode = mode;
  }
  build(table) {
    return new SQLiteBoolean(
      table,
      this.config
    );
  }
}
class SQLiteBoolean extends SQLiteBaseInteger {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteBoolean";
  mode = this.config.mode;
  mapFromDriverValue(value) {
    return Number(value) === 1;
  }
  mapToDriverValue(value) {
    return value ? 1 : 0;
  }
}
function integer(a, b) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__/* .getColumnNameAndConfig */ .Ll)(a, b);
  if (config?.mode === "timestamp" || config?.mode === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config.mode);
  }
  if (config?.mode === "boolean") {
    return new SQLiteBooleanBuilder(name, config.mode);
  }
  return new SQLiteIntegerBuilder(name);
}
const int = (/* unused pure expression or super */ null && (integer));

//# sourceMappingURL=integer.js.map

/***/ }),

/***/ 8470:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   x: () => (/* binding */ real)
/* harmony export */ });
/* unused harmony exports SQLiteReal, SQLiteRealBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3824);


class SQLiteRealBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumnBuilder */ .o {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteRealBuilder";
  constructor(name) {
    super(name, "number", "SQLiteReal");
  }
  /** @internal */
  build(table) {
    return new SQLiteReal(table, this.config);
  }
}
class SQLiteReal extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumn */ .v {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteReal";
  getSQLType() {
    return "real";
  }
}
function real(name) {
  return new SQLiteRealBuilder(name ?? "");
}

//# sourceMappingURL=real.js.map

/***/ }),

/***/ 1513:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Qq: () => (/* binding */ text)
/* harmony export */ });
/* unused harmony exports SQLiteText, SQLiteTextBuilder, SQLiteTextJson, SQLiteTextJsonBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3824);



class SQLiteTextBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumnBuilder */ .o {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteTextBuilder";
  constructor(name, config) {
    super(name, "string", "SQLiteText");
    this.config.enumValues = config.enum;
    this.config.length = config.length;
  }
  /** @internal */
  build(table) {
    return new SQLiteText(table, this.config);
  }
}
class SQLiteText extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumn */ .v {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteText";
  enumValues = this.config.enumValues;
  length = this.config.length;
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}
class SQLiteTextJsonBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumnBuilder */ .o {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteTextJsonBuilder";
  constructor(name) {
    super(name, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(table) {
    return new SQLiteTextJson(
      table,
      this.config
    );
  }
}
class SQLiteTextJson extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .SQLiteColumn */ .v {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "SQLiteTextJson";
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(value) {
    return JSON.parse(value);
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
}
function text(a, b = {}) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .getColumnNameAndConfig */ .Ll)(a, b);
  if (config.mode === "json") {
    return new SQLiteTextJsonBuilder(name);
  }
  return new SQLiteTextBuilder(name, config);
}

//# sourceMappingURL=text.js.map

/***/ }),

/***/ 2084:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  jo: () => (/* binding */ SQLiteTable),
  D: () => (/* binding */ sqliteTable)
});

// UNUSED EXPORTS: InlineForeignKeys, sqliteTableCreator

// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(9724);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/table.js
var drizzle_orm_table = __webpack_require__(8407);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/utils.js
var utils = __webpack_require__(3853);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/common.js + 2 modules
var common = __webpack_require__(3824);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/blob.js



class SQLiteBigIntBuilder extends common/* SQLiteColumnBuilder */.o {
  static [entity/* entityKind */.i] = "SQLiteBigIntBuilder";
  constructor(name) {
    super(name, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(table) {
    return new SQLiteBigInt(table, this.config);
  }
}
class SQLiteBigInt extends common/* SQLiteColumn */.v {
  static [entity/* entityKind */.i] = "SQLiteBigInt";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    return BigInt(Buffer.isBuffer(value) ? value.toString() : String.fromCodePoint(...value));
  }
  mapToDriverValue(value) {
    return Buffer.from(value.toString());
  }
}
class SQLiteBlobJsonBuilder extends common/* SQLiteColumnBuilder */.o {
  static [entity/* entityKind */.i] = "SQLiteBlobJsonBuilder";
  constructor(name) {
    super(name, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(table) {
    return new SQLiteBlobJson(
      table,
      this.config
    );
  }
}
class SQLiteBlobJson extends common/* SQLiteColumn */.v {
  static [entity/* entityKind */.i] = "SQLiteBlobJson";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    return JSON.parse(Buffer.isBuffer(value) ? value.toString() : String.fromCodePoint(...value));
  }
  mapToDriverValue(value) {
    return Buffer.from(JSON.stringify(value));
  }
}
class SQLiteBlobBufferBuilder extends common/* SQLiteColumnBuilder */.o {
  static [entity/* entityKind */.i] = "SQLiteBlobBufferBuilder";
  constructor(name) {
    super(name, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(table) {
    return new SQLiteBlobBuffer(table, this.config);
  }
}
class SQLiteBlobBuffer extends common/* SQLiteColumn */.v {
  static [entity/* entityKind */.i] = "SQLiteBlobBuffer";
  getSQLType() {
    return "blob";
  }
}
function blob(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  if (config?.mode === "json") {
    return new SQLiteBlobJsonBuilder(name);
  }
  if (config?.mode === "bigint") {
    return new SQLiteBigIntBuilder(name);
  }
  return new SQLiteBlobBufferBuilder(name);
}

//# sourceMappingURL=blob.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/custom.js



class SQLiteCustomColumnBuilder extends common/* SQLiteColumnBuilder */.o {
  static [entity/* entityKind */.i] = "SQLiteCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "SQLiteCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new SQLiteCustomColumn(
      table,
      this.config
    );
  }
}
class SQLiteCustomColumn extends common/* SQLiteColumn */.v {
  static [entity/* entityKind */.i] = "SQLiteCustomColumn";
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
    return new SQLiteCustomColumnBuilder(
      name,
      config,
      customTypeParams
    );
  };
}

//# sourceMappingURL=custom.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/integer.js
var integer = __webpack_require__(6654);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/numeric.js


class SQLiteNumericBuilder extends common/* SQLiteColumnBuilder */.o {
  static [entity/* entityKind */.i] = "SQLiteNumericBuilder";
  constructor(name) {
    super(name, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(table) {
    return new SQLiteNumeric(
      table,
      this.config
    );
  }
}
class SQLiteNumeric extends common/* SQLiteColumn */.v {
  static [entity/* entityKind */.i] = "SQLiteNumeric";
  getSQLType() {
    return "numeric";
  }
}
function numeric(name) {
  return new SQLiteNumericBuilder(name ?? "");
}

//# sourceMappingURL=numeric.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/real.js
var real = __webpack_require__(8470);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/text.js
var columns_text = __webpack_require__(1513);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/all.js






function getSQLiteColumnBuilders() {
  return {
    blob: blob,
    customType: customType,
    integer: integer/* integer */.nd,
    numeric: numeric,
    real: real/* real */.x,
    text: columns_text/* text */.Qq
  };
}

//# sourceMappingURL=all.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/table.js



const InlineForeignKeys = Symbol.for("drizzle:SQLiteInlineForeignKeys");
class SQLiteTable extends drizzle_orm_table/* Table */.XI {
  static [entity/* entityKind */.i] = "SQLiteTable";
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
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new SQLiteTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
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
    table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
const sqliteTable = (name, columns, extraConfig) => {
  return sqliteTableBase(name, columns, extraConfig);
};
function sqliteTableCreator(customizeTableName) {
  return (name, columns, extraConfig) => {
    return sqliteTableBase(customizeTableName(name), columns, extraConfig, void 0, name);
  };
}

//# sourceMappingURL=table.js.map

/***/ }),

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

/***/ 1377:
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

// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/table.js + 4 modules
var table = __webpack_require__(2084);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/text.js
var columns_text = __webpack_require__(1513);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(9724);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/indexes.js

class IndexBuilderOn {
  constructor(name, unique) {
    this.name = name;
    this.unique = unique;
  }
  static [entity/* entityKind */.i] = "SQLiteIndexBuilderOn";
  on(...columns) {
    return new IndexBuilder(this.name, columns, this.unique);
  }
}
class IndexBuilder {
  static [entity/* entityKind */.i] = "SQLiteIndexBuilder";
  /** @internal */
  config;
  constructor(name, columns, unique) {
    this.config = {
      name,
      columns,
      unique,
      where: void 0
    };
  }
  /**
   * Condition for partial index.
   */
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
  static [entity/* entityKind */.i] = "SQLiteIndex";
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
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/integer.js
var integer = __webpack_require__(6654);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/sqlite-core/columns/real.js
var real = __webpack_require__(8470);
;// CONCATENATED MODULE: ../../packages/db/dist/schema/sqlite.js

// ─── Settings ─────────────────────────────────────────────────
const settings = (0,table/* sqliteTable */.D)("settings", {
    key: (0,columns_text/* text */.Qq)("key").primaryKey(),
    value: (0,columns_text/* text */.Qq)("value").notNull(),
    updatedAt: (0,columns_text/* text */.Qq)("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});
// ─── Agents ─────────────────────────────────────────────────────
const agents = (0,table/* sqliteTable */.D)("agents", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,columns_text/* text */.Qq)("tenant_id").notNull().default("default"),
    name: (0,columns_text/* text */.Qq)("name").notNull(),
    description: (0,columns_text/* text */.Qq)("description"),
    provider: (0,columns_text/* text */.Qq)("provider").notNull().default("custom"),
    status: (0,columns_text/* text */.Qq)("status").notNull().default("inactive"),
    lastSeenAt: (0,columns_text/* text */.Qq)("last_seen_at"),
    metadata: (0,columns_text/* text */.Qq)("metadata", { mode: "json" }).notNull().default({}),
    createdAt: (0,columns_text/* text */.Qq)("created_at").notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: (0,columns_text/* text */.Qq)("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
    statusIdx: index("idx_agents_status").on(table.status),
    tenantIdIdx: index("idx_agents_tenant_id").on(table.tenantId),
}));
// ─── Scanner Definitions ────────────────────────────────────────
const scannerDefinitions = (0,table/* sqliteTable */.D)("scanner_definitions", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,columns_text/* text */.Qq)("tenant_id").notNull().default("default"),
    scannerId: (0,columns_text/* text */.Qq)("scanner_id").notNull(),
    name: (0,columns_text/* text */.Qq)("name").notNull(),
    description: (0,columns_text/* text */.Qq)("description").notNull(),
    config: (0,columns_text/* text */.Qq)("config", { mode: "json" }).notNull().default({}),
    isEnabled: (0,integer/* integer */.nd)("is_enabled", { mode: "boolean" }).notNull().default(true),
    isDefault: (0,integer/* integer */.nd)("is_default", { mode: "boolean" }).notNull().default(false),
}, (table) => ({
    scannerIdIdx: index("idx_scanner_defs_scanner_id").on(table.scannerId),
    tenantIdIdx: index("idx_scanner_defs_tenant_id").on(table.tenantId),
}));
// ─── Policies ───────────────────────────────────────────────────
const policies = (0,table/* sqliteTable */.D)("policies", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,columns_text/* text */.Qq)("tenant_id").notNull().default("default"),
    name: (0,columns_text/* text */.Qq)("name").notNull(),
    description: (0,columns_text/* text */.Qq)("description"),
    scannerIds: (0,columns_text/* text */.Qq)("scanner_ids", { mode: "json" }).notNull().default([]),
    action: (0,columns_text/* text */.Qq)("action").notNull().default("log"),
    sensitivityThreshold: (0,real/* real */.x)("sensitivity_threshold").notNull().default(0.5),
    isEnabled: (0,integer/* integer */.nd)("is_enabled", { mode: "boolean" }).notNull().default(true),
    createdAt: (0,columns_text/* text */.Qq)("created_at").notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: (0,columns_text/* text */.Qq)("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
    tenantIdIdx: index("idx_policies_tenant_id").on(table.tenantId),
}));
// ─── Usage Logs ─────────────────────────────────────────────────
const usageLogs = (0,table/* sqliteTable */.D)("usage_logs", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,columns_text/* text */.Qq)("tenant_id").notNull().default("default"),
    agentId: (0,columns_text/* text */.Qq)("agent_id"),
    endpoint: (0,columns_text/* text */.Qq)("endpoint").notNull(),
    statusCode: (0,integer/* integer */.nd)("status_code").notNull(),
    responseSafe: (0,integer/* integer */.nd)("response_safe", { mode: "boolean" }),
    categories: (0,columns_text/* text */.Qq)("categories", { mode: "json" }).notNull().default([]),
    latencyMs: (0,integer/* integer */.nd)("latency_ms").notNull(),
    requestId: (0,columns_text/* text */.Qq)("request_id").notNull(),
    createdAt: (0,columns_text/* text */.Qq)("created_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
    agentIdIdx: index("idx_usage_logs_agent_id").on(table.agentId),
    createdAtIdx: index("idx_usage_logs_created_at").on(table.createdAt),
    tenantIdIdx: index("idx_usage_logs_tenant_id").on(table.tenantId),
}));
// ─── Detection Results ──────────────────────────────────────────
const detectionResults = (0,table/* sqliteTable */.D)("detection_results", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,columns_text/* text */.Qq)("tenant_id").notNull().default("default"),
    agentId: (0,columns_text/* text */.Qq)("agent_id"),
    safe: (0,integer/* integer */.nd)("safe", { mode: "boolean" }).notNull(),
    categories: (0,columns_text/* text */.Qq)("categories", { mode: "json" }).notNull().default([]),
    sensitivityScore: (0,real/* real */.x)("sensitivity_score").notNull().default(0),
    findings: (0,columns_text/* text */.Qq)("findings", { mode: "json" }).notNull().default([]),
    latencyMs: (0,integer/* integer */.nd)("latency_ms").notNull(),
    requestId: (0,columns_text/* text */.Qq)("request_id").notNull(),
    // Static scan fields
    scanType: (0,columns_text/* text */.Qq)("scan_type").notNull().default("dynamic"), // "static" or "dynamic"
    filePath: (0,columns_text/* text */.Qq)("file_path"), // Relative path from workspace for static scans
    fileType: (0,columns_text/* text */.Qq)("file_type"), // "soul", "agent", "memory", "task", "skill", "plugin", "other"
    createdAt: (0,columns_text/* text */.Qq)("created_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
    agentIdIdx: index("idx_detection_results_agent_id").on(table.agentId),
    createdAtIdx: index("idx_detection_results_created_at").on(table.createdAt),
    tenantIdIdx: index("idx_detection_results_tenant_id").on(table.tenantId),
    scanTypeIdx: index("idx_detection_results_scan_type").on(table.scanType),
}));
// ─── Tool Call Observations ─────────────────────────────────────
const toolCallObservations = (0,table/* sqliteTable */.D)("tool_call_observations", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,columns_text/* text */.Qq)("tenant_id").notNull().default("default"),
    agentId: (0,columns_text/* text */.Qq)("agent_id").notNull(),
    sessionKey: (0,columns_text/* text */.Qq)("session_key"),
    toolName: (0,columns_text/* text */.Qq)("tool_name").notNull(),
    category: (0,columns_text/* text */.Qq)("category"),
    accessPattern: (0,columns_text/* text */.Qq)("access_pattern"),
    paramsJson: (0,columns_text/* text */.Qq)("params_json", { mode: "json" }),
    phase: (0,columns_text/* text */.Qq)("phase").notNull(),
    resultJson: (0,columns_text/* text */.Qq)("result_json", { mode: "json" }),
    error: (0,columns_text/* text */.Qq)("error"),
    durationMs: (0,integer/* integer */.nd)("duration_ms"),
    blocked: (0,integer/* integer */.nd)("blocked", { mode: "boolean" }).notNull().default(false),
    blockReason: (0,columns_text/* text */.Qq)("block_reason"),
    timestamp: (0,columns_text/* text */.Qq)("timestamp").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
    agentIdIdx: index("idx_tool_obs_agent_id").on(table.agentId),
    toolNameIdx: index("idx_tool_obs_tool_name").on(table.toolName),
    timestampIdx: index("idx_tool_obs_timestamp").on(table.timestamp),
    tenantIdIdx: index("idx_tool_obs_tenant_id").on(table.tenantId),
}));
// ─── Magic Links ─────────────────────────────────────────────
// One-time login tokens sent via email (15-min TTL)
const magicLinks = (0,table/* sqliteTable */.D)("magic_links", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: (0,columns_text/* text */.Qq)("email").notNull(),
    token: (0,columns_text/* text */.Qq)("token").notNull().unique(),
    expiresAt: (0,columns_text/* text */.Qq)("expires_at").notNull(),
    usedAt: (0,columns_text/* text */.Qq)("used_at"),
    createdAt: (0,columns_text/* text */.Qq)("created_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
    tokenIdx: index("idx_magic_links_token").on(table.token),
    emailIdx: index("idx_magic_links_email").on(table.email),
}));
// ─── User Sessions ────────────────────────────────────────────
// Persistent sessions created after magic link verification (30-day TTL)
const userSessions = (0,table/* sqliteTable */.D)("user_sessions", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: (0,columns_text/* text */.Qq)("email").notNull(),
    token: (0,columns_text/* text */.Qq)("token").notNull().unique(),
    expiresAt: (0,columns_text/* text */.Qq)("expires_at").notNull(),
    createdAt: (0,columns_text/* text */.Qq)("created_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
    tokenIdx: index("idx_user_sessions_token").on(table.token),
    emailIdx: index("idx_user_sessions_email").on(table.email),
}));
// ─── Gateway Activity ─────────────────────────────────────────
// Records of gateway sanitization and restoration events
const gatewayActivity = (0,table/* sqliteTable */.D)("gateway_activity", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,columns_text/* text */.Qq)("tenant_id").notNull().default("default"),
    eventId: (0,columns_text/* text */.Qq)("event_id").notNull(), // From gateway: gw-timestamp-counter-type
    requestId: (0,columns_text/* text */.Qq)("request_id").notNull(), // gw-timestamp-counter
    timestamp: (0,columns_text/* text */.Qq)("timestamp").notNull(),
    type: (0,columns_text/* text */.Qq)("type").notNull(), // "sanitize" or "restore"
    direction: (0,columns_text/* text */.Qq)("direction").notNull(), // "request" or "response"
    backend: (0,columns_text/* text */.Qq)("backend").notNull(), // "openai", "anthropic", "gemini"
    endpoint: (0,columns_text/* text */.Qq)("endpoint").notNull(), // e.g., "/v1/chat/completions"
    model: (0,columns_text/* text */.Qq)("model"),
    redactionCount: (0,integer/* integer */.nd)("redaction_count").notNull().default(0),
    categories: (0,columns_text/* text */.Qq)("categories", { mode: "json" }).notNull().default({}), // { email: 2, secret: 1 }
    durationMs: (0,integer/* integer */.nd)("duration_ms"),
    createdAt: (0,columns_text/* text */.Qq)("created_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
    requestIdIdx: index("idx_gateway_activity_request_id").on(table.requestId),
    timestampIdx: index("idx_gateway_activity_timestamp").on(table.timestamp),
    typeIdx: index("idx_gateway_activity_type").on(table.type),
    tenantIdIdx: index("idx_gateway_activity_tenant_id").on(table.tenantId),
}));
// ─── Agent Permissions ────────────────────────────────────────
const agentPermissions = (0,table/* sqliteTable */.D)("agent_permissions", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,columns_text/* text */.Qq)("tenant_id").notNull().default("default"),
    agentId: (0,columns_text/* text */.Qq)("agent_id").notNull(),
    toolName: (0,columns_text/* text */.Qq)("tool_name").notNull(),
    category: (0,columns_text/* text */.Qq)("category"),
    accessPattern: (0,columns_text/* text */.Qq)("access_pattern"),
    targetsJson: (0,columns_text/* text */.Qq)("targets_json", { mode: "json" }).notNull().default([]),
    callCount: (0,integer/* integer */.nd)("call_count").notNull().default(0),
    errorCount: (0,integer/* integer */.nd)("error_count").notNull().default(0),
    firstSeen: (0,columns_text/* text */.Qq)("first_seen").notNull().$defaultFn(() => new Date().toISOString()),
    lastSeen: (0,columns_text/* text */.Qq)("last_seen").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
    agentIdIdx: index("idx_agent_perms_agent_id").on(table.agentId),
    toolNameIdx: index("idx_agent_perms_tool_name").on(table.toolName),
    tenantIdIdx: index("idx_agent_perms_tenant_id").on(table.tenantId),
    uniqueAgentTool: index("idx_agent_perms_unique").on(table.tenantId, table.agentId, table.toolName),
}));
// ─── Agentic Hours ──────────────────────────────────────────────
// Daily aggregated duration metrics per agent
const agenticHoursLocal = (0,table/* sqliteTable */.D)("agentic_hours_local", {
    id: (0,columns_text/* text */.Qq)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: (0,columns_text/* text */.Qq)("tenant_id").notNull().default("default"),
    agentId: (0,columns_text/* text */.Qq)("agent_id").notNull(),
    date: (0,columns_text/* text */.Qq)("date").notNull(), // YYYY-MM-DD
    toolCallDurationMs: (0,integer/* integer */.nd)("tool_call_duration_ms").notNull().default(0),
    llmDurationMs: (0,integer/* integer */.nd)("llm_duration_ms").notNull().default(0),
    totalDurationMs: (0,integer/* integer */.nd)("total_duration_ms").notNull().default(0),
    toolCallCount: (0,integer/* integer */.nd)("tool_call_count").notNull().default(0),
    llmCallCount: (0,integer/* integer */.nd)("llm_call_count").notNull().default(0),
    sessionCount: (0,integer/* integer */.nd)("session_count").notNull().default(0),
    blockCount: (0,integer/* integer */.nd)("block_count").notNull().default(0),
    riskEventCount: (0,integer/* integer */.nd)("risk_event_count").notNull().default(0),
    createdAt: (0,columns_text/* text */.Qq)("created_at").notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: (0,columns_text/* text */.Qq)("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => ({
    agentDateIdx: index("idx_agentic_hours_agent_date").on(table.tenantId, table.agentId, table.date),
    tenantDateIdx: index("idx_agentic_hours_tenant_date").on(table.tenantId, table.date),
}));
//# sourceMappingURL=sqlite.js.map

/***/ })

};

//# sourceMappingURL=377.index.js.map