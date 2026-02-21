import { create } from "zustand";

export const GameStep = {
  LOBBY: 0,
  PLAY_TYPE_SETUP: 1,
  PLAY: 2,
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
  /**
   * 게임 진행 flow 제어용 ({내부용}, ex. Lobby 단계, Play 단계, Finish 단계에 따라 화면 보여줌)
   */
  currentStep: GameStep;
  /**
   * 게임 인원/닉네임
   */
  players: string[];
  /**
   * 벌칙 설정 (벌칙 없으면 꺼짐으로 판단)
   */
  penalty?: string;
  /**
   * 문구 길이 (추후 확장성 고려하여 true/false 대신 enum)
   */
  levelOfDifficulty: GameLevelOfDifficulty;
  /**
   * 진행 방식 (추후 확장성 고려하여 true/false 대신 enum)
   */
  playType: GamePlayType;
  /**
   * playType이 Timer일 때 사용되는 상태, 게임 타이머
   */
  playTime: number;

  nextStep: () => void;
  backStep: () => void;
  setPlayers: (param: string[]) => void;
  setPenalty: (param: string) => void;
  setLevelOfDifficulty: (param: GameLevelOfDifficulty) => void;
  setPlayType: (param: GamePlayType) => void;
  setPlayTime: (param: number) => void;
}

const useGameStore = create<GameState>((set) => ({
  players: ["플레이어1", "플레이어2"],
  currentStep: GameStep.LOBBY,
  levelOfDifficulty: GameLevelOfDifficulty.Long,
  playType: GamePlayType.Timer,
  playTime: 30,

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
  setPlayTime: (newState) => set(() => ({ playTime: newState })),
}));

export default useGameStore;
