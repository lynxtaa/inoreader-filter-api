"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_middleware_1 = require("graphql-middleware");
const graphql_tools_1 = require("graphql-tools");
const permissions_1 = __importDefault(require("./permissions"));
const resolvers_1 = __importDefault(require("./resolvers"));
const typeDefs_1 = __importDefault(require("./typeDefs"));
exports.default = graphql_middleware_1.applyMiddleware(graphql_tools_1.makeExecutableSchema({ resolvers: resolvers_1.default, typeDefs: typeDefs_1.default }), permissions_1.default);
