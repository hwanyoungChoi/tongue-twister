import { useState, useEffect, useCallback, useRef } from "react";

interface UseTimerProps {
  initialTime: number; // ms 단위
  onTimerEnd: () => void;
}

export default function useTimer({ initialTime, onTimerEnd }: UseTimerProps) {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  // ⭐️ 핵심 1: 현실의 '절대 시간'을 기록하여 리액트 렌더링 지연을 무시함
  const expectedEndTimeRef = useRef<number | null>(null);
  const remainingTimeRef = useRef(initialTime);

  // onTimerEnd 콜백이 렌더링마다 바뀌어도 무한 루프에 빠지지 않도록 Ref로 보관
  const onTimerEndRef = useRef(onTimerEnd);
  useEffect(() => {
    onTimerEndRef.current = onTimerEnd;
  }, [onTimerEnd]);

  // ⭐️ 핵심 2: useCallback을 사용하여 화면이 다시 그려져도 타이머 함수가 튀지 않게 고정
  const start = () => {
    if (!isRunning && remainingTimeRef.current > 0) {
      // 타이머가 시작되는 순간, '현실 시간 + 남은 시간'으로 목표 종료 시간을 못 박음
      expectedEndTimeRef.current = Date.now() + remainingTimeRef.current;
      setIsRunning(true);
    }
  };

  const pause = () => {
    if (isRunning) {
      setIsRunning(false);
      // 일시정지하는 순간, 목표 종료 시간에서 현재 현실 시간을 빼서 정확한 남은 시간을 저장
      if (expectedEndTimeRef.current) {
        remainingTimeRef.current = Math.max(
          0,
          expectedEndTimeRef.current - Date.now(),
        );
      }
      expectedEndTimeRef.current = null;
    }
  };

  const reset = useCallback(() => {
    setIsRunning(false);
    remainingTimeRef.current = initialTime;
    setCurrentTime(initialTime);
    expectedEndTimeRef.current = null;
  }, [initialTime]);

  // ⭐️ 핵심 3: 50ms마다 화면을 갱신하되, 오직 '절대 시간'을 기준으로 계산
  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      intervalId = setInterval(() => {
        if (!expectedEndTimeRef.current) return;

        const now = Date.now();
        // 렌더링이 밀리든 말든 현실 시간과 비교해서 깎아버림
        const timeLeft = Math.max(0, expectedEndTimeRef.current - now);

        setCurrentTime(timeLeft);
        remainingTimeRef.current = timeLeft;

        if (timeLeft <= 0) {
          clearInterval(intervalId);
          setIsRunning(false);
          expectedEndTimeRef.current = null;
          onTimerEndRef.current(); // 0초 도달 시 콜백 실행
        }
      }, 50); // 모바일 성능을 고려해 50ms마다 부드럽게 업데이트
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  return { start, pause, reset, currentTime };
}
