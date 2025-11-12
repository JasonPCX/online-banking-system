import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useQueryClient } from 'react-query'

import { Button } from '@/components/ui/button'
import { destroyToken, getToken } from '@/services/tokenService';
import { useToast } from '@/components/ui/use-toast';
import { base64UrlDecode } from '@/lib/utils';

function MainLayout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onLogout() {
    destroyToken();
    queryClient.removeQueries('userData');
    navigate('/login');
    toast({
      title: 'See you soon',
      variant: 'default',
    })
  }

  useEffect(() => {
    const userData = queryClient.getQueryData('userData');

    if (!userData) {
      const token = getToken()
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const payload = token.split('.')[1];
        const authData = base64UrlDecode(payload);
        queryClient.setQueryData('userData', authData.data);
      } catch (error) {
        console.error('Invalid token format:', error);
        destroyToken();
        navigate('/login');
      }
    }
  }, [navigate, queryClient])
  
  
  return (
    <div className='flex flex-col min-h-screen'>
        <div className='border-b'>
          <div className='flex h-16 items-center px-4'>
            <Link to={'/home'}>
              <h1 className='text-4xl font-bold'>Bank app</h1>
            </Link>
            <nav className='ml-auto flex items-center space-x-4 lg:space-x-6 mx-6'>
              <Button variant={'ghost'} onClick={() => onLogout()}>
                Cerrar sesión
              </Button>
            </nav>
          </div>
        </div>
        <main className='flex-1 space-y-4 p-8 pt-6'>
          <Outlet />
        </main>
    </div>
  )
}

export default MainLayout