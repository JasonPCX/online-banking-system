import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import AuthLayout from './layouts/AuthLayout';
import SignUp from './pages/SignUp/SignUp';
import LogIn from './pages/LogIn/LogIn';
import NotFound from './pages/NotFound/NotFound';
import { Toaster } from './components/ui/toaster';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import Account from './pages/Account/Account';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to={'/login'} />} />
          <Route element={<AuthLayout />}>
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<LogIn />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path='/home' element={<Home />} />
            <Route path='/account/:id' element={<Account />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
