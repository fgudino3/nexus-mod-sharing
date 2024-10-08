import Mod from './Mod';

export default interface Profile {
  id: string;
  name: string;
  game: string;
  modCount: number;
  description: string;
  userId: string;
  mods: Mod[];
  user: {
    nexusUsername: string;
    nexusProfileUrl: string;
  };
}

export interface ProfileCreate {
  name: string;
  game: string;
  description: string;
  mods: {
    modId: number;
    version: string;
    order?: string;
    installed: boolean;
    isPatched: boolean;
  }[];
  manualMods: {
    modName: string;
    order?: string;
  }[];
}
