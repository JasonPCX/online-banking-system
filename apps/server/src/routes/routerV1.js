import { Router } from 'express';

import userRoutes from '../modules/users/user.routes.js';
import accountRoutes from '../modules/accounts/account.routes.js';
import transactionRoutes from '../modules/transactions/transaction.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import { accountTypeNames } from '../utils/generateAccountNumber.js';

const router = Router();

router.get('/ping', (_, res) => {
    res.status(200).send('pong');
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.get('/account-types', (req, res) => res.json(accountTypeNames));

export default router;