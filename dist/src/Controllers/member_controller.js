"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Base_Controller_1 = __importDefault(require("./Base_Controller"));
const member_model_1 = __importDefault(require("../Models/member_model"));
const memberController = (0, Base_Controller_1.default)(member_model_1.default);
module.exports = memberController;
//# sourceMappingURL=member_controller.js.map