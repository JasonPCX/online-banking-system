import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Receipt } from 'lucide-react';

interface ErrorStateProps {
    title: string;
    message: string;
    onRetry?: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
    return (
        <Card className='border-destructive/50 bg-destructive/10'>
            <CardContent className='p-6 text-center'>
                <div className='text-destructive'>
                    <p className='font-medium'>{title}</p>
                    <p className='text-sm mt-1'>{message}</p>
                    {onRetry && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className='mt-4'
                            onClick={onRetry}
                        >
                            Try Again
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

interface EmptyAccountsStateProps {
    onCreateAccount?: () => void;
}

export function EmptyAccountsState({ onCreateAccount }: EmptyAccountsStateProps) {
    return (
        <Card className='border-dashed'>
            <CardContent className='p-8 text-center'>
                <CreditCard className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='font-medium text-foreground mb-2'>No accounts yet</h3>
                <p className='text-sm text-muted-foreground mb-4'>
                    Create your first bank account to get started
                </p>
            </CardContent>
        </Card>
    );
}

export function EmptyTransactionsState() {
    return (
        <Card className='border-dashed'>
            <CardContent className='p-8 text-center'>
                <Receipt className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='font-medium text-foreground mb-2'>No transactions yet</h3>
                <p className='text-sm text-muted-foreground'>
                    Your recent transactions will appear here
                </p>
            </CardContent>
        </Card>
    );
}