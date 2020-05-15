"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const graphql_middleware_1 = require("graphql-middleware");
const graphql_tools_1 = require("graphql-tools");
const permissions_1 = __importDefault(require("./permissions"));
const resolvers_1 = __importDefault(require("./resolvers"));
const typeDefs = fs_1.readFileSync(path_1.resolve('./typeDefs.graphql'), 'utf8');
exports.default = graphql_middleware_1.applyMiddleware(graphql_tools_1.makeExecutableSchema({ resolvers: resolvers_1.default, typeDefs }), permissions_1.default);
