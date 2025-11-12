import jwt from 'jsonwebtoken';

import { ENV } from './env.js';

export function signData(data) {
    const token = jwt.sign({
        data,
    }, ENV.JWT_SECRET, {
        expiresIn: '1h'
    });

    return token
}

export function decodeData(token) {
    try {
        const decodedData = jwt.verify(token, ENV.JWT_SECRET);
        return decodedData
    } catch (error) {
        throw error;
    }
}