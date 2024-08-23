import Login from '@/pages/login';
import { RouteObject } from 'react-router-dom';

export const LOGIN_ROUTES: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
];
