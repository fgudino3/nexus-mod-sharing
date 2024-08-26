import Mod from '@/interfaces/Mod';
import { MoMod } from '@/interfaces/MoMod';

export function mapMoModsToMods(moMods: MoMod[]): Mod[] {
  return moMods.map((moMod) => ({
    id: moMod.id,
    name: moMod.name,
    pageUrl: moMod.pageUrl,
    version: moMod.version,
    installed: moMod.status === '+',
  }));
}
