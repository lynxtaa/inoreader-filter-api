"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const glob_1 = __importDefault(require("glob"));
exports.default = glob_1.default
    .sync('**/*.graphql', { cwd: path_1.resolve(__dirname, '../../typeDefs'), absolute: true })
    .map((path) => fs_1.readFileSync(path, 'utf8'))
    .join('\n');
