import { createStore } from "zustand/vanilla";

import { Position } from "./types";
import { shoot } from "./gamelogic";

interface GameState {
  loons: Map<string, Position>;
  towers: Position[];
  lasers: { start: Position; end: Position }[];

  shootInterval: number | undefined;

  ws: WebSocket | undefined;
  mergePatch: (patch: Object) => void;
  addTower: (pos: Position) => void;
  startGameLoop: () => void;
  upgradeTower: (idx: number) => void;
}

export const useGameState = createStore<GameState>()((set, get) => ({
  loons: new Map<string, Position>(),
  towers: [],
  shootInterval: undefined,
  lasers: [],
  ws: undefined,

  startGameLoop: () => {
    if (get().shootInterval === undefined) {
      set({ shootInterval: window.setInterval(shoot, 1000) });
    }
  },
  upgradeTower: (idx) => {
    let t = get().towers;
    t[idx].level += 1;
    set({ towers: t });
  },
  mergePatch: (patch: Object) => {
    let newLoons = new Map(get().loons);

    Object.entries(patch).map((it) => {
      newLoons.set(it[0], {
        position_x: parseInt(it[1].position_x) + 100,
        position_y: parseInt(it[1].position_y) + 100,
        level: parseInt(it[1].level),
      });

      set({ loons: newLoons });
    });
  },
  addTower(pos) {
    set({ towers: [...get().towers, pos] });
  },
}));
