"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const db_1 = __importDefault(require("../db"));
objection_1.Model.knex(db_1.default);
let BaseModel = /** @class */ (() => {
    class BaseModel extends objection_1.Model {
    }
    BaseModel.modifiers = {
        orderById: (builder) => builder.orderBy('id'),
    };
    BaseModel.useLimitInFirst = true;
    BaseModel.modelPaths = [__dirname];
    return BaseModel;
})();
exports.default = BaseModel;
