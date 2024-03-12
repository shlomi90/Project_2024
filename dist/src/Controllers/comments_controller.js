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
const comments_model_1 = __importDefault(require("../Models/comments_model"));
const user_model_1 = __importDefault(require("../Models/user_model"));
const post_model_1 = __importDefault(require("../Models/post_model"));
class Commentcontroller extends Base_Controller_1.BaseController {
    constructor() {
        super(comments_model_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postid = req.params.postId;
                const userid = req.body.user.id;
                const uesrname = yield this.findUserNameById(userid);
                const comment = new comments_model_1.default({
                    content: req.body.content,
                    author: uesrname,
                    post_id: postid,
                    createdAt: Date.now(),
                    author_id: userid
                });
                yield comment.save();
                yield post_model_1.default.findByIdAndUpdate(postid, {
                    $push: { comments: comment._id },
                    $inc: { numOfComments: 1 } // Increment comment count
                }, { new: true });
                ;
                res.status(201).send(comment);
            }
            catch (error) {
                console.log(error.message);
                res.status(400).send(error.message);
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postid = req.params.postId;
                const comments = yield comments_model_1.default.find({ post_id: postid });
                res.status(200).send(comments);
            }
            catch (error) {
                console.log(error.message);
                res.status(400).send(error.message);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentid = req.params.commentId;
                const postid = req.params.postId;
                const com = yield comments_model_1.default.findById(commentid);
                if (com.author_id == req.body.user.id) {
                    yield comments_model_1.default.findByIdAndDelete(commentid);
                    yield post_model_1.default.findByIdAndUpdate(postid, {
                        $pull: { comments: commentid },
                        $inc: { numOfComments: -1 }
                    }, { new: true });
                    res.status(200).send("comment deleted");
                }
                else {
                    res.status(400).send("you are not the author of this comment");
                }
            }
            catch (error) {
                console.log(error.message);
                res.status(400).send(error.message);
            }
        });
    }
    findUserNameById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = id;
                const user = yield user_model_1.default.findById(user_id);
                return user.username;
            }
            catch (error) {
                console.log(error.message);
                return error.message;
            }
        });
    }
}
exports.default = new Commentcontroller();
//# sourceMappingURL=comments_controller.js.map