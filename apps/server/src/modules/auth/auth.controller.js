import bcrypt from 'bcrypt';

import { signData } from '../../utils/jwt.js';
import { sendMail } from '../../utils/mail.js';
import { UserModel } from '../users/user.model.js';

export async function signUp(req, res, next) {
    try {
        const existingUser = await UserModel.checkUserExists(req.body);

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exist',
            });
        }

        const newUser = await UserModel.register(req.body);

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}

export async function logIn(req, res, next) {
    try {
        const existingUser = await UserModel.findBy({
            username: req.body.username,
        });

        if (!existingUser) {
            return res.status(401).json({
                message: 'Incorrect username or password',
            });
        }

        if (existingUser.failed_login_attempts >= 3) {
            return res.status(401).json({
                message: 'Your account is blocked',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            const updatedUser = await UserModel.update(existingUser.id, {
                failed_login_attempts: existingUser.failed_login_attempts + 1,
            });
            if (updatedUser.failed_login_attempts == 3) {
                await sendMail({
                    recipient: existingUser.email,
                    subject: 'Alert: Your account has been blocked',
                    text: 'Someone attempted to log into your account, and after three incorrect attempts, we have blocked your account.',
                });
                return res.status(401).json({
                    message: 'Your account has been blocked',
                });
            }
            return res.status(401).json({
                message: 'Incorrect username or password',
            });
        }

        const user = await UserModel.update(existingUser.id, {
            last_login: new Date(),
            failed_login_attempts: 0,
        });

        const token = signData(user);

        res.json({
            token,
        });
    } catch (error) {
        next(error);
    }
}

export async function recoverPassword(req, res, next) {
    try {
    } catch (error) {
        next(error);
    }
}

export async function recoverPasswordRequest(req, res, next) {
    try {
    } catch (error) {
        next(error);
    }
}
