import ProfileCard from '@/components/cards/ProfileCard';
import useProfileApi from '@/hooks/useProfileApi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllProfiles() {
  const navigate = useNavigate();
  const { getProfiles, profiles } = useProfileApi();

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
          toUser={() => navigate('/user/' + profile.userId)}
        />
      ))}
    </div>
  );
}
