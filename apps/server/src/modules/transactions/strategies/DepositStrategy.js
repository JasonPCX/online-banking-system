import { BaseTransactionStrategy } from './BaseTransactionStrategy.js';
import { Result } from '../utils/Result.js';

export class DepositStrategy extends BaseTransactionStrategy {
    async execute(transactionData) {
        // Find recipient account
        const accountResult = await this.findAccountByNumber(transactionData.rcptAccountNumber);
        if (!accountResult.isSuccess) {
            return accountResult;
        }
        
        const rcptAccount = accountResult.data;

        // Create transaction
        const transaction = await this.TransactionModel.create({
            amount: transactionData.amount,
            transaction_type: 'Deposit',
            rcpt_id: rcptAccount.id,
            status: 'Pending',
        });

        // Update account balance
        const updateResult = await this.updateFunds(rcptAccount.id, transactionData.amount, 'add');
        
        // Update transaction status
        const status = updateResult.isSuccess ? 'Success' : 'Failed';
        const updatedTransaction = await this.updateTransactionStatus(transaction.id, status);

        // Send notification email
        await this.sendTransactionEmail(
            rcptAccount.user_id,
            'Notification: Deposit made to your bank account',
            'A deposit has been made to your bank account. Please check your account balance or transaction history for more details. If you did not authorize this transaction, please contact our customer service team immediately.'
        );

        return Result.success(updatedTransaction);
    }
}