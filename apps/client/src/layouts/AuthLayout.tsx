import React from 'react'
import {Outlet} from 'react-router-dom';

function AuthLayout() {
  return (
    <div className='grid place-items-center min-h-screen'>
      <Outlet />
    </div>
  );
}

export default AuthLayout