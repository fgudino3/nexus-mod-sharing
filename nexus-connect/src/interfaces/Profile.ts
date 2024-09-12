import Mod from './Mod';

export default interface Profile {
  name: string;
  description: string;
  userId: string;
  mods: Mod[];
}
