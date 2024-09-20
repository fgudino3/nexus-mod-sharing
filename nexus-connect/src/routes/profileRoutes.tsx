import UserProfiles from '@/pages/profiles/userProfiles';
import AllProfiles from '@/pages/profiles/allProfiles';
import MyProfiles from '@/pages/profiles/myProfiles';
import ProfilePage from '@/pages/profiles/profile';
import { RouteObject } from 'react-router-dom';

export const PROFILE_ROUTES: RouteObject[] = [
  {
    path: '/profiles/me',
    element: <MyProfiles />,
  },
  {
    path: '/:username/profiles',
    element: <UserProfiles />,
  },
  {
    path: '/profiles',
    element: <AllProfiles />,
  },
  {
    path: '/profiles/:profileId',
    element: <ProfilePage />,
  },
];
