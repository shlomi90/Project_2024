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
const user_model_1 = __importDefault(require("../Models/user_model"));
const user = {
    email: "testauth@gmail.com",
    password: "123456789",
    username: "testauth",
    imgURL: "https://www.google.com",
};
const user2 = {
    email: "changeemail",
    username: "changeusername",
    imgURL: "changeimgURL",
};
const user3 = {
    email: "test3",
    password: "123456789",
    username: "test3",
    imgURL: "https://www.google.com",
};
let accesstoken;
let refreshtoken;
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    yield user_model_1.default.deleteMany({ 'email': user.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.deleteMany({ 'email': user.email });
    yield mongoose_1.default.connection.close();
    yield mongoose_1.default.disconnect();
}));
describe('Auth tests', () => {
    test('Register test', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/register').send(user);
        expect(response.status).toBe(200);
    }));
    test('Try to register without auth', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/post').send(user);
        expect(response.status).not.toEqual(200);
    }));
    test('Login test', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(response.status).toBe(200);
        accesstoken = response.body['access token:'];
        expect(accesstoken).not.toBeNull();
        refreshtoken = response.body['refresh token:'];
        expect(refreshtoken).not.toBeNull();
        const response2 = yield (0, supertest_1.default)(app).get('/post').set('Authorization', "JWT " + accesstoken);
        expect(response2.status).toBe(200);
        const response3 = yield (0, supertest_1.default)(app).get('/post').set('Authorization', "JWT 1 " + accesstoken);
        expect(response3.status).toBe(403);
    }));
    test('update user test', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/login').send(user);
        expect(response.status).toBe(200);
        const user_id = response.body['user id:'];
        const response2 = yield (0, supertest_1.default)(app).put(`/auth/${user_id}`).send(user);
        expect(response2.status).toBe(200);
    }));
});
test('Refresh token test', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app).get('/auth/refresh').set('Authorization', "JWT " + refreshtoken);
    expect(response.status).toBe(200);
    const newaccesstoken = response.body['access token:'];
    const newrefreshtoken = response.body['refresh token:'];
    expect(newaccesstoken).not.toBeNull();
    expect(newrefreshtoken).not.toBeNull();
}));
// jest.setTimeout(30000);
// test('timeout test', async () => {
//     await new Promise(resolve => setTimeout(resolve, 20000));
//     const response = (await request(app).get('/post').set('Authorization', "JWT " + accesstoken));
//     expect(response.status).not.toEqual(200);
// })
test('Logout test', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app).get('/auth/logout').set('Authorization', "JWT " + refreshtoken);
    expect(response.status).toBe(200);
}));
//# sourceMappingURL=auth.test.js.map