"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const { APP_ID, APP_KEY, AUTH } = process.env;
async function fetchApi(url, params = {}) {
    const response = await node_fetch_1.default(`https://www.inoreader.com/reader/api/0${url}`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            AppId: APP_ID,
            AppKey: APP_KEY,
            Authorization: `GoogleLogin auth=${AUTH}`,
        },
        ...params,
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Request ${response.url} failed: ${text} (${response.status})`);
    }
    return response;
}
exports.default = fetchApi;
