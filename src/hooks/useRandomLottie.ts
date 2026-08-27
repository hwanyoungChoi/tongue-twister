import { useMemo } from "react";

/**
 * 여러 개의 Lottie 타입 중 하나를 랜덤으로 뽑아 고정해 주는 공통 훅
 * @param types 고를 수 있는 타입 배열 (2개 이상 몇 개든 가능!)
 * @param trigger 이 값이 변경될 때만 새로운 랜덤값을 다시 뽑음
 */
export default function useRandomLottie(types: string[], trigger?: unknown) {
  return useMemo(
    () => types[Math.floor(Math.random() * types.length)],
    // ⭐️ types는 매 렌더 새 배열일 수 있어 의도적으로 제외 — trigger가 바뀔 때만 다시 뽑음
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trigger],
  );
}
