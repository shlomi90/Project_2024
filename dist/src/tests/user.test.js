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
const auth_model_1 = __importDefault(require("../Models/auth_model"));
let app;
let token;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    yield user_model_1.default.deleteMany();
    yield auth_model_1.default.deleteMany({ 'email': "testuser@test.com" });
    yield (0, supertest_1.default)(app).post("/auth/register").send({
        email: "testuser@test.com",
        password: "123456789"
    });
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
        email: "testuser@test.com",
        password: "123456789"
    });
    token = response.body['access token:'];
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    yield mongoose_1.default.disconnect();
}));
const user = {
    name: "Tes1",
    _id: "123456789",
};
describe('User test', () => {
    test('should return an empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/user').set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test('should create a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/user').send(user).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
    }));
    test('should return an array with 1 user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/user').set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const user = response.body[0];
        expect(user.name).toBe(user.name);
        expect(user._id).toBe(user._id);
    }));
    test('create duplicate user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/user').send(user).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe('Unable to save data to database');
    }));
    test('get user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/user/${user._id}`).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(user.name);
        expect(response.body._id).toBe(user._id);
    }));
    test('delete user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/user/${user._id}`).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Data deleted from database');
    }));
    test('try to create user with missing name', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/user').send({ _id: user._id }).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe('Unable to save data to database');
    }));
    test('try to create user with missing _id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/user').send({ name: user.name }).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe('Unable to save data to database');
    }));
    test('try to create user with missing name and _id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/user').send({}).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe('Unable to save data to database');
    }));
    test('put user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put(`/user/${user._id}`).send(user).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Data updated in database');
    }));
    test('try to put user with missing name', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put(`/user/${user._id}`).send({ _id: user._id }).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('Both name and _id are required');
    }));
});
//# sourceMappingURL=user.test.js.map