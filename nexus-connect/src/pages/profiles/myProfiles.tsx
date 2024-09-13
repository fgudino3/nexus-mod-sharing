import OffsetPagination from '@/interfaces/OffsetPagination';
import Profile from '@/interfaces/Profile';
import { useUserState } from '@/states/userState';
import { fetch } from '@tauri-apps/api/http';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyProfiles() {
  const navigate = useNavigate();
  const jwt = useUserState((state) => state.userJwt);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  async function getProfiles() {
    const { data, ok } = await fetch<OffsetPagination<Profile>>(
      'http://127.0.0.1:8000/profiles/me',
      {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
      }
    );

    if (ok) {
      setProfiles(() => data.items);
    }
  }

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <div className="pt-10">
      {profiles.map((profile) => (
        <button
          key={profile.id}
          onClick={() => navigate('/profiles/' + profile.id)}
          className="border p-5 rounded-md"
        >
          <p>{profile.name}</p>
          <p>{profile.description}</p>
        </button>
      ))}
    </div>
  );
}
