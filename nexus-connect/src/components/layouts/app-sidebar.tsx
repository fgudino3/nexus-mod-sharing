import { Compass, LayoutDashboard } from 'lucide-react';
import Sidebar, { SidebarHeader, SidebarItem } from '../ui/sidebar';
import { useLocation } from 'react-router-dom';
import { useUserState } from '@/states/userState';
import { useEffect } from 'react';
import useUserApi from '@/hooks/useUserApi';

export default function AppSidebar({ headerHeight }: { headerHeight: number }) {
  const location = useLocation();
  const jwt = useUserState((state) => state.userJwt);
  const following = useUserState((state) => state.following);
  const { getConnections } = useUserApi();

  useEffect(() => {
    if (jwt) {
      getConnections();
    }
  }, [jwt]);

  return (
    <Sidebar headerHeight={headerHeight}>
      <SidebarItem
        icon={<LayoutDashboard size={24} />}
        text="Dashboard"
        path="/"
        active={
          location.pathname === '/' ||
          location.pathname.startsWith('/mod-manager')
        }
      />
      <SidebarItem
        icon={<Compass size={24} />}
        text="Explore"
        path="/profiles"
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
              className="w-6 h-6 rounded-full object-cover"
            />
          }
          text={user.nexusUsername}
          path={`/user/${user.id}`}
          active={location.pathname.startsWith(`/user/${user.id}`)}
        />
      ))}
    </Sidebar>
  );
}
