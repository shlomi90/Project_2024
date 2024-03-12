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
const post_model_1 = __importDefault(require("../Models/post_model"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const user_model_1 = __importDefault(require("../Models/user_model"));
const comments_model_1 = __importDefault(require("../Models/comments_model"));
const user = {
    email: "test@comment.com",
    password: "123456789",
    username: "testcomment",
    imgURL: "https://www.google.com",
};
const user2 = {
    email: "test@commentcreate.com",
    password: "123456789",
    username: "testcomment2",
    imgURL: "https://www.google.com",
};
const user3 = {
    email: "test@commentcreate3.com",
    password: "123456789",
    username: "testcomment3",
    imgURL: "https://www.google.com",
};
const post = {
    title: "title",
    message: "message",
    owner: "123123123",
    image: "image",
};
let app;
let token = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    yield post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': user.email });
    yield user_model_1.default.deleteMany({ 'email': user2.email });
    yield comments_model_1.default.deleteMany();
    const b = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    console.log(b.body);
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: user.email, password: user.password });
    token = response2.body['access token:'];
    const s = yield (0, supertest_1.default)(app).post("/post").send(post).set('Authorization', "JWT " + token);
    yield (0, supertest_1.default)(app).get("/auth/logout").set("Authorization", "JWT " + token);
    const response4 = yield (0, supertest_1.default)(app).post("/auth/register").send(user2);
    user._id = response4.body._id;
    const response3 = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: user2.email, password: user2.password });
    token = response3.body['access token:'];
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    yield mongoose_1.default.disconnect();
}));
describe("POST /comment", () => {
    test("should create a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const postId = (yield post_model_1.default.findOne())._id.toString();
        const commentData = { content: "This is a test comment" };
        const response = yield (0, supertest_1.default)(app).post(`/post/${postId}/comments`).send(commentData)
            .set("Authorization", "JWT " + token);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("content", commentData.content);
        const updatedPost = yield post_model_1.default.findById(postId);
        expect(updatedPost.comments[0].toString()).toBe(response.body._id);
    }));
    test("get all comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const postId = (yield post_model_1.default.findOne())._id.toString();
        const response = yield (0, supertest_1.default)(app).get(`/post/${postId}/comments`).set("Authorization", "JWT " + token);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty("content", "This is a test comment");
    }));
    test("create another comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const postId = (yield post_model_1.default.findOne())._id.toString();
        const commentData = { content: "This is another test comment" };
        const response = yield (0, supertest_1.default)(app).post(`/post/${postId}/comments`).send(commentData)
            .set("Authorization", "JWT " + token);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("content", commentData.content);
        const updatedPost = yield post_model_1.default.findById(postId);
        expect(updatedPost.comments[1].toString()).toBe(response.body._id);
    }));
    test("delete comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const postId = (yield post_model_1.default.findOne())._id.toString();
        const commentId = (yield comments_model_1.default.findOne())._id.toString();
        const response = yield (0, supertest_1.default)(app).delete(`/post/${postId}/comments/${commentId}`).set("Authorization", "JWT " + token);
        expect(response.status).toBe(200);
        expect(response.text).toBe("comment deleted");
    }));
    test("should return 400 if comment not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const postId = (yield post_model_1.default.findOne())._id.toString();
        const commentId = '1323';
        const response = yield (0, supertest_1.default)(app).delete(`/post/${postId}/comments/${commentId}`).set("Authorization", "JWT " + token);
        expect(response.status).toBe(400);
    }));
    test("unauthorized user should not delete comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const postId = (yield post_model_1.default.findOne())._id.toString();
        const commentId = (yield comments_model_1.default.findOne())._id.toString();
        yield (0, supertest_1.default)(app).get("/auth/logout").set("Authorization", "JWT " + token);
        const r = yield (0, supertest_1.default)(app).post("/auth/register").send(user3);
        const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: user3.email, password: user3.password });
        token = response2.body['access token:'];
        const response3 = yield (0, supertest_1.default)(app).delete(`/post/${postId}/comments/${commentId}`).set("Authorization", "JWT " + token);
        expect(response3.status).toBe(400);
        expect(response3.text).toBe("you are not the author of this comment");
    }));
});
//# sourceMappingURL=comment.test.js.map