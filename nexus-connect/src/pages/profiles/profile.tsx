import ModCard from '@/components/cards/ModCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import useProfileApi from '@/hooks/useProfileApi';
import Profile from '@/interfaces/Profile';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

export default function ProfilePage() {
  const { profileId } = useParams();
  const { getProfile } = useProfileApi();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile(profileId as string).then((profile) => {
      if (profile) {
        setProfile(profile);
      }
    });
  }, []);

  if (!profile) {
    return <div>no profile found</div>;
  }

  return (
    <>
      <div className="sticky-header flex flex-col items-start">
        <div className="flex items-baseline space-x-2">
          <h1 className="text-2xl">{profile.name}</h1>
          <Separator orientation="vertical" />
          <p className="opacity-50 text-sm">
            {profile.modCount} {profile.modCount === 1 ? 'mod' : 'mods'}
          </p>
        </div>
        <NavLink
          to={`/user/${profile.userId}`}
          className="flex items-center space-x-2"
        >
          <Avatar className="w-7 h-7 mt-1">
            <AvatarImage src={profile.user.nexusProfileUrl} />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
          <p className="text-sm">{profile.user.nexusUsername}</p>
        </NavLink>
      </div>
      <p className="opacity-50 text-sm">{profile.description}</p>
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mt-5">
        {profile.mods.map((mod) => (
          <ModCard key={mod.id} mod={mod} />
        ))}
      </div>
    </>
  );
}
