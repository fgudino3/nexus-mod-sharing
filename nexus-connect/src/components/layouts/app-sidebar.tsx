import { Compass, LayoutDashboard, UserCircle } from 'lucide-react';
import Sidebar, { SidebarHeader, SidebarItem } from '../ui/sidebar';
import { useLocation } from 'react-router-dom';
import { useUserState } from '@/states/userState';

export default function AppSidebar({ headerHeight }: { headerHeight: number }) {
  const location = useLocation();
  const following = useUserState((state) => state.following);

  return (
    <Sidebar headerHeight={headerHeight}>
      <SidebarItem
        icon={<LayoutDashboard size={20} />}
        text="Dashboard"
        path="/"
        active={location.pathname === '/'}
      />
      <SidebarItem
        icon={<Compass size={20} />}
        text="Explore"
        path="/profiles/me"
        active={location.pathname.startsWith('/profiles')}
      />
      <div className="my-3 border-t-3 dark:border-zinc-700" />
      <SidebarHeader>Following</SidebarHeader>
      {following.map((user) => (
        <SidebarItem
          key={user.id}
          icon={
            <img
              src={user.nexusProfileUrl}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          }
          text={user.nexusUsername}
          path="/following"
        />
      ))}
    </Sidebar>
  );
}
