import type { GameLevelOfDifficulty, GamePlayType, Player } from "@/types/game";
import { create } from "zustand";

interface GameState {
  /**
   * 게임 인원/닉네임
   */
  players: Player[];
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
}

interface GameAction {
  setPlayers: (param: Player[]) => void;
  setPenalty: (param: string) => void;
  setLevelOfDifficulty: (param: GameLevelOfDifficulty) => void;
  setPlayType: (param: GamePlayType) => void;
  setPlayTime: (param: number) => void;
}

const useGameStore = create<GameState & GameAction>((set) => ({
  players: [
    {
      id: 1,
      name: "플레이어1",
    },
    {
      id: 2,
      name: "플레이어2",
    },
  ],
  levelOfDifficulty: "long",
  playType: "timer",
  playTime: 30,

  setPlayers: (newState) => set(() => ({ players: newState })),
  setPenalty: (newState) => set(() => ({ penalty: newState })),
  setLevelOfDifficulty: (newState) =>
    set(() => ({
      levelOfDifficulty: newState,
      playTime: newState === "long" ? 30 : 15,
    })),
  setPlayType: (newState) => set(() => ({ playType: newState })),
  setPlayTime: (newState) => set(() => ({ playTime: newState })),
}));

export default useGameStore;
