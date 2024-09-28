import UserPage from '@/components/layouts/user-page';
import useProfileApi from '@/hooks/useProfileApi';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function UserProfiles() {
  const { userId } = useParams();
  const { getProfiles, profiles, user } = useProfileApi();

  if (!userId) {
    return (
      <>
        <p>No user found</p>
      </>
    );
  }

  useEffect(() => {
    getProfiles(userId);
  }, []);

  return (
    <>
      {user ? (
        <UserPage user={user} profiles={profiles} />
      ) : (
        <p>No user found</p>
      )}
    </>
  );
}
