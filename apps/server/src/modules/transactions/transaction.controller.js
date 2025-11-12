import { AccountModel } from '../accounts/account.model.js';
import { TransactionModel } from './transaction.model.js';
import { DepositStrategy } from './strategies/DepositStrategy.js';
import { WithdrawStrategy } from './strategies/WithdrawStrategy.js';
import { TransferStrategy } from './strategies/TransferStrategy.js';

export async function createTransaction(req, res, next) {
    try {
        const { transactionType } = req.body;
        
        // Input validation
        if (!transactionType) {
            return res.status(400).json({
                message: 'Transaction type is required'
            });
        }

        // Create strategy based on transaction type
        let strategy;
        if (transactionType === 'Deposit') {
            strategy = new DepositStrategy();
        } else if (transactionType === 'Withdraw') {
            strategy = new WithdrawStrategy();
        } else if (transactionType === 'Transfer') {
            strategy = new TransferStrategy();
        } else {
            return res.status(400).json({
                message: `Unsupported transaction type: ${transactionType}`
            });
        }

        // Execute strategy
        const result = await strategy.execute(req.body);

        // Handle result
        if (result.isSuccess) {
            return res.status(200).json(result.data);
        } else {
            // Determine appropriate status code based on error
            const statusCode = result.error.includes('find') ? 404 : 400;
            return res.status(statusCode).json({
                message: result.error
            });
        }
    } catch (error) {
        next(error);
    }
}

// Legacy function kept for backward compatibility
async function handleUpdateFunds(accountId, amount, action) {
    try {
        const account = await AccountModel.findById(accountId);
        if (!account) {
            return 'Failed';
        }

        let newBalance = parseFloat(account.balance);
        const amountValue = parseFloat(amount);

        if (action == 'remove') {
            newBalance = newBalance - amountValue;
            if (newBalance < 0) {
                return 'Insufficient funds';
            }
        } else if (action == 'add') {
            newBalance = newBalance + amountValue;
        }

        const updatedAccount = await AccountModel.update(account.id, {
            balance: newBalance.toFixed(2),
        });

        return updatedAccount ? 'Success' : 'Failed';
    } catch (error) {
        console.error('Error updating funds:', error);
        return 'Failed';
    }
}

export async function getTransactions(req, res, next) {
    try {
        const userData = req.userData;

        const transactions = await TransactionModel.getLatestByUserId(
            userData.id
        );

        res.json(transactions);
    } catch (error) {
        next(error);
    }
}

export async function getTransactionsByAccountId(req, res, next) {
    try {
        const accountId = req.params.accountId;
        const userData = req.userData;

        // First, verify that the account belongs to the authenticated user
        const account = await AccountModel.findById(accountId);
        
        if (!account) {
            return res.status(404).json({
                message: 'Account not found'
            });
        }

        if (account.user_id !== userData.id) {
            return res.status(403).json({
                message: 'Access denied: You can only view transactions for your own accounts'
            });
        }

        const transactions = await TransactionModel.getLatestByAccountId(
            accountId
        );

        res.json(transactions);
    } catch (error) {
        next(error);
    }
}
