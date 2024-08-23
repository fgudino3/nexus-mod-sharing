import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import '@/styles/App.css';

export default function App() {
  return (
    <div className="container mx-auto h-screen">
      <RouterProvider router={router} />
    </div>
  );
}
