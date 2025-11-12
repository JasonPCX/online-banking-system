import { MainApi } from '@/lib/axios';

const resource = 'account-types';

export const getAccountTypes = async () => MainApi.GET(`/${resource}`);
