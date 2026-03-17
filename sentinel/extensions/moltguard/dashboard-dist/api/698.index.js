export const id = 698;
export const ids = [698];
export const modules = {

/***/ 1419:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   zM: () => (/* binding */ boolean)
/* harmony export */ });
/* unused harmony exports PgBoolean, PgBooleanBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2414);


class PgBooleanBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumnBuilder */ .pe {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "PgBoolean");
  }
  /** @internal */
  build(table) {
    return new PgBoolean(table, this.config);
  }
}
class PgBoolean extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgBoolean";
  getSQLType() {
    return "boolean";
  }
}
function boolean(name) {
  return new PgBooleanBuilder(name ?? "");
}

//# sourceMappingURL=boolean.js.map

/***/ }),

/***/ 52:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   u: () => (/* binding */ PgDateColumnBaseBuilder)
/* harmony export */ });
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(183);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2414);



class PgDateColumnBaseBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumnBuilder */ .pe {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgDateColumnBaseBuilder";
  defaultNow() {
    return this.default((0,_sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .sql */ .ll)`now()`);
  }
}

//# sourceMappingURL=date.common.js.map

/***/ }),

/***/ 763:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dw: () => (/* binding */ PgDateString),
/* harmony export */   p6: () => (/* binding */ date),
/* harmony export */   qw: () => (/* binding */ PgDate)
/* harmony export */ });
/* unused harmony exports PgDateBuilder, PgDateStringBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2414);
/* harmony import */ var _date_common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52);




class PgDateBuilder extends _date_common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgDateColumnBaseBuilder */ .u {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgDateBuilder";
  constructor(name) {
    super(name, "date", "PgDate");
  }
  /** @internal */
  build(table) {
    return new PgDate(table, this.config);
  }
}
class PgDate extends _common_js__WEBPACK_IMPORTED_MODULE_2__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgDate";
  getSQLType() {
    return "date";
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
  mapToDriverValue(value) {
    return value.toISOString();
  }
}
class PgDateStringBuilder extends _date_common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgDateColumnBaseBuilder */ .u {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgDateStringBuilder";
  constructor(name) {
    super(name, "string", "PgDateString");
  }
  /** @internal */
  build(table) {
    return new PgDateString(
      table,
      this.config
    );
  }
}
class PgDateString extends _common_js__WEBPACK_IMPORTED_MODULE_2__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgDateString";
  getSQLType() {
    return "date";
  }
}
function date(a, b) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__/* .getColumnNameAndConfig */ .Ll)(a, b);
  if (config?.mode === "date") {
    return new PgDateBuilder(name);
  }
  return new PgDateStringBuilder(name);
}

//# sourceMappingURL=date.js.map

/***/ }),

/***/ 8683:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ PgIntColumnBaseBuilder)
/* harmony export */ });
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2414);


class PgIntColumnBaseBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumnBuilder */ .pe {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgIntColumnBaseBuilder";
  generatedAlwaysAsIdentity(sequence) {
    if (sequence) {
      const { name, ...options } = sequence;
      this.config.generatedIdentity = {
        type: "always",
        sequenceName: name,
        sequenceOptions: options
      };
    } else {
      this.config.generatedIdentity = {
        type: "always"
      };
    }
    this.config.hasDefault = true;
    this.config.notNull = true;
    return this;
  }
  generatedByDefaultAsIdentity(sequence) {
    if (sequence) {
      const { name, ...options } = sequence;
      this.config.generatedIdentity = {
        type: "byDefault",
        sequenceName: name,
        sequenceOptions: options
      };
    } else {
      this.config.generatedIdentity = {
        type: "byDefault"
      };
    }
    this.config.hasDefault = true;
    this.config.notNull = true;
    return this;
  }
}

//# sourceMappingURL=int.common.js.map

/***/ }),

/***/ 2917:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nd: () => (/* binding */ integer)
/* harmony export */ });
/* unused harmony exports PgInteger, PgIntegerBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2414);
/* harmony import */ var _int_common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8683);



class PgIntegerBuilder extends _int_common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgIntColumnBaseBuilder */ .p {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgIntegerBuilder";
  constructor(name) {
    super(name, "number", "PgInteger");
  }
  /** @internal */
  build(table) {
    return new PgInteger(table, this.config);
  }
}
class PgInteger extends _common_js__WEBPACK_IMPORTED_MODULE_2__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgInteger";
  getSQLType() {
    return "integer";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseInt(value);
    }
    return value;
  }
}
function integer(name) {
  return new PgIntegerBuilder(name ?? "");
}

