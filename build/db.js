"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const objection_1 = require("objection");
const knexfile_1 = __importDefault(require("./knexfile"));
const { NODE_ENV } = process.env;
const envs = Object.keys(knexfile_1.default);
if (!NODE_ENV || !envs.includes(NODE_ENV)) {
    throw new Error(`NODE_ENV should be one of: ${envs.join(', ')}`);
}
exports.default = knex_1.default({
    ...knexfile_1.default[NODE_ENV],
    ...objection_1.knexSnakeCaseMappers(),
});
