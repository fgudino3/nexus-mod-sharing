import UserPage from '@/components/layouts/user-page';
import useProfileApi from '@/hooks/useProfileApi';
import { useUserState } from '@/states/userState';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function UserProfiles() {
  const { username } = useParams();
  const { getProfiles, profiles } = useProfileApi();
  const following = useUserState((state) => state.following);

  const user = following.find((user) => user.nexusUsername === username);

  if (!user) {
    return (
      <>
        <p>No user found</p>
      </>
    );
  }

  useEffect(() => {
    console.log(user.id);
    getProfiles(user.id);
  }, []);

  return (
    <>
      <UserPage user={user} profiles={profiles} />
    </>
  );
}
