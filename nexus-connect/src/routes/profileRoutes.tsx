import UserProfiles from '@/pages/profiles/userProfiles';
import AllProfiles from '@/pages/profiles/allProfiles';
import ProfilePage from '@/pages/profiles/profile';
import { RouteObject } from 'react-router-dom';

export const PROFILE_ROUTES: RouteObject[] = [
  {
    path: '/profiles',
    element: <AllProfiles />,
  },
  {
    path: '/user/:userId',
    element: <UserProfiles />,
  },
  {
    path: '/:username/profiles/:profileId',
    element: <ProfilePage />,
  },
  {
    path: '/profiles/:profileId',
    element: <ProfilePage />,
  },
];
