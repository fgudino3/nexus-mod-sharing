import Mod from '@/interfaces/Mod';
import { create } from 'zustand';

interface ModState {
  moModList: Mod[];
  vortexModdedGames: Map<string, Mod[]>;
  setMoModList: (moModList: Mod[]) => void;
  parseVortexBackup: (backupData: any) => void;
}

export const useModState = create<ModState>()((set) => ({
  vortexModdedGames: new Map<string, Mod[]>(),
  moModList: [],
  setMoModList(moModList: Mod[]) {
    set({ moModList });
  },
  parseVortexBackup(backupData: any) {
    const modMap: [gameName: string, mod: Mod[]][] = [];
    const gameNames: string[] = Object.keys(backupData);

    for (const gameName of gameNames) {
      const gameMods = backupData[gameName];
      const modNames = Object.keys(gameMods);
      const modList: Mod[] = [];
      let orderCounter = 0;

      for (const modName of modNames) {
        const modData = gameMods[modName];

        const sameMod = modList.find(
          (mod) => modData.attributes.modId === mod.id
        );

        if (sameMod) {
          sameMod.isPatched = true;
          continue;
        }

        modList.push({
          id: modData.attributes.modId,
          name: modData.attributes.modName ?? modData.attributes.name,
          author: modData.attributes.author,
          pageUrl: modData.attributes.homepage,
          imageUrl: modData.attributes.pictureUrl,
          description: modData.attributes.shortDescription,
          installed: modData.state === 'installed',
          fileSizeBytes: modData.attributes.fileSize,
          version: modData.attributes.modVersion,
          order: (orderCounter++).toString().padStart(4, '0'),
          isPatched: false,
        });
      }

      modMap.push([gameName, modList]);
    }

    set({ vortexModdedGames: new Map(modMap) });
  },
}));
