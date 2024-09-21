import ProfileCard from '@/components/cards/ProfileCard';
import OffsetPagination from '@/interfaces/OffsetPagination';
import Profile from '@/interfaces/Profile';
import { useUserState } from '@/states/userState';
import { fetch } from '@tauri-apps/api/http';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserProfiles() {
  const navigate = useNavigate();
  const { username } = useParams();
  const following = useUserState((state) => state.following);
  const jwt = useUserState((state) => state.userJwt);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const user = following.find((user) => user.nexusUsername === username);

  if (!user) {
    return (
      <>
        <p>No user found</p>
      </>
    );
  }

  async function getProfiles() {
    if (!user) {
      return;
    }

    const { data, ok } = await fetch<OffsetPagination<Profile>>(
      'http://127.0.0.1:8000/profiles',
      {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
        query: {
          user_id: user.id,
        },
      }
    );

    if (ok) {
      console.log(data.items);
      setProfiles(() => data.items);
    }
  }

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-10">
        {user.nexusUsername}'s Profiles
      </h1>
      <div className="grid grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <ProfileCard
            profile={profile}
            key={profile.id}
            toProfile={() => navigate(`/${username}/profiles/${profile.id}`)}
          />
        ))}
      </div>
    </>
  );
}
