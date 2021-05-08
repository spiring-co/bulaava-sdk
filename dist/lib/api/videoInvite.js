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
    var ref = firestore().collection('videoInvites');
    var videoTemplatesRef = firestore().collection('videoTemplates');
    var getArrayOfIdsAsQueryString = function (field, ids) {
        return ids.map(function (id, index) { return "" + (index === 0 ? "" : "&") + field + "[]=" + id; }).toString().replace(/,/g, "");
    };
    var populateVideoInvite = function (vi) { return __awaiter(void 0, void 0, void 0, function () {
        var buzzleJob, buzzleVideoTemplate, videoTemplate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Buzzle.Job.get(vi._jobId, true)];
                case 1:
                    buzzleJob = _a.sent();
                    buzzleVideoTemplate = buzzleJob.videoTemplate;
                    delete buzzleJob['videoTemplate'];
                    return [4 /*yield*/, videoTemplatesRef.doc(vi.videoTemplateId).get()];
                case 2: return [4 /*yield*/, (_a.sent()).data()];
                case 3:
                    videoTemplate = _a.sent();
                    console.log(videoTemplate, vi);
                    return [2 /*return*/, __assign({ buzzleJob: buzzleJob, buzzleVideoTemplate: buzzleVideoTemplate, videoTemplate: videoTemplate }, vi)];
            }
        });
    }); };
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
        getAll: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
            var snapshot, videoInvites_1, populateJobs, results_1, snapshot, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, ref.where('userId', '==', userId).get()];
                    case 1:
                        snapshot = _a.sent();
                        if (snapshot.empty)
                            return [2 /*return*/, []];
                        videoInvites_1 = snapshot.docs.map(function (d) { return (__assign({ id: d.id }, d.data())); });
                        return [4 /*yield*/, Buzzle.Job.getAll(1, videoInvites_1.length, getArrayOfIdsAsQueryString('id', videoInvites_1.map(function (vi) { return vi._jobId; })))];
                    case 2:
                        populateJobs = (_a.sent()).data;
                        results_1 = [];
                        populateJobs.map(function (jd) {
                            var invite = videoInvites_1.find(function (vi) { return vi._jobId === jd.id; });
                            if (invite) {
                                invite.buzzleJob = jd;
                                invite.buzzleVideoTemplate = jd.videoTemplate;
                                results_1.push(invite);
                            }
                        });
                        return [2 /*return*/, results_1];
                    case 3: return [4 /*yield*/, ref.get()];
                    case 4:
                        snapshot = _a.sent();
                        if (snapshot.empty)
                            return [2 /*return*/, []];
                        data = snapshot.docs.map(function (d) {
                            return (__assign(__assign({ id: d.id }, d.data()), { createdAt: d.data().createdAt.toDate() + "" }));
                        });
                        return [4 /*yield*/, Promise.all(data.map(function (d) { return __awaiter(void 0, void 0, void 0, function () {
                                var _a, _b, name, _c, email, _d, phone;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0: return [4 /*yield*/, usersRef.doc(d.userId).get()];
                                        case 1: return [4 /*yield*/, (_e.sent()).data()];
                                        case 2:
                                            _a = (_e.sent()) || {}, _b = _a.name, name = _b === void 0 ? "----" : _b, _c = _a.email, email = _c === void 0 ? "----" : _c, _d = _a.phone, phone = _d === void 0 ? "----" : _d;
                                            return [2 /*return*/, (__assign(__assign({}, d), { name: name, email: email, phone: phone }))];
                                    }
                                });
                            }); }))];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        get: function (id) { return __awaiter(void 0, void 0, void 0, function () {
            var snapshot, videoInvite;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ref.doc(id).get()];
                    case 1:
                        snapshot = _a.sent();
                        videoInvite = __assign(__assign({}, snapshot.data()), { id: id });
                        return [2 /*return*/, populateVideoInvite(videoInvite)];
                }
            });
        }); },
        create: function (data, actions, videoTemplate, idVersion, userId, renderPrefs) {
            if (data === void 0) { data = {}; }
            if (actions === void 0) { actions = {}; }
            return __awaiter(void 0, void 0, void 0, function () {
                var _a, id, _b, _templateId, _jobId, date;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = videoTemplate // id is document id, _templateId is buzzle videoTemplate id
                            .id, id = _a === void 0 ? "" : _a, _b = videoTemplate // id is document id, _templateId is buzzle videoTemplate id
                            ._templateId, _templateId = _b === void 0 ? "" : _b;
                            if (!_templateId)
                                throw new Error("No template with ID " + _templateId);
                            if (!idVersion)
                                throw new Error("No template with Version ID " + idVersion);
                            return [4 /*yield*/, Buzzle.Job.create({
                                    data: data,
                                    actions: actions,
                                    idVideoTemplate: _templateId,
                                    idVersion: idVersion,
                                    renderPrefs: renderPrefs,
                                })];
                        case 1:
                            _jobId = (_c.sent()).id;
                            date = new Date();
                            return [4 /*yield*/, ref.doc().set({
                                    _jobId: _jobId,
                                    userId: userId,
                                    videoTemplateId: id,
                                    createdAt: date,
                                    updatedAt: date
                                })];
                        case 2:
                            _c.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        },
        delete: function (id) { return __awaiter(void 0, void 0, void 0, function () {
            var _jobId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ref.doc(id).get()];
                    case 1:
                        _jobId = (_a.sent()).data()._jobId;
                        return [4 /*yield*/, Buzzle.Job.delete(_jobId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ref.doc(id).delete()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        update: function (id, data, actions, renderPrefs) {
            if (data === void 0) { data = {}; }
            if (actions === void 0) { actions = {}; }
            if (renderPrefs === void 0) { renderPrefs = {}; }
            return __awaiter(void 0, void 0, void 0, function () {
                var _jobId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ref.doc(id).get()];
                        case 1:
                            _jobId = (_a.sent()).data()._jobId;
                            return [4 /*yield*/, Buzzle.Job.update(_jobId, {
                                    data: data,
                                    actions: actions,
                                    renderPrefs: renderPrefs
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, ref.doc(id).update({
                                    updatedAt: new Date(),
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        },
    };
});
