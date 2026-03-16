import { useMemo } from "react";

/**
 * 여러 개의 Lottie 타입 중 하나를 랜덤으로 뽑아 고정해 주는 공통 훅
 * @param types 고를 수 있는 타입 배열 (2개 이상 몇 개든 가능!)
 * @param trigger 이 값이 변경될 때만 새로운 랜덤값을 다시 뽑음
 */
export default function useRandomLottie(types: string[], trigger: unknown) {
  return useMemo(() => {
    // eslint-disable-next-line
    const randomIndex = Math.floor(Math.random() * types.length);

    return types[randomIndex];
  }, [trigger]); // trigger가 바뀔 때만 useMemo가 다시 실행됨
}
