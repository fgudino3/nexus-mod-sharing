import ProfileCard from '@/components/cards/ProfileCard';
import useProfileApi from '@/hooks/useProfileApi';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllProfiles() {
  const navigate = useNavigate();
  const { getProfiles, profiles } = useProfileApi();

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl">Explore Mod Profiles</h1>
        <p className="mt-2 opacity-75">
          Browse other Nexus Connect user's profiles. Follow and share with
          friends.
        </p>
      </div>
      <Separator className="my-7" />
      <div className="grid grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <ProfileCard
            profile={profile}
            key={profile.id}
            toProfile={() => navigate('/profiles/' + profile.id)}
            toUser={() => navigate('/user/' + profile.userId)}
          />
        ))}
      </div>
    </>
  );
}
