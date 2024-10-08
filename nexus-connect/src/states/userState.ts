import User, { UserBase } from '@/interfaces/User';
import { createStore, Store } from '@tauri-apps/plugin-store';
import { create } from 'zustand';

interface UserState {
  store: Store;
  userJwt: string;
  user: User | null;
  nexusApiKey: string;
  following: UserBase[];
  followers: UserBase[];
  setUserConnections: (following: UserBase[], followers: UserBase[]) => void;
  loadUserData: () => Promise<void>;
  saveJwt: (jwt: string) => Promise<void>;
  saveUser: (user: User) => Promise<void>;
  saveNexusApiKey: (apiKey: string) => Promise<void>;
  logout: () => Promise<void>;
}

const NEXUS_API_KEY = 'NEXUS_API_KEY';
const USER_JWT = 'USER_JWT';
const USER_DATA = 'USER_DATA';

const store = await createStore('.settings.dat');

export const useUserState = create<UserState>()((set, get) => ({
  nexusApiKey: '',
  userJwt: '',
  user: null,
  following: [],
  followers: [],
  store,
  setUserConnections(following: UserBase[], followers: UserBase[]) {
    set({ following, followers });
  },
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
  async logout() {
    const store = get().store;

    await store.delete(USER_JWT);
    await store.delete(USER_DATA);

    set({ userJwt: '', user: null });
    set({ followers: [], following: [] });
  },
}));
