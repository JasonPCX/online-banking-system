import { MainApi } from "@/lib/axios";

const resource = 'accounts'

export const getAccounts = () => MainApi.GET(`/${resource}`);

export const getAccountById = (accountId: string) => MainApi.GET(`${resource}/${accountId}`);

export const createAccount = (data: object) => MainApi.POST(`/${resource}`, data);
