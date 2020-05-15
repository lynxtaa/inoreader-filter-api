"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function match(arr) {
    return (str) => arr.some((filter) => str.includes(filter));
}
exports.default = match;
