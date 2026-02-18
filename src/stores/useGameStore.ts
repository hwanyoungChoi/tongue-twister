import { create } from "zustand";

export const GameStep = {
  LOBBY: 0,
  PLAY: 1,
} as const;

export type GameStep = (typeof GameStep)[keyof typeof GameStep];

export const GameLevelOfDifficulty = {
  Long: 0,
  Short: 1,
};

export type GameLevelOfDifficulty =
  (typeof GameLevelOfDifficulty)[keyof typeof GameLevelOfDifficulty];

export const GamePlayType = {
  Timer: 0,
  Conscience: 1,
};

export type GamePlayType = (typeof GamePlayType)[keyof typeof GamePlayType];

interface GameState {
  currentStep: GameStep;
  players: string[];
  penalty?: string;
  levelOfDifficulty: GameLevelOfDifficulty;
  playType: GamePlayType;

  nextStep: () => void;
  backStep: () => void;
  setPlayers: (param: string[]) => void;
  setPenalty: (param: string) => void;
  setLevelOfDifficulty: (param: GameLevelOfDifficulty) => void;
  setPlayType: (param: GamePlayType) => void;
}

const useGameStore = create<GameState>((set) => ({
  players: ["플레이어1", "플레이어2"],
  currentStep: GameStep.LOBBY,
  levelOfDifficulty: GameLevelOfDifficulty.Long,
  playType: GamePlayType.Timer,

  nextStep: () =>
    set((state) => ({
      currentStep: (state.currentStep + 1) as GameStep,
    })),
  backStep: () =>
    set((state) => ({
      currentStep: (state.currentStep - 1) as GameStep,
    })),
  setPlayers: (newState) => set(() => ({ players: newState })),
  setPenalty: (newState) => set(() => ({ penalty: newState })),
  setLevelOfDifficulty: (newState) =>
    set(() => ({ levelOfDifficulty: newState })),
  setPlayType: (newState) => set(() => ({ playType: newState })),
}));

export default useGameStore;
