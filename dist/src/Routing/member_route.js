"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const member_controller_1 = __importDefault(require("../Controllers/member_controller"));
const auth_middleware_1 = __importDefault(require("../Common/auth_middleware"));
router.get('/', auth_middleware_1.default, member_controller_1.default.getAll.bind(member_controller_1.default));
router.get('/:id', auth_middleware_1.default, member_controller_1.default.get.bind(member_controller_1.default));
router.post('/', auth_middleware_1.default, member_controller_1.default.post.bind(member_controller_1.default));
router.put('/:id', auth_middleware_1.default, member_controller_1.default.put.bind(member_controller_1.default));
router.delete('/:id', auth_middleware_1.default, member_controller_1.default.delete.bind(member_controller_1.default));
exports.default = router;
//# sourceMappingURL=member_route.js.map