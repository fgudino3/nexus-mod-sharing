import { READER_ROUTES } from './readerRoutes';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  ...READER_ROUTES,
]);