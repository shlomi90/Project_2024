"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../Controllers/post_controller"));
router.get('/', post_controller_1.default.getAllPosts);
router.get('/:id', post_controller_1.default.getPostById);
router.post('/', post_controller_1.default.postPost);
router.put('/:id', post_controller_1.default.putPost);
router.delete('/:id', post_controller_1.default.deletePost);
exports.default = router;
//# sourceMappingURL=user_post_route.js.map