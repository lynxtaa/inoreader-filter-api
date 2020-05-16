"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Rule_1 = __importDefault(require("./Rule"));
exports.default = mongoose_1.model('User', new mongoose_1.Schema({
    createdAt: { type: Date, default: Date.now },
    inoreaderUserId: { type: String, required: true, unique: true },
    inoreaderUserName: { type: String, required: true },
    inoreaderAccessToken: { type: String, required: true },
    inoreaderTokenType: { type: String, required: true },
    inoreaderRefreshToken: { type: String, required: true },
    inoreaderAccessTokenExpiresAt: { type: Date, required: true },
    rules: { type: [Rule_1.default.schema], required: true },
}));
