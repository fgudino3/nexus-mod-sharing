import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import '@/styles/App.css';
import { useUserState } from './states/userState';
import { useEffect } from 'react';

export default function App() {
  const getNexusApiKey = useUserState((state) => state.getNexusApiKey);

  useEffect(() => {
    getNexusApiKey();
  }, []);

  return (
    <div className="container mx-auto h-screen">
      <RouterProvider router={router} />
    </div>
  );
}
