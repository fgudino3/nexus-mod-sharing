import CenteredContent from '@/components/layouts/centered-content';
import UserPage from '@/components/layouts/user-page';
import { Button } from '@/components/ui/button';
import useProfileApi from '@/hooks/useProfileApi';
import { useUserState } from '@/states/userState';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const user = useUserState((state) => state.user);
  const jwt = useUserState((state) => state.userJwt);
  const { getMyProfiles, profiles } = useProfileApi();
  const navigate = useNavigate();

  useEffect(() => {
    getMyProfiles();
  }, [jwt]);

  return (
    <>
      {user ? (
        <UserPage user={user} profiles={profiles} isMe />
      ) : (
        <CenteredContent>
          <h1 className="text-3xl">Welcome to Nexus Connect!</h1>
          <p className="opacity-75">
            Login or register to start sharing your mod lists with others!
          </p>
          <Button
            className="mt-10"
            size="lg"
            onClick={() => navigate('/login')}
          >
            Log in / Register
          </Button>
        </CenteredContent>
      )}
    </>
  );
}
