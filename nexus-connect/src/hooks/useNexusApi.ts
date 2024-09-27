import { NexusProfile } from '@/interfaces/User';
import { fetch } from '@tauri-apps/api/http';

export default function useNexusApi() {
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

  return { getNexusProfileAsync };
}
