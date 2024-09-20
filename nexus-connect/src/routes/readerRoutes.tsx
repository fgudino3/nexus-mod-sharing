import ModManagerSelection from '@/pages/reader/ModManagerSelection';
import VortexModListReader from '@/pages/reader/VortexModListReader';
import ModOrganizerListReader from '@/pages/reader/MO2ModListReader';
import ModList from '@/pages/reader/ModList';
import { RouteObject } from 'react-router-dom';

export const READER_ROUTES: RouteObject[] = [
  {
    path: '/reader',
    element: <ModManagerSelection />,
  },
  {
    path: '/vortex',
    element: <VortexModListReader />,
  },
  {
    path: '/vortex/:gameName',
    element: <ModList />,
  },
  {
    path: '/mo2',
    element: <ModOrganizerListReader />,
  },
  {
    path: '/mo2/:gameName',
    element: <ModList />,
  },
];
