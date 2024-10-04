import { NexusGame } from '@/interfaces/NexusMod';
import { create } from 'zustand';

type GameDomain = string;
type GameName = string;

interface GameState {
  games: Map<GameDomain, GameName>;
  initGames: (games: NexusGame[]) => void;
}

export const useGameState = create<GameState>()((set) => ({
  games: new Map<GameDomain, GameName>(),
  initGames(games: NexusGame[]) {
    const map = new Map<GameDomain, GameName>();

    for (const game of games) {
      map.set(game.domain_name, game.name);
    }

    set({ games: map });
  },
}));
