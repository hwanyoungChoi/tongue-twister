// src/hooks/useGame.ts
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "@/stores/useGameStore";
import useTimer from "@/hooks/useTimer";
import ROUTES from "@/lib/routes";
import { MAX_LIFE, MAX_SEQUENCE, MAX_ROUND } from "@/lib/constants";

export type PlayStep = "INTRO" | "COUNTDOWN" | "GAME" | "TURN_RESULT";
export type TurnResultType = "CLEAR" | "FAIL" | "TIMEOUT";

interface PlayerStat {
  score: number;
  life: number;
}

export default function useGame(isHistoryPop: boolean) {
  const navigate = useNavigate();

  const players = useGameStore((state) => state.players);
  const playType = useGameStore((state) => state.playType);
  const playTime = useGameStore((state) => state.playTime);

  const [subStep, setSubStep] = useState<PlayStep>("INTRO");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [sequence, setSequence] = useState(1);
  const [round, setRound] = useState(1);

  // ⭐️ 2초 패널티 대기, 1초 성공 대기용 새로운 상태
  const [penaltyState, setPenaltyState] = useState<"FAIL" | "TIMEOUT" | null>(
    null,
  );

  const isPenaltyRef = useRef(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [playerStats, setPlayerStats] = useState<PlayerStat[]>(() =>
    players.map(() => ({ score: 0, life: MAX_LIFE })),
  );

  const [turnResult, setTurnResult] = useState<{
    type: TurnResultType;
    earnedScore: number;
  } | null>(null);

  const updateCurrentStat = (updater: (stat: PlayerStat) => PlayerStat) => {
    setPlayerStats((prev) =>
      prev.map((stat, idx) =>
        idx === currentPlayerIndex ? updater(stat) : stat,
      ),
    );
  };

  const currentPlayer = players[currentPlayerIndex];
  const currentLife = playerStats[currentPlayerIndex].life;
  const currentScore = playerStats[currentPlayerIndex].score;

  // ⭐️ 턴 완전 종료 처리 (결과창으로 이동)
  const handleTurnEnd = (type: TurnResultType, currentTime: number) => {
    pauseGameTimer();
    const baseScore = type === "CLEAR" ? sequence : sequence - 1;
    let bonusScore = 0;

    if (type === "CLEAR" && playType === "timer") {
      bonusScore = Math.floor(currentTime / 1000);
      updateCurrentStat((stat) => ({
        ...stat,
        score: stat.score + bonusScore,
      }));
    }
    setTurnResult({ type, earnedScore: baseScore + bonusScore });
    setSubStep("TURN_RESULT");
  };

  // ⭐️ 목숨 차감 (남은 목숨이 있으면 2초 패널티 화면, 없으면 턴 종료)
  const loseLife = (type: Extract<TurnResultType, "FAIL" | "TIMEOUT">) => {
    if (isPenaltyRef.current) {
      return;
    }
    isPenaltyRef.current = true;

    pauseGameTimer();
    updateCurrentStat((stat) => ({ ...stat, life: stat.life - 1 }));

    if (currentLife - 1 <= 0 || sequence === MAX_SEQUENCE) {
      handleTurnEnd(type, gameTime);
    } else {
      setPenaltyState(type);
      setIsButtonDisabled(true);
    }
  };

  const handleTimeout = () => loseLife("TIMEOUT");

  const {
    start: startGameTimer,
    pause: pauseGameTimer,
    reset: resetGameTimer,
    currentTime: gameTime,
  } = useTimer({
    initialTime: playTime * 1000,
    onTimerEnd: handleTimeout,
  });

  // ⭐️ 패널티 2초 대기 후 게임 자동 재개
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (penaltyState) {
      timeoutId = setTimeout(() => {
        setPenaltyState(null);
        setIsButtonDisabled(false);
        isPenaltyRef.current = false;

        if (playType === "timer") {
          resetGameTimer(); // 타이머 시간 꽉 채워서
          startGameTimer(); // 재시작
        }
      }, 2000); // 2초 대기
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [penaltyState, playType, resetGameTimer, startGameTimer]);

  // ⭐️ 타이머 동기화 (팝업, 패널티, 성공대기 중일 땐 타이머 멈춤)
  useEffect(() => {
    if (subStep !== "GAME") {
      return;
    }

    if (isHistoryPop || penaltyState) {
      pauseGameTimer();
    } else {
      if (playType === "timer") startGameTimer();
    }
  }, [
    isHistoryPop,
    penaltyState,
    pauseGameTimer,
    startGameTimer,
    subStep,
    playType,
  ]);

  const handleSuccess = () => {
    updateCurrentStat((stat) => ({ ...stat, score: stat.score + 1 }));

    if (sequence === MAX_SEQUENCE) {
      handleTurnEnd("CLEAR", gameTime);
    } else {
      setSequence((prev) => prev + 1);
    }
  };

  // ⭐️ 양심 모드 실패
  const handleFail = () => loseLife("FAIL");

  // ⭐️ 다음 플레이어로 넘어가기
  const handleNextPlayer = () => {
    resetGameTimer();
    setSequence(1);
    setIsButtonDisabled(false);
    isPenaltyRef.current = false;
    setPenaltyState(null);

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

  return {
    gameState: {
      subStep,
      currentPlayer,
      currentPlayerName: currentPlayer.name,
      currentPlayerIndex,
      currentLife,
      currentScore,
      sequence,
      round,
      gameTime,
      turnResult,
      isButtonDisabled,
      penaltyState, // ⭐️ UI로 상태 넘겨주기
    },
    actions: {
      setSubStep,
      handleSuccess,
      handleFail,
      handleNextPlayer,
    },
  };
}