//# sourceMappingURL=integer.js.map

/***/ }),

/***/ 6077:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Pq: () => (/* binding */ json),
/* harmony export */   iX: () => (/* binding */ PgJson)
/* harmony export */ });
/* unused harmony export PgJsonBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2414);


class PgJsonBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumnBuilder */ .pe {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgJsonBuilder";
  constructor(name) {
    super(name, "json", "PgJson");
  }
  /** @internal */
  build(table) {
    return new PgJson(table, this.config);
  }
}
class PgJson extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgJson";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "json";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
}
function json(name) {
  return new PgJsonBuilder(name ?? "");
}

//# sourceMappingURL=json.js.map

/***/ }),

/***/ 1343:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fx: () => (/* binding */ jsonb),
/* harmony export */   kn: () => (/* binding */ PgJsonb)
/* harmony export */ });
/* unused harmony export PgJsonbBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2414);


class PgJsonbBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumnBuilder */ .pe {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgJsonbBuilder";
  constructor(name) {
    super(name, "json", "PgJsonb");
  }
  /** @internal */
  build(table) {
    return new PgJsonb(table, this.config);
  }
}
class PgJsonb extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgJsonb";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "jsonb";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
}
function jsonb(name) {
  return new PgJsonbBuilder(name ?? "");
}

//# sourceMappingURL=jsonb.js.map

/***/ }),

/***/ 5584:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z5: () => (/* binding */ PgNumeric),
/* harmony export */   sH: () => (/* binding */ numeric)
/* harmony export */ });
/* unused harmony exports PgNumericBuilder, decimal */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2414);



class PgNumericBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumnBuilder */ .pe {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgNumericBuilder";
  constructor(name, precision, scale) {
    super(name, "string", "PgNumeric");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  /** @internal */
  build(table) {
    return new PgNumeric(table, this.config);
  }
}
class PgNumeric extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgNumeric";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `numeric(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "numeric";
    } else {
      return `numeric(${this.precision})`;
    }
  }
}
function numeric(a, b) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .getColumnNameAndConfig */ .Ll)(a, b);
  return new PgNumericBuilder(name, config?.precision, config?.scale);
}
const decimal = (/* unused pure expression or super */ null && (numeric));

//# sourceMappingURL=numeric.js.map

/***/ }),

/***/ 7483:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   x: () => (/* binding */ real)
/* harmony export */ });
/* unused harmony exports PgReal, PgRealBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2414);


class PgRealBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumnBuilder */ .pe {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgRealBuilder";
  constructor(name, length) {
    super(name, "number", "PgReal");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new PgReal(table, this.config);
  }
}
class PgReal extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgReal";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "real";
  }
  mapFromDriverValue = (value) => {
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    return value;
  };
}
function real(name) {
  return new PgRealBuilder(name ?? "");
}

//# sourceMappingURL=real.js.map

/***/ }),

/***/ 3524:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Qq: () => (/* binding */ text)
/* harmony export */ });
/* unused harmony exports PgText, PgTextBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2414);



class PgTextBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumnBuilder */ .pe {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgTextBuilder";
  constructor(name, config) {
    super(name, "string", "PgText");
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgText(table, this.config);
  }
}
class PgText extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgText";
  enumValues = this.config.enumValues;
  getSQLType() {
    return "text";
  }
}
function text(a, b = {}) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .getColumnNameAndConfig */ .Ll)(a, b);
  return new PgTextBuilder(name, config);
}

//# sourceMappingURL=text.js.map

/***/ }),

/***/ 1810:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Xd: () => (/* binding */ PgTime),
/* harmony export */   kB: () => (/* binding */ time)
/* harmony export */ });
/* unused harmony export PgTimeBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2414);
/* harmony import */ var _date_common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52);




