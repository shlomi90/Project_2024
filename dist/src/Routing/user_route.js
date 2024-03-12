"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../Controllers/user_controller"));
const auth_logout_1 = __importDefault(require("../Common/auth_logout"));
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User management
 */
/**
* @swagger
* components:
*  securitySchemes:
*   bearerAuth:
*    type: http
*    scheme: bearer
*    bearerFormat: JWT
*/
/**
* @swagger
* components:
*   schemas:
*     User:
*      type: object
*      required:
*         - email
*         - password
*      properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*         username:
*           type: string
*           description: The user username
*         tokens:
*           type: array
*           description: The user tokens
*           items:
*             type: string
*         posts:
*           type: array
*           description: The user posts
*           items:
*             type: string
*      example:
*         { "email":"shlomi",
*           "password":"123456"
*         }
*/
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request or user registration failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error
 *               example:
 *                 error: Registration failed, please check your input
 */
router.post('/register', user_controller_1.default.register);
router.post('/google', user_controller_1.default.googleSignIn);
/**
 * @swagger
 * components:
 *   schemas:
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: '123cd123x1xx1'
 *         refreshToken: '134r2134cr1x3c'
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in and get access & refresh tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successful login, returns access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
router.post('/login', user_controller_1.default.login);
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Auth]
 *     description: |
 *       Log out a user by providing the refresh token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout completed successfully
 */
router.get('/logout', auth_logout_1.default, user_controller_1.default.logout);
/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Get a new access token using the refresh token
 *     tags: [Auth]
 *     description: |
 *       Get a new access token by providing the refresh token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful token refresh, returns new access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
router.get('/refresh', user_controller_1.default.refresh);
router.put('/:id', user_controller_1.default.updateUserdetails);
exports.default = router;
//# sourceMappingURL=user_route.js.map