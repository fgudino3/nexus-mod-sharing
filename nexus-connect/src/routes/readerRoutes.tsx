import ModManagerSelection from '@/pages/reader/ModManagerSelection';
import VortexModListReader from '@/pages/reader/VortexModListReader';
import MO2ModListReader from '@/pages/reader/MO2ModListReader';
import VortexModList from '@/pages/reader/VortexModList';
import { RouteObject } from 'react-router-dom';

export const READER_ROUTES: RouteObject[] = [
  {
    path: '/',
    element: <ModManagerSelection />,
  },
  {
    path: '/vortex-reader',
    element: <VortexModListReader />,
  },
  {
    path: '/vortex-reader/preview',
    element: <VortexModList />,
  },
  {
    path: '/mo2-reader',
    element: <MO2ModListReader />,
  },
];
