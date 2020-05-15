"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __importDefault(require("./BaseModel"));
var ArticleProp;
(function (ArticleProp) {
    ArticleProp["Href"] = "href";
    ArticleProp["Title"] = "title";
})(ArticleProp || (ArticleProp = {}));
var FilterType;
(function (FilterType) {
    FilterType["Contains"] = "contains";
    FilterType["Equal"] = "equal";
    FilterType["MatchRegexp"] = "matchRegexp";
})(FilterType || (FilterType = {}));
let Rule = /** @class */ (() => {
    class Rule extends BaseModel_1.default {
    }
    Rule.tableName = 'rules';
    Rule.jsonAttributes = ['rule'];
    Rule.jsonSchema = {
        type: 'object',
        properties: {
            rule: {
                type: 'object',
                required: ['prop', 'type', 'value'],
                properties: {
                    prop: { type: 'string', enum: Object.values(ArticleProp) },
                    type: { type: 'string', enum: Object.values(FilterType) },
                    negate: { type: 'boolean' },
                    value: { type: 'string' },
                },
            },
        },
    };
    return Rule;
})();
exports.default = Rule;
