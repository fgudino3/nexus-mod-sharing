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
