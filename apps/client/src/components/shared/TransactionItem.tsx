import React from 'react';
import { CircleFadingPlus, CopyMinus, Handshake, Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Transaction {
    id: string;
    transaction_type: string;
    amount: number;
    created_at: string;
    description?: string;
    from_id?: string;
    rcpt_id?: string;
    status: string;
    from_account_number?: string;
    from_account_type?: string;
    from_account_balance?: string;
    rcpt_account_number?: string;
    rcpt_account_type?: string;
    rcpt_account_balance?: string;
}

interface TransactionItemProps {
    transaction: Transaction;
    currentAccountId?: string; // To determine if it's incoming or outgoing transfer
}

const transactionTypeIcons: Record<string, JSX.Element> = {
    Transfer: <Handshake className='h-5 w-5' />,
    Withdraw: <CopyMinus className='h-5 w-5' />,
    Deposit: <CircleFadingPlus className='h-5 w-5' />,
};

const transactionTypeColors: Record<string, string> = {
    Transfer: 'text-blue-600',
    Withdraw: 'text-red-600',
    Deposit: 'text-green-600',
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

function formatDate(iso?: string | Date) {
    if (!iso) return '';
    const date = typeof iso === 'string' ? new Date(iso) : iso;
    if (isNaN(date.getTime())) return String(iso);
    return dateTimeFormatter.format(date);
}

function formatAccountNumber(accountNumber?: string) {
    if (!accountNumber) return '';
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
}

export function TransactionItem({ transaction, currentAccountId }: TransactionItemProps) {
    // For transfers, determine if it's incoming or outgoing based on the account being viewed
    const isIncomingTransfer = transaction.transaction_type === 'Transfer' && 
                              currentAccountId && 
                              transaction.rcpt_id === currentAccountId;
    
    const getAmountColor = (type: string) => {
        switch (type) {
            case 'Deposit':
                return 'text-green-600';
            case 'Withdraw':
                return 'text-red-600';
            case 'Transfer':
                return isIncomingTransfer ? 'text-green-600' : 'text-red-600';
            default:
                return 'text-foreground';
        }
    };

    const getAmountPrefix = (type: string) => {
        if (type === 'Deposit') return '+';
        if (type === 'Withdraw') return '-';
        if (type === 'Transfer') {
            return isIncomingTransfer ? '+' : '-';
        }
        return '';
    };

    const getTransactionDescription = () => {
        if (transaction.transaction_type === 'Transfer') {
            if (isIncomingTransfer) {
                return `Transfer Received`;
            } else {
                return `Transfer Sent`;
            }
        }
        return transaction.transaction_type;
    };

    const getTransactionDetails = () => {
        if (transaction.transaction_type === 'Transfer') {
            if (isIncomingTransfer) {
                return `From ${transaction.from_account_type} • ${formatAccountNumber(transaction.from_account_number)}`;
            } else {
                return `To ${transaction.rcpt_account_type} • ${formatAccountNumber(transaction.rcpt_account_number)}`;
            }
        }
        
        if (transaction.transaction_type === 'Withdraw' && transaction.from_account_type) {
            return `From ${transaction.from_account_type} • ${formatAccountNumber(transaction.from_account_number)}`;
        }
        
        if (transaction.transaction_type === 'Deposit' && transaction.rcpt_account_type) {
            return `To ${transaction.rcpt_account_type} • ${formatAccountNumber(transaction.rcpt_account_number)}`;
        }

        return formatDate(transaction.created_at);
    };

    return (
        <div className='flex items-center space-x-4'>
            <div className={`p-2 rounded-full bg-muted ${transactionTypeColors[transaction.transaction_type] || 'text-muted-foreground'}`}>
                {transactionTypeIcons[transaction.transaction_type] || <Receipt className='h-5 w-5' />}
            </div>
            <div className='flex-1 min-w-0'>
                <p className='font-medium text-foreground truncate'>
                    {getTransactionDescription()}
                </p>
                <p className='text-sm text-muted-foreground'>
                    {getTransactionDetails()}
                </p>
                {transaction.description && (
                    <p className='text-xs text-muted-foreground/75 truncate'>
                        {transaction.description}
                    </p>
                )}
            </div>
            <div className='text-right'>
                <p className={`font-semibold ${getAmountColor(transaction.transaction_type)}`}>
                    {getAmountPrefix(transaction.transaction_type)}
                    {formatCurrency(transaction.amount)}
                </p>
                <p className='text-xs text-muted-foreground'>
                    {formatDate(transaction.created_at)}
                </p>
            </div>
        </div>
    );
}