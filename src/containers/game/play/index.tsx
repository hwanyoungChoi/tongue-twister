import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useGameStore from "@/stores/useGameStore";
import Header from "@/components/common/Header";
import FixedBottom from "@/components/common/FixedBottom";
import ConfirmPopup from "@/components/common/ConfirmPopup";
import Countdown from "./components/Countdown";
import Intro from "./components/Intro";

import ImageIntroCharacter from "@/assets/images/intro-character.png";
import IconAlarmClockFill from "@/assets/icons/alarm_clock_fill.svg?react";
import IconTongue from "@/assets/icons/tongue.svg?react";
import IconTongueGray from "@/assets/icons/tongue_gray.svg?react";

import { GAME_TEXT_LIST } from "@/lib/constants";
import { useBlocker, useNavigate } from "react-router-dom";
import ROUTES from "@/lib/routes";
import useTimer from "@/hooks/useTimer";
import { formatMsToS } from "@/lib/utils";

type PlayStep = "INTRO" | "COUNTDOWN" | "GAME";

export default function GamePlay() {
  const navigate = useNavigate();

  const {
    state: blockerState,
    proceed,
    reset,
  } = useBlocker(({ historyAction }) => historyAction === "POP");

  const isHistoryPop = blockerState === "blocked";

  const players = useGameStore((state) => state.players);
  const levelOfDifficulty = useGameStore((state) => state.levelOfDifficulty);
  const playType = useGameStore((state) => state.playType);
  const playTime = useGameStore((state) => state.playTime);

  const [subStep, setSubStep] = useState<PlayStep>("INTRO");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [round, setRound] = useState(1);

  const currentPlayerName = players[currentPlayerIndex];

  const {
    start: startGameTimer,
    pause: pauseGameTimer,
    reset: resetGameTimer,
    currentTime: gameTime,
  } = useTimer({
    initialTime: playTime * 1000,
    onTimerEnd: () => {
      console.log("타임아웃");
      resetGameTimer();
    },
  });

  useEffect(() => {
    if (subStep !== "GAME") {
      return;
    }
    if (isHistoryPop) {
      pauseGameTimer();
    } else {
      startGameTimer();
    }
  }, [isHistoryPop, pauseGameTimer, startGameTimer, subStep]);

  const handleNextPlayer = () => {
    resetGameTimer();

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
            isPause={isHistoryPop}
          />
        )}

        {subStep === "COUNTDOWN" && (
          <Countdown onNext={() => setSubStep("GAME")} isPause={isHistoryPop} />
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
                    <p className="text-[18px] text-[#4A4A4A] font-np">
                      {currentPlayerName}
                    </p>
                  </div>
                </div>
                <div className="flex gap-[4px] items-center h-[58px] bg-[#F8FAFA] rounded-[10000px] px-[10px]">
                  <div className="flex flex-col justify-center gap-[2px] w-[48px]">
                    <p className="font-[600] text-[12px] text-[#8C8C8C] text-center">
                      점수
                    </p>
                    <p className="text-[18px] text-[#F571A2] text-center font-np">
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
                        <div className="flex justify-center">
                          <div className="flex min-w-[50px] max-w-[50px] items-center justify-between">
                            <IconAlarmClockFill width={16} height={16} />
                            <p className="text-[13px] text-[#8C8C8C] font-np">
                              {`${formatMsToS(gameTime)}초`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {playType === "conscience" && <div />}
                  <p className="text-[40px] text-[#1F1F1F] font-np">
                    {GAME_TEXT_LIST[levelOfDifficulty][round - 1]}
                  </p>
                  <p className="text-[13px] text-[#BDBDBD] font-np">
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
        open={isHistoryPop}
        title="정말 게임을 종료할거야?"
        description="지금까지 한 발음, 되돌릴 수 없어!"
        okButtonLabel="계속하기"
        cancelButtonLabel="종료하기"
        okButtonClick={reset}
        cancelButtonClick={() => {
          /**
           * 양심모드일 때는 로비로 보내버린다.
           * play type setup 페이지가 타이머 후 자동 진행이므로
           */
          if (playType === "conscience") {
            navigate(ROUTES.LOBBY, { replace: true });
            return;
          }

          proceed!();
        }}
      />
    </>
  );
}
