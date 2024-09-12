import MdiExternalLink from '~icons/mdi/external-link';
import { useModState } from '@/states/modState';
import { useParams, useLocation } from 'react-router-dom';
import { fetch, Body } from '@tauri-apps/api/http';
import { shell } from '@tauri-apps/api';
import Mod from '@/interfaces/Mod';
import { useEffect, useState } from 'react';
import { useUserState } from '@/states/userState';
import { emit, listen, UnlistenFn } from '@tauri-apps/api/event';
import { NexusButton } from '@/components/NexusButton';
import Profile from '@/interfaces/Profile';

export default function ModList() {
  const { gameName } = useParams();
  const { pathname } = useLocation();
  const [modList, setModList] = useState<Mod[]>([]);
  const vortexMods = useModState((state) =>
    state.vortexModdedGames.get(gameName!)
  );
  const moModList = useModState((state) => state.moModList);
  const apikey = useUserState((state) => state.nexusApiKey);

  // if (!gameName) {
  //   return (
  //     <div>
  //       <p>Page not found</p>
  //     </div>
  //   );
  // }

  useEffect(() => {
    let listenPromise: Promise<UnlistenFn> | undefined;

    if (pathname.includes('vortex')) {
      setModList(() => vortexMods ?? []);
      console.log(vortexMods);
    } else {
      const startTime = new Date();
      const slicedList = moModList.slice(0);
      const nexusModUrls = slicedList.map(
        (mod) =>
          `https://api.nexusmods.com/v1/games/starfield/mods/${mod.id}.json`
      );
      emit('process_mo_mods', { apikey, nexusModUrls, nexusMods: slicedList });

      listenPromise = listen('mods_processed', (event: any) => {
        console.log(
          event,
          `Elapsed Time: ${new Date().getTime() - startTime.getTime()} ms`
        );
        setModList(() =>
          (event.payload.mods as Mod[]).sort((a, b) =>
            a.order!.localeCompare(b.order!)
          )
        );
      });
      // getMoModMetadata(gameName!, apikey).then(() => {
      //   setModList(() => moModList);
      // });
    }
    console.log('done with useEffect. listening for async event');

    return () => {
      listenPromise?.then((unlisten) => unlisten());
    };
  }, []);

  if (!modList) {
    return (
      <div>
        <p>Game does not have any mods</p>
      </div>
    );
  }

  return (
    <>
      <ProfileForm modList={modList} />
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 p-4">
        {modList.map((mod) => (
          <ModCard mod={mod} key={mod.id} />
        ))}
      </div>
    </>
  );
}

function ProfileForm({ modList }: { modList: Mod[] }) {
  const jwt = useUserState((state) => state.userJwt);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  async function createProfile() {
    await createMods();

    const { ok } = await fetch<Profile>('http://127.0.0.1:8000/profiles', {
      method: 'POST',
      body: Body.json({
        name,
        description,
        mods: modList.map((mod) => ({
          modId: mod.id,
          version: mod.version,
          order: mod.order,
          installed: mod.installed,
          isPatched: mod.isPatched,
        })),
      }),
      headers: {
        authorization: 'Bearer ' + jwt,
      },
    });
  }

  async function createMods() {
    for (const mod of modList) {
      await fetch<Profile>('http://127.0.0.1:8000/mods', {
        method: 'POST',
        body: Body.json({
          id: mod.id,
          name: mod.name,
          description: mod.description,
          author: mod.author,
          pageUrl: mod.pageUrl,
          imageUrl: mod.imageUrl,
        }),
        headers: {
          authorization: 'Bearer ' + jwt,
        },
      });
    }
  }

  return (
    <>
      <input
        type="text"
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Profile name"
        className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
      />
      <input
        type="text"
        onChange={(e) => setDescription(e.currentTarget.value)}
        placeholder="description"
        className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
      />
      <NexusButton onClick={createProfile}>Create Profile</NexusButton>
    </>
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
