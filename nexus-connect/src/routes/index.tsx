import { createBrowserRouter } from 'react-router-dom';
import { PROFILE_ROUTES } from './profileRoutes';
import { READER_ROUTES } from './readerRoutes';
import { USER_ROUTES } from './userRoutes';
import Home from '@/pages/home';
import Layout from '@/layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      ...PROFILE_ROUTES,
      ...READER_ROUTES,
      ...USER_ROUTES,
    ],
  },
]);
