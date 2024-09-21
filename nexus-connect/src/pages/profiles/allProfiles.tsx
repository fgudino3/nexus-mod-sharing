import ProfileCard from '@/components/cards/ProfileCard';
import OffsetPagination from '@/interfaces/OffsetPagination';
import Profile from '@/interfaces/Profile';
import { useUserState } from '@/states/userState';
import { fetch } from '@tauri-apps/api/http';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllProfiles() {
  const navigate = useNavigate();
  const jwt = useUserState((state) => state.userJwt);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  async function getProfiles() {
    const { data, ok } = await fetch<OffsetPagination<Profile>>(
      'http://127.0.0.1:8000/profiles',
      {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + jwt,
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
    <div className="grid grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <ProfileCard
          profile={profile}
          key={profile.id}
          toProfile={() => navigate('/profiles/' + profile.id)}
        />
      ))}
    </div>
  );
}
