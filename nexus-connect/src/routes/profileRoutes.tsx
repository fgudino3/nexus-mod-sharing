import MyProfiles from '@/pages/profiles/myProfiles';
import ProfilePage from '@/pages/profiles/profile';
import { RouteObject } from 'react-router-dom';

export const PROFILE_ROUTES: RouteObject[] = [
  {
    path: '/profiles/me',
    element: <MyProfiles />,
  },
  {
    path: '/profiles/:profileId',
    element: <ProfilePage />,
  },
];
