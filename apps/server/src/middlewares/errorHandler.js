import { ZodError } from "zod";
import { getReasonPhrase } from "http-status-codes";

import { ENV } from "../utils/env.js";
import { HttpError } from '../utils/HttpError.js';
import { logger } from '../utils/logger.js';

export default function errorHandler(error, req, res, next) {
    if (error.name == 'TokenExpiredError') {
        return res.status(403).json({
            message: 'Session expired',
        });
    } else if (error.name == 'JsonWebTokenError') {
        return res.status(403).json({
            message: 'Bad credentials',
        });
    } else if (error instanceof ZodError) {
        const formattedErrors = error.format();

        return res.status(422).json(formattedErrors);
    } else if (error instanceof HttpError) {
        return res.status(error.status).json(error.toProblemDetails());
    } else {
        logger.error(error);
        return res.status(500).json({
            message: ENV.NODE_ENV == "development" ? error.message : getReasonPhrase(500),
        });
    }
}