"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchApi_1 = __importDefault(require("./fetchApi"));
async function getUnread() {
    const response = await fetchApi_1.default('/stream/contents?n=100&xt=user/-/state/com.google/read');
    const { items } = await response.json();
    return items;
}
exports.default = getUnread;
