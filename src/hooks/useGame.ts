// src/hooks/useGameLogic.ts
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "@/stores/useGameStore";
import useTimer from "@/hooks/useTimer";
import ROUTES from "@/lib/routes";

export type PlayStep = "INTRO" | "COUNTDOWN" | "GAME" | "TURN_RESULT";
export type TurnResultType = "CLEAR" | "FAIL" | "TIMEOUT";

const MAX_ROUND = 3;
const MAX_SEQUENCE = 10;
const MAX_LIFE = 2;

export default function useGameLogic(isHistoryPop: boolean) {
  const navigate = useNavigate();

  const players = useGameStore((state) => state.players);
  const playType = useGameStore((state) => state.playType);
  const playTime = useGameStore((state) => state.playTime);

  const [subStep, setSubStep] = useState<PlayStep>("INTRO");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [sequence, setSequence] = useState(1);
  const [round, setRound] = useState(1);

  const isPenaltyRef = useRef(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [playerStats, setPlayerStats] = useState(() =>
    players.map(() => ({ score: 0, life: MAX_LIFE })),
  );

  const [turnResult, setTurnResult] = useState<{
    type: TurnResultType;
    earnedScore: number;
  } | null>(null);

  const currentPlayer = players[currentPlayerIndex];
  const currentLife = playerStats[currentPlayerIndex].life;
  const currentScore = playerStats[currentPlayerIndex].score;

  // ⭐️ 턴 종료 처리 (공통 로직)
  const handleTurnEnd = (type: TurnResultType, currentTime: number) => {
    pauseGameTimer();
    const baseScore = type === "CLEAR" ? sequence : sequence - 1;
    let bonusScore = 0;

    if (type === "CLEAR" && playType === "timer") {
      bonusScore = Math.floor(currentTime / 1000);
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

  // ⭐️ 시간 초과 (버그 수정 완료: 무조건 결과창 띄움)
  const handleTimeout = () => {
    if (isPenaltyRef.current) return;
    isPenaltyRef.current = true;

    pauseGameTimer();
    setPlayerStats((prev) =>
      prev.map((stat, idx) =>
        idx === currentPlayerIndex ? { ...stat, life: stat.life - 1 } : stat,
      ),
    );
    handleTurnEnd("TIMEOUT", gameTime);
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

  // ⭐️ 타이머 상태 동기화 (팝업이 뜨면 멈춤)
  useEffect(() => {
    if (subStep !== "GAME") return;
    if (isHistoryPop || isButtonDisabled) {
      pauseGameTimer();
    } else {
      if (playType === "timer") startGameTimer();
    }
  }, [
    isHistoryPop,
    isButtonDisabled,
    pauseGameTimer,
    startGameTimer,
    subStep,
    playType,
  ]);

  // ⭐️ 1초 대기 후 다음 문장으로 (버튼 비활성화 해제)
  useEffect(() => {
    let timeoutId: number;
    if (isButtonDisabled) {
      timeoutId = setTimeout(() => {
        setSequence((prev) => prev + 1);
        setIsButtonDisabled(false);
        isPenaltyRef.current = false;
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

  const handleSuccess = () => {
    if (isPenaltyRef.current) return;

    setPlayerStats((prev) =>
      prev.map((stat, idx) =>
        idx === currentPlayerIndex ? { ...stat, score: stat.score + 1 } : stat,
      ),
    );

    if (sequence === MAX_SEQUENCE) {
      handleTurnEnd("CLEAR", gameTime);
    } else {
      setIsButtonDisabled(true); // 1초 대기 후 다음 시퀀스로 이동
    }
  };

  // ⭐️ 양심 모드 실패 (버그 수정 완료: 무조건 결과창 띄움)
  const handleFail = () => {
    if (isPenaltyRef.current) return;
    isPenaltyRef.current = true;

    setPlayerStats((prev) =>
      prev.map((stat, idx) =>
        idx === currentPlayerIndex ? { ...stat, life: stat.life - 1 } : stat,
      ),
    );
    handleTurnEnd("FAIL", gameTime);
  };

  // ⭐️ 기회가 남았을 때 '다시 도전하기'
  const handleRetry = () => {
    setSequence(1); // 처음부터 하려면 1, 이어서 하려면 유지
    setIsButtonDisabled(false);
    isPenaltyRef.current = false;
    setSubStep("INTRO");
  };

  // ⭐️ 다음 플레이어로 넘어가기
  const handleNextPlayer = () => {
    resetGameTimer();
    setSequence(1);
    setIsButtonDisabled(false);
    isPenaltyRef.current = false;

    let nextIndex = currentPlayerIndex + 1;
    let nextRound = round;

    while (nextIndex < players.length && playerStats[nextIndex].life <= 0)
      nextIndex++;

    if (nextIndex >= players.length) {
      nextRound++;
      nextIndex = 0;
      while (nextIndex < players.length && playerStats[nextIndex].life <= 0)
        nextIndex++;
    }

    if (nextRound > MAX_ROUND || nextIndex >= players.length) {
      navigate(ROUTES.FINISH);
    } else {
      setRound(nextRound);
      setCurrentPlayerIndex(nextIndex);
      setSubStep("INTRO");
    }
  };

  return {
    gameState: {
      subStep,
      currentPlayer,
      currentPlayerName: currentPlayer.name,
      currentLife,
      currentScore,
      sequence,
      round,
      gameTime,
      turnResult,
      isButtonDisabled,
    },
    actions: {
      setSubStep,
      handleSuccess,
      handleFail,
      handleNextPlayer,
      handleRetry,
    },
  };
}
