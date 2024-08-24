import MdiExternalLink from '~icons/mdi/external-link';
import { useModState } from '@/states/vortexState';
import { useParams } from 'react-router-dom';
import { shell } from '@tauri-apps/api';
import Mod from '@/interfaces/Mod';

export default function ModList() {
  const { gameName } = useParams();

  if (!gameName) {
    return (
      <div>
        <p>Page not found</p>
      </div>
    );
  }

  const modList = useModState((state) => state.moddedGames.get(gameName));

  if (!modList) {
    return (
      <div>
        <p>Game does not have any mods</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 p-4">
      {modList.map((mod) => (
        <ModCard mod={mod} key={mod.id} />
      ))}
    </div>
  );
}

function ModCard({ mod }: { mod: Mod }) {
  return (
    <div className="w-full h-full">
      <img
        className="rounded-lg ring-1 dark:ring-slate-600 ring-gray-200 object-cover w-full"
        style={{ aspectRatio: 16 / 9 }}
        src={mod.imageUrl}
        alt="Mod Image"
      />
      <div className="text-left p-2 h-44">
        <p className="font-semibold text-base text-gray-700 line-clamp-2 dark:text-gray-50">
          {mod.name}
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400 h-32">
          {mod.author ? (
            <p className="truncate">
              Author:{' '}
              <span className="text-gray-700 font-medium dark:text-gray-50">
                {mod.author}
              </span>
            </p>
          ) : (
            <></>
          )}
          <p className="line-clamp-5 mt-2">{mod.description}</p>
        </div>
      </div>
      <button
        onClick={() => shell.open(mod.pageUrl)}
        className="flex items-center justify-center rounded-md w-full space-x-2 font-medium px-2 py-1 bg-amber-600"
      >
        <span>Visit Nexus Page</span>
        <MdiExternalLink className="h-5 w-5" />
      </button>
    </div>
  );
}
