import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';

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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { signUp } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

export const userSchema = z.object({
    id: z.string(),
    full_name: z.string({
        required_error: 'First name is required',
    }),
    username: z
        .string({
            required_error: 'Username is required',
        })
        .min(5, { message: 'Username must be 5 chars minimum' })
        .max(16, { message: 'Username must be 16 chars maximum' }),
    email: z
        .string({
            required_error: 'Email is required',
        })
        .email({
            message: 'Not a valid email',
        }),
    password: z.string({ required_error: 'Password is required' }),
});

const signUpFormSchema = userSchema
    .omit({ id: true })
    .extend({
        confirmPassword: z.string({
            required_error: 'Password confirmation is required',
        }),
    })
    .refine(data => data.password == data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type TSignUpForm = z.infer<typeof signUpFormSchema>;

function SignUp() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const form = useForm<TSignUpForm>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            full_name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const signUpMutation = useMutation(signUp, {
        onSuccess: () => {
            toast({
                title: 'You have been registered successfully',
                description: 'Lets start with log in to your account',
                variant: 'default',
            });
            navigate('/login');
        },
        onError: () => {
            toast({
                title: 'Something went wrong',
                variant: 'destructive',
            });
        },
    });

    function onSubmit(data: TSignUpForm) {
        signUpMutation.mutate(data);
    }

    return (
        <Card className='max-w-md'>
            <CardHeader className='space-y-1'>
                <CardTitle className='text-2xl'>Create an account</CardTitle>
                <CardDescription>
                    Enter your email below to create your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='grid gap-4'
                    >
                        <FormField
                            control={form.control}
                            name='full_name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Full name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Username'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='Email'
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
                                            placeholder='Password'
                                            autoComplete='new-password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Confirm password'
                                            autoComplete='new-password'
                                            {...field}
                                        />
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
            </CardContent>
            <CardFooter className='d-flex flex-col'>
                <p className='mt-2 px-3'>
                    Do you already have an account?&nbsp;
                    <Link to='/login'>
                        <span className='text-blue-600 hover:underline'>
                            Log in
                        </span>
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}

export default SignUp;
