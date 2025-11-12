import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../SignUp/SignUp';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useMutation, useQueryClient } from 'react-query';
import { logIn } from '@/services/authService';
import { isAxiosError } from 'axios';
import { base64UrlDecode } from '@/lib/utils';
import { saveToken } from '@/services/tokenService';

const logInFormSchema = userSchema.pick({ username: true, password: true });

export type TLogInForm = z.infer<typeof logInFormSchema>;

function LogIn() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const form = useForm<TLogInForm>({
        resolver: zodResolver(logInFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });
    const queryClient = useQueryClient();

    const logInMutation = useMutation(logIn, {
        onSuccess(data) {
            // Saving token on localStorage
            saveToken(data.token);
            // Decoding token data
            const payload = data.token.split('.')[1];
            const authData = base64UrlDecode(payload);
            queryClient.setQueryData('userData', authData.data);

            toast({
                variant: 'default',
                title: 'Welcome to your account',
            });
            navigate('/home');
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

    function onSubmit(data: TLogInForm) {
        logInMutation.mutate(data);
    }

    return (
        <Card>
            <CardHeader className='space-y-1'>
                <CardTitle className='text-2xl'>Welcome to BankApp</CardTitle>
                <CardDescription>Enter your username and password</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='grid gap-4'
                    >
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Username'
                                            autoComplete='username'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='********'
                                            autoComplete='current-password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' className='w-full'>
                            Log in
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className='d-flex flex-col'>
                <p className='mt-2 px-3'>
                    Don't have an account?&nbsp;
                    <Link to='/signup' className='text-blue-600 hover:underline'>
                        Create one
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}

export default LogIn;
