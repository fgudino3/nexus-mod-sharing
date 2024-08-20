import React from 'react';
import ReactDOM from 'react-dom/client';
import ModManagerSelection from './pages/ModManagerSelection';
import VortexModListReader from './pages/VortexModListReader';
import MO2ModListReader from './pages/MO2ModListReader';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ModManagerSelection />,
  },
  {
    path: '/vortex-reader',
    element: <VortexModListReader />,
  },
  {
    path: '/mo2-reader',
    element: <MO2ModListReader />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="container mx-auto h-screen w-screen">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
