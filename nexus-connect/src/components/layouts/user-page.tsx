import Profile from '@/interfaces/Profile';
import { UserBase } from '@/interfaces/User';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import ProfileCard from '../cards/ProfileCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useUserState } from '@/states/userState';
import { format } from 'date-fns';
import { Calendar, Import } from 'lucide-react';
import { Separator } from '../ui/separator';
import useUserApi from '@/hooks/useUserApi';

interface UserPageProps {
  user: UserBase;
  isMe?: boolean;
  profiles: Profile[];
}

export default function UserPage({ user, profiles, isMe }: UserPageProps) {
  const { follow, unfollow } = useUserApi();
  const following = useUserState((state) => state.following);
  const navigate = useNavigate();

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-5 self-center">
          <Avatar className="h-25 w-25">
            <AvatarImage src={user.nexusProfileUrl} />
            <AvatarFallback>TODO</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-3xl">{user.nexusUsername}</p>
            <p className="opacity-50 text-sm flex items-center space-x-2 mt-1">
              <Calendar size={16} />
              <span>Joined {format(user.createdAt, 'MMMM yyyy')}</span>
            </p>
            <div className="text-sm flex items-center space-x-5 mt-3">
              <p className="space-x-1">
                <span className="font-semibold">{1}</span>
                <span className="opacity-50">Following</span>
              </p>
              <p className="space-x-1">
                <span className="font-semibold">{0}</span>
                <span className="opacity-50">Followers</span>
              </p>
            </div>
          </div>
        </div>
        {isMe ? (
          <Button
            className="flex items-center space-x-2"
            onClick={() => navigate('/mod-manager')}
          >
            <Import />
            <span className="font-medium">Create Profile</span>
          </Button>
        ) : following.some((user) => user.id === user.id) ? (
          <Button variant="outline" onClick={() => unfollow(user.id)}>
            Unfollow
          </Button>
        ) : (
          <Button onClick={() => follow(user.id)}>Follow</Button>
        )}
      </div>
      <Separator className="my-10" />
      {/* PROFILES */}
      <div className="grid grid-cols-3 gap-6 mt-10">
        {profiles.map((profile) => (
          <ProfileCard
            profile={profile}
            key={profile.id}
            toProfile={() => navigate('/me/profiles/' + profile.id)}
          />
        ))}
      </div>
    </>
  );
}
