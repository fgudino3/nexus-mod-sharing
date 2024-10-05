import { useModState } from '@/states/modState';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Mod, { ManualModUpsert } from '@/interfaces/Mod';
import { useEffect, useState } from 'react';
import { useUserState } from '@/states/userState';
import { emit, listen, UnlistenFn } from '@tauri-apps/api/event';
import ModCard from '@/components/cards/ModCard';
import { TabsList, Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useImmer } from 'use-immer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LoadingDialog from '@/components/dialogs/LoadingDialog';
import { useGameState } from '@/states/gameState';
import { GameCombobox } from '@/components/forms/GameCombobox';
import useProfileApi from '@/hooks/useProfileApi';
import useNexusApi from '@/hooks/useNexusApi';

const gridCss =
  'grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mt-5';

export default function ModList() {
  const { gameName } = useParams();
  const { pathname } = useLocation();
  const { getNexusGames } = useNexusApi();
  const [modList, setModList] = useImmer<Mod[]>([]);
  const [loading, setLoading] = useState(false);
  const vortexMods = useModState((state) =>
    state.vortexModdedGames.get(gameName!)
  );
  const moModList = useModState((state) => state.moModList);
  const apikey = useUserState((state) => state.nexusApiKey);

  useEffect(() => {
    let listenPromise: Promise<UnlistenFn> | undefined;

    getNexusGames();

    if (pathname.includes('vortex')) {
      setModList(vortexMods ?? []);
    } else {
      const startTime = new Date();
      const nexusMods = moModList.filter((mod) => mod.pageUrl !== undefined);
      const nexusModUrls = nexusMods.map((mod) => {
        const game = mod.pageUrl.split('/')[3];

        return `https://api.nexusmods.com/v1/games/${game}/mods/${mod.id}.json`;
      });

      if (!apikey) {
        return; // TODO: error handling
      }

      emit('process_mo_mods', { apikey, nexusModUrls, nexusMods });
      setLoading(true);

      setTimeout(() => setLoading(() => false), 11000); // fallback close loader

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
        setLoading(false);
      });
    }

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

  const game = modList
    .find((mod) => mod.pageUrl !== undefined)
    ?.pageUrl.split('/')[3];

  const manualMods = modList.filter((mod) => mod.id === undefined);
  const nexusMods = modList.filter((mod) => mod.id !== undefined);
  const [touched, setTouched] = useState(new Set<string>());
  const countToEdit = manualMods.length - touched.size;

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

      setTouched((prev) => new Set(prev.add(order)));
    });
  }

  return (
    <>
      {loading && (
        <LoadingDialog text="Getting mod data from Nexus. Please wait a moment." />
      )}
      {manualMods.length > 0 ? (
        <Tabs defaultValue="manual" className="relative">
          <div className="flex items-center justify-center space-x-10 sticky-header">
            <TabsList className="grid w-md grid-cols-2 justify-self-center">
              <TabsTrigger value="manual">Manual Mods</TabsTrigger>
              <TabsTrigger value="nexus">Nexus Mods</TabsTrigger>
            </TabsList>
            <ProfileForm modList={modList} game={game} />
          </div>
          <TabsContent value="manual">
            <Alert>
              <Info className="w-5 h-5" />
              <AlertTitle>
                {countToEdit > 0 ? (
                  <span>
                    There {countToEdit === 1 ? 'is' : 'are'} {countToEdit} mod
                    {countToEdit === 1 ? '' : 's'} that could use your attention
                  </span>
                ) : (
                  <span>
                    Looks like you've edited all the mods. Feel free to edit
                    some more before creating the profile.
                  </span>
                )}
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
        <>
          <div className="flex items-center justify-end space-x-10 sticky-header">
            <ProfileForm modList={modList} game={game} />
          </div>
          <div className={gridCss}>
            {nexusMods.map((mod) => (
              <ModCard mod={mod} key={mod.id} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

const formSchema = z.object({
  name: z.string().max(128),
  description: z.string().max(512).optional(),
  game: z.string().max(128),
});

function ProfileForm({ modList, game }: { modList: Mod[]; game?: string }) {
  const navigate = useNavigate();
  const games = useGameState((state) => state.games);
  const { createProfile } = useProfileApi();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      game: '',
    },
  });

  form.setValue('game', games.get(game ?? '') ?? '');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setOpen(false);
    setLoading(true);
    await createProfile(
      modList,
      values.name,
      values.description ?? '',
      values.game
    );
    setLoading(false);
    navigate('/', { replace: true });
  }

  return (
    <>
      {loading && <LoadingDialog text="Creating your profile" />}
      <Button className="!bg-primary" onClick={() => setOpen(true)}>
        Create Profile
      </Button>
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Profile</DialogTitle>
            <DialogDescription>
              Create a profile with the mods you have imported.
            </DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mod Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Mod name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <GameCombobox form={form} games={[...games.values()]} />
                <div className="flex justify-end">
                  <Button type="submit" className="!bg-primary">
                    Create
                  </Button>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
