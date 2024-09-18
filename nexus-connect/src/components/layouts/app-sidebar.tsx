import { UserCircle } from 'lucide-react';
import Sidebar, { SidebarItem } from '../ui/sidebar';

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarItem icon={<UserCircle size={20} />} text="following" />
    </Sidebar>
  );
}
