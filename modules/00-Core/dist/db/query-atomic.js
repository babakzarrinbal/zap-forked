"use strict";
/**
 *
 *    Copyright (c) 2021 Silicon Labs
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/**
 * This module provides queries for atomic type queries.
 *
 * @module DB API: zcl database access
 */
var dbApi = require('./db-api.js');
var dbMapping = require('./db-mapping.js');
var dbCache = require('./db-cache');
var ATOMIC_QUERY = "\nSELECT\n  ATOMIC_ID,\n  ATOMIC_IDENTIFIER,\n  NAME,\n  DESCRIPTION,\n  ATOMIC_SIZE,\n  IS_DISCRETE,\n  IS_STRING,\n  IS_LONG,\n  IS_CHAR,\n  IS_SIGNED\nFROM ATOMIC\n";
var cacheKey = 'atomic';
// Raw query versions without caching.
function selectAllAtomics(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbAll(db, "".concat(ATOMIC_QUERY, " WHERE PACKAGE_REF = ? ORDER BY ATOMIC_IDENTIFIER"), [packageId])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(dbMapping.map.atomic)];
            }
        });
    });
}
function selectAtomicSizeFromType(db, packageId, type) {
    return __awaiter(this, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbApi.dbGet(db, 'SELECT ATOMIC_SIZE FROM ATOMIC WHERE PACKAGE_REF = ? AND NAME = ?', 
                    // The types in the ATOMIC table are always lowercase.
                    [packageId, type.toLowerCase()])];
                case 1:
                    row = _a.sent();
                    if (row == null) {
                        return [2 /*return*/, null];
                    }
                    else {
                        return [2 /*return*/, row.ATOMIC_SIZE];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Locates atomic type based on a type name. Query is not case sensitive.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} typeName
 */
function selectAtomicType(db, packageId, name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "".concat(ATOMIC_QUERY, " WHERE PACKAGE_REF = ? AND UPPER(NAME) = ?"), [
                    packageId,
                    name == null ? name : name.toUpperCase(),
                ])
                    .then(dbMapping.map.atomic)];
        });
    });
}
/**
 * Retrieves atomic type by a given Id.
 * @param {*} db
 * @param {*} packageId
 */
function selectAtomicById(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dbApi
                    .dbGet(db, "".concat(ATOMIC_QUERY, " WHERE ATOMIC_ID = ?"), [id])
                    .then(function (rows) { return rows.map(dbMapping.map.atomic); })];
        });
    });
}
/**
 * Function that populates cache.
 *
 * @param {*} db
 * @param {*} packageId
 * @returns Newly created cache object, after it's put into the cache.
 */
function createCache(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        var packageSpecificCache, d, d_1, d_1_1, at;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    packageSpecificCache = {
                        byName: {},
                        byId: {},
                    };
                    return [4 /*yield*/, selectAllAtomics(db, packageId)];
                case 1:
                    d = _b.sent();
                    packageSpecificCache.rawData = d;
                    try {
                        for (d_1 = __values(d), d_1_1 = d_1.next(); !d_1_1.done; d_1_1 = d_1.next()) {
                            at = d_1_1.value;
                            packageSpecificCache.byName[at.name.toUpperCase()] = at;
                            packageSpecificCache.byId[at.id] = at;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (d_1_1 && !d_1_1.done && (_a = d_1.return)) _a.call(d_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    dbCache.put(cacheKey, packageId, packageSpecificCache);
                    return [2 /*return*/, packageSpecificCache];
            }
        });
    });
}
/**
 * Locates atomic type based on a type name. Query is not case sensitive.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} typeName
 */
function selectAtomicTypeFromCache(db, packageId, name) {
    return __awaiter(this, void 0, void 0, function () {
        var cache;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dbCache.isCached(cacheKey, packageId)) return [3 /*break*/, 1];
                    cache = dbCache.get(cacheKey, packageId);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, createCache(db, packageId)];
                case 2:
                    cache = _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, cache.byName[name.toUpperCase()]];
            }
        });
    });
}
/**
 * Retrieves all atomic types under a given package Id.
 * @param {*} db
 * @param {*} packageId
 */
function selectAllAtomicsFromCache(db, packageId) {
    return __awaiter(this, void 0, void 0, function () {
        var cache;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dbCache.isCached(cacheKey, packageId)) return [3 /*break*/, 1];
                    cache = dbCache.get(cacheKey, packageId);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, createCache(db, packageId)];
                case 2:
                    cache = _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, cache.rawData];
            }
        });
    });
}
/**
 * Retrieves atomic type by a given Id.
 * @param {*} db
 * @param {*} packageId
 */
function selectAtomicByIdFromCache(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        var cache;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dbCache.isCached(cacheKey, packageId)) return [3 /*break*/, 1];
                    cache = dbCache.get(cacheKey, packageId);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, createCache(db, packageId)];
                case 2:
                    cache = _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, cache.byId[id]];
            }
        });
    });
}
/**
 * Retrieves the size from atomic type.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} type
 */
function selectAtomicSizeFromTypeFromCache(db, packageId, type) {
    return __awaiter(this, void 0, void 0, function () {
        var cache, at;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dbCache.isCached(cacheKey, packageId)) return [3 /*break*/, 1];
                    cache = dbCache.get(cacheKey, packageId);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, createCache(db, packageId)];
                case 2:
                    cache = _a.sent();
                    _a.label = 3;
                case 3:
                    at = cache.byName[type.toUpperCase()];
                    if (at == null) {
                        return [2 /*return*/, null];
                    }
                    else {
                        return [2 /*return*/, at.size];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.selectAllAtomics = dbCache.cacheEnabled
    ? selectAllAtomicsFromCache
    : selectAllAtomics;
exports.selectAtomicSizeFromType = dbCache.cacheEnabled
    ? selectAtomicSizeFromTypeFromCache
    : selectAtomicSizeFromType;
exports.selectAtomicType = dbCache.cacheEnabled
    ? selectAtomicTypeFromCache
    : selectAtomicType;
exports.selectAtomicById = selectAtomicById;
//# sourceMappingURL=query-atomic.js.map