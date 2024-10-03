import { create } from 'zustand';
import { games } from '@/utils/games';

type GameDomain = string;
type GameName = string;

interface GameState {
  games: Map<GameDomain, GameName>;
  initGames: () => void;
}

export const useGameState = create<GameState>()((set) => ({
  games: new Map<GameDomain, GameName>(),
  initGames() {
    const map = new Map<GameDomain, GameName>();

    for (const game of games) {
      map.set(game.domain_name, game.name);
    }

    set({ games: map });
  },
}));
