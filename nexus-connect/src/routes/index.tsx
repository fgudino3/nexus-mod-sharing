import { createBrowserRouter } from 'react-router-dom';
import { PROFILE_ROUTES } from './profileRoutes';
import { READER_ROUTES } from './readerRoutes';
import { USER_ROUTES } from './userRoutes';
import Home from '@/pages/home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  ...PROFILE_ROUTES,
  ...READER_ROUTES,
  ...USER_ROUTES,
]);
