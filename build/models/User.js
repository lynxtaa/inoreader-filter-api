"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __importDefault(require("./BaseModel"));
let User = /** @class */ (() => {
    class User extends BaseModel_1.default {
    }
    User.tableName = 'users';
    User.relationMappings = {
        rules: {
            relation: BaseModel_1.default.HasManyRelation,
            modelClass: 'Rule',
            join: { from: 'users.id', to: 'rules.userIFd' },
        },
    };
    return User;
})();
exports.default = User;
