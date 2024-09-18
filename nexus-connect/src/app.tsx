import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import '@/styles/App.css';
import { useUserState } from './states/userState';
import { useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';

export default function App() {
  const loadUserData = useUserState((state) => state.loadUserData);

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
