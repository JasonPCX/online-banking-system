import { AccountModel } from "./account.model.js";

export async function createAccount(req, res, next) {
    try {
        const accountType = req.body.accountType;
        const user_id = req.userData.id;

        const newAccount = await AccountModel.create({
            accountType,
            user_id,
        });

        if (!newAccount) {
            return res.status(400).json({
                message: 'Account cannot be created',
            });
        }

        res.status(201).json(newAccount);
    } catch (error) {
        next(error);
    }
}

export async function getAccounts(req, res, next) {
    try {
        const userData = req.userData;

        const accounts = await AccountModel.getAllByUserId(userData.id);

        res.json(accounts);
    } catch (error) {
        next(error);
    }
}

export async function getAccount(req, res, next) {
    try {
        const accountId = req.params.id;
        const user_id = req.userData.id;

        const account = await AccountModel.findBy({
            id: accountId,
            user_id,
        });

        res.json(account);
    } catch (error) {
        next(error);
    }
}