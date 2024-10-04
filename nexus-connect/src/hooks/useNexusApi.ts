import { NexusGame } from '@/interfaces/NexusMod';
import { NexusProfile } from '@/interfaces/User';
import { useGameState } from '@/states/gameState';
import { useUserState } from '@/states/userState';
import { fetch } from '@tauri-apps/api/http';

export default function useNexusApi() {
  const apiKey = useUserState((state) => state.nexusApiKey);
  const games = useGameState((state) => state.games);
  const initNexusGames = useGameState((state) => state.initGames);

  async function getNexusProfileAsync(apikey: string) {
    const { data, ok } = await fetch<NexusProfile>(
      'https://api.nexusmods.com/v1/users/validate.json',
      {
        method: 'GET',
        headers: {
          apikey,
        },
      }
    );

    if (ok) {
      return data;
    }
  }

  async function getNexusGames() {
    if (games.size > 0) {
      return;
    }

    const { data, ok } = await fetch<NexusGame[]>(
      'https://api.nexusmods.com/v1/games.json',
      {
        method: 'GET',
        headers: {
          apikey: apiKey,
        },
      }
    );

    if (ok) {
      initNexusGames(data);
    }
  }

  return { getNexusProfileAsync, getNexusGames };
}
