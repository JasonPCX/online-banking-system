import { jest } from '@jest/globals';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import generateHash from '../src/utils/generateHash.js';

jest.unstable_mockModule('../src/modules/users/user.model.js', () => ({
    UserModel: {
        checkUserExists: jest.fn(),
        register: jest.fn(),
        findBy: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
    },
}));

const { createServer } = await import('../src/utils/server.js');
const { UserModel } = await import('../src/modules/users/user.model.js');

const app = createServer();

const userPayload = {
    id: uuidv4(),
    full_name: 'John Doe',
    email: 'john@example.net',
    username: 'john_doe',
    last_login: new Date().toISOString(),
    failed_login_attempts: 0,
};

describe('Auth module', () => {
    describe('POST /api/v1/auth/signup', () => {
        describe('given a new user registration', () => {
            it('should create a new user', async () => {
                UserModel.checkUserExists.mockResolvedValue(false);
                UserModel.register.mockResolvedValue(userPayload);

                const response = await request(app)
                    .post('/api/v1/auth/signup')
                    .send({
                        ...userPayload,
                        password: 'StrongPwd1',
                        confirmPassword: 'StrongPwd1',
                    });

                expect(response.statusCode).toBe(201);
                expect(response.body).toEqual(userPayload);
            });

            it('should return a 400 status if the user already exists', async () => {
                UserModel.checkUserExists.mockResolvedValue(true);

                const response = await request(app)
                    .post('/api/v1/auth/signup')
                    .send({
                        ...userPayload,
                        password: 'StrongPwd1',
                        confirmPassword: 'StrongPwd1',
                    });

                expect(response.statusCode).toBe(400);
                expect(response.body).toEqual({
                    message: 'User already exist',
                });
            });
        });
    });

    describe('POST /api/v1/auth/login', () => {
        describe('given valid login credentials', () => {
            it('should log in the user successfully', async () => {
                const mockPassword = await generateHash('StrongPwd1');
                UserModel.findBy.mockResolvedValue({
                    ...userPayload,
                    password: mockPassword,
                });
                UserModel.update.mockResolvedValue(userPayload);

                const response = await request(app)
                    .post('/api/v1/auth/login')
                    .send({
                        username: userPayload.username,
                        password: 'StrongPwd1',
                    });

                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('token');
            });
        });

        describe('given invalid login credentials', () => {
            it('should return 401 status if the username is incorrect', async () => {
                UserModel.findBy.mockResolvedValue(null);

                const response = await request(app)
                    .post('/api/v1/auth/login')
                    .send({
                        username: userPayload.username,
                        password: 'StrongPwd1',
                    });

                expect(response.statusCode).toBe(401);
                expect(response.body).toEqual({
                    message: 'Incorrect username or password',
                });
            });

            it('should return 401 status if the password is incorrect', async () => {});

            it('should block the user account after 3 failed attempts', async () => {});
        });

        describe('given a blocked user', () => {
            it('should inform the user that their account is blocked', async () => {});
        });
    });
});
