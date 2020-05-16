"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluck = (key) => (arr) => arr.map((el) => el[key]);
exports.default = pluck;
