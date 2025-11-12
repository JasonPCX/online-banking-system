import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AccountsLoadingSkeletonProps {
    count?: number;
}

export function AccountsLoadingSkeleton({ count = 3 }: AccountsLoadingSkeletonProps) {
    return (
        <div className='flex gap-4 overflow-x-auto pb-4'>
            {[...Array(count)].map((_, index) => (
                <Card key={index} className='min-w-[280px] flex-shrink-0'>
                    <CardContent className='p-6'>
                        <div className='space-y-4'>
                            <div className='flex justify-between items-start'>
                                <div className='space-y-2'>
                                    <Skeleton className='h-5 w-20' />
                                    <Skeleton className='h-4 w-16' />
                                </div>
                                <Skeleton className='h-5 w-5' />
                            </div>
                            <div className='space-y-2'>
                                <Skeleton className='h-8 w-32' />
                                <Skeleton className='h-4 w-24' />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

interface TransactionsLoadingSkeletonProps {
    count?: number;
}

export function TransactionsLoadingSkeleton({ count = 5 }: TransactionsLoadingSkeletonProps) {
    return (
        <Card>
            <CardContent className='p-6'>
                <div className='space-y-4'>
                    {[...Array(count)].map((_, index) => (
                        <div key={index} className='flex items-center space-x-4'>
                            <Skeleton className='h-10 w-10 rounded-full' />
                            <div className='flex-1 space-y-2'>
                                <Skeleton className='h-4 w-32' />
                                <Skeleton className='h-3 w-24' />
                            </div>
                            <Skeleton className='h-4 w-16' />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}