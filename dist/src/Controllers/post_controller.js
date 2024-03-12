"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_Controller_1 = require("./Base_Controller");
const post_model_1 = __importDefault(require("../Models/post_model"));
const user_model_1 = __importDefault(require("../Models/user_model"));
class Postcontroller extends Base_Controller_1.BaseController {
    constructor() {
        super(post_model_1.default);
    }
    post(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = (_a = req.body.user) === null || _a === void 0 ? void 0 : _a.id;
            const post = req.body;
            const imgURL = req.body.image;
            try {
                const user = yield user_model_1.default.findById(id);
                if (!user) {
                    res.status(404).send('User not found');
                    return;
                }
                post.owner = user.username;
                post.createdAt = new Date();
                post.image = imgURL;
                const createdPost = yield this.model.create(post);
                yield user_model_1.default.findByIdAndUpdate(id, { $push: { posts: createdPost._id } }, { new: true });
                res.send(createdPost).status(200);
            }
            catch (err) {
                console.log(err);
                res.status(500).send("Unable to save data to database");
            }
        });
    }
    put(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const updatedPost = req.body;
            try {
                const post = yield this.model.findByIdAndUpdate(id, { $set: updatedPost }, { new: true });
                const user = yield user_model_1.default.findById((_a = req.body.user) === null || _a === void 0 ? void 0 : _a.id);
                if (post.owner !== user.username) {
                    res.status(403).send('Unauthorized to update this post');
                    return;
                }
                res.send(post).status(200);
            }
            catch (err) {
                console.log(err);
                res.status(500).send('Error updating post');
            }
        });
    }
    delete(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const post = yield this.model.findById(id);
                const user = yield user_model_1.default.findById((_a = req.body.user) === null || _a === void 0 ? void 0 : _a.id);
                if (post.owner !== user.username) {
                    res.status(403).send('Unauthorized to delete this post');
                    return;
                }
                yield this.model.findByIdAndDelete(id);
                res.send(post).status(200);
            }
            catch (err) {
                console.log(err);
                res.status(500).send('Error deleting post');
            }
        });
    }
    //function to get all posts by a userid
    getPostsByUserId(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = (_a = req.body.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const user = yield user_model_1.default.findById(id);
                if (!user) {
                    res.status(404).send('User not found');
                    return;
                }
                const posts = yield this.model.find({ owner: user.username });
                res.send(posts).status(200);
            }
            catch (err) {
                console.log(err);
                res.status(500).send('Error retrieving posts');
            }
        });
    }
}
exports.default = new Postcontroller();
//# sourceMappingURL=post_controller.js.map