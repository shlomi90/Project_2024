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
const user_model_1 = __importDefault(require("../Models/user_model"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getAllUsers");
    try {
        const users = yield user_model_1.default.find();
        res.send(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Unable to retrieve users from database');
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getUserById");
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        res.send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Unable to retrieve user from database');
    }
});
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request Body:", req.body); // Add this line for detailed logging
    const { name, _id } = req.body;
    try {
        if (!name || !_id) {
            return res.status(400).send('Both name and _id are required');
        }
        const user = new user_model_1.default({ name, _id });
        yield user.save();
        res.status(200);
        res.send('User saved to database');
    }
    catch (err) {
        res.status(500).send('Unable to save user to database');
    }
});
const putUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("putUser");
    try {
        const { name, _id } = req.body;
        if (!name || !_id) {
            return res.status(400).send('Both name and _id are required');
        }
        yield user_model_1.default.findByIdAndUpdate(req.params.id, { name, _id });
        res.send('User updated in database');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Unable to update user in database');
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("deleteUser");
    try {
        yield user_model_1.default.findByIdAndDelete(req.params.id);
        res.send('User deleted from database');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Unable to delete user from database');
    }
});
exports.default = { getAllUsers, getUserById, postUser, putUser, deleteUser };
//# sourceMappingURL=user_controller.js.map