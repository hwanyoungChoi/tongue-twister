/**
 * 게임 난이도 - 긴 문장 | 짧은 문장
 */
export type GameLevelOfDifficulty = "long" | "short";

/**
 * 진행 방식 - 타이머 | 양심
 */
export type GamePlayType = "timer" | "conscience";

export interface Player {
  id: number;
  name: string;
  score?: number;
}
