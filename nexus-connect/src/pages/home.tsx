import CenteredContent from '@/components/layouts/centered-content';
import UserPage from '@/components/layouts/user-page';
import useProfileApi from '@/hooks/useProfileApi';
import { useUserState } from '@/states/userState';
import { useEffect } from 'react';

export default function Home() {
  const user = useUserState((state) => state.user);
  const jwt = useUserState((state) => state.userJwt);
  const { getMyProfiles, profiles } = useProfileApi();

  useEffect(() => {
    getMyProfiles();
  }, [jwt]);

  return (
    <>
      {user ? (
        <UserPage user={user} profiles={profiles} isMe />
      ) : (
        <CenteredContent>
          <div>TODO: login or sign up button</div>
        </CenteredContent>
      )}
    </>
  );
}
