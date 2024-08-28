import Mod from '@/interfaces/Mod';
import MoMod from '@/interfaces/MoMod';

export function mapMoModsToMods(moMods: MoMod[]): Mod[] {
  const modList: Mod[] = [];

  for (const moMod of moMods) {
    const sameMod = modList.find((mod) => mod.id === moMod.id);

    if (sameMod) {
      sameMod.isPatched = true;
      continue;
    }

    modList.push({
      id: moMod.id,
      name: moMod.name,
      pageUrl: moMod.pageUrl,
      version: moMod.version,
      installed: moMod.status === '+',
      isPatched: false,
    });
  }

  return modList;
}
