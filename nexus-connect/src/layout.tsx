import { Outlet } from 'react-router-dom';
import AppSidebar from './components/layouts/app-sidebar';
import { useSidebar } from './states/sidebarState';
import AppHeader from './components/layouts/app-header';
import { Toaster } from './components/ui/sonner';
import SimpleBar from 'simplebar-react';

export default function Layout() {
  const expanded = useSidebar((state) => state.expanded);
  const headerHeightPx = 60;

  return (
    <>
      <AppSidebar headerHeight={headerHeightPx} />
      <AppHeader height={headerHeightPx} />
      <SimpleBar
        style={{ height: `calc(100vh - ${headerHeightPx}px)` }}
        autoHide={false}
        className={`p-5 overflow-auto transition-all ${
          expanded ? 'ml-[160px]' : 'ml-[52px]'
        }`}
      >
        <Outlet />
      </SimpleBar>
      <Toaster richColors />
    </>
  );
}
