import type { GamePlayType, PlayerResult } from "@/types/game";

/**
 * 최종 순위 정렬
 * 점수 내림차순 → 실패 횟수 오름차순 → 오래 생존한 순
 */
export const getRanking = (results: PlayerResult[]): PlayerResult[] => {
  return [...results].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.failCount !== b.failCount) return a.failCount - b.failCount;

    // 생존자(null)를 탈락자보다 앞에, 탈락자끼리는 늦게 탈락한 쪽을 앞에
    const aOrder = a.eliminatedOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.eliminatedOrder ?? Number.MAX_SAFE_INTEGER;
    return bOrder - aOrder;
  });
};

/**
 * 벌칙 대상자 산정
 * - 타이머 모드: 가장 먼저 탈락한 플레이어 (탈락자가 없으면 최저 점수자)
 * - 양심 모드: 실패 횟수가 가장 많은 플레이어 (동률이면 최저 점수자)
 */
export const getPenaltyTarget = (
  results: PlayerResult[],
  playType: GamePlayType,
): PlayerResult | null => {
  if (results.length === 0) return null;

  if (playType === "timer") {
    const eliminated = results.filter((result) => result.eliminatedOrder !== null);

    if (eliminated.length > 0) {
      return eliminated.reduce((first, current) =>
        current.eliminatedOrder! < first.eliminatedOrder! ? current : first,
      );
    }
  }

  // 양심 모드이거나, 타이머 모드인데 탈락자가 한 명도 없는 경우
  return results.reduce((worst, current) => {
    if (current.failCount !== worst.failCount) {
      return current.failCount > worst.failCount ? current : worst;
    }
    return current.score < worst.score ? current : worst;
  });
};
