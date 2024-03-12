"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comments_controller_1 = __importDefault(require("../Controllers/comments_controller"));
const auth_middleware_1 = __importDefault(require("../Common/auth_middleware"));
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments management
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment.
 *         author:
 *           type: string
 *           description: The author of the comment.
 *         post_id:
 *           type: string
 *           description: The ID of the associated post.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was created.
 *       example:
 *         content: 'This is a comment.'
 *         author: 'JohnDoe'
 *         post_id: '5f70a5d259b2b9a2b6c244ae'
 *         createdAt: '2022-01-15T12:34:56Z'
 */
/**
 * @swagger
 * paths:
 *   /post/{postId}/comments:
 *     post:
 *       summary: Create a new comment for a post
 *       tags: [Comments]
 *       security:
 *        - bearerAuth: []
 *       parameters:
 *         - name: postId
 *           in: path
 *           required: true
 *           description: The ID of the post
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       responses:
 *         '201':
 *           description: The created comment
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Comment'
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               example:
 *                 error: "Failed to create a new comment."
 *                 details: "Bad Request. Please check your input."
 */
router.post('/post/:postId/comments', auth_middleware_1.default, comments_controller_1.default.post.bind(comments_controller_1.default));
/**
 * @swagger
 * paths:
 *   /post/{postId}/comments:
 *     get:
 *       summary: Get all comments for a post
 *       tags: [Comments]
 *       security:
 *        - bearerAuth: []
 *       parameters:
 *         - name: postId
 *           in: path
 *           required: true
 *           description: The ID of the post
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: An array of comments
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Comment'
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               example:
 *                 error: "Failed to retrieve comments."
 *                 details: "Bad Request. Please check your input."
 */
router.get('/post/:postId/comments', auth_middleware_1.default, comments_controller_1.default.get.bind(comments_controller_1.default));
/**
 * @swagger
 * paths:
 *   /post/{postId}/comments/{commentId}:
 *     delete:
 *       summary: Delete a comment
 *       tags: [Comments]
 *       security:
 *        - bearerAuth: []
 *       parameters:
 *         - name: postId
 *           in: path
 *           required: true
 *           description: The ID of the post
 *           schema:
 *             type: string
 *         - name: commentId
 *           in: path
 *           required: true
 *           description: The ID of the comment
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: The comment was deleted
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               example:
 *                 error: "Failed to delete comment."
 *                 details: "Bad Request. Please check your input."
 */
router.delete('/post/:postId/comments/:commentId', auth_middleware_1.default, comments_controller_1.default.delete.bind(comments_controller_1.default));
exports.default = router;
//# sourceMappingURL=comments_route.js.map