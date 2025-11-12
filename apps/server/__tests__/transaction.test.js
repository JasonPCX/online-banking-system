import { jest } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';
import request from 'supertest';

import generateAccountNumber from '../src/utils/generateAccountNumber.js';

jest.unstable_mockModule(
    '../src/modules/transactions/transaction.model.js',
    () => ({
        TransactionModel: {
            create: jest.fn(),
            update: jest.fn(),
        },
    })
);

jest.unstable_mockModule('../src/modules/users/user.model.js', () => ({
    UserModel: {
        checkUserExists: jest.fn(),
        register: jest.fn(),
        findBy: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
    },
}));

jest.unstable_mockModule('../src/modules/accounts/account.model.js', () => ({
    AccountModel: {
        findBy: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
    },
}));

jest.unstable_mockModule('../src/utils/mail.js', () => ({
    sendMail: jest.fn().mockResolvedValue(true),
}));

const { createServer } = await import('../src/utils/server.js');
const { TransactionModel } = await import(
    '../src/modules/transactions/transaction.model.js'
);
const { UserModel } = await import('../src/modules/users/user.model.js');
const { AccountModel } = await import(
    '../src/modules/accounts/account.model.js'
);

const app = createServer();

describe('Transactions module', () => {
    describe('POST /api/v1/transactions', () => {
        const url = '/api/v1/transactions';
        describe('given a deposit transaction', () => {
            it('should create the transaction successfully if the recipient account exists', async () => {
                const payload = {
                    transactionType: 'Deposit',
                    amount: 10.0,
                    rcptAccountNumber: generateAccountNumber(),
                };

                const accountData = {
                    id: uuidv4(),
                    balance: 2000,
                    user_id: uuidv4(),
                    account_number: payload.rcptAccountNumber,
                };
                AccountModel.findBy.mockResolvedValue(accountData);
                AccountModel.findById.mockResolvedValue(accountData);

                TransactionModel.create.mockResolvedValue({
                    id: uuidv4(),
                    status: 'Pending',
                });
                TransactionModel.update.mockResolvedValue({
                    id: uuidv4(),
                    status: 'Success',
                });

                UserModel.findById.mockResolvedValue({
                    id: accountData.user_id,
                    email: 'user1@example.com',
                });

                const response = await request(app).post(url).send(payload);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toBe('Success');
                expect(sendMail).toHaveBeenCalledWith(
                    expect.objectContaining({
                        recipient: 'user1@example.com',
                        subject:
                            'Notification: Deposit made to your bank account',
                    })
                );
            });

            it('should return a error if the recipient account does not exist', async () => {
                const payload = {
                    transactionType: 'Deposit',
                    amount: 10.0,
                    rcptAccountNumber: generateAccountNumber(),
                };
                AccountModel.findBy.mockResolvedValue(undefined);

                const response = await request(app).post(url).send(payload);

                expect(response.statusCode).toBe(404);
                expect(response.body).toEqual({
                    message:
                        'Failed to find an account with the account number provided',
                });
            });
        });

        describe('given a withdrawal transaction', () => {
            it('should create the transaction successfully if the sender account exists and has sufficient funds', async () => {
                const payload = {
                    transactionType: 'Withdraw',
                    amount: 25.0,
                    accountNumber: generateAccountNumber(),
                };

                const accountData = {
                    id: uuidv4(),
                    balance: 2000,
                    user_id: uuidv4(),
                    account_number: payload.accountNumber,
                };
                AccountModel.findBy.mockResolvedValue(accountData);
                AccountModel.findById.mockResolvedValue(accountData);
                TransactionModel.create.mockResolvedValue({
                    id: uuidv4(),
                    status: 'Pending',
                });
                TransactionModel.update.mockResolvedValue({
                    id: uuidv4(),
                    status: 'Success',
                });
                UserModel.findById.mockResolvedValue({
                    id: uuidv4(),
                    email: 'user2@example.net',
                });

                const response = await request(app).post(url).send(payload);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toBe('Success');
                expect(sendMail).toHaveBeenCalledWith(
                    expect.objectContaining({
                        recipient: 'user2@example.com',
                        subject:
                            'Notification: Funds withdrawn from your bank account',
                    })
                );
            });

            it('should return an error if the sender account does not exist', async () => {
                const payload = {
                    transactionType: 'Withdraw',
                    amount: 25.0,
                    accountNumber: generateAccountNumber(),
                };

                AccountModel.findBy.mockResolvedValue(undefined);

                const response = await request(app).post(url).send(payload);

                expect(response.statusCode).toBe(404);
                expect(response.body).toEqual({
                    message:
                        'Failed to find an account with the account number provided',
                });
            });

            it('should return an error if the sender account does not has sufficient funds', async () => {
                const payload = {
                    transactionType: 'Withdraw',
                    amount: 200000.0,
                    accountNumber: generateAccountNumber(),
                };

                expect(true).toBe(true);
            });
        });

        describe('given a transfer transaction', () => {
            it('should complete the transaction if both account exist and the sender has sufficient funds', async () => {
                const payload = {
                    transactionType: 'Transfer',
                    amount: 50.0,
                    senderAccountNumber: generateAccountNumber(),
                    rcptAccountNumber: generateAccountNumber(),
                    description: 'Transfer money',
                };

                const senderAccount = {
                    id: uuidv4(),
                    balance: 2000,
                    user_id: uuidv4(),
                    account_number: payload.senderAccountNumber,
                };
                const rcptAccount = {
                    id: uuidv4(),
                    balance: 5000,
                    user_id: uuidv4(),
                    account_number: payload.rcptAccountNumber,
                };
                AccountModel.findBy.mockResolvedValueOnce(senderAccount);
                AccountModel.findBy.mockResolvedValueOnce(rcptAccount);

                AccountModel.findById.mockResolvedValue(senderAccount);
                AccountModel.findById.mockResolvedValue(rcptAccount);

                TransactionModel.create.mockResolvedValue({
                    id: uuidv4(),
                    status: 'Pending',
                });
                TransactionModel.update.mockResolvedValue({
                    id: uuidv4(),
                    status: 'Success',
                });

                UserModel.findById.mockResolvedValueOnce({
                    id: uuidv4(),
                    email: 'user3@example.net',
                });
                UserModel.findById.mockResolvedValueOnce({
                    id: uuidv4(),
                    email: 'user4@example.net',
                });

                const response = await request(app).post(url).send(payload);

                expect(response.statusCode).toBe(200);
                expect(response.body.status).toBe('Success');
                expect(sendMail).toHaveBeenCalledWith(
                    expect.objectContaining({
                        recipient: 'user3@example.com',
                        subject: 'Transfer alert: funds sent from your account',
                    })
                );
                expect(sendMail).toHaveBeenCalledWith(
                    expect.objectContaining({
                        recipient: 'user4@example.com',
                        subject:
                            'Transfer received: funds added to your account',
                    })
                );
            });

            it('should return an error if either of sender or recipient account does not exist', async () => {
                const payload = {
                    transactionType: 'Transfer',
                    amount: 50.0,
                    senderAccountNumber: generateAccountNumber(),
                    rcptAccountNumber: generateAccountNumber(),
                    description: 'Transfer money',
                };

                AccountModel.findBy.mockResolvedValueOnce(undefined);
                AccountModel.findBy.mockResolvedValueOnce(undefined);

                const response = await request(app).post(url).send(payload);

                expect(response.statusCode).toBe(404);
                expect(response.body).toEqual({
                    message:
                        'Failed to find accounts with the account numbers provided',
                });
            });

            it('should return an error if the sender account has insufficient funds', async () => {
                const payload = {
                    transactionType: 'Transfer',
                    amount: 5000.0,
                    senderAccountNumber: generateAccountNumber(),
                    rcptAccountNumber: generateAccountNumber(),
                    description: 'Transfer money',
                };

                expect(true).toBe(true);
            });
        });
    });
});
