import React from 'react';
import { useQuery } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Clipboard, CreditCard, ArrowLeftRight, ArrowLeft } from 'lucide-react';

import TransactionsList from '@/components/shared/TransactionsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAccountById } from '@/services/accountsService';
import { getTransactionsByAccountId } from '@/services/transactionsService';
import NewTransactionDrawer from '@/components/shared/NewTransactionDrawer';
import useClipboard from '@/hooks/useClipboard';
import { formatCurrency } from '@/lib/utils';

function Account() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { copy } = useClipboard();
    const {
        isLoading: isAccountLoading,
        error: accountError,
        data: account,
    } = useQuery({
        queryKey: ['accounts', id],
        queryFn: () => getAccountById(id as string),
        enabled: id !== undefined,
    });
    const {
        data: transactions,
        isLoading: isTransactionsLoading,
        error: transactionsError,
    } = useQuery({
        queryKey: ['accountTransactions'],
        queryFn: () => getTransactionsByAccountId(id as string),
        enabled: id !== undefined,
    });

    if (isAccountLoading) {
        return (
            <div className='space-y-6'>
                {/* Account Info Skeleton */}
                <Card>
                    <CardContent className='p-8'>
                        <div className='text-center space-y-6'>
                            <div className='space-y-2'>
                                <Skeleton className='h-6 w-24 mx-auto' />
                                <Skeleton className='h-8 w-32 mx-auto' />
                            </div>
                            <div className='space-y-2'>
                                <Skeleton className='h-6 w-16 mx-auto' />
                                <Skeleton className='h-12 w-40 mx-auto' />
                            </div>
                            <div className='space-y-2'>
                                <Skeleton className='h-6 w-32 mx-auto' />
                                <Skeleton className='h-6 w-48 mx-auto' />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (accountError) {
        return (
            <Card className='border-destructive/50 bg-destructive/10'>
                <CardContent className='p-8 text-center'>
                    <div className='text-destructive'>
                        <p className='font-medium'>Unable to load account</p>
                        <p className='text-sm mt-1'>
                            Something went wrong while trying to retrieve account info
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Back Navigation */}
            <div className='flex items-center gap-4'>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => navigate('/home')}
                    className='flex items-center gap-2'
                >
                    <ArrowLeft className='h-4 w-4' />
                    Back
                </Button>
                <div className='h-4 w-px bg-border' />
                <h1 className='text-2xl font-semibold text-foreground'>Account Details</h1>
            </div>

            {/* Account Overview Card */}
            {account && (
                <Card>
                    <CardContent className='p-8'>
                        <div className='text-center space-y-6'>
                            {/* Account Icon and Type */}
                            <div className='space-y-3'>
                                <div className='mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
                                    <CreditCard className='h-8 w-8 text-primary' />
                                </div>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Account Type</p>
                                    <h1 className='text-2xl font-semibold text-foreground'>
                                        {account.account_type}
                                    </h1>
                                </div>
                            </div>

                            {/* Balance */}
                            <div className='space-y-1'>
                                <p className='text-sm text-muted-foreground'>Available Balance</p>
                                <p className='text-4xl font-bold text-foreground'>
                                    {formatCurrency(account.balance)}
                                </p>
                            </div>

                            {/* Account Number */}
                            <div className='space-y-3'>
                                <p className='text-sm text-muted-foreground'>Account Number</p>
                                <div className='flex items-center justify-center gap-2'>
                                    <span className='text-lg font-mono tracking-wider'>
                                        {account.account_number}
                                    </span>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => copy(account.account_number)}
                                        className='h-8 w-8 p-0'
                                    >
                                        <Clipboard className='h-4 w-4' />
                                    </Button>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className='pt-2'>
                                <NewTransactionDrawer account={account} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Transactions Section */}
            <section className='space-y-4'>
                <div className='flex flex-row justify-between items-center'>
                    <h2 className='text-xl font-medium text-foreground'>Transaction History</h2>
                    {/* TODO: implement filter */}
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <ArrowLeftRight className='h-4 w-4' />
                        <span>Recent Activity</span>
                    </div>
                </div>
                <TransactionsList
                    transactions={transactions}
                    isLoading={isTransactionsLoading}
                    error={transactionsError}
                    currentAccountId={id}
                />
            </section>
        </div>
    );
}

export default Account;
