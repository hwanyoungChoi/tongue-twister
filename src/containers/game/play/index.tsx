import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useGameStore from "@/stores/useGameStore";
import Header from "@/components/common/Header";

import ImageIntroCharacter from "@/assets/images/intro-character.png";
import FixedBottom from "@/components/common/FixedBottom";

type PlayStep = "INTRO" | "COUNTDOWN" | "GAME";

export default function GamePlay() {
  const players = useGameStore((state) => state.players);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [subStep, setSubStep] = useState<PlayStep>("INTRO");
  const [countdown, setCountdown] = useState(3);

  const currentPlayerName = players[currentPlayerIndex];

  useEffect(() => {
    let timer: any;

    if (subStep === "INTRO") {
      timer = setTimeout(() => {
        setSubStep("COUNTDOWN");
        setCountdown(3);
      }, 1000);
    } else if (subStep === "COUNTDOWN") {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        // 동기적 호출이 아닌 setTimeout 콜백 내부에서 호출하여 에러 방지
        timer = setTimeout(() => {
          setSubStep("GAME");
        }, 0);
      }
    }

    return () => clearTimeout(timer);
  }, [subStep, countdown]);

  const handleNextPlayer = () => {
    if (currentPlayerIndex + 1 < players.length) {
      // 다음 플레이어가 남아있으면 인덱스 증가 후 인트로 화면으로 복귀
      setCurrentPlayerIndex((prev) => prev + 1);
      setSubStep("INTRO");
    } else {
      // 모든 플레이어가 끝났다면 결과 화면(다음 스텝)으로 이동
      // nextStep();
    }
  };

  return (
    <div
      className={`flex flex-col min-h-dvh ${subStep === "GAME" ? "bg-[#F8FAFA]" : "bg-white -mt-[48px]"}`}
    >
      <Header type={subStep === "GAME" ? "playing" : "back"} />

      {/* 1️⃣ 인트로 화면 (1초 표시) */}
      {subStep === "INTRO" && (
        <main className="flex-1 flex flex-col items-center justify-center px-[24px]">
          <h1 className="text-center text-[28px] text-[#1F1F1F] leading-[140%] font-one-pop">
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
      )}

      {/* 2️⃣ 카운트다운 화면 (3초 표시) */}
      {subStep === "COUNTDOWN" && (
        <main className="flex-1 flex flex-col items-center justify-center px-[24px]">
          <h1 className="text-center text-[28px] text-[#1F1F1F] leading-[140%] mb-[40px] font-one-pop">
            제한 시간 안에
            <br />
            꼬이지 않고
            <br />
            빠르게 말하기!
          </h1>
          <div className="w-[80px] h-[80px] bg-[#1F1F1F] text-white rounded-full flex items-center justify-center text-[40px] font-one-pop">
            {countdown}
          </div>
        </main>
      )}

      {/* 3️⃣ 실제 게임 화면 (버튼 클릭 시 다음으로) */}
      {subStep === "GAME" && (
        <>
          <main className="flex-1 flex flex-col px-[16px] pt-[20px]">
            <div className="flex-1 bg-[#F8F9FA] rounded-[20px] flex items-center justify-center">
              <p className="text-[20px] font-bold text-gray-500">
                {currentPlayerName} 플레이 영역 (임시)
              </p>
            </div>
          </main>
          <FixedBottom>
            <Button
              variant="primary"
              size="md"
              onClick={handleNextPlayer}
              className="w-full"
            >
              다음 플레이어 (또는 종료)
            </Button>
          </FixedBottom>
        </>
      )}
    </div>
  );
}
