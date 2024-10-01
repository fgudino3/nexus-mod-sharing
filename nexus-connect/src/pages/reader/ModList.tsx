import { useModState } from '@/states/modState';
import { useParams, useLocation } from 'react-router-dom';
import { fetch, Body } from '@tauri-apps/api/http';
import Mod, { ManualModUpsert } from '@/interfaces/Mod';
import { useEffect, useState } from 'react';
import { useUserState } from '@/states/userState';
import { emit, listen, UnlistenFn } from '@tauri-apps/api/event';
import { NexusButton } from '@/components/NexusButton';
import Profile from '@/interfaces/Profile';
import ModCard from '@/components/cards/ModCard';
import { TabsList, Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useImmer } from 'use-immer';

const gridCss =
  'grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mt-5';

export default function ModList() {
  const { gameName } = useParams();
  const { pathname } = useLocation();
  const [modList, setModList] = useImmer<Mod[]>([]);
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
      setModList(vortexMods ?? []);
      console.log(vortexMods);
    } else {
      const startTime = new Date();
      const slicedList = moModList.slice(0);
      const nexusModUrls = slicedList.map(
        (mod) =>
          `https://api.nexusmods.com/v1/games/starfield/mods/${mod.id}.json`
      );

      console.log(apikey, slicedList);

      if (!apikey) {
        return; // TODO: error handling
      }

      emit('process_mo_mods', { apikey, nexusModUrls, nexusMods: slicedList });

      listenPromise = listen('mods_processed', (event: any) => {
        console.log(
          event,
          `Elapsed Time: ${new Date().getTime() - startTime.getTime()} ms`
        );
        setModList(
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

  const manualMods = modList.filter((mod) => mod.id === undefined);
  const nexusMods = modList.filter((mod) => mod.id !== undefined);

  function editManualMod(order: string, updatedMod: ManualModUpsert) {
    setModList((mods) => {
      const mod = mods.find((mod) => mod.order === order);

      if (!mod) {
        return;
      }

      mod.name = updatedMod.name ?? mod.name;
      mod.author = updatedMod.author;
      mod.description = updatedMod.description;
      mod.pageUrl = updatedMod.pageUrl!;
      mod.version = updatedMod.version!;
    });
  }

  return (
    <>
      {/* <ProfileForm modList={modList} /> */}
      {manualMods.length > 0 ? (
        <Tabs defaultValue="manual">
          <TabsList className="grid w-md grid-cols-2 justify-self-center mb-5">
            <TabsTrigger value="manual">Manual Mods</TabsTrigger>
            <TabsTrigger value="nexus">Nexus Mods</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <Alert>
              <Info className="w-5 h-5" />
              <AlertTitle>
                There are {3} mods that need your attention
              </AlertTitle>
              <AlertDescription>
                These are mods that you may have installed manually. It's not
                necessary to fill in info, but it would make your list more
                complete.
              </AlertDescription>
            </Alert>

            <div className={gridCss}>
              {manualMods.map((mod) => (
                <ModCard mod={mod} key={mod.id} editMod={editManualMod} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="nexus" className={gridCss}>
            {nexusMods.map((mod) => (
              <ModCard mod={mod} key={mod.id} />
            ))}
          </TabsContent>
        </Tabs>
      ) : (
        <div className={gridCss}>
          {nexusMods.map((mod) => (
            <ModCard mod={mod} key={mod.id} />
          ))}
        </div>
      )}
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
        game: 'Fallout New Vegas', // TODO: figure out how to get game name
        description,
        mods: modList
          .filter((mod) => mod.id !== undefined)
          .map((mod) => ({
            modId: mod.id,
            version: mod.version,
            order: mod.order,
            installed: mod.installed,
            isPatched: mod.isPatched,
          })),
        manualMods: modList
          .filter((mod) => mod.id === undefined)
          .map((mod) => ({
            modName: mod.name,
            order: mod.order,
          })),
      }),
      headers: {
        authorization: 'Bearer ' + jwt,
      },
    });
  }

  async function createMods() {
    for (const mod of modList) {
      if (mod.id) {
        await fetch<Profile>('http://127.0.0.1:8000/mods', {
          method: 'POST',
          body: Body.json({
            id: mod.id,
            name: mod.name,
            description: mod.description,
            author: mod.author,
            pageUrl: mod.pageUrl,
            imageUrl: mod.imageUrl,
            available: mod.available,
          }),
          headers: {
            authorization: 'Bearer ' + jwt,
          },
        });
      } else {
        await fetch<Profile>('http://127.0.0.1:8000/mods/manual', {
          method: 'POST',
          body: Body.json({
            name: mod.name,
            description: mod.description,
            author: mod.author,
            pageUrl: mod.pageUrl,
          }),
          headers: {
            authorization: 'Bearer ' + jwt,
          },
        });
      }
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
