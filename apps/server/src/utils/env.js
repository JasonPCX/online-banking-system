import { z } from 'zod';
import { config } from 'dotenv';
import { environments } from '../contants/constants.js';

config();

const envSchema = z.object({
    NODE_ENV: z.enum(environments),
    SERVER_PORT: z.coerce.number().default(5001),

    LOG_LEVEL: z.string(),

    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),

    JWT_SECRET: z.string(),

    MAIL_HOST: z.string(),
    MAIL_PORT: z.string(),
    MAIL_FROM: z.string(),
    MAIL_USERNAME: z.string(),
    MAIL_PASSWORD: z.string(),
    MAIL_SECURE: z.coerce.boolean(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.log(result.error.format());
    process.exit(1);
}

const ENV = result.data;

export {
    ENV
};
