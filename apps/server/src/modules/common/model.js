import { db } from '../../database/db.js';

export class Model {
    static tableName;

    static get model() {
        if (!this.tableName) {
            throw new Error('Table name is not set')
        }
        return db(this.tableName);
    }

    static async getAll() {
        return this.model;
    }

    static async create(data) {
        const [result] = await this.model.insert(data).returning('*');
        return result;
    }

    static async findById(id) {
        return this.model.where('id', id).first();
    }

    static async findBy(data) {
        return this.model.where(data).first()
    }

    static async update(id, data) {
        const [result] = await this.model.where({ id }).update(data).returning('*');
        return result;
    }

    static async delete(id) {
        return this.model.where({ id }).del();
    }
}