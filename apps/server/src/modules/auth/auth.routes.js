import { Router } from 'express';

import { logInRequestSchema, signUpRequestSchema } from './auth.schemas.js';
import { logIn, signUp } from './auth.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';

const router = Router();

/**
 * @openapi
 * /auth/signup:
 *  post:
 *    tags:
 *      - Auth
 *    summary: User Signup
 *    description: Create a new user account 
 *    requestBody:
 *      description: Signup information for a new user
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/User'
 *              - type: object
 *                properties:
 *                  password:
 *                    type: string
 *                    description: 'Password of the new user'
 *                    example: 'Password1'
 *                  confirmPassword:
 *                    type: string
 *                    description: 'Password confirmation'
 *                    example: 'Password1'
 *    responses:
 *      201:
 *        description: Successfully created a new account
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *    
 */
router.post('/signup', [validateRequest(signUpRequestSchema)], signUp);
/**
 * @openapi
 * /auth/login:
 *  post:
 *      tags:
 *          - Auth
 *      summary: User login
 *      description: 'Access to user account'
 *      requestBody:
 *          description: 'Login information'
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: 'Username of the user'
 *                              example: 'john_doe'
 *                          password:
 *                              type: string
 *                              description: 'Password of the new user'
 *                              example: 'Password1'
 *      responses:
 *          200:
 *              description: 'User authenticated'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *                                  description: 'JWT token'
 */
router.post('/login', [validateRequest(logInRequestSchema)], logIn);
// router.post('/recover-password', [validateRequest(recoverPasswordSchema), recoverPassword]);
// router.post('/reset-password', [validateRequest(resetPasswordSchema), resetPassword]);

export default router;