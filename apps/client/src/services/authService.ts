import { MainApi } from '@/lib/axios';
import { TLogInForm } from '@/pages/LogIn/LogIn';
import { TSignUpForm } from '@/pages/SignUp/SignUp';

const resource = 'auth';

export const signUp = (data: TSignUpForm) =>
  MainApi.POST(`/${resource}/signup`, data);

export const logIn = (data: TLogInForm) => MainApi.POST(`/${resource}/login`, data);
