import { Model } from "../common/model.js";
import { db } from "../../database/db.js";


export class TransactionModel extends Model {
    static tableName = 'transactions';

    static async getLatestByAccountId(accountId) {
        return this.model
            .leftJoin('accounts as from_account', 'transactions.from_id', '=', 'from_account.id')
            .leftJoin('accounts as rcpt_account', 'transactions.rcpt_id', '=', 'rcpt_account.id')
            .where('from_id', accountId)
            .orWhere('rcpt_id', accountId)
            .select([
                'transactions.*',
                'from_account.account_number as from_account_number',
                'from_account.account_type as from_account_type',
                'from_account.balance as from_account_balance',
                'rcpt_account.account_number as rcpt_account_number',
                'rcpt_account.account_type as rcpt_account_type',
                'rcpt_account.balance as rcpt_account_balance'
            ])
            .orderBy('transactions.created_at', 'desc');
    }

    static async getLatestByUserId(userId) {
        // First, get all account IDs for this user
        const userAccounts = await db('accounts').select('id').where('user_id', userId);
        const accountIds = userAccounts.map(account => account.id);
        
        if (accountIds.length === 0) {
            return []; // User has no accounts, return empty array
        }

        // Get transactions with account information for both sender and recipient
        return this.model
            .leftJoin('accounts as from_account', 'transactions.from_id', '=', 'from_account.id')
            .leftJoin('accounts as rcpt_account', 'transactions.rcpt_id', '=', 'rcpt_account.id')
            .where(function() {
                this.whereIn('transactions.from_id', accountIds)
                    .orWhereIn('transactions.rcpt_id', accountIds);
            })
            .select([
                'transactions.*',
                'from_account.account_number as from_account_number',
                'from_account.account_type as from_account_type',
                'from_account.balance as from_account_balance',
                'rcpt_account.account_number as rcpt_account_number',
                'rcpt_account.account_type as rcpt_account_type',
                'rcpt_account.balance as rcpt_account_balance'
            ])
            .orderBy('transactions.created_at', 'desc');
    }
}