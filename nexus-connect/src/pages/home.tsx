import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mt-10 grid grid-cols-3 gap-6">
        <Button onClick={() => navigate('/reader')}>Import Mod List</Button>
        <Button onClick={() => navigate('/login-nexus')}>Login Nexus</Button>
        <Button onClick={() => navigate('/login')}>Login</Button>
        <Button onClick={() => navigate('/profiles/me')}>Profiles</Button>
      </div>
    </div>
  );
}
