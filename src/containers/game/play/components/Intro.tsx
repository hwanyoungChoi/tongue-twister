import useTimer from "@/hooks/useTimer";
import { useEffect } from "react";

import type { Player } from "@/types/game";
import Lottie from "lottie-react";
import { getLottieData } from "@/lib/utils";
import useRandomLottie from "@/hooks/useRandomLottie";

const KOREAN_ORDINALS = [
  "첫 번째",
  "두 번째",
  "세 번째",
  "네 번째",
  "다섯 번째",
  "여섯 번째",
  "일곱 번째",
  "여덟 번째",
  "아홉 번째",
  "열 번째",
];

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

  const lottie = useRandomLottie(
    ["player_circle1", "player_circle2"],
    currentPlayerIndex,
  );

  return (
    <main className="flex-1 flex flex-col items-center justify-center -mt-[48px]">
      <h1 className="text-center text-[26px] text-[#1F1F1F] leading-[1.5] font-np">
        긴장되지?
        <br />
        자, {KOREAN_ORDINALS[currentPlayerIndex]} 차례는
        <br />
        <span className="text-[#F571A2]">{name}</span> 너야!
      </h1>
      <Lottie
        animationData={getLottieData(lottie, color)}
        className="w-[160px] h-auto mt-[20px]"
      />
    </main>
  );
}
