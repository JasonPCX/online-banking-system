import { MainApi } from '@/lib/axios';

const resource = 'transactions';

export const getTransactions = () => MainApi.GET(`/${resource}`);

export const getTransactionsByAccountId = (accountId: string) =>
    MainApi.GET(`/${resource}/account/${accountId}`);

export const createTransaction = (data: object) =>
    MainApi.POST(`${resource}`, data);
