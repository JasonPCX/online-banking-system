import pino from 'pino';
import { ENV } from './env.js';

export const logger = pino({
    level: ENV.LOG_LEVEL,
    base: {
        pid: false,
    },
    transport: {
        target: 'pino-pretty',
    }
});
