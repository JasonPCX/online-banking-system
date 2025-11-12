import React from 'react';
import { AccountsLoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState, EmptyAccountsState } from '@/components/ui/empty-states';
import { AccountCard } from './AccountCard';

interface AccountsListProps {
    accounts: any[];
    isLoading: boolean;
    error: Error | null;
    onCreateAccount?: () => void;
    onRetry?: () => void;
}

function AccountsList({ accounts, isLoading, error, onCreateAccount, onRetry }: AccountsListProps) {
    if (isLoading) {
        return <AccountsLoadingSkeleton />;
    }

    if (error) {
        return (
            <ErrorState 
                title="Unable to load accounts"
                message={error.message}
                onRetry={onRetry}
            />
        );
    }

    if (!accounts || accounts.length === 0) {
        return <EmptyAccountsState onCreateAccount={onCreateAccount} />;
    }

    return (
        <div className='flex gap-4 overflow-x-auto pb-4'>
            {accounts.map((account, index) => (
                <AccountCard key={account.id || index} account={account} />
            ))}
        </div>
    );
}

export default AccountsList;
