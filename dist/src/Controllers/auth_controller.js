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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_2 = __importDefault(require("../Models/user_model"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return res.status(400).send("email or password not provided");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user == null) {
            return res.status(400).send("email not found");
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(400).send("wrong password");
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH);
        if (user.tokens == null)
            user.tokens = [refreshToken];
        else
            user.tokens.push(refreshToken);
        yield user.save();
        return res.status(200).send({ 'access token:': accessToken,
            'refresh token:': refreshToken });
    }
    catch (err) {
        return res.status(400).send("error");
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("register");
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("email or password not provided");
    }
    try {
        const exist = yield user_model_1.default.findOne({ email: email });
        if (exist != null) {
            return res.status(400).send("email already exist");
        }
    }
    catch (err) {
        return res.status(400).send("error");
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const auth = yield user_model_1.default.create({ email: email, password: hash });
        res.status(200).send(auth);
    }
    catch (err) {
        res.status(400).send("error");
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.sendStatus(403).send(err.message);
        const user_id = user.id;
        try {
            user = yield user_model_2.default.findById(user_id);
            if (user == null)
                return res.sendStatus(404).send("user not found");
            if (!user.tokens.includes(token)) {
                user.tokens = [];
                yield user.save();
                return res.sendStatus(403).send("token not found");
            }
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH);
            user.tokens[user.tokens.indexOf(token)] = refreshToken;
            yield user.save();
            return res.status(200).send({ 'access token:': accessToken,
                'refresh token:': refreshToken });
        }
        catch (err) {
            return res.status(400).send("error");
        }
    }));
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.sendStatus(403);
        const user_id = user.id;
        try {
            user = yield user_model_2.default.findById(user_id);
            if (user == null)
                return res.sendStatus(404).send("user not found");
            if (!user.tokens.includes(token)) {
                user.tokens = [];
                yield user.save();
                return res.sendStatus(403).send("token not found");
            }
            user.tokens.splice(user.tokens.indexOf(token), 1);
            yield user.save();
            return res.sendStatus(200);
        }
        catch (err) {
            return res.status(400).send("error");
        }
    }));
});
exports.default = { login, logout, register, refresh };
//# sourceMappingURL=auth_controller.js.map