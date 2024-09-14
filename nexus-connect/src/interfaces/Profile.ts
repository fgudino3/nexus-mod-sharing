import Mod from './Mod';

export default interface Profile {
  id: string;
  name: string;
  game: string;
  modCount: string;
  description: string;
  userId: string;
  mods: Mod[];
  user: {
    nexusUsername: string;
    nexusProfileUrl: string;
  };
}
