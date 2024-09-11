import { createBrowserRouter } from 'react-router-dom';
import { READER_ROUTES } from './readerRoutes';
import { LOGIN_ROUTES } from './userRoutes';
import Home from '@/pages/home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  ...READER_ROUTES,
  ...LOGIN_ROUTES,
]);
