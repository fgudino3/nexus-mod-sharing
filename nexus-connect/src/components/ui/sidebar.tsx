import { ChevronLast, ChevronFirst } from 'lucide-react';
import React, { useContext, createContext } from 'react';
import { Button } from './button';
import { useSidebar } from '@/states/sidebarState';

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

export default function Sidebar({ children }: React.PropsWithChildren) {
  const expanded = useSidebar((state) => state.expanded);
  const toggleSidebar = useSidebar((state) => state.toggleSidebar);

  return (
    <aside className="h-screen fixed pt-[57px]">
      <nav className="h-full flex flex-col bg-white shadow-sm dark:bg-zinc-800">
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1">{children}</ul>
        </SidebarContext.Provider>

        <Button size="sm" onClick={toggleSidebar}>
          {expanded ? <ChevronFirst /> : <ChevronLast />}
        </Button>
      </nav>
    </aside>
  );
}

type SidebarItemProps = {
  icon: JSX.Element;
  text: string;
  active?: boolean;
  alert?: boolean;
};

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`
        relative flex items-center justify-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
            : 'hover:bg-indigo-50 dark:hover:bg-background text-gray-600 dark:text-white'
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? 'w-25 ml-3' : 'w-0'
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? '' : 'top-2'
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 dark:bg-orange-500 dark:text-white text-indigo-800 text-sm
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
