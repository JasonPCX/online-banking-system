import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TransactionsLoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState, EmptyTransactionsState } from '@/components/ui/empty-states';
import { TransactionItem } from './TransactionItem';

interface TransactionsListProps {
    transactions: any[];
    isLoading: boolean;
    error: Error | null;
    maxItems?: number;
    currentAccountId?: string; // To determine transfer direction
}

function TransactionsList({ transactions, isLoading, error, maxItems = 10, currentAccountId }: TransactionsListProps) {
    if (isLoading) {
        return <TransactionsLoadingSkeleton />;
    }

    if (error) {
        return (
            <ErrorState 
                title="Unable to load transactions"
                message={error.message}
            />
        );
    }

    if (!transactions || transactions.length === 0) {
        return <EmptyTransactionsState />;
    }

    const displayedTransactions = transactions.slice(0, maxItems);

    return (
        <Card>
            <CardContent className='p-6'>
                <div className='space-y-4'>
                    {displayedTransactions.map((transaction: any) => (
                        <TransactionItem 
                            key={transaction.id} 
                            transaction={transaction}
                            currentAccountId={currentAccountId}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default TransactionsList;
