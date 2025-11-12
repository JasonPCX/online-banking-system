import { UserModel } from "./user.model.js";

export async function getAllUsers(req, res, next) {
    try {
        const users = await UserModel.getAll();

        res.json(users);
    } catch (error) {
        next(error);
    }
}