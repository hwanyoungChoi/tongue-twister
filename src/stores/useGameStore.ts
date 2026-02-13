import { create } from "zustand";

export const GameStep = {
  LOBBY: 0,
  PLAY: 1,
} as const;

export type GameStep = (typeof GameStep)[keyof typeof GameStep];

interface GameState {
  currentStep: GameStep;

  nextStep: () => void;
}

const useGameStore = create<GameState>((set) => ({
  currentStep: GameStep.LOBBY,

  nextStep: () =>
    set((state) => ({
      currentStep: (state.currentStep + 1) as GameStep,
    })),
}));

export default useGameStore;
