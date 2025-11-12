import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Account {
    id: string;
    account_type: string;
    account_number: string;
    balance: number;
}

interface AccountCardProps {
    account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
    return (
        <Card className='min-w-[280px] flex-shrink-0 hover:shadow-md transition-shadow'>
            <CardContent className='p-6'>
                <Link to={`/account/${account.id}`} className='block space-y-4'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <h3 className='font-medium text-foreground'>
                                {account.account_type}
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                                ****{account.account_number?.slice(-4)}
                            </p>
                        </div>
                        <CreditCard className='h-5 w-5 text-muted-foreground' />
                    </div>
                    <div>
                        <p className='text-3xl font-bold text-foreground'>
                            {formatCurrency(account.balance)}
                        </p>
                        <p className='text-sm text-muted-foreground'>Available balance</p>
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
}