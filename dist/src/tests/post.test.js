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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../Models/post_model"));
const user_model_1 = __importDefault(require("../Models/user_model"));
const user = {
    email: "test@post.com",
    password: "123456789",
    username: "testpost",
    imgURL: "test"
};
const differentUser = {
    email: "different@email.com",
    password: "password",
    username: "different",
    imgURL: "different"
};
let app;
let token;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    yield post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': user.email });
    yield user_model_1.default.deleteMany({ 'email': differentUser.email });
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    user._id = response.body.username;
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    token = response2.body['access token:'];
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    yield mongoose_1.default.disconnect();
}));
const post = {
    title: "title",
    message: "message",
    image: "image",
};
const post2 = {
    title: "title2",
    message: "message2",
    image: "image",
};
const updatedPost = {
    title: "updated title",
    message: "updated message",
    image: "image",
};
describe("POST /post", () => {
    test("should create a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/post").send(post).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(post.title);
        expect(response.body.owner).toBe(user._id);
        expect(response.body.message).toBe(post.message);
    }));
    test("should return an array with 1 post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/post').set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const post = response.body[0];
        expect(post.title).toBe(post.title);
        expect(post.message).toBe(post.message);
        expect(post.owner).toBe(post.owner);
    }));
    test("should create a second post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/post").send(post2).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(post2.title);
        expect(response.body.owner).toBe(user._id);
        expect(response.body.message).toBe(post2.message);
    }));
    test("Try to create a post with missing data", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/post").send({ title: "test post" }).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("Unable to save data to database");
    }));
    test("Try to create a post with empty data", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/post").send({}).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("Unable to save data to database");
    }));
    test("should update a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/post").send(post).set('Authorization', "JWT " + token);
        const postId = response.body._id;
        const response2 = yield (0, supertest_1.default)(app).put(`/post/${postId}`).send(updatedPost).set('Authorization', "JWT " + token);
        expect(response2.statusCode).toBe(200);
        expect(response2.body.title).toBe(updatedPost.title);
        expect(response2.body.message).toBe(updatedPost.message);
        expect(response2.body.owner).toBe(user._id);
    }));
    test("should return a 404 error if the post is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put(`/post/12345`).send(post).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("Error updating post");
    }));
    test("should return a 403 error if the user is not authorized to update the post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/post").send(post).set('Authorization', "JWT " + token);
        const postId = response.body._id;
        const response2 = yield (0, supertest_1.default)(app).post("/auth/register").send(differentUser);
        differentUser._id = response2.body._id;
        const differentToken = (yield (0, supertest_1.default)(app).post("/auth/login").send(differentUser)).body['access token:'];
        const response3 = yield (0, supertest_1.default)(app).put(`/post/${postId}`).send(updatedPost).set('Authorization', "JWT " + differentToken);
        expect(response3.statusCode).toBe(403);
        expect(response3.text).toBe('Unauthorized to update this post');
    }));
    test("should return the user's posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/post/${user._id}`).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(4);
    }));
    test("should delete a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/post").send(post).set('Authorization', "JWT " + token);
        const postId = response.body._id;
        const response2 = yield (0, supertest_1.default)(app).delete(`/post/${postId}`).set('Authorization', "JWT " + token);
        expect(response2.statusCode).toBe(200);
    }));
    test("should return a 404 error if the post is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/post/12345`).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("Error deleting post");
    }));
    test("should return a 403 error if the user is not authorized to delete the post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/post").send(post).set('Authorization', "JWT " + token);
        const postId = response.body._id;
        const response2 = yield (0, supertest_1.default)(app).post("/auth/register").send(differentUser);
        differentUser._id = response2.body._id;
        const differentToken = (yield (0, supertest_1.default)(app).post("/auth/login").send(differentUser)).body['access token:'];
        const response3 = yield (0, supertest_1.default)(app).delete(`/post/${postId}`).set('Authorization', "JWT " + differentToken);
        expect(response3.statusCode).toBe(403);
        expect(response3.text).toBe('Unauthorized to delete this post');
    }));
});
//# sourceMappingURL=post.test.js.map