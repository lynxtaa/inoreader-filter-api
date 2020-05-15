"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const fetchApi_1 = __importDefault(require("./fetchApi"));
function markAsRead(articles) {
    const searchParams = new url_1.URLSearchParams();
    searchParams.append('a', 'user/-/state/com.google/read');
    for (const article of articles) {
        searchParams.append('i', article.id);
    }
    return fetchApi_1.default(`/edit-tag?${searchParams}`, { method: 'POST' });
}
exports.default = markAsRead;
