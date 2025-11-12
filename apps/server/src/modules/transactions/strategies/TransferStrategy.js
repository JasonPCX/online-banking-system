import { BaseTransactionStrategy } from './BaseTransactionStrategy.js';
import { Result } from '../utils/Result.js';

export class TransferStrategy extends BaseTransactionStrategy {
    async execute(transactionData) {
        // Find both accounts
        const senderResult = await this.findAccountByNumber(transactionData.senderAccountNumber);
        const rcptResult = await this.findAccountByNumber(transactionData.rcptAccountNumber);
        
        if (!senderResult.isSuccess) {
            return senderResult;
        }
        if (!rcptResult.isSuccess) {
            return rcptResult;
        }
        
        const senderAccount = senderResult.data;
        const rcptAccount = rcptResult.data;

        // Check sufficient funds
        const fundsCheck = this.checkSufficientFunds(senderAccount, transactionData.amount);
        if (!fundsCheck.isSuccess) {
            return fundsCheck;
        }

        // Create transaction
        const transaction = await this.TransactionModel.create({
            amount: transactionData.amount,
            transaction_type: 'Transfer',
            description: transactionData.description,
            from_id: senderAccount.id,
            rcpt_id: rcptAccount.id,
            status: 'Pending',
        });

        // Execute transfer with rollback on failure
        const transferResult = await this.executeTransfer(senderAccount, rcptAccount, transactionData.amount);
        
        // Update transaction status
        const status = transferResult.isSuccess ? 'Success' : 'Failed';
        const updatedTransaction = await this.updateTransactionStatus(transaction.id, status);

        // Send notification emails
        await Promise.all([
            this.sendTransactionEmail(
                senderAccount.user_id,
                'Transfer alert: funds sent from your account',
                'A transfer has been initiated from your bank account. Please check your account balance or transaction history to view the details of this transfer. If you did not authorize this transaction, please contact our customer service team without delay.'
            ),
            this.sendTransactionEmail(
                rcptAccount.user_id,
                'Transfer received: funds added to your account',
                'You have received a funds transfer into your bank account. Please check your account balance or transaction history to view the details of this transfer. If this transaction was unexpected or if you have any concerns, please contact our customer service team for support.'
            )
        ]);

        return Result.success(updatedTransaction);
    }

    async executeTransfer(senderAccount, rcptAccount, amount) {
        // Deduct from sender
        const senderResult = await this.updateFunds(senderAccount.id, amount, 'remove');
        if (!senderResult.isSuccess) {
            return senderResult;
        }

        // Add to recipient
        const rcptResult = await this.updateFunds(rcptAccount.id, amount, 'add');
        if (!rcptResult.isSuccess) {
            // Rollback sender transaction
            await this.updateFunds(senderAccount.id, amount, 'add');
            return Result.failure('Transfer failed, transaction rolled back');
        }

        return Result.success(true);
    }
}