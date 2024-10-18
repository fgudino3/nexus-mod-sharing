import Login from '@/pages/user/login';
import Verify from '@/pages/user/verify';
import Register from '@/pages/user/register';
import NexusLogin from '@/pages/user/nexusLogin';
import { RouteObject } from 'react-router-dom';
import ForgotPassword from '@/pages/user/forgotPassword';

export const USER_ROUTES: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/verify',
    element: <Verify />,
  },
  {
    path: '/login-nexus',
    element: <NexusLogin />,
  },
];
