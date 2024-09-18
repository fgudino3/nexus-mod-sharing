import { Outlet } from 'react-router-dom';
import AppSidebar from './components/layouts/app-sidebar';
import { useSidebar } from './states/sidebarState';
import AppHeader from './components/layouts/app-header';

export default function Layout() {
  const expanded = useSidebar((state) => state.expanded);

  return (
    <div>
      <AppSidebar />
      <AppHeader />
      <main
        className={`p-5 overflow-hidden transition-all ${
          expanded ? 'ml-[156px]' : 'ml-[48px]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
