import ModCard from '@/components/ModCard';
import Profile from '@/interfaces/Profile';
import { useUserState } from '@/states/userState';
import { fetch } from '@tauri-apps/api/http';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProfilePage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const jwt = useUserState((state) => state.userJwt);
  const [profile, setProfile] = useState<Profile | null>(null);

  async function getProfile() {
    const { data, ok } = await fetch<Profile>(
      `http://127.0.0.1:8000/profiles/${profileId}`,
      {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
      }
    );

    if (ok) {
      console.log(data);
      setProfile(() => data);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  if (!profile) {
    return <div>no profile found</div>;
  }

  return (
    <div className="pt-10">
      <div>
        <div className="flex justify-between">
          <h1>Name: {profile.name}</h1>
          <div className="flex items-center space-x-2">
            <img
              src={profile.user.nexusProfileUrl}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
            />
            <p>{profile.user.nexusUsername}</p>
          </div>
        </div>
        <p>Description: {profile.description}</p>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-10">
        {profile.mods.map((mod) => (
          <ModCard key={mod.id} mod={mod} />
        ))}
      </div>
    </div>
  );
}
