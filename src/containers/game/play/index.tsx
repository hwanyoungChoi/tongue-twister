import { useBlocker, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useGameStore from "@/stores/useGameStore";
import ROUTES from "@/lib/routes";
import { GAME_TEXT_LIST } from "@/lib/constants";
import { formatMsToS } from "@/lib/utils";

import Header from "@/components/common/Header";
import FixedBottom from "@/components/common/FixedBottom";
import ConfirmPopup from "@/components/common/ConfirmPopup";
import Intro from "./components/Intro";
import Countdown from "./components/Countdown";
import TimeGauge from "./components/TimeGauge";
import TopBar from "./components/TopBar";

import useGame from "@/hooks/useGame";

import IconAlarmClockFill from "@/assets/icons/alarm_clock_fill.svg?react";
import ImageClearTimerCharacter from "@/assets/images/game/clear_timer_character.svg?react";
import ImageClearConscienceCharacter from "@/assets/images/game/clear_conscience_character.svg?react";

export default function GamePlay() {
  const navigate = useNavigate();
  const { playType, playTime, levelOfDifficulty } = useGameStore();

  const {
    state: blockerState,
    proceed,
    reset,
  } = useBlocker(({ historyAction }) => historyAction === "POP");
  const isHistoryPop = blockerState === "blocked";

  // ⭐️ 로직을 단 한 줄로 분리!
  const { gameState, actions } = useGame(isHistoryPop);

  const {
    subStep,
    currentPlayer,
    currentPlayerName,
    currentLife,
    currentScore,
    sequence,
    round,
    gameTime,
    turnResult,
    isButtonDisabled,
  } = gameState;

  const isPlayingOrResult = subStep === "GAME" || subStep === "TURN_RESULT";
  const currentSentence =
    GAME_TEXT_LIST[levelOfDifficulty][round - 1][sequence - 1];

  return (
    <>
      <div
        className={`flex flex-col min-h-dvh ${isPlayingOrResult ? "bg-[#F8FAFA]" : "bg-white -mt-[48px]"}`}
      >
        <Header type={isPlayingOrResult ? "play" : "back"} />

        {subStep === "INTRO" && (
          <Intro
            currentPlayerIndex={currentPlayer.id} // 필요시 인덱스 조정
            currentPlayer={currentPlayer}
            onNext={() => actions.setSubStep("COUNTDOWN")}
            isPause={isHistoryPop}
          />
        )}

        {subStep === "COUNTDOWN" && (
          <Countdown
            onNext={() => actions.setSubStep("GAME")}
            isPause={isHistoryPop}
          />
        )}

        {isPlayingOrResult && (
          <>
            <main className="flex-1 flex flex-col px-[16px]">
              {/* ⭐️ 상단 바 분리 완료 */}
              <TopBar
                round={round}
                playerName={currentPlayerName}
                score={currentScore}
                life={currentLife}
              />

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
                    <p className="text-[40px] text-[#1F1F1F] font-np leading-[140%]">
                      {currentSentence}
                    </p>
                    <p className="text-[13px] text-[#BDBDBD] font-np">
                      {sequence} / 10
                    </p>
                  </div>
                ) : (
                  turnResult && (
                    <div className="h-full flex flex-col justify-center items-center text-center pt-[20px]">
                      {/* 결과창 UI 영역 */}
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
                      onClick={actions.handleSuccess}
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
                        onClick={actions.handleFail}
                        className="flex-1"
                        disabled={isButtonDisabled}
                      >
                        꼬였어!
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={actions.handleSuccess}
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
                  onClick={
                    currentLife > 0 && turnResult?.type !== "CLEAR"
                      ? actions.handleRetry
                      : actions.handleNextPlayer
                  }
                  className="w-full"
                >
                  {currentLife > 0 && turnResult?.type !== "CLEAR"
                    ? "다시 도전하기"
                    : "다음 플레이어 시작"}
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
