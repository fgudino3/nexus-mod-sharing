import CenteredContent from '@/components/layouts/centered-content';
import { NavLink } from 'react-router-dom';

export default function ModManagerSelection() {
  return (
    <CenteredContent>
      <h3 className="mt-3 font-medium text-3xl">Select your mod manager</h3>

      <div className="flex justify-center space-x-3xl">
        <NavLink to="/vortex">
          <img
            src="/vortex-logo.png"
            className="logo vortex h-48"
            alt="Vortex logo"
          />
        </NavLink>
        <NavLink to="/mo2">
          <img src="/mo2-logo.png" className="logo mo2 h-48" alt="Mo2 logo" />
        </NavLink>
      </div>
    </CenteredContent>
  );
}
