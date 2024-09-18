import { create } from 'zustand';

interface SideBarState {
  expanded: boolean;
  toggleSidebar: () => void;
}

export const useSidebar = create<SideBarState>()((set, get) => ({
  expanded: true,
  toggleSidebar() {
    set({ expanded: !get().expanded });
  },
}));
