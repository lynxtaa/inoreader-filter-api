"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
exports.default = mongoose_1.model('Rule', new mongoose_1.Schema({
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, required: true },
    lastHitAt: Date,
    hits: { type: Number, required: true },
    ruleDef: {
        prop: { type: String, required: true, enum: Object.values(ArticleProp) },
        type: { type: String, required: true, enum: Object.values(FilterType) },
        negate: Boolean,
        value: { type: String, required: true, maxlength: 128 },
    },
}));
