"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'buzz... Remove this comment to see the full error message
var buzzle_sdk_1 = __importDefault(require("buzzle-sdk"));
var user_1 = __importDefault(require("./user"));
var order_1 = __importDefault(require("./order"));
var admin_1 = __importDefault(require("./admin"));
var category_1 = __importDefault(require("./category"));
var videoInvite_1 = __importDefault(require("./videoInvite"));
var imageInvite_1 = __importDefault(require("./imageInvite"));
var videoTemplate_1 = __importDefault(require("./videoTemplate"));
var imageTemplate_1 = __importDefault(require("./imageTemplate"));
/**
 * @param  {} buzzleUrl Buzzle API URl
 * @param  {} firestore firestore instance
 */
var main = function (_a) {
    var _b = _a.buzzleUrl, buzzleUrl = _b === void 0 ? "http://buzzle-dev.herokuapp.com" : _b, firestore = _a.firestore, _c = _a.buzzleAuthToken, buzzleAuthToken = _c === void 0 ? null : _c;
    var Buzzle = buzzle_sdk_1.default.apiClient({
        baseUrl: buzzleUrl,
        authToken: buzzleAuthToken,
    });
    return {
        Admin: admin_1.default(firestore),
        Category: category_1.default(firestore),
        Order: order_1.default(firestore),
        VideoInvite: videoInvite_1.default(firestore, Buzzle),
        VideoTemplate: videoTemplate_1.default(firestore, Buzzle),
        User: user_1.default(firestore),
        ImageTemplate: imageTemplate_1.default(firestore),
        ImageInvite: imageInvite_1.default(firestore),
    };
};
exports.default = main;
