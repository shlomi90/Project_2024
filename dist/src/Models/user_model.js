"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const authSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    imgURL: {
        type: String,
        required: false
    },
    tokens: {
        type: [String],
        required: false
    },
    posts: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Post'
        }],
});
exports.default = mongoose_1.default.model('Auth', authSchema);
//# sourceMappingURL=user_model.js.map