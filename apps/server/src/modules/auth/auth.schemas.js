import { z } from 'zod';

import { userSchema } from '../users/user.schemas.js';

const signUpSchema = userSchema.omit({ id: true })
    .extend({
        confirmPassword: z.string({ required_error: 'Password confirmation is required' }),
    })
    .refine((data) => data.password == data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

const logInSchema = userSchema.pick({ username: true, password: true });

export const logInRequestSchema = z.object({
    body: logInSchema
});

export const signUpRequestSchema = z.object({
    body: signUpSchema
});