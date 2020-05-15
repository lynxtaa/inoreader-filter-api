"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const ejs_1 = __importDefault(require("ejs"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_secure_session_1 = __importDefault(require("fastify-secure-session"));
const fastify_static_1 = __importDefault(require("fastify-static"));
const point_of_view_1 = __importDefault(require("point-of-view"));
const routes_1 = __importDefault(require("./routes"));
function app({ logLevel, } = {}) {
    const fastify = fastify_1.default({
        logger: {
            base: null,
            prettyPrint: process.env.NODE_ENV !== 'production' && { colorize: true },
            timestamp: false,
            level: logLevel || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        },
    });
    fastify.register(fastify_secure_session_1.default, {
        secret: 'averylogphrasebiggerthanthirtytwochars',
        salt: 'mq9hDxBVDbspDR6n',
    });
    fastify.register(point_of_view_1.default, {
        engine: { ejs: ejs_1.default },
        templates: 'templates',
        options: { filename: path_1.resolve('templates') },
    });
    fastify.register(fastify_static_1.default, {
        root: path_1.resolve('../public'),
        prefix: '/public/',
    });
    fastify.register(routes_1.default);
    return fastify;
}
exports.default = app;
