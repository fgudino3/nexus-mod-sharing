import { useUserState } from '@/states/userState';

export default function AppHeader({ height }: { height: number }) {
  const user = useUserState((state) => state.user);
  const logout = useUserState((state) => state.logout);

  return (
    <header
      style={{ height: height + 'px' }}
      className={`flex items-center justify-between gap-1 border-b border-zinc-700 bg-background px-4`}
    >
      <h1 className="font-nunito text-xl">Nexus Connect</h1>
      {user && (
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-xs">{user.nexusUsername}</p>
            <button
              className="text-primary hover:underline text-xs"
              onClick={logout}
            >
              Log out
            </button>
          </div>
          <img
            src={user.nexusProfileUrl}
            alt=""
            className="h-9 w-9 rounded-full object-contain"
          />
        </div>
      )}
    </header>
  );
}
