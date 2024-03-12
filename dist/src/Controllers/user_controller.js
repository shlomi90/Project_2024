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
const user_model_3 = __importDefault(require("../Models/user_model"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client();
const googleSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.credentialResponse.credential);
    console.log(req.body.credentialResponse.clientId);
    try {
        const ticket = yield client.verifyIdToken({
            idToken: req.body.credentialResponse.credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (email != null) {
            let user = yield user_model_3.default.findOne({ email: email });
            if (user == null) {
                user = yield user_model_1.default.create({
                    email: email,
                    password: "",
                    username: payload === null || payload === void 0 ? void 0 : payload.name,
                    imgURL: payload === null || payload === void 0 ? void 0 : payload.picture
                });
            }
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH);
            if (user.tokens == null)
                user.tokens = [refreshToken];
            else
                user.tokens.push(refreshToken);
            yield user.save();
            console.log("access token: " + accessToken);
            console.log("refresh token: " + refreshToken);
            return res.status(200).send({ "message": "success",
                'access token:': accessToken,
                'refresh token:': refreshToken,
                'user id:': user._id,
                'username:': user.username,
                'imgURL:': user.imgURL,
                'email:': user.email,
                'posts': user.posts,
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("error");
    }
});
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
        console.log("access token: " + accessToken);
        console.log("refresh token: " + refreshToken);
        return res.status(200).send({ 'access token:': accessToken,
            'refresh token:': refreshToken,
            'user id:': user._id,
            'username:': user.username,
            'imgURL:': user.imgURL,
            'email:': user.email,
            'posts': user.posts,
        });
    }
    catch (err) {
        return res.status(400).send("error");
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("register");
    const email = req.body.email;
    const password = req.body.password;
    const userName = req.body.username;
    const imgURL = req.body.imgURL;
    console.log(imgURL);
    if (!email || !password || !userName || !imgURL) {
        return res.status(400).send("one of the fields is missing");
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
        const userexist = yield user_model_1.default.findOne({ username: userName });
        if (userexist != null) {
            return res.status(400).send("username already exist");
        }
    }
    catch (err) {
        return res.status(400).send("error");
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const auth = yield user_model_1.default.create({ email: email, password: hash, username: userName, imgURL: imgURL });
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
const updateUserdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatname = req.body.username;
    const updateimgURL = req.body.imgURL;
    const updateemail = req.body.email;
    try {
        const user = yield user_model_3.default.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.username = updatname;
        user.imgURL = updateimgURL;
        user.email = updateemail;
        yield user.save();
        res.status(200).send('User updated successfully');
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error updating user');
    }
});
exports.default = { login, logout, register, refresh, updateUserdetails, googleSignIn };
//# sourceMappingURL=user_controller.js.map