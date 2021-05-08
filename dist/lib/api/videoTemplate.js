"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (firestore, Buzzle) {
    var ref = firestore().collection('videoTemplates');
    var getArrayOfIdsAsQueryString = function (field, ids) {
        return ids.map(function (id, index) { return "" + (index === 0 ? "" : "&") + field + "[]=" + id; }).toString().replace(/,/g, "");
    };
    var populateVideoTemplate = function (vt) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = [{}];
                    return [4 /*yield*/, Buzzle.VideoTemplate.get(vt._templateId)];
                case 1: return [2 /*return*/, __assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_b.sent())])), vt])];
            }
        });
    }); };
    return {
        getAll: function (showNotAvailable, categoryId, page, size) {
            if (showNotAvailable === void 0) { showNotAvailable = false; }
            if (page === void 0) { page = 0; }
            if (size === void 0) { size = 10; }
            return __awaiter(void 0, void 0, void 0, function () {
                var snapshot, count, _a, totalCount, _b, totalCount, videoTemplates, populatedTemplates, data;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!categoryId) return [3 /*break*/, 3];
                            return [4 /*yield*/, ref.where('categories', typeof categoryId === 'string' ? 'array-contains' : 'array-contains-any', categoryId).get()];
                        case 1:
                            _a = (_c.sent()).size, totalCount = _a === void 0 ? 0 : _a;
                            count = totalCount;
                            return [4 /*yield*/, ref
                                    .where('categories', typeof categoryId === 'string' ? 'array-contains' : 'array-contains-any', categoryId)
                                    .orderBy('ranking')
                                    .startAfter(page * size)
                                    .limit(size)
                                    .get()];
                        case 2:
                            snapshot = _c.sent();
                            return [3 /*break*/, 6];
                        case 3: return [4 /*yield*/, ref.get()];
                        case 4:
                            _b = (_c.sent()).size, totalCount = _b === void 0 ? 0 : _b;
                            count = totalCount;
                            return [4 /*yield*/, ref
                                    .orderBy('ranking')
                                    .startAfter(page * size)
                                    .limit(size)
                                    .get()];
                        case 5:
                            snapshot = _c.sent();
                            _c.label = 6;
                        case 6:
                            if (snapshot.empty)
                                return [2 /*return*/, { data: [], page: page, count: 0 }];
                            videoTemplates = snapshot.docs.map(function (d) { return (__assign({ id: d.id }, d.data())); });
                            return [4 /*yield*/, Buzzle.VideoTemplate.getAll(1, videoTemplates.length, getArrayOfIdsAsQueryString('id', videoTemplates.map(function (_a) {
                                    var _templateId = _a._templateId;
                                    return _templateId;
                                })))];
                        case 7:
                            populatedTemplates = (_c.sent()).data;
                            if (showNotAvailable) {
                                return [2 /*return*/, { data: videoTemplates.map(function (vt) { return (__assign(__assign({}, populatedTemplates.find(function (_a) {
                                            var id = _a.id;
                                            return id === vt._templateId;
                                        })), vt)); }), page: page + 1, count: count }];
                            }
                            else {
                                data = videoTemplates.map(function (vt) { return (__assign(__assign({}, populatedTemplates.find(function (_a) {
                                    var id = _a.id;
                                    return id === vt._templateId;
                                })), vt)); })
                                    .filter(function (_a) {
                                    var isAvailable = _a.isAvailable, _templateId = _a._templateId;
                                    return isAvailable;
                                });
                                return [2 /*return*/, {
                                        data: data,
                                        page: page + 1,
                                        count: count - ((videoTemplates === null || videoTemplates === void 0 ? void 0 : videoTemplates.length) - data.length)
                                    }];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        getRecommendations: function (showNotAvailable, categoryId, limitCount, excludedVideoTemplateId) {
            if (showNotAvailable === void 0) { showNotAvailable = false; }
            if (limitCount === void 0) { limitCount = false; }
            if (excludedVideoTemplateId === void 0) { excludedVideoTemplateId = false; }
            return __awaiter(void 0, void 0, void 0, function () {
                var snapshot, videoTemplates, populatedTemplates;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!categoryId) return [3 /*break*/, 5];
                            if (!limitCount) return [3 /*break*/, 2];
                            return [4 /*yield*/, ref
                                    .where('categories', typeof categoryId === 'string' ? 'array-contains' : 'array-contains-any', categoryId)
                                    .limit(limitCount)
                                    .get()];
                        case 1:
                            // only limit the videoTemplates
                            snapshot = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, ref
                                .where('categories', typeof categoryId === 'string' ? 'array-contains' : 'array-contains-any', categoryId)
                                .get()];
                        case 3:
                            snapshot = _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 9];
                        case 5:
                            if (!limitCount) return [3 /*break*/, 7];
                            return [4 /*yield*/, ref
                                    .limit(limitCount)
                                    .get()];
                        case 6:
                            // only limit the videoTemplates
                            snapshot = _a.sent();
                            return [3 /*break*/, 9];
                        case 7: return [4 /*yield*/, ref.get()];
                        case 8:
                            snapshot = _a.sent();
                            _a.label = 9;
                        case 9:
                            if (snapshot.empty)
                                return [2 /*return*/, []];
                            videoTemplates = snapshot.docs.map(function (d) { return (__assign({ id: d.id }, d.data())); });
                            return [4 /*yield*/, Buzzle.VideoTemplate.getAll(1, videoTemplates.length, getArrayOfIdsAsQueryString('id', videoTemplates.map(function (_a) {
                                    var _templateId = _a._templateId;
                                    return _templateId;
                                })))];
                        case 10:
                            populatedTemplates = (_a.sent()).data;
                            if (excludedVideoTemplateId) {
                                if (showNotAvailable) {
                                    return [2 /*return*/, videoTemplates.map(function (vt) { return (__assign(__assign({}, populatedTemplates.find(function (_a) {
                                            var id = _a.id;
                                            return id === vt._templateId;
                                        })), vt)); })
                                            .filter(function (_a) {
                                            var _templateId = _a._templateId;
                                            return _templateId !== excludedVideoTemplateId;
                                        })];
                                }
                                else {
                                    return [2 /*return*/, videoTemplates.map(function (vt) { return (__assign(__assign({}, populatedTemplates.find(function (_a) {
                                            var id = _a.id;
                                            return id === vt._templateId;
                                        })), vt)); })
                                            .filter(function (_a) {
                                            var isAvailable = _a.isAvailable, _templateId = _a._templateId;
                                            return isAvailable && _templateId !== excludedVideoTemplateId;
                                        })];
                                }
                            }
                            else {
                                if (showNotAvailable) {
                                    return [2 /*return*/, videoTemplates.map(function (vt) { return (__assign(__assign({}, populatedTemplates.find(function (_a) {
                                            var id = _a.id;
                                            return id === vt._templateId;
                                        })), vt)); })];
                                }
                                else {
                                    return [2 /*return*/, videoTemplates.map(function (vt) { return (__assign(__assign({}, populatedTemplates.find(function (_a) {
                                            var id = _a.id;
                                            return id === vt._templateId;
                                        })), vt)); })
                                            .filter(function (_a) {
                                            var isAvailable = _a.isAvailable, _templateId = _a._templateId;
                                            return isAvailable;
                                        })];
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        get: function (id) { return __awaiter(void 0, void 0, void 0, function () {
            var snapshot, videoTemplate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ref.doc(id).get()];
                    case 1:
                        snapshot = _a.sent();
                        videoTemplate = __assign(__assign({}, snapshot.data()), { id: id });
                        return [2 /*return*/, populateVideoTemplate(videoTemplate)];
                }
            });
        }); },
        create: function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Math.random()
                            .toString()
                            .slice(2, 15);
                        return [4 /*yield*/, ref.doc(id).set(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, id];
                }
            });
        }); },
        delete: function (id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ref.doc(id).delete()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); },
        update: function (id, data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ref.doc(id).update(data)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); },
    };
});