class PgTimeBuilder extends _date_common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgDateColumnBaseBuilder */ .u {
  constructor(name, withTimezone, precision) {
    super(name, "string", "PgTime");
    this.withTimezone = withTimezone;
    this.precision = precision;
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgTimeBuilder";
  /** @internal */
  build(table) {
    return new PgTime(table, this.config);
  }
}
class PgTime extends _common_js__WEBPACK_IMPORTED_MODULE_2__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgTime";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : `(${this.precision})`;
    return `time${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
}
function time(a, b = {}) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__/* .getColumnNameAndConfig */ .Ll)(a, b);
  return new PgTimeBuilder(name, config.withTimezone ?? false, config.precision);
}

//# sourceMappingURL=time.js.map

/***/ }),

/***/ 8631:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KM: () => (/* binding */ PgTimestamp),
/* harmony export */   vE: () => (/* binding */ timestamp),
/* harmony export */   xQ: () => (/* binding */ PgTimestampString)
/* harmony export */ });
/* unused harmony exports PgTimestampBuilder, PgTimestampStringBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2414);
/* harmony import */ var _date_common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52);




class PgTimestampBuilder extends _date_common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgDateColumnBaseBuilder */ .u {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgTimestampBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "date", "PgTimestamp");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTimestamp(table, this.config);
  }
}
class PgTimestamp extends _common_js__WEBPACK_IMPORTED_MODULE_2__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgTimestamp";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : ` (${this.precision})`;
    return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
  mapFromDriverValue = (value) => {
    return new Date(this.withTimezone ? value : value + "+0000");
  };
  mapToDriverValue = (value) => {
    return value.toISOString();
  };
}
class PgTimestampStringBuilder extends _date_common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgDateColumnBaseBuilder */ .u {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgTimestampStringBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "string", "PgTimestampString");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTimestampString(
      table,
      this.config
    );
  }
}
class PgTimestampString extends _common_js__WEBPACK_IMPORTED_MODULE_2__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgTimestampString";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : `(${this.precision})`;
    return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
}
function timestamp(a, b = {}) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__/* .getColumnNameAndConfig */ .Ll)(a, b);
  if (config?.mode === "string") {
    return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
  }
  return new PgTimestampBuilder(name, config?.withTimezone ?? false, config?.precision);
}

//# sourceMappingURL=timestamp.js.map

/***/ }),

/***/ 1848:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dL: () => (/* binding */ PgUUID),
/* harmony export */   uR: () => (/* binding */ uuid)
/* harmony export */ });
/* unused harmony export PgUUIDBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _sql_sql_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(183);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2414);



class PgUUIDBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumnBuilder */ .pe {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgUUIDBuilder";
  constructor(name) {
    super(name, "string", "PgUUID");
  }
  /**
   * Adds `default gen_random_uuid()` to the column definition.
   */
  defaultRandom() {
    return this.default((0,_sql_sql_js__WEBPACK_IMPORTED_MODULE_2__/* .sql */ .ll)`gen_random_uuid()`);
  }
  /** @internal */
  build(table) {
    return new PgUUID(table, this.config);
  }
}
class PgUUID extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgUUID";
  getSQLType() {
    return "uuid";
  }
}
function uuid(name) {
  return new PgUUIDBuilder(name ?? "");
}

//# sourceMappingURL=uuid.js.map

/***/ }),

/***/ 890:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   yf: () => (/* binding */ varchar)
/* harmony export */ });
/* unused harmony exports PgVarchar, PgVarcharBuilder */
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9724);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3853);
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2414);



class PgVarcharBuilder extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumnBuilder */ .pe {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgVarcharBuilder";
  constructor(name, config) {
    super(name, "string", "PgVarchar");
    this.config.length = config.length;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgVarchar(table, this.config);
  }
}
class PgVarchar extends _common_js__WEBPACK_IMPORTED_MODULE_0__/* .PgColumn */ .Kl {
  static [_entity_js__WEBPACK_IMPORTED_MODULE_1__/* .entityKind */ .i] = "PgVarchar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
  }
}
function varchar(a, b = {}) {
  const { name, config } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .getColumnNameAndConfig */ .Ll)(a, b);
  return new PgVarcharBuilder(name, config);
}

//# sourceMappingURL=varchar.js.map

/***/ }),

/***/ 698:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  mu: () => (/* binding */ PgTable),
  cJ: () => (/* binding */ pgTable)
});

// UNUSED EXPORTS: EnableRLS, InlineForeignKeys, pgTableCreator, pgTableWithSchema

// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/entity.js
var entity = __webpack_require__(9724);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/table.js
var drizzle_orm_table = __webpack_require__(8407);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/utils.js
var utils = __webpack_require__(3853);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/common.js + 3 modules
var common = __webpack_require__(2414);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/int.common.js
var int_common = __webpack_require__(8683);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/bigint.js




class PgBigInt53Builder extends int_common/* PgIntColumnBaseBuilder */.p {
  static [entity/* entityKind */.i] = "PgBigInt53Builder";
  constructor(name) {
    super(name, "number", "PgBigInt53");
  }
  /** @internal */
  build(table) {
    return new PgBigInt53(table, this.config);
  }
}
class PgBigInt53 extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgBigInt53";
  getSQLType() {
    return "bigint";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
}
class PgBigInt64Builder extends int_common/* PgIntColumnBaseBuilder */.p {
  static [entity/* entityKind */.i] = "PgBigInt64Builder";
  constructor(name) {
    super(name, "bigint", "PgBigInt64");
  }
  /** @internal */
  build(table) {
    return new PgBigInt64(
      table,
      this.config
    );
  }
}
class PgBigInt64 extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgBigInt64";
  getSQLType() {
    return "bigint";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
}
function bigint(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  if (config.mode === "number") {
    return new PgBigInt53Builder(name);
  }
  return new PgBigInt64Builder(name);
}

//# sourceMappingURL=bigint.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/bigserial.js



class PgBigSerial53Builder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgBigSerial53Builder";
  constructor(name) {
    super(name, "number", "PgBigSerial53");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgBigSerial53(
      table,
      this.config
    );
  }
}
class PgBigSerial53 extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgBigSerial53";
  getSQLType() {
    return "bigserial";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
}
class PgBigSerial64Builder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgBigSerial64Builder";
  constructor(name) {
    super(name, "bigint", "PgBigSerial64");
    this.config.hasDefault = true;
  }
  /** @internal */
  build(table) {
    return new PgBigSerial64(
      table,
      this.config
    );
  }
}
class PgBigSerial64 extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgBigSerial64";
  getSQLType() {
    return "bigserial";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
}
function bigserial(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  if (config.mode === "number") {
    return new PgBigSerial53Builder(name);
  }
  return new PgBigSerial64Builder(name);
}

//# sourceMappingURL=bigserial.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/boolean.js
var columns_boolean = __webpack_require__(1419);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/char.js



class PgCharBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgCharBuilder";
  constructor(name, config) {
    super(name, "string", "PgChar");
    this.config.length = config.length;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgChar(table, this.config);
  }
}
class PgChar extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgChar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
}
function char_char(a, b = {}) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new PgCharBuilder(name, config);
}

//# sourceMappingURL=char.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/cidr.js


class PgCidrBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgCidrBuilder";
  constructor(name) {
    super(name, "string", "PgCidr");
  }
  /** @internal */
  build(table) {
    return new PgCidr(table, this.config);
  }
}
class PgCidr extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgCidr";
  getSQLType() {
    return "cidr";
  }
}
function cidr(name) {
  return new PgCidrBuilder(name ?? "");
}

//# sourceMappingURL=cidr.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/custom.js



class PgCustomColumnBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "PgCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new PgCustomColumn(
      table,
      this.config
    );
  }
}
class PgCustomColumn extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgCustomColumn";
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
    return new PgCustomColumnBuilder(name, config, customTypeParams);
  };
}

//# sourceMappingURL=custom.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/date.js
var date = __webpack_require__(763);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/double-precision.js


class PgDoublePrecisionBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgDoublePrecisionBuilder";
  constructor(name) {
    super(name, "number", "PgDoublePrecision");
  }
  /** @internal */
  build(table) {
    return new PgDoublePrecision(
      table,
      this.config
    );
  }
}
class PgDoublePrecision extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgDoublePrecision";
  getSQLType() {
    return "double precision";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    return value;
  }
}
function doublePrecision(name) {
  return new PgDoublePrecisionBuilder(name ?? "");
}

//# sourceMappingURL=double-precision.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/inet.js


class PgInetBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgInetBuilder";
  constructor(name) {
    super(name, "string", "PgInet");
  }
  /** @internal */
  build(table) {
    return new PgInet(table, this.config);
  }
}
class PgInet extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgInet";
  getSQLType() {
    return "inet";
  }
}
function inet(name) {
  return new PgInetBuilder(name ?? "");
}

//# sourceMappingURL=inet.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/integer.js
var integer = __webpack_require__(2917);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/interval.js



class PgIntervalBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgIntervalBuilder";
  constructor(name, intervalConfig) {
    super(name, "string", "PgInterval");
    this.config.intervalConfig = intervalConfig;
  }
  /** @internal */
  build(table) {
    return new PgInterval(table, this.config);
  }
}
class PgInterval extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgInterval";
  fields = this.config.intervalConfig.fields;
  precision = this.config.intervalConfig.precision;
  getSQLType() {
    const fields = this.fields ? ` ${this.fields}` : "";
    const precision = this.precision ? `(${this.precision})` : "";
    return `interval${fields}${precision}`;
  }
}
function interval(a, b = {}) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new PgIntervalBuilder(name, config);
}

//# sourceMappingURL=interval.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/json.js
var json = __webpack_require__(6077);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/jsonb.js
var jsonb = __webpack_require__(1343);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/line.js



class PgLineBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgLineBuilder";
  constructor(name) {
    super(name, "array", "PgLine");
  }
  /** @internal */
  build(table) {
    return new PgLineTuple(
      table,
      this.config
    );
  }
}
class PgLineTuple extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgLine";
  getSQLType() {
    return "line";
  }
  mapFromDriverValue(value) {
    const [a, b, c] = value.slice(1, -1).split(",");
    return [Number.parseFloat(a), Number.parseFloat(b), Number.parseFloat(c)];
  }
  mapToDriverValue(value) {
    return `{${value[0]},${value[1]},${value[2]}}`;
  }
}
class PgLineABCBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgLineABCBuilder";
  constructor(name) {
    super(name, "json", "PgLineABC");
  }
  /** @internal */
  build(table) {
    return new PgLineABC(
      table,
      this.config
    );
  }
}
class PgLineABC extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgLineABC";
  getSQLType() {
    return "line";
  }
  mapFromDriverValue(value) {
    const [a, b, c] = value.slice(1, -1).split(",");
    return { a: Number.parseFloat(a), b: Number.parseFloat(b), c: Number.parseFloat(c) };
  }
  mapToDriverValue(value) {
    return `{${value.a},${value.b},${value.c}}`;
  }
}
function line(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  if (!config?.mode || config.mode === "tuple") {
    return new PgLineBuilder(name);
  }
  return new PgLineABCBuilder(name);
}

//# sourceMappingURL=line.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/macaddr.js


class PgMacaddrBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgMacaddrBuilder";
  constructor(name) {
    super(name, "string", "PgMacaddr");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr(table, this.config);
  }
}
class PgMacaddr extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgMacaddr";
  getSQLType() {
    return "macaddr";
  }
}
function macaddr(name) {
  return new PgMacaddrBuilder(name ?? "");
}

//# sourceMappingURL=macaddr.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/macaddr8.js


class PgMacaddr8Builder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgMacaddr8Builder";
  constructor(name) {
    super(name, "string", "PgMacaddr8");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr8(table, this.config);
  }
}
class PgMacaddr8 extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgMacaddr8";
  getSQLType() {
    return "macaddr8";
  }
}
function macaddr8(name) {
  return new PgMacaddr8Builder(name ?? "");
}

//# sourceMappingURL=macaddr8.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/numeric.js
var numeric = __webpack_require__(5584);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/point.js



class PgPointTupleBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgPointTupleBuilder";
  constructor(name) {
    super(name, "array", "PgPointTuple");
  }
  /** @internal */
  build(table) {
    return new PgPointTuple(
      table,
      this.config
    );
  }
}
class PgPointTuple extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgPointTuple";
  getSQLType() {
    return "point";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      const [x, y] = value.slice(1, -1).split(",");
      return [Number.parseFloat(x), Number.parseFloat(y)];
    }
    return [value.x, value.y];
  }
  mapToDriverValue(value) {
    return `(${value[0]},${value[1]})`;
  }
}
class PgPointObjectBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgPointObjectBuilder";
  constructor(name) {
    super(name, "json", "PgPointObject");
  }
  /** @internal */
  build(table) {
    return new PgPointObject(
      table,
      this.config
    );
  }
}
class PgPointObject extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgPointObject";
  getSQLType() {
    return "point";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      const [x, y] = value.slice(1, -1).split(",");
      return { x: Number.parseFloat(x), y: Number.parseFloat(y) };
    }
    return value;
  }
  mapToDriverValue(value) {
    return `(${value.x},${value.y})`;
  }
}
function point(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  if (!config?.mode || config.mode === "tuple") {
    return new PgPointTupleBuilder(name);
  }
  return new PgPointObjectBuilder(name);
}

//# sourceMappingURL=point.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.js
function hexToBytes(hex) {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(Number.parseInt(hex.slice(c, c + 2), 16));
  }
  return new Uint8Array(bytes);
}
function bytesToFloat64(bytes, offset) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  for (let i = 0; i < 8; i++) {
    view.setUint8(i, bytes[offset + i]);
  }
  return view.getFloat64(0, true);
}
function parseEWKB(hex) {
  const bytes = hexToBytes(hex);
  let offset = 0;
  const byteOrder = bytes[offset];
  offset += 1;
  const view = new DataView(bytes.buffer);
  const geomType = view.getUint32(offset, byteOrder === 1);
  offset += 4;
  let _srid;
  if (geomType & 536870912) {
    _srid = view.getUint32(offset, byteOrder === 1);
    offset += 4;
  }
  if ((geomType & 65535) === 1) {
    const x = bytesToFloat64(bytes, offset);
    offset += 8;
    const y = bytesToFloat64(bytes, offset);
    offset += 8;
    return [x, y];
  }
  throw new Error("Unsupported geometry type");
}

//# sourceMappingURL=utils.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.js




class PgGeometryBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgGeometryBuilder";
  constructor(name) {
    super(name, "array", "PgGeometry");
  }
  /** @internal */
  build(table) {
    return new PgGeometry(
      table,
      this.config
    );
  }
}
class PgGeometry extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgGeometry";
  getSQLType() {
    return "geometry(point)";
  }
  mapFromDriverValue(value) {
    return parseEWKB(value);
  }
  mapToDriverValue(value) {
    return `point(${value[0]} ${value[1]})`;
  }
}
class PgGeometryObjectBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgGeometryObjectBuilder";
  constructor(name) {
    super(name, "json", "PgGeometryObject");
  }
  /** @internal */
  build(table) {
    return new PgGeometryObject(
      table,
      this.config
    );
  }
}
class PgGeometryObject extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgGeometryObject";
  getSQLType() {
    return "geometry(point)";
  }
  mapFromDriverValue(value) {
    const parsed = parseEWKB(value);
    return { x: parsed[0], y: parsed[1] };
  }
  mapToDriverValue(value) {
    return `point(${value.x} ${value.y})`;
  }
}
function geometry(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  if (!config?.mode || config.mode === "tuple") {
    return new PgGeometryBuilder(name);
  }
  return new PgGeometryObjectBuilder(name);
}

//# sourceMappingURL=geometry.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/real.js
var real = __webpack_require__(7483);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/serial.js


class PgSerialBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSerial(table, this.config);
  }
}
class PgSerial extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgSerial";
  getSQLType() {
    return "serial";
  }
}
function serial(name) {
  return new PgSerialBuilder(name ?? "");
}

//# sourceMappingURL=serial.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/smallint.js



class PgSmallIntBuilder extends int_common/* PgIntColumnBaseBuilder */.p {
  static [entity/* entityKind */.i] = "PgSmallIntBuilder";
  constructor(name) {
    super(name, "number", "PgSmallInt");
  }
  /** @internal */
  build(table) {
    return new PgSmallInt(table, this.config);
  }
}
class PgSmallInt extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgSmallInt";
  getSQLType() {
    return "smallint";
  }
  mapFromDriverValue = (value) => {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  };
}
function smallint(name) {
  return new PgSmallIntBuilder(name ?? "");
}

//# sourceMappingURL=smallint.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/smallserial.js


class PgSmallSerialBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgSmallSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSmallSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSmallSerial(
      table,
      this.config
    );
  }
}
class PgSmallSerial extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgSmallSerial";
  getSQLType() {
    return "smallserial";
  }
}
function smallserial(name) {
  return new PgSmallSerialBuilder(name ?? "");
}

//# sourceMappingURL=smallserial.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/text.js
var columns_text = __webpack_require__(3524);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/time.js
var time = __webpack_require__(1810);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/timestamp.js
var timestamp = __webpack_require__(8631);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/uuid.js
var uuid = __webpack_require__(1848);
// EXTERNAL MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/varchar.js
var varchar = __webpack_require__(890);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.js



class PgBinaryVectorBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgBinaryVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgBinaryVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgBinaryVector(
      table,
      this.config
    );
  }
}
class PgBinaryVector extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgBinaryVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `bit(${this.dimensions})`;
  }
}
function bit(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new PgBinaryVectorBuilder(name, config);
}

//# sourceMappingURL=bit.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.js



class PgHalfVectorBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgHalfVectorBuilder";
  constructor(name, config) {
    super(name, "array", "PgHalfVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgHalfVector(
      table,
      this.config
    );
  }
}
class PgHalfVector extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgHalfVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `halfvec(${this.dimensions})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
  }
}
function halfvec(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new PgHalfVectorBuilder(name, config);
}

//# sourceMappingURL=halfvec.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.js



class PgSparseVectorBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgSparseVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgSparseVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgSparseVector(
      table,
      this.config
    );
  }
}
class PgSparseVector extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgSparseVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `sparsevec(${this.dimensions})`;
  }
}
function sparsevec(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new PgSparseVectorBuilder(name, config);
}

//# sourceMappingURL=sparsevec.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.js



class PgVectorBuilder extends common/* PgColumnBuilder */.pe {
  static [entity/* entityKind */.i] = "PgVectorBuilder";
  constructor(name, config) {
    super(name, "array", "PgVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgVector(table, this.config);
  }
}
class PgVector extends common/* PgColumn */.Kl {
  static [entity/* entityKind */.i] = "PgVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `vector(${this.dimensions})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
  }
}
function vector(a, b) {
  const { name, config } = (0,utils/* getColumnNameAndConfig */.Ll)(a, b);
  return new PgVectorBuilder(name, config);
}

//# sourceMappingURL=vector.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/columns/all.js
































function getPgColumnBuilders() {
  return {
    bigint: bigint,
    bigserial: bigserial,
    boolean: columns_boolean/* boolean */.zM,
    char: char_char,
    cidr: cidr,
    customType: customType,
    date: date/* date */.p6,
    doublePrecision: doublePrecision,
    inet: inet,
    integer: integer/* integer */.nd,
    interval: interval,
    json: json/* json */.Pq,
    jsonb: jsonb/* jsonb */.Fx,
    line: line,
    macaddr: macaddr,
    macaddr8: macaddr8,
    numeric: numeric/* numeric */.sH,
    point: point,
    geometry: geometry,
    real: real/* real */.x,
    serial: serial,
    smallint: smallint,
    smallserial: smallserial,
    text: columns_text/* text */.Qq,
    time: time/* time */.kB,
    timestamp: timestamp/* timestamp */.vE,
    uuid: uuid/* uuid */.uR,
    varchar: varchar/* varchar */.yf,
    bit: bit,
    halfvec: halfvec,
    sparsevec: sparsevec,
    vector: vector
  };
}

