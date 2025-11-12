import { Router } from 'express';
import { createAccount, getAccount, getAccounts } from './account.controller.js';
import verifyAuth from '../../middlewares/verifyAuth.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { createAccountRequestSchema } from './account.schemas.js';

const router = Router();

router.get('/', [verifyAuth, getAccounts]);
router.get('/:id', [verifyAuth, getAccount]);
router.post('/', [verifyAuth, validateRequest(createAccountRequestSchema), createAccount]);

export default router;