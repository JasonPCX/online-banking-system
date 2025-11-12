import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from 'react-query';
import { createTransaction } from '@/services/transactionsService';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { isAxiosError } from 'axios';
import { Clipboard } from 'lucide-react';
import useClipboard from '@/hooks/useClipboard';

type TTransactionType = 'Withdraw' | 'Deposit' | 'Transfer';

function NewTransactionDrawer({ account }: { account: object }) {
    const [transactionType, setTransactionType] =
        useState<TTransactionType | null>(null);
    const [open, setOpen] = useState(false);

    function onCloseDrawer() {
        setOpen(false);
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <div className='flex flex-row justify-evenly items-center'>
                <DrawerTrigger asChild>
                    <Button className='font-medium rounded-3xl' onClick={() => setTransactionType('Withdraw')}>
                        Withdraw
                    </Button>
                </DrawerTrigger>
                <DrawerTrigger asChild>
                    <Button className='font-medium rounded-3xl' onClick={() => setTransactionType('Deposit')}>
                        Deposit
                    </Button>
                </DrawerTrigger>
                <DrawerTrigger asChild>
                    <Button className='font-medium rounded-3xl' onClick={() => setTransactionType('Transfer')}>
                        Transfer
                    </Button>
                </DrawerTrigger>
            </div>
            <DrawerContent>
                <div className='mx-auto w-full max-w-md space-y-3'>
                    <DrawerHeader>
                        <DrawerTitle>{transactionType}</DrawerTitle>
                        <DrawerDescription>
                            This action cannot be undone.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className='px-4'>
                        <div className='flex flex-row justify-between items-center border rounded-lg p-3'>
                            <div className='flex flex-col justify-start items-start'>
                                <span className='text-gray-600'>
                                    Account type
                                </span>
                                <h3 className='text-xl font-bold'>
                                    {account.account_type}
                                </h3>
                            </div>
                            <h3 className='text-2xl font-bold'>
                                ${account.balance}
                            </h3>
                        </div>
                        <TransactionDetailsForm
                            account={account}
                            transactionType={transactionType}
                            onCloseDrawer={onCloseDrawer}
                        />
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant='outline' className='w-full'>
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

const depositSchema = z.object({
    transactionType: z.literal('Deposit'),
    amount: z.coerce.number().positive(),
    rcptAccountNumber: z.string(),
});

const withdrawSchema = z.object({
    transactionType: z.literal('Withdraw'),
    amount: z.coerce.number().positive(),
    accountNumber: z.string(),
});

const transferSchema = z.object({
    transactionType: z.literal('Transfer'),
    amount: z.coerce.number().positive().min(1),
    senderAccountNumber: z.string(),
    rcptAccountNumber: z.string(),
    description: z.string().max(255),
});

const transactionFormSchema = z.discriminatedUnion('transactionType', [
    depositSchema,
    withdrawSchema,
    transferSchema,
]);

type TTransactionFormSchema = z.infer<typeof transactionFormSchema>;

function TransactionDetailsForm({
    account,
    transactionType,
    onCloseDrawer,
}: {
    account: object;
    transactionType: TTransactionType;
    onCloseDrawer: () => void;
}) {
    const { copy } = useClipboard();
    const queryClient = useQueryClient();
    const form = useForm<TTransactionFormSchema>({
        resolver: zodResolver(transactionFormSchema),
        values: {
            transactionType,
            senderAccountNumber:
                transactionType == 'Transfer' ? account.account_number : '',
            accountNumber:
                transactionType == 'Withdraw' ? account.account_number : '',
            description: '',
            rcptAccountNumber:
                transactionType == 'Deposit' ? account.account_number : '',
            amount: 1,
        },
    });

    const transactionMutation = useMutation(createTransaction, {
        onSuccess(data) {
            queryClient.invalidateQueries(['accounts', account.id]);
            queryClient.invalidateQueries('accountTransactions');
            queryClient.invalidateQueries('accounts');
            toast({
                title: 'Transaction successfully processed',
                description: (
                    <div className='mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-white flex flex-col justify-start items-start'>
                        <span className='mb-2'>Transaction ID</span>
                        <span className='font-bold text-lg uppercase'>
                            {data.id}
                        </span>
                        <Button
                            variant={'ghost'}
                            size={'sm'}
                            onClick={() => copy(data.id)}
                            className='mt-2'
                        >
                            <Clipboard />
                        </Button>
                    </div>
                ),
            });
            onCloseDrawer();
        },
        onError(error) {
            if (isAxiosError(error)) {
                toast({
                    variant: 'destructive',
                    title: 'Something went wrong',
                    description: error.response?.data?.message,
                });
                return;
            }
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
            });
        },
    });

    function onSubmit(data: TTransactionFormSchema) {
        transactionMutation.mutate(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
                {transactionType == 'Transfer' && (
                    <FormField
                        control={form.control}
                        name='rcptAccountNumber'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Recipient account number</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Recipient account number'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name='amount'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Amount'
                                    type='number'
                                    step='1'
                                    min={1}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {transactionType == 'Transfer' && (
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Details</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Transaction details'
                                        className='resize-none'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <Button className='w-full' type='submit'>
                    Submit
                </Button>
            </form>
        </Form>
    );
}

export default NewTransactionDrawer;
