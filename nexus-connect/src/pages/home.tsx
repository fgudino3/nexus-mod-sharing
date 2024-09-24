import { Download, IdCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const buttonCss =
  'bg-accent border transition-colors hover:bg-accent/90 border-zinc-7 space-y-5 w-full flex shadow-accent flex-col items-center p-5 rounded-lg';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-6 w-full">
      <button className={buttonCss} onClick={() => navigate('/reader')}>
        <Download size={100} />
        <span className="text-xl">Import Mod List</span>
      </button>
      <button className={buttonCss} onClick={() => navigate('/me/profiles')}>
        <IdCard size={100} />
        <span className="text-xl">My Profiles</span>
      </button>
    </div>
  );
}
