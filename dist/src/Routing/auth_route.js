"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../Controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../Common/auth_middleware"));
router.post('/register', user_controller_1.default.register);
router.post('/login', user_controller_1.default.login);
router.get('/logout', auth_middleware_1.default, user_controller_1.default.logout);
router.get('/refresh', user_controller_1.default.refresh);
exports.default = router;
//# sourceMappingURL=auth_route.js.map