"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const match_1 = __importDefault(require("./match"));
const or = (...fns) => (x) => fns.some((fn) => fn(x));
const hrefIncludes = (filters) => (article) => article.canonical.map((el) => el.href).some(match_1.default(filters));
const titleIncludes = (filters) => (article) => match_1.default(filters)(article.title);
function checkItem({ hrefs, titles, }) {
    return or(hrefIncludes(hrefs), titleIncludes(titles));
}
exports.default = checkItem;
