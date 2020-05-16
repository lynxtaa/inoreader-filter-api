"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
exports.default = {
    Query: {
        async user(_, { id }) {
            const user = await User_1.default.findById(id).sort('id');
            return user;
        },
        async users() {
            const users = await User_1.default.find();
            return users;
        },
    },
};
