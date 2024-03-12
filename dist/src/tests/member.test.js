// import request from 'supertest';
// import initApp from '../app';
// import mongoose from 'mongoose';
// import User from '../Models/member_model';
// import { Express, response } from 'express';
// import auth from '../Models/user_model';
// let app: Express;
// let token: string;
// beforeAll(async () => {
//     app=await initApp();
//     await User.deleteMany();
//     await auth.deleteMany({'email':"testuser@test.com"});
//     await request (app).post("/auth/register").send({
//         email: "testuser@test.com"
//         , password: "123456789"
//         , username: "test"
//         , imgURL: "https://www.google.com"
//     });
//     const response = await request(app).post("/auth/login").send({
//         email: "testuser@test.com"
//         , password: "123456789"
//     });
//     token = response.body['access token:']
// });
// afterAll(async () => {
//     await mongoose.connection.close();
//     await mongoose.disconnect();
// });
// const member = {
//     name: "Tes1",
//     _id: "123456789",
// };
// describe('User test', () => {
//     test('should return an empty array', async () => {
//         const response = await request(app).get('/member').set('Authorization', "JWT " + token);
//         expect(response.statusCode).toBe(200);
//         expect(response.body).toStrictEqual([]);
//     })
//     test('should create a user', async () => {
//         const response = await request(app).post('/member').send(member).set('Authorization', "JWT " + token);
//         expect(response.statusCode).toBe(200);
//     })
//     test('should return an array with 1 user', async () => {
//         const response = await request(app).get('/member').set('Authorization', "JWT " + token);
//         expect(response.statusCode).toBe(200);
//         expect(response.body.length).toBe(1);
//         const user = response.body[0];
//         expect(user.name).toBe(user.name);
//         expect(user._id).toBe(user._id);
//     })
//     test('create duplicate user', async () => {
//         const response = await request(app).post('/member').send(member).set('Authorization', "JWT " + token);
//         expect(response.statusCode).toBe(500);
//         expect(response.text).toBe('Unable to save data to database');
//     })
//     test('get user by id', async () => {
//         const response = await request(app).get(`/member/${member._id}`).set('Authorization', "JWT " + token);
//         expect(response.statusCode).toBe(200);
//         expect(response.body.name).toBe(member.name);
//         expect(response.body._id).toBe(member._id);
//     })
//     test('delete user by id', async () => {
//         const response = await request(app).delete(`/member/${member._id}`).set('Authorization', "JWT " + token);
//         expect(response.statusCode).toBe(200);
//         expect(response.text).toBe('Data deleted');
//     })
//     test('try to create user with missing name', async () => {
//         const response = await request(app).post('/member').send({ _id: member._id }).set('Authorization', "JWT " + token);
//         expect(response.statusCode).toBe(500);
//         expect(response.text).toBe('Unable to save data to database');
//     })
//     test('try to create user with missing _id', async () => {
//         const response = await request(app).post('/member').send({ name: member.name }).set('Authorization', "JWT " + token);
//         expect(response.statusCode).toBe(500);
//         expect(response.text).toBe('Unable to save data to database');
//     })
//     test('try to create user with missing name and _id', async () => {
//         const response = await request(app).post('/member').send({}).set('Authorization', "JWT " + token);
//         expect(response.statusCode).toBe(500);
//         expect(response.text).toBe('Unable to save data to database');
//     })
//     test('put user', async () => {
//         const response = await request(app).put(`/member/${member._id}`).send(member).set('Authorization', "JWT " + token);
//         expect(response.statusCode).toBe(200);
//         expect(response.text).toBe('Data updated in database');
//     })
// })
//# sourceMappingURL=member.test.js.map