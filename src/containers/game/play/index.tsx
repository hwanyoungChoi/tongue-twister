import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useGameStore from "@/stores/useGameStore";
import Header from "@/components/common/Header";

import ImageIntroCharacter from "@/assets/images/intro-character.png";
import IconAlarmClockFill from "@/assets/icons/alarm_clock_fill.svg?react";
import IconTongue from "@/assets/icons/tongue.svg?react";
import IconTongueGray from "@/assets/icons/tongue_gray.svg?react";

import FixedBottom from "@/components/common/FixedBottom";
import { GAME_TEXT_LIST } from "@/lib/constants";
import { useBlocker, useNavigate } from "react-router-dom";
import ROUTES from "@/lib/routes";
import ConfirmPopup from "@/components/common/ConfirmPopup";

type PlayStep = "INTRO" | "COUNTDOWN" | "GAME";

export default function GamePlay() {
  const navigate = useNavigate();

  const {
    state: blockerState,
    proceed,
    reset,
  } = useBlocker(({ historyAction }) => historyAction === "POP");
  console.log(blockerState);

  const players = useGameStore((state) => state.players);
  const levelOfDifficulty = useGameStore((state) => state.levelOfDifficulty);
  const playType = useGameStore((state) => state.playType);
  const playTime = useGameStore((state) => state.playTime);

  const [subStep, setSubStep] = useState<PlayStep>("INTRO");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [round, setRound] = useState(1);

  const currentPlayerName = players[currentPlayerIndex];

  const handleNextPlayer = () => {
    if (round < 10) {
      setRound((prev) => prev + 1);
      return;
    }
    if (currentPlayerIndex + 1 < players.length) {
      // 다음 플레이어가 남아있으면 인덱스 증가 후 인트로 화면으로 복귀
      setCurrentPlayerIndex((prev) => prev + 1);
      setSubStep("INTRO");
      // 라운드 초기화
      setRound(1);
    } else {
      // 모든 플레이어가 끝났다면 결과 화면(다음 스텝)으로 이동
      // nextStep();
      navigate(ROUTES.FINISH);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col min-h-dvh ${subStep === "GAME" ? "bg-[#F8FAFA]" : "bg-white -mt-[48px]"}`}
      >
        <Header type={subStep === "GAME" ? "play" : "back"} />

        {subStep === "INTRO" && (
          <Intro
            currentPlayerIndex={currentPlayerIndex}
            currentPlayerName={currentPlayerName}
            onNext={() => setSubStep("COUNTDOWN")}
          />
        )}

        {subStep === "COUNTDOWN" && (
          <Countdown onNext={() => setSubStep("GAME")} />
        )}

        {subStep === "GAME" && (
          <>
            <main className="flex-1 flex flex-col px-[16px]">
              <div className="flex items-center justify-between gap-[8px] h-[72px] bg-white rounded-[1000px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] pl-[12px] pr-[8px] mb-[16px]">
                <div className="flex items-center justify-between gap-[8px]">
                  <img
                    src={ImageIntroCharacter}
                    className="w-[48px] h-[48px]"
                  />
                  <div className="flex flex-col justify-center gap-[4px]">
                    <div className="bg-[#F5F5F5] rounded-[100px] w-fit h-[18px] px-[6px] font-[700] text-[11px] text-[#8C8C8C] flex items-center">
                      {round}Round
                    </div>
                    <p className="text-[19px] text-[#4A4A4A] font-one-pop">
                      {currentPlayerName}
                    </p>
                  </div>
                </div>
                <div className="flex gap-[4px] items-center h-[58px] bg-[#F8FAFA] rounded-[10000px] px-[10px]">
                  <div className="flex flex-col justify-center gap-[2px] w-[48px]">
                    <p className="font-[600] text-[12px] text-[#8C8C8C] text-center">
                      점수
                    </p>
                    <p className="text-[18px] text-[#F571A2] text-center font-one-pop">
                      0
                    </p>
                  </div>
                  <div className="border" />
                  <div className="flex flex-col justify-center gap-[2px] w-[80px]">
                    <p className="font-[600] text-[12px] text-[#8C8C8C] text-center">
                      남은 기회
                    </p>
                    <div className="flex gap-[2px] items-center justify-center">
                      <IconTongue />
                      <IconTongueGray />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-[457px] pt-[40px] pb-[20px] px-[20px] bg-white rounded-[24px] shadow-[0_10px_40px_0_rgba(0,0,0,0.1)]">
                <div className="h-full flex flex-col justify-between items-center text-center">
                  {playType === "timer" && (
                    <>
                      <div className="w-full px-[32px]">
                        <div className="h-[12px] bg-[#F571A2] rounded-[100px] mb-[8px]" />
                        <div className="flex gap-[4px] items-center justify-center">
                          <IconAlarmClockFill width={16} height={16} />{" "}
                          <p className="text-[13px] text-[#8C8C8C] font-one-pop">
                            0:{playTime}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {playType === "conscience" && <div />}
                  <p className="text-[48px] text-[#1F1F1F] font-one-pop">
                    {GAME_TEXT_LIST[levelOfDifficulty][round - 1]}
                  </p>
                  <p className="text-[16px] text-[#BDBDBD] font-one-pop ">
                    {round} / 10
                  </p>
                </div>
              </div>
            </main>

            <FixedBottom>
              {playType === "timer" && (
                <Button variant="primary" size="md" onClick={handleNextPlayer}>
                  성공!
                </Button>
              )}

              {playType === "conscience" && (
                <div className="flex items-center gap-[12px]">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleNextPlayer}
                    className="flex-1"
                  >
                    꼬였어!
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNextPlayer}
                    className="flex-1"
                  >
                    성공!
                  </Button>
                </div>
              )}
            </FixedBottom>
          </>
        )}
      </div>

      <ConfirmPopup
        open={blockerState === "blocked"}
        title="정말 게임을 종료할거야?"
        description="지금까지 한 발음, 되돌릴 수 없어!"
        okButtonLabel="계속하기"
        cancelButtonLabel="종료하기"
        okButtonClick={reset}
        cancelButtonClick={proceed}
      />
    </>
  );
}

function Intro({
  currentPlayerIndex,
  currentPlayerName,
  onNext,
}: {
  currentPlayerIndex: number;
  currentPlayerName: string;
  onNext: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onNext, 1000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center">
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
  );
}

function Countdown({ onNext }: { onNext: () => void }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      // 동기적 호출이 아닌 setTimeout 콜백 내부에서 호출하여 에러 방지
      timer = setTimeout(onNext, 0);
    }

    return () => clearTimeout(timer);
  }, [countdown, onNext]);

  return (
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
  );
}