//# sourceMappingURL=all.js.map
;// CONCATENATED MODULE: ../../node_modules/.pnpm/drizzle-orm@0.36.4_@libsql+client@0.14.0_@types+better-sqlite3@7.6.13_@types+react@18.3.28_be_bhyfo6jtf7gmzt2fsdpal3g2vq/node_modules/drizzle-orm/pg-core/table.js



const InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
const EnableRLS = Symbol.for("drizzle:EnableRLS");
class PgTable extends drizzle_orm_table/* Table */.XI {
  static [entity/* entityKind */.i] = "PgTable";
  /** @internal */
  static Symbol = Object.assign({}, drizzle_orm_table/* Table */.XI.Symbol, {
    InlineForeignKeys,
    EnableRLS
  });
  /**@internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [EnableRLS] = false;
  /** @internal */
  [drizzle_orm_table/* Table */.XI.Symbol.ExtraConfigBuilder] = void 0;
}
function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new PgTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getPgColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const builtColumnsForExtraConfig = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.buildExtraConfigColumn(rawTable);
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[drizzle_orm_table/* Table */.XI.Symbol.Columns] = builtColumns;
  table[drizzle_orm_table/* Table */.XI.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
  if (extraConfig) {
    table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return Object.assign(table, {
    enableRLS: () => {
      table[PgTable.Symbol.EnableRLS] = true;
      return table;
    }
  });
}
const pgTable = (name, columns, extraConfig) => {
  return pgTableWithSchema(name, columns, extraConfig, void 0);
};
function pgTableCreator(customizeTableName) {
  return (name, columns, extraConfig) => {
    return pgTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
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

/***/ })

};

//# sourceMappingURL=698.index.js.map