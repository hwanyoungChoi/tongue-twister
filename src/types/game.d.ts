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
  color: string;
}

/**
 * 게임 종료 시점의 플레이어별 최종 성적
 */
export interface PlayerResult {
  player: Player;
  /**
   * 최종 점수 (성공한 문구 수 + 타이머 모드 잔여 시간 보너스)
   */
  score: number;
  /**
   * 남은 목숨 (0이면 탈락)
   */
  life: number;
  /**
   * 실패 횟수 (꼬였어! + 시간 초과)
   */
  failCount: number;
  /**
   * 탈락 순서 (1부터 시작, 끝까지 생존했으면 null)
   */
  eliminatedOrder: number | null;
}
