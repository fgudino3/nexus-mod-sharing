import { NexusButton } from '@/components/NexusButton';
import { useUserState } from '@/states/userState';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const user = useUserState((state) => state.user);
  const logout = useUserState((state) => state.logout);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {user ? (
        <div className="flex items-center space-x-3">
          <img
            src={user.nexusProfileUrl}
            alt=""
            className="h-9 w-9 rounded-full object-contain"
          />
          <p className="font-bold">{user.nexusUsername}</p>
          <button onClick={logout} className="border rounded-md p-2">
            logout
          </button>
        </div>
      ) : (
        <></>
      )}

      <h1 className="text-5xl font-bold font-nunito">Nexus Connect</h1>
      <div className="mt-10 grid grid-cols-3 gap-6">
        <NexusButton onClick={() => navigate('/reader')}>
          Import Mod List
        </NexusButton>
        <NexusButton onClick={() => navigate('/login-nexus')}>
          Login Nexus
        </NexusButton>
        <NexusButton onClick={() => navigate('/login')}>Login</NexusButton>
        <NexusButton onClick={() => navigate('/profiles/me')}>
          Profiles
        </NexusButton>
      </div>
    </div>
  );
}
