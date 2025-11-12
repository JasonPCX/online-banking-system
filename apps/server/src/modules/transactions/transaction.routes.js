import { Router} from 'express';

import verifyAuth from '../../middlewares/verifyAuth.js';
import { createTransaction, getTransactions, getTransactionsByAccountId } from './transaction.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { transactionRequestSchema } from './transaction.schemas.js';

const router = Router();

router.get('/', [verifyAuth, getTransactions]);
router.post('/', [verifyAuth, validateRequest(transactionRequestSchema), createTransaction]);
router.get('/account/:accountId', [verifyAuth, getTransactionsByAccountId]);

export default router;