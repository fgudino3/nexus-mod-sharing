import { NexusGame } from '@/interfaces/NexusMod';
import { NexusProfile } from '@/interfaces/User';
import { useGameState } from '@/states/gameState';
import { useUserState } from '@/states/userState';
import { NexusApi } from '@/utils/request';

export default function useNexusApi() {
  const apiKey = useUserState((state) => state.nexusApiKey);
  const games = useGameState((state) => state.games);
  const initNexusGames = useGameState((state) => state.initGames);

  async function getNexusProfileAsync(apikey: string) {
    const { ok, data } = await NexusApi.get<NexusProfile>(
      'https://api.nexusmods.com/v1/users/validate.json',
      apikey
    );

    if (ok) {
      return data;
    }
  }

  async function getNexusGames() {
    if (games.size > 0) {
      return;
    }

    const { data, ok } = await NexusApi.get<NexusGame[]>(
      'https://api.nexusmods.com/v1/games.json',
      apiKey
    );

    if (ok) {
      initNexusGames(data);
    }
  }

  return { getNexusProfileAsync, getNexusGames };
}
