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
    <div>
      <h1 className="text-3xl font-bold mb-10">
        {user.nexusUsername}'s Profiles
      </h1>
      <div className="grid grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => navigate('/profiles/' + profile.id)}
            className="border p-5 rounded-md"
          >
            <p className="font-bold">{profile.name}</p>
            <p className="text-sm mt-3">Game: {profile.game}</p>
            <p className="text-sm mt-2">
              Installed Mods: <span>{profile.modCount}</span>
            </p>
            <p className="mt-2 text-sm">{profile.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
