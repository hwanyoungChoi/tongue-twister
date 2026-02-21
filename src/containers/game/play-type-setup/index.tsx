import useGameStore, { GamePlayType } from "@/stores/useGameStore";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";
import FixedBottom from "@/components/common/FixedBottom";

import ImageIntroCharacter from "@/assets/images/intro-character.png";

export default function GamePlayTypeSetup() {
  const playType = useGameStore((state) => state.playType);

  return (
    <div className="min-h-dvh flex flex-col">
      <Header type="back" />

      {playType === GamePlayType.Timer && <TimerSetup />}
      {playType === GamePlayType.Conscience && <ConscienceSetup />}
    </div>
  );
}

const TIME_OPTIONS = [10, 15, 20, 30, 40];

function TimerSetup() {
  const nextStep = useGameStore((state) => state.nextStep);

  const playTime = useGameStore((state) => state.playTime);
  const setPlayTime = useGameStore((state) => state.setPlayTime);

  return (
    <div className="relative h-full pb-[120px]">
      <h1 className="text-center text-[28px] text-[#1F1F1F] font-one-pop mb-[20px] mt-[40px]">
        잠깐! 잠깐!
        <br />
        10장의 카드를
        <br />몇 초안에 읽을래?
      </h1>
      <div className="space-y-[12px] px-[24px]">
        {TIME_OPTIONS.map((option) => (
          <button
            key={option}
            className={`
              w-full flex items-center rounded-[12px] px-[16px] h-[56px] font-one-pop text-[20px]
              ${playTime === option ? "bg-white text-[#1F1F1F] border-[2px] border-[#1F1F1F]" : "bg-[#F5F5F5] text-[#BDBDBD] active:bg-[#E5E5E5]"}
            `}
            onClick={() => setPlayTime(option)}
          >
            {option}초
          </button>
        ))}
      </div>

      <FixedBottom>
        <Button variant="primary" size="md" onClick={nextStep}>
          진짜 게임 시작
        </Button>
      </FixedBottom>
    </div>
  );
}

function ConscienceSetup() {
  const nextStep = useGameStore((state) => state.nextStep);

  useEffect(() => {
    const timer = setTimeout(() => {
      nextStep();
    }, 1000);

    return () => clearTimeout(timer);
  }, [nextStep]);

  return (
    <div className="flex flex-[1] flex-col items-center justify-center font-one-pop bg-white">
      <h1 className="text-center text-[28px] text-[#1F1F1F] font-one-pop">
        친구가 잘 읽었는지
        <br />
        혀가 꼬여있는지
        <br />잘 감시하라구~!
      </h1>
      <img
        src={ImageIntroCharacter}
        alt="게임 인트로 캐릭터"
        className="w-[160px] h-auto mt-[20px]"
      />
    </div>
  );
}
