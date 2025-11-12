import { Model } from "../common/model.js";
import generateAccountNumber, { accountTypes } from "../../utils/generateAccountNumber.js";

export class AccountModel extends Model {
    static tableName = 'accounts';

    static async create({ user_id, accountType = "checkingAccount" }) {
        const account_number = generateAccountNumber(accountType);
        const account_type = accountType;
        const [result] = await this.model.insert({
            account_number,
            account_type,
            user_id,
        }).returning('*');
        return result;
    }

    static async getAllByUserId (userId) {
        return this.model.where('user_id', userId);
    }

    static async findByUserId (userId) {
        return super.findBy({
            user_id: userId
        })
    }
}