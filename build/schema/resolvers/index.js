"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const scalars_1 = __importDefault(require("./scalars"));
const user_1 = __importDefault(require("./user"));
exports.default = lodash_1.merge({}, scalars_1.default, user_1.default);
