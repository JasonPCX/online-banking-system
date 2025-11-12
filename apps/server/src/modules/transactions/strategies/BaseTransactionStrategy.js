import { AccountModel } from '../../accounts/account.model.js';
import { TransactionModel } from '../transaction.model.js';
import { UserModel } from '../../users/user.model.js';
import { sendMail } from '../../../utils/mail.js';
import { Result } from '../utils/Result.js';

export class BaseTransactionStrategy {
    constructor() {
        this.AccountModel = AccountModel;
        this.TransactionModel = TransactionModel;
        this.UserModel = UserModel;
        this.sendMail = sendMail;
    }

    async execute(transactionData) {
        throw new Error('execute method must be implemented by subclasses');
    }

    async findAccountByNumber(accountNumber) {
        const account = await this.AccountModel.findBy({
            account_number: accountNumber
        });
        
        if (!account) {
            return Result.failure('Failed to find an account with the account number provided');
        }
        
        return Result.success(account);
    }

    checkSufficientFunds(account, amount) {
        const accountBalance = parseFloat(account.balance);
        const transactionAmount = parseFloat(amount);
        
        if (accountBalance < transactionAmount) {
            return Result.failure('Insufficient funds for this transaction');
        }
        
        return Result.success(true);
    }

    async updateFunds(accountId, amount, action) {
        try {
            const account = await this.AccountModel.findById(accountId);
            if (!account) {
                return Result.failure('Account not found');
            }

            let newBalance = parseFloat(account.balance);
            const amountValue = parseFloat(amount);

            if (action === 'remove') {
                newBalance = newBalance - amountValue;
                if (newBalance < 0) {
                    return Result.failure('Insufficient funds');
                }
            } else if (action === 'add') {
                newBalance = newBalance + amountValue;
            }

            const updatedAccount = await this.AccountModel.update(account.id, {
                balance: newBalance.toFixed(2),
            });

            return updatedAccount ? Result.success(updatedAccount) : Result.failure('Failed to update account');
        } catch (error) {
            console.error('Error updating funds:', error);
            return Result.failure('Database error');
        }
    }

    async updateTransactionStatus(transactionId, status) {
        return await this.TransactionModel.update(transactionId, { status });
    }

    async sendTransactionEmail(userId, subject, text) {
        const user = await this.UserModel.findById(userId);
        await this.sendMail({
            recipient: user.email,
            subject,
            text,
        });
    }
}