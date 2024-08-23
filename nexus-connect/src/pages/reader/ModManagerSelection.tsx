import { NavLink } from 'react-router-dom';

export default function ModManagerSelection() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-5xl font-bold font-nunito">Nexus Connect</h1>
        <h3 className="mt-3 font-medium text-lg">Select your mod manager</h3>

        <div className="flex justify-center space-x-3xl">
          <NavLink to="/vortex" className="logo-button">
            <img
              src="/vortex-logo.png"
              className="logo vortex"
              alt="Vortex logo"
            />
          </NavLink>
          <NavLink to="/mo2" className="logo-button">
            <img src="/mo2-logo.png" className="logo react" alt="React logo" />
          </NavLink>
        </div>
      </div>
    </>
  );
}
