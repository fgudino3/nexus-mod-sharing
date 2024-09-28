import ModManagerSelection from '@/pages/reader/ModManagerSelection';
import VortexModListReader from '@/pages/reader/VortexModListReader';
import ModOrganizerListReader from '@/pages/reader/MO2ModListReader';
import ModList from '@/pages/reader/ModList';
import { RouteObject } from 'react-router-dom';

export const READER_ROUTES: RouteObject[] = [
  {
    path: 'mod-manager',
    handle: {
      crumb: 'Mod Manager',
    },
    children: [
      {
        path: '',
        element: <ModManagerSelection />,
      },
      {
        path: 'vortex',
        handle: {
          crumb: 'Vortex Scanner',
        },
        children: [
          {
            path: '',
            element: <VortexModListReader />,
          },
          {
            path: ':gameName',
            element: <ModList />,
            handle: {
              crumb: 'Create Profile',
            },
          },
        ],
      },
      {
        path: '/mod-manager/mo2',
        handle: {
          crumb: 'Mo2 Scanner',
        },
        children: [
          {
            path: '',
            element: <ModOrganizerListReader />,
          },
          {
            path: ':gameName',
            element: <ModList />,
            handle: {
              crumb: 'Create Profile',
            },
          },
        ],
      },
    ],
  },
];
