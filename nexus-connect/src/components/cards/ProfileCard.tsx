import Profile from '@/interfaces/Profile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ProfileCardProps {
  profile: Profile;
  toProfile: () => void;
  toUser?: () => void;
}

export default function ProfileCard({
  profile,
  toProfile,
  toUser,
}: ProfileCardProps) {
  return (
    <Card className="border-accent">
      <CardHeader onClick={toProfile} className="cursor-pointer">
        <CardTitle>{profile.name}</CardTitle>
        <CardDescription>{profile.game}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mt-2">
          Installed Mods: <span>{profile.modCount}</span>
        </p>
        <CardDescription>{profile.description}</CardDescription>
        {toUser && (
          <button
            className="flex items-center space-x-2 hover:underline mt-5"
            onClick={toUser}
          >
            <Avatar>
              <AvatarImage src={profile.user.nexusProfileUrl} />
              <AvatarFallback>TODO</AvatarFallback>
            </Avatar>
            <p>{profile.user.nexusUsername}</p>
          </button>
        )}
      </CardContent>
    </Card>
  );
}
