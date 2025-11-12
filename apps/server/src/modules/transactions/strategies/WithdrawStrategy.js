import { BaseTransactionStrategy } from './BaseTransactionStrategy.js';
import { Result } from '../utils/Result.js';

export class WithdrawStrategy extends BaseTransactionStrategy {
    async execute(transactionData) {
        // Find sender account
        const accountResult = await this.findAccountByNumber(transactionData.accountNumber);
        if (!accountResult.isSuccess) {
            return accountResult;
        }
        
        const senderAccount = accountResult.data;

        // Check sufficient funds
        const fundsCheck = this.checkSufficientFunds(senderAccount, transactionData.amount);
        if (!fundsCheck.isSuccess) {
            return fundsCheck;
        }

        // Create transaction
        const transaction = await this.TransactionModel.create({
            amount: transactionData.amount,
            transaction_type: 'Withdraw',
            from_id: senderAccount.id,
            status: 'Pending',
        });

        // Update account balance
        const updateResult = await this.updateFunds(senderAccount.id, transactionData.amount, 'remove');
        
        // Update transaction status
        const status = updateResult.isSuccess ? 'Success' : 'Failed';
        const updatedTransaction = await this.updateTransactionStatus(transaction.id, status);

        // Send notification email
        await this.sendTransactionEmail(
            senderAccount.user_id,
            'Notification: Funds withdrawn from your bank account',
            'A withdrawal has been made from your bank account. Please review your account balance or transaction history to confirm the details of this withdrawal. If you did not authorize this transaction, please contact our customer service team immediately for assistance.'
        );

        return Result.success(updatedTransaction);
    }
}