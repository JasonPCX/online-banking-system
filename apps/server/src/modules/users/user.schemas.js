import { z } from 'zod';

import { params } from '../common/schemas.js';

/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        full_name:
 *          type: string
 *          description: 'The full name of the user'
 *          example: 'John'
 *        username:
 *          type: string
 *          minLength: 5
 *          maxLength: 16
 *          example: 'john_doe'
 *          description: 'The username of the user'
 *        email:
 *          type: string
 *          format: email
 *          example: 'johndoe@example.net'
 *          description: 'The email address of the user'
 *      required:
 *        - firstName
 *        - lastName
 *        - username
 *        - email
 */

export const userSchema = z.object({
    id: z.string().uuid(),
    full_name: z.string({
        required_error: "First name is required",
    }),
    username: z
        .string({
            required_error: "Username is required",
        })
        .min(5, { message: "Username must be 5 chars minimum" })
        .max(16, { message: 'Username must be 16 chars maximum' }),
    email: z
        .string({
            required_error: "Email is required",
        })
        .email({
            message: "Not a valid email",
        }),
    password: z.string({ required_error: 'Password is required' }),
});

export const readUserRequestSchema = z.object({
    params,
});

export const updateUserRequestSchema = z.object({
    params,
    body: userSchema.omit({ password: true }),
});

export const deleteUserRequestSchema = z.object({
    params,
});