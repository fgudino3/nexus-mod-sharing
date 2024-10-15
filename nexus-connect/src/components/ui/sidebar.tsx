import { ChevronLast, ChevronFirst } from 'lucide-react';
import React, { useContext, createContext } from 'react';
import { Button } from './button';
import { useSidebar } from '@/states/sidebarState';
import { useNavigate } from 'react-router-dom';

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

interface SidebarProps extends React.PropsWithChildren {
  headerHeight: number;
}

export default function Sidebar({ children, headerHeight }: SidebarProps) {
  const expanded = useSidebar((state) => state.expanded);
  const toggleSidebar = useSidebar((state) => state.toggleSidebar);

  return (
    <aside
      style={{ paddingTop: headerHeight + 'px' }}
      className="h-screen fixed z-10"
    >
      <nav className="h-full flex flex-col bg-accent shadow-sm ">
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1">{children}</ul>
        </SidebarContext.Provider>

        <Button size="sm" className="h-6" onClick={toggleSidebar}>
          {expanded ? <ChevronFirst /> : <ChevronLast />}
        </Button>
      </nav>
    </aside>
  );
}

type SidebarItemProps = {
  icon: JSX.Element;
  text: string;
  path: string;
  active?: boolean;
};

export function SidebarItem({ icon, text, active, path }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);
  const navigate = useNavigate();

  return (
    <li
      onClick={() => navigate(path)}
      className={`
        relative flex items-center justify-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? 'bg-background/50'
            : 'hover:bg-indigo-50 dark:hover:bg-background/50'
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden text-sm transition-all ${
          expanded ? 'w-25 ml-3' : 'w-0'
        }`}
      >
        {text}
      </span>
      <div
        className={`absolute z-10 right-0 h-full rounded-r-md ${active ? 'border-r-6 border-primary' : ''}`}
      />
      {/* {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? '' : 'top-2'
          }`}
        />
      )} */}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-primary text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}

export function SidebarHeader({ children }: React.PropsWithChildren) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li className="text-center">
      <span
        className={`overflow-hidden text-sm opacity-50 transition-all ${
          expanded ? 'w-25' : 'w-0 hidden'
        }`}
      >
        {children}
      </span>
    </li>
  );
}
