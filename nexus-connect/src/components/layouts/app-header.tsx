import { useUserState } from '@/states/userState';
import { NavLink, UIMatch, useMatches, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '../ui/breadcrumb';

interface Breadcrumb {
  name: string;
  path: string;
}

export default function AppHeader({ height }: { height: number }) {
  const navigate = useNavigate();
  const matches: UIMatch<any, any>[] = useMatches();
  const user = useUserState((state) => state.user);
  const logout = useUserState((state) => state.logout);
  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map<Breadcrumb>((match) => ({
      name: match.handle.crumb,
      path: match.pathname,
    }));

  return (
    <header
      style={{ height: height + 'px' }}
      className={`flex items-center justify-between gap-1 border-b border-zinc-700 bg-background px-4`}
    >
      <div className="flex items-center space-x-5">
        <h1 className="font-nunito text-xl">Nexus Connect</h1>
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, i) => (
              <BreadcrumbItem key={i}>
                {crumbs.length - 1 !== i ? (
                  <>
                    <BreadcrumbLink asChild>
                      <NavLink to={crumb.path}>{crumb.name}</NavLink>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {user ? (
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
      ) : (
        <button
          className="text-primary hover:underline text-sm"
          onClick={() => navigate('/login')}
        >
          Log in
        </button>
      )}
    </header>
  );
}
