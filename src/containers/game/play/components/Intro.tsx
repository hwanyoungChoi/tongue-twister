import useTimer from "@/hooks/useTimer";
import { useEffect, useMemo } from "react";

import type { Player } from "@/types/game";
import Lottie from "lottie-react";
import { getLottieData } from "@/lib/utils";

function formatPlayerIndex(index: number) {
  switch (index) {
    case 0:
      return "첫 번째";
    case 1:
      return "두 번째";
    case 2:
      return "세 번째";
    case 3:
      return "네 번째";
    case 4:
      return "다섯 번째";
    case 5:
      return "여섯 번째";
    case 6:
      return "일곱 번째";
    case 7:
      return "여덟 번째";
    case 8:
      return "아홉 번째";
    case 9:
      return "열 번째";
    default:
      return "";
  }
}

export default function Intro({
  currentPlayerIndex,
  currentPlayer,
  onNext,
  isPause,
}: {
  currentPlayerIndex: number;
  currentPlayer: Player;
  onNext: () => void;
  isPause: boolean;
}) {
  const { start, pause } = useTimer({
    initialTime: 2000,
    onTimerEnd: () => onNext(),
  });

  useEffect(() => {
    if (isPause) {
      pause();
    } else {
      start();
    }
  }, [isPause, pause, start]);

  const { name, color } = currentPlayer;

  // ⭐️ 핵심: 리렌더링(타이머 틱 등) 시 Lottie가 무작위로 계속 바뀌는 것을 방어합니다.
  const randomLottieType = useMemo(() => {
    const lottieTypes = ["player_circle1", "player_circle2"];

    // eslint-disable-next-line
    const randomIndex = Math.floor(Math.random() * lottieTypes.length);

    return lottieTypes[randomIndex];
  }, [currentPlayerIndex]); // 플레이어의 인덱스(턴)가 넘어갈 때만 새로운 랜덤값을 뽑습니다.

  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-center text-[26px] text-[#1F1F1F] leading-[1.5] font-np">
        긴장되지?
        <br />
        자, {formatPlayerIndex(currentPlayerIndex)} 차례는
        <br />
        <span className="text-[#F571A2]">{name}</span> 너야!
      </h1>
      <Lottie
        animationData={getLottieData(randomLottieType, color)}
        className="w-[160px] h-auto mt-[20px]"
      />
    </main>
  );
}
