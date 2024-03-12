"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.header("Authorization");
    let token = '';
    // Handle both prefixed and unprefixed tokens:
    if (authHeader) {
        if (authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
        }
        else if (authHeader.startsWith("JWT ")) {
            token = authHeader.split(" ")[1];
        }
        else {
            token = authHeader;
        }
    }
    if (token == null)
        return res.status(401).send("Access Denied");
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).send("Invalid Token");
        req.body.user = user;
        next();
    });
};
exports.default = authenticate;
//# sourceMappingURL=auth_middleware.js.map