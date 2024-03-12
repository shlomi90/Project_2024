"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    post_id: {
        type: String,
        ref: 'Post',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author_id: {
        type: String,
        required: false
    },
});
exports.default = mongoose_1.default.model('Comment', commentSchema);
//# sourceMappingURL=comments_model.js.map