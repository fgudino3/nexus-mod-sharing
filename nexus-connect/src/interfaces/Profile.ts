import Mod from './Mod';

export default interface Profile {
  id: string;
  name: string;
  description: string;
  userId: string;
  mods: Mod[];
}
