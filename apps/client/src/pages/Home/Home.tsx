import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { getAccounts } from '@/services/accountsService';
import { getTransactions } from '@/services/transactionsService';
import AccountsList from '@/components/Home/AccountsList';
import TransactionsList from '@/components/shared/TransactionsList';
import CreateBankAccountDrawer from '@/components/Home/CreateBankAccountDrawer';

function Home() {
    const queryClient = useQueryClient();
    const {
        data: accounts,
        isLoading: isAccountsLoading,
        error: accountsError,
    } = useQuery('accounts', getAccounts);

    const {
        data: transactions,
        isLoading: isTransactionsLoading,
        error: transactionsError,
    } = useQuery('transactions', getTransactions);

    const userData = queryClient.getQueryData('userData');

    if (!userData) {
        return <Navigate to={'/login'} />;
    }

    return (
        <div className='space-y-6'>
            {/* Welcome Header */}
            <div className='border border-border bg-card rounded-lg px-6 py-4 flex flex-row justify-between items-center'>
                <div>
                    <h1 className='text-2xl font-semibold text-foreground'>
                        Welcome back, {userData.full_name}
                    </h1>
                    <p className='text-sm text-muted-foreground mt-1'>
                        Manage your accounts and track transactions
                    </p>
                </div>
                <Button variant='ghost' size='icon'>
                    <Bell className='h-5 w-5' />
                </Button>
            </div>

            {/* Accounts Section */}
            <section className='space-y-4'>
                <div className='flex flex-row justify-between items-center'>
                    <h2 className='text-xl font-medium text-foreground'>Your Accounts</h2>
                    <CreateBankAccountDrawer />
                </div>
                <AccountsList 
                    accounts={accounts} 
                    isLoading={isAccountsLoading} 
                    error={accountsError} 
                />
            </section>

            {/* Transactions Section */}
            <section className='space-y-4'>
                <div className='flex flex-row justify-between items-center'>
                    <h2 className='text-xl font-medium text-foreground'>Recent Transactions</h2>
                </div>
                <TransactionsList 
                    transactions={transactions} 
                    isLoading={isTransactionsLoading} 
                    error={transactionsError} 
                />
            </section>
        </div>
    );
}

export default Home;
