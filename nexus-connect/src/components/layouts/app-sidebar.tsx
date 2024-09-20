import { Compass, LayoutDashboard } from 'lucide-react';
import Sidebar, { SidebarHeader, SidebarItem } from '../ui/sidebar';
import { useLocation } from 'react-router-dom';
import { useUserState } from '@/states/userState';
import { fetch } from '@tauri-apps/api/http';
import { UserDTO } from '@/interfaces/User';
import { useEffect } from 'react';

export default function AppSidebar({ headerHeight }: { headerHeight: number }) {
  const location = useLocation();
  const following = useUserState((state) => state.following);
  const setUserConnections = useUserState((state) => state.setUserConnections);
  const jwt = useUserState((state) => state.userJwt);

  async function getConnections() {
    const { data: following } = await fetch<UserDTO[]>(
      'http://127.0.0.1:8000/users/following',
      {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
      }
    );

    const { data: followers } = await fetch<UserDTO[]>(
      'http://127.0.0.1:8000/users/following',
      {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + jwt,
        },
      }
    );

    console.log(following, followers);

    setUserConnections(following, followers);
  }

  useEffect(() => {
    if (jwt) {
      getConnections();
    }
  }, [jwt]);

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
              className="w-8 h-8 rounded-full object-cover"
            />
          }
          text={user.nexusUsername}
          path={`/${user.nexusUsername}/profiles`}
          active={location.pathname.startsWith(
            `/${user.nexusUsername}/profiles`
          )}
        />
      ))}
    </Sidebar>
  );
}
