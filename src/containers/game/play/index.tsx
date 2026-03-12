import { useEffect, useState, useRef } from "react";
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

import ImageClearTimerCharacter from "@/assets/images/game/clear_timer_character.svg?react";
import ImageClearConscienceCharacter from "@/assets/images/game/clear_conscience_character.svg?react";

import { GAME_TEXT_LIST } from "@/lib/constants";
import { useBlocker, useNavigate } from "react-router-dom";
import ROUTES from "@/lib/routes";
import useTimer from "@/hooks/useTimer";
import { formatMsToS } from "@/lib/utils";
import TimeGauge from "./components/TimeGauge";

type PlayStep = "INTRO" | "COUNTDOWN" | "GAME" | "TURN_RESULT";
type TurnResultType = "CLEAR" | "FAIL" | "TIMEOUT";

const MAX_ROUND = 3;
const MAX_SEQUENCE = 10;
const MAX_LIFE = 2;

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
  const [sequence, setSequence] = useState(1);
  const [round, setRound] = useState(1);

  // 상태 업데이트 지연을 방어하는 완벽한 동기 자물쇠
  const isPenaltyRef = useRef(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [playerStats, setPlayerStats] = useState(() =>
    players.map(() => ({ score: 0, life: MAX_LIFE })),
  );

  const [turnResult, setTurnResult] = useState<{
    type: TurnResultType;
    earnedScore: number;
  } | null>(null);

  const currentPlayerName = players[currentPlayerIndex].name;
  const currentLife = playerStats[currentPlayerIndex].life;
  const currentScore = playerStats[currentPlayerIndex].score;

  // ⭐️ 시간 초과 처리 (버그 1 완벽 해결)
  const handleTimeout = () => {
    // 이미 패널티 처리 중이라면 절대 중복 실행 안 됨!
    if (isPenaltyRef.current) return;
    isPenaltyRef.current = true; // 0.001초 만에 자물쇠 잠금

    pauseGameTimer();

    setPlayerStats((prev) =>
      prev.map((stat, idx) =>
        idx === currentPlayerIndex ? { ...stat, life: stat.life - 1 } : stat,
      ),
    );

    const lifeAfterPenalty = currentLife - 1;

    if (lifeAfterPenalty <= 0) {
      handleTurnEnd("TIMEOUT");
    } else if (sequence === MAX_SEQUENCE) {
      handleTurnEnd("TIMEOUT");
    } else {
      setIsButtonDisabled(true); // 1초 대기 UI 트리거 가동
    }
  };

  const {
    start: startGameTimer,
    pause: pauseGameTimer,
    reset: resetGameTimer,
    currentTime: gameTime,
  } = useTimer({
    initialTime: playTime * 1000,
    onTimerEnd: handleTimeout,
  });

  // ⭐️ 1초 대기 후 다음 시퀀스로 넘어가는 로직 (버그 2 완벽 해결)
  useEffect(() => {
    let timeoutId: number;
    if (isButtonDisabled) {
      timeoutId = setTimeout(() => {
        setSequence((prev) => prev + 1);
        setIsButtonDisabled(false);
        isPenaltyRef.current = false; // 자물쇠 해제

        // ✅ 목숨을 바쳐서 부활했으니 타이머 꽉 채워서 리셋 후 재시작!
        if (playType === "timer") {
          resetGameTimer();
          startGameTimer();
        }
      }, 1000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isButtonDisabled, playType, resetGameTimer, startGameTimer]);

  useEffect(() => {
    if (subStep !== "GAME") return;

    // 팝업이 떴거나, 버튼이 잠겼을(패널티 대기 중) 때는 타이머 정지
    if (isHistoryPop || isButtonDisabled) {
      pauseGameTimer();
    } else {
      if (playType === "timer") {
        startGameTimer();
      }
    }
  }, [
    isHistoryPop,
    isButtonDisabled,
    pauseGameTimer,
    startGameTimer,
    subStep,
    playType,
  ]);

  const handleTurnEnd = (type: TurnResultType) => {
    pauseGameTimer();

    const baseScore = type === "CLEAR" ? sequence : sequence - 1;
    let bonusScore = 0;

    if (type === "CLEAR" && playType === "timer") {
      bonusScore = Math.floor(gameTime / 1000);
      setPlayerStats((prev) =>
        prev.map((stat, idx) =>
          idx === currentPlayerIndex
            ? { ...stat, score: stat.score + bonusScore }
            : stat,
        ),
      );
    }

    setTurnResult({ type, earnedScore: baseScore + bonusScore });
    setSubStep("TURN_RESULT");
  };

  const handleSuccess = () => {
    if (isPenaltyRef.current) return; // 연타 방어

    setPlayerStats((prev) =>
      prev.map((stat, idx) =>
        idx === currentPlayerIndex ? { ...stat, score: stat.score + 1 } : stat,
      ),
    );

    if (sequence === MAX_SEQUENCE) {
      handleTurnEnd("CLEAR");
    } else {
      setSequence((prev) => prev + 1);
    }
  };

  const handleFail = () => {
    if (isPenaltyRef.current) return;
    isPenaltyRef.current = true; // 자물쇠 잠금

    setPlayerStats((prev) =>
      prev.map((stat, idx) =>
        idx === currentPlayerIndex ? { ...stat, life: stat.life - 1 } : stat,
      ),
    );

    const lifeAfterPenalty = currentLife - 1;

    if (lifeAfterPenalty <= 0) {
      handleTurnEnd("FAIL");
    } else if (sequence === MAX_SEQUENCE) {
      handleTurnEnd("FAIL");
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleNextPlayer = () => {
    resetGameTimer();
    setSequence(1);
    setIsButtonDisabled(false);
    isPenaltyRef.current = false; // 자물쇠 초기화

    let nextIndex = currentPlayerIndex + 1;
    let nextRound = round;

    while (nextIndex < players.length && playerStats[nextIndex].life <= 0) {
      nextIndex++;
    }

    if (nextIndex >= players.length) {
      nextRound++;
      nextIndex = 0;
      while (nextIndex < players.length && playerStats[nextIndex].life <= 0) {
        nextIndex++;
      }
    }

    if (nextRound > MAX_ROUND || nextIndex >= players.length) {
      navigate(ROUTES.FINISH);
    } else {
      setRound(nextRound);
      setCurrentPlayerIndex(nextIndex);
      setSubStep("INTRO");
    }
  };

  const isPlayingOrResult = subStep === "GAME" || subStep === "TURN_RESULT";

  return (
    <>
      <div
        className={`flex flex-col min-h-dvh ${isPlayingOrResult ? "bg-[#F8FAFA]" : "bg-white -mt-[48px]"}`}
      >
        <Header type={isPlayingOrResult ? "play" : "back"} />
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
        {isPlayingOrResult && (
          <>
            <main className="flex-1 flex flex-col px-[16px]">
              <div className="flex items-center justify-between gap-[8px] h-[72px] bg-white rounded-[1000px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] pl-[12px] pr-[8px] mb-[16px]">
                <div className="flex items-center justify-between gap-[8px]">
                  <img
                    src={ImageIntroCharacter}
                    className="w-[48px] h-[48px]"
                    alt="character"
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
                      {currentScore}
                    </p>
                  </div>
                  <div className="border" />
                  <div className="flex flex-col justify-center gap-[2px] w-[80px]">
                    <p className="font-[600] text-[12px] text-[#8C8C8C] text-center">
                      남은 기회
                    </p>
                    <div className="flex gap-[2px] items-center justify-center">
                      {currentLife >= 1 ? <IconTongue /> : <IconTongueGray />}
                      {currentLife >= 2 ? <IconTongue /> : <IconTongueGray />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-[457px] pt-[40px] pb-[20px] px-[20px] bg-white rounded-[24px] shadow-[0_10px_40px_0_rgba(0,0,0,0.1)]">
                {subStep === "GAME" ? (
                  <div className="h-full flex flex-col justify-between items-center text-center">
                    {playType === "timer" && (
                      <div className="w-full px-[32px]">
                        <TimeGauge
                          ratio={(gameTime / (playTime * 1000)) * 100}
                        />
                        <div className="flex justify-center mt-[8px]">
                          <div className="flex min-w-[50px] max-w-[50px] items-center justify-between">
                            <IconAlarmClockFill width={16} height={16} />
                            <p className="text-[13px] text-[#8C8C8C] font-np">{`${formatMsToS(gameTime)}초`}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {playType === "conscience" && <div />}
                    <p className="text-[40px] text-[#1F1F1F] font-np leading-[140%]">
                      {
                        GAME_TEXT_LIST[levelOfDifficulty][round - 1][
                          sequence - 1
                        ]
                      }
                    </p>
                    <p className="text-[13px] text-[#BDBDBD] font-np">
                      {sequence} / 10
                    </p>
                  </div>
                ) : (
                  turnResult && (
                    <div className="h-full flex flex-col justify-center items-center text-center pt-[20px]">
                      {turnResult.type === "CLEAR" && (
                        <h2 className="text-[26px] leading-[1.5] text-[#1F1F1F] font-np">
                          {playType === "timer" ? (
                            <>
                              {formatMsToS(gameTime)}초 남기고 성공했네!
                              <br />
                              <span className="text-[#F571A2]">
                                추가 {turnResult.earnedScore - sequence}점 획득!
                              </span>
                              <ImageClearTimerCharacter />
                            </>
                          ) : (
                            <>
                              {currentPlayerName}{" "}
                              <span className="text-[#F571A2]">
                                {turnResult.earnedScore}점 획득!
                              </span>
                              <ImageClearConscienceCharacter />
                            </>
                          )}
                        </h2>
                      )}

                      {turnResult.type === "FAIL" && (
                        <h2 className="text-[26px] leading-[1.5] text-[#1F1F1F] font-np">
                          {currentLife > 0 ? (
                            <>
                              혀가 꼬였어!
                              <br />
                              남은 기회는{" "}
                              <span className="text-[#F571A2]">한 번</span>이다?
                            </>
                          ) : (
                            <>
                              저런.. 이제
                              <br />
                              남은 기회는 없어..
                            </>
                          )}
                        </h2>
                      )}

                      {turnResult.type === "TIMEOUT" && (
                        <h2 className="text-[28px] font-bold text-[#1F1F1F] font-np leading-[140%]">
                          {currentLife > 0 ? (
                            <>
                              시간이 부족했니!
                              <br />
                              남은 기회는{" "}
                              <span className="text-[#F571A2]">한 번</span>이다?
                            </>
                          ) : (
                            <>
                              저런.. 이제
                              <br />
                              남은 기회는 없어..
                            </>
                          )}
                        </h2>
                      )}
                    </div>
                  )
                )}
              </div>
            </main>

            <FixedBottom>
              {subStep === "GAME" ? (
                <>
                  {playType === "timer" && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSuccess}
                      className="w-full"
                      disabled={isButtonDisabled}
                    >
                      성공!
                    </Button>
                  )}
                  {playType === "conscience" && (
                    <div className="flex items-center gap-[12px]">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={handleFail}
                        className="flex-1"
                        disabled={isButtonDisabled}
                      >
                        꼬였어!
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSuccess}
                        className="flex-1"
                        disabled={isButtonDisabled}
                      >
                        성공!
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNextPlayer}
                  className="w-full"
                >
                  다음 플레이어 시작
                </Button>
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
