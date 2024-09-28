import ModManagerSelection from '@/pages/reader/ModManagerSelection';
import VortexModListReader from '@/pages/reader/VortexModListReader';
import ModOrganizerListReader from '@/pages/reader/MO2ModListReader';
import ModList from '@/pages/reader/ModList';
import { RouteObject } from 'react-router-dom';

export const READER_ROUTES: RouteObject[] = [
  {
    path: '/mod-manager',
    element: <ModManagerSelection />,
  },
  {
    path: '/mod-manager/vortex',
    element: <VortexModListReader />,
  },
  {
    path: '/mod-manager/vortex/:gameName',
    element: <ModList />,
  },
  {
    path: '/mod-manager/mo2',
    element: <ModOrganizerListReader />,
  },
  {
    path: '/mod-manager/mo2/:gameName',
    element: <ModList />,
  },
];
