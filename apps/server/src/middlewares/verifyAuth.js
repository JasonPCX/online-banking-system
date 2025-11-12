import { ENV } from "../utils/env.js";
import { decodeData } from "../utils/jwt.js";

function verifyAuth(req, res, next) {
    try {
        if (ENV.NODE_ENV == 'test') {
            next();
            return;
        }

        const auth = req.headers.authorization;

        if (!auth) {
            return res.status(401).json({
                message: 'Unauthenticated',
            });
        }

        const token = auth.split(' ')[1];

        const decodedData = decodeData(token)
        req.userData = decodedData.data;
        
        next();
    } catch (error) {
        next(error);
    }
}

export default verifyAuth;
