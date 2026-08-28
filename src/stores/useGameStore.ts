import { create } from "zustand";

import { PLAYER_COLOR_LIST } from "@/lib/constants";
import type {
  GameLevelOfDifficulty,
  GamePlayType,
  Player,
  PlayerResult,
} from "@/types/game";

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
  /**
   * 로비에서 게임을 시작했는지 여부 (세션 가드 용도)
   * 새로고침/URL 직접 진입 시 false이므로 로비로 되돌린다
   */
  hasStarted: boolean;
  /**
   * 게임 종료 시점의 플레이어별 최종 성적
   */
  results: PlayerResult[];
}

interface GameAction {
  setPlayers: (param: Player[]) => void;
  setPenalty: (param: string) => void;
  setLevelOfDifficulty: (param: GameLevelOfDifficulty) => void;
  setPlayType: (param: GamePlayType) => void;
  setPlayTime: (param: number) => void;
  /**
   * 로비 → 셋업으로 진입할 때 호출. 이전 판의 결과를 비운다
   */
  startGame: () => void;
  /**
   * 게임 종료 시 최종 성적을 커밋
   */
  finishGame: (param: PlayerResult[]) => void;
  /**
   * 로비로 완전히 빠져나올 때 호출
   */
  exitGame: () => void;
}

const useGameStore = create<GameState & GameAction>((set) => ({
  players: [
    {
      id: 1,
      name: "플레이어1",
      color: PLAYER_COLOR_LIST[0],
    },
    {
      id: 2,
      name: "플레이어2",
      color: PLAYER_COLOR_LIST[1],
    },
  ],
  levelOfDifficulty: "long",
  playType: "timer",
  playTime: 30,
  hasStarted: false,
  results: [],

  setPlayers: (newState) => set(() => ({ players: newState })),
  setPenalty: (newState) => set(() => ({ penalty: newState })),
  setLevelOfDifficulty: (newState) =>
    set(() => ({
      levelOfDifficulty: newState,
      playTime: newState === "long" ? 30 : 15,
    })),
  setPlayType: (newState) => set(() => ({ playType: newState })),
  setPlayTime: (newState) => set(() => ({ playTime: newState })),

  startGame: () => set(() => ({ hasStarted: true, results: [] })),
  finishGame: (newState) => set(() => ({ results: newState })),
  exitGame: () => set(() => ({ hasStarted: false, results: [] })),
}));

export default useGameStore;
