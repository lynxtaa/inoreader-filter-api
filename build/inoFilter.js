"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUnread_1 = __importDefault(require("./inoreader/getUnread"));
const markAsRead_1 = __importDefault(require("./inoreader/markAsRead"));
const checkItem_1 = __importDefault(require("./utils/checkItem"));
function inoFilter({ logger = console, } = {}) {
    const run = ({ hrefs, titles }) => getUnread_1.default()
        .then((articles) => articles.filter(checkItem_1.default({ hrefs, titles })))
        .then(async (items) => {
        if (items.length > 0) {
            await markAsRead_1.default(items);
            logger.info(`Marked as read:\n${items.map((item) => item.title).join('\n')}`);
        }
    })
        .catch(logger.error);
    return { run };
}
exports.default = inoFilter;
