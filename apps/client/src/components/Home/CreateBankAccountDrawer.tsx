import React, { useState } from 'react';
import { Plus } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAccountTypes } from '@/services/accountTypesService';
import { createAccount } from '@/services/accountsService';
import { isAxiosError } from 'axios';

function CreateBankAccountDrawer() {
    const [open, setOpen] = useState(false);

    function onCloseDrawer() {
        setOpen(false);
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant={'default'}>
                    <Plus />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className='mx-auto w-full max-w-md'>
                    <DrawerHeader>
                        <DrawerTitle>Create new account</DrawerTitle>
                        <DrawerDescription>
                            Lets create a new bank account so you can start
                            making transactions. Your new account will start with <strong>$2,000</strong>.
                        </DrawerDescription>
                    </DrawerHeader>
                    <CreateBankAccountForm onCloseDrawer={onCloseDrawer} />
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant='outline'>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

const CreateBankAccountFormSchema = z.object({
    accountType: z.string({
        required_error: 'You need to select a notification type.',
    }),
});

type TCreateBankAccountForm = z.infer<typeof CreateBankAccountFormSchema>;

function CreateBankAccountForm({
    onCloseDrawer,
}: {
    onCloseDrawer: () => void;
}) {
    const queryClient = useQueryClient();
    const { data: accountTypes } = useQuery('accountTypes', getAccountTypes);
    const form = useForm<TCreateBankAccountForm>({
        resolver: zodResolver(CreateBankAccountFormSchema),
    });

    const createBankAccountMutation = useMutation(createAccount, {
        onSuccess(data) {
            queryClient.invalidateQueries('accounts');
            toast({
                title: 'Account successfully created',
                description: (
                    <div className='mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-white flex flex-col'>
                        <span className='font-bold text-lg uppercase'>
                            {data.account_type}
                        </span>
                        <span className='mt-2'>{data.account_number}</span>
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

    function onSubmit(data: TCreateBankAccountForm) {
        createBankAccountMutation.mutate(data);
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6 px-4'
            >
                <FormField
                    control={form.control}
                    name='accountType'
                    render={({ field }) => (
                        <FormItem className='space-y-3'>
                            <FormLabel>
                                Select a type for your new account
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className='flex flex-col space-y-1'
                                >
                                    {accountTypes?.length > 0 &&
                                        accountTypes?.map(
                                            (accountType, index) => (
                                                <FormItem
                                                    key={index}
                                                    className='flex items-center space-x-3 space-y-0'
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={accountType}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className='font-normal'>
                                                        {accountType}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        )}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='w-full' type='submit'>
                    Create account
                </Button>
            </form>
        </Form>
    );
}

export default CreateBankAccountDrawer;
