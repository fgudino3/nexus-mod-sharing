import Mod from '@/interfaces/Mod';
import { create } from 'zustand';

interface ModState {
  moddedGames: Map<string, Mod[]>;
  parseVortexBackup: (backupData: any) => void;
}

export const useModState = create<ModState>()((set) => ({
  moddedGames: new Map<string, Mod[]>(),
  parseVortexBackup(backupData: any) {
    const modMap: [gameName: string, mod: Mod[]][] = [];
    const gameNames: string[] = Object.keys(backupData);

    for (const gameName of gameNames) {
      const gameMods = backupData[gameName];
      const modNames = Object.keys(gameMods);
      const modList: Mod[] = [];

      for (const modName of modNames) {
        const modData = gameMods[modName];

        modList.push({
          id: modData.id,
          name: modData.attributes.modName ?? modData.attributes.name,
          author: modData.attributes.author,
          pageUrl: modData.attributes.homepage,
          imageUrl: modData.attributes.pictureUrl,
          description: modData.attributes.shortDescription,
          installed: modData.state === 'installed',
        });
      }

      modMap.push([gameName, modList]);
    }

    set({ moddedGames: new Map(modMap) });
  },
}));
