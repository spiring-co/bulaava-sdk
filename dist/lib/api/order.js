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
exports.default = (function (firestore) {
    var ref = firestore().collection('orders');
    return {
        getAll: function () { return __awaiter(void 0, void 0, void 0, function () {
            var snapshot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ref.get()];
                    case 1:
                        snapshot = _a.sent();
                        if (snapshot.isEmpty)
                            return [2 /*return*/, []];
                        return [2 /*return*/, snapshot.docs.map(function (d) { return (__assign({ id: d.id }, d.data())); })];
                }
            });
        }); },
        getByUser: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
            var snapshot, orders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ref.where('userId', '==', userId).get()];
                    case 1:
                        snapshot = _a.sent();
                        if (snapshot.empty)
                            return [2 /*return*/, []];
                        orders = snapshot.docs.map(function (d) { return (__assign({ id: d.id }, d.data())); });
                        return [2 /*return*/, orders];
                }
            });
        }); },
        get: function (id) { return __awaiter(void 0, void 0, void 0, function () {
            var snapshot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ref.doc(id).get()];
                    case 1:
                        snapshot = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, snapshot.data()), { id: id })];
                }
            });
        }); },
        create: function (_a) {
            var value = _a.value, userId = _a.userId, productId = _a.productId, paymentGateway = _a.paymentGateway, paymentReference = _a.paymentReference;
            return __awaiter(void 0, void 0, void 0, function () {
                var snapshot;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, ref.where('productId', '==', productId).get()];
                        case 1:
                            snapshot = _b.sent();
                            if (!snapshot.empty)
                                throw new Error('An order for this product already exists!');
                            return [4 /*yield*/, ref.doc().set({
                                    value: value,
                                    userId: userId,
                                    productId: productId,
                                    paymentGateway: paymentGateway,
                                    paymentReference: paymentReference,
                                    createdAt: new Date(),
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        },
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
