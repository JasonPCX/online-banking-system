import { z } from 'zod';

import { accountTypeNames } from '../../utils/generateAccountNumber.js';

export const createAccountRequestSchema = z.object({
    body: z.object({
        accountType: z.enum(accountTypeNames),
    })
})