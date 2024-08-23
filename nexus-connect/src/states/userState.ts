import { Store } from 'tauri-plugin-store-api';
import { create } from 'zustand';

interface UserState {
  nexusApiKey: string;
  store: Store;
  saveNexusApiKey: (apiKey: string) => Promise<void>;
  getNexusApiKey: () => Promise<void>;
}

const NEXUS_API_KEY = 'NEXUS_API_KEY';

export const useUserState = create<UserState>()((set, get) => ({
  nexusApiKey: '',
  store: new Store('.settings.dat'),
  async saveNexusApiKey(apiKey: string) {
    const store = get().store;

    await store.set(NEXUS_API_KEY, apiKey);

    await store.save();

    set({ nexusApiKey: apiKey });
  },
  async getNexusApiKey() {
    const store = get().store;
    const nexusApiKey = await store.get<string>(NEXUS_API_KEY);

    if (nexusApiKey) {
      set({ nexusApiKey });
    }
  },
}));
