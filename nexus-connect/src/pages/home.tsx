import { NexusButton } from '@/components/NexusButton';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-5xl font-bold font-nunito">Nexus Connect</h1>
      <div className="mt-10 grid grid-cols-3 gap-6">
        <NexusButton onClick={() => navigate('/reader')}>
          Import Mod List
        </NexusButton>
        <NexusButton onClick={() => navigate('/login-nexus')}>
          Login Nexus
        </NexusButton>
        <NexusButton onClick={() => navigate('/login')}>Login</NexusButton>
      </div>
    </div>
  );
}
