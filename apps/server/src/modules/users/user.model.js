import generateHash from "../../utils/generateHash.js";
import { Model } from "../common/model.js";

export class UserModel extends Model {
    static tableName = 'users';

    static async checkUserExists({ email, username }) {
        const user = await this.model.where('email', email).orWhere('username', username).first();

        return user;
    }

    static async register(data) {
        const passwordHash = await generateHash(data.password);
        const payload = {
            full_name: data.full_name,
            email: data.email,
            username: data.username,
            password: passwordHash,
        }
        return super.create(payload);
    }

    static async getAll() {
        return this.model.select(['email', 'username', 'full_name', 'last_login'])
    }
}