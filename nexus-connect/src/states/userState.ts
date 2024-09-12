import User from '@/interfaces/User';
import { Store } from 'tauri-plugin-store-api';
import { create } from 'zustand';

interface UserState {
  store: Store;
  userJwt: string;
  user: User | null;
  nexusApiKey: string;
  loadUserData: () => Promise<void>;
  saveJwt: (jwt: string) => Promise<void>;
  saveUser: (user: User) => Promise<void>;
  saveNexusApiKey: (apiKey: string) => Promise<void>;
}

const NEXUS_API_KEY = 'NEXUS_API_KEY';
const USER_JWT = 'USER_JWT';
const USER_DATA = 'USER_DATA';

export const useUserState = create<UserState>()((set, get) => ({
  nexusApiKey: '',
  userJwt: '',
  user: null,
  store: new Store('.settings.dat'),
  async saveNexusApiKey(apiKey: string) {
    const store = get().store;

    await store.set(NEXUS_API_KEY, apiKey);

    await store.save();

    set({ nexusApiKey: apiKey });
  },
  async saveJwt(jwt: string) {
    const store = get().store;

    await store.set(USER_JWT, jwt);

    await store.save();

    set({ userJwt: jwt });
  },
  async saveUser(user: User) {
    const store = get().store;

    await store.set(USER_DATA, user);

    await store.save();

    set({ user });
  },
  async loadUserData() {
    const store = get().store;

    const nexusApiKey = await store.get<string>(NEXUS_API_KEY);

    if (nexusApiKey) {
      set({ nexusApiKey });
    }

    const userJwt = await store.get<string>(USER_JWT);

    if (userJwt) {
      set({ userJwt });
    }

    const user = await store.get<User>(USER_DATA);

    if (user) {
      set({ user });
    }
  },
}));
