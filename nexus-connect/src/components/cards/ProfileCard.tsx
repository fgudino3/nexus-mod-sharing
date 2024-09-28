import Profile from '@/interfaces/Profile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface ProfileCardProps {
  profile: Profile;
  toProfile: () => void;
}

export default function ProfileCard({ profile, toProfile }: ProfileCardProps) {
  return (
    <Card onClick={toProfile} className="border-accent">
      <CardHeader>
        <CardTitle>{profile.name}</CardTitle>
        <CardDescription>{profile.game}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mt-2">
          Installed Mods: <span>{profile.modCount}</span>
        </p>
        <CardDescription>{profile.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
