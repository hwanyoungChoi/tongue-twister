import useTimer from "@/hooks/useTimer";
import { useEffect } from "react";

import ImageIntroCharacter from "@/assets/images/intro-character.png";

export default function Intro({
  currentPlayerIndex,
  currentPlayerName,
  onNext,
  isPause,
}: {
  currentPlayerIndex: number;
  currentPlayerName: string;
  onNext: () => void;
  isPause: boolean;
}) {
  const { start, pause } = useTimer({
    initialTime: 1000,
    onTimerEnd: () => onNext(),
  });

  useEffect(() => {
    if (isPause) {
      pause();
    } else {
      start();
    }
  }, [isPause, pause, start]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-center text-[26px] text-[#1F1F1F] leading-[1.5] font-np">
        긴장되지?
        <br />
        자, {currentPlayerIndex + 1}번 째 차례는
        <br />
        <span className="text-[#F571A2]">{currentPlayerName}</span> 너야!
      </h1>
      <img
        src={ImageIntroCharacter}
        alt="게임 인트로 캐릭터"
        className="w-[160px] h-auto mt-[20px]"
      />
    </main>
  );
}
