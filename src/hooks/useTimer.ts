import { useEffect, useRef, useState } from "react";

interface UseTimerProps {
  /**
   * 타이머 초 설정 (ms)
   */
  initialTime?: number;
  /**
   * 타이머 동작 주기 (ms)
   */
  interval?: number;
  /**
   * 시간 증가/감소 옵션
   */
  direction?: "up" | "down";
  onTimerEnd?: () => void;
}

interface UseTimerReturn {
  currentTime: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export default function useTimer({
  initialTime = 0,
  interval = 1000,
  direction = "down",
  onTimerEnd,
}: UseTimerProps): UseTimerReturn {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<number>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          let newTime;

          if (direction === "down") {
            newTime = prevTime - interval;

            if (newTime <= 0) {
              setIsRunning(false);

              if (onTimerEnd) {
                onTimerEnd();
              }

              return 0;
            }
          } else {
            newTime = prevTime + interval;
          }

          return newTime;
        });
      }, interval);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [direction, interval, isRunning, onTimerEnd]);

  const start = () => setIsRunning(true);

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setCurrentTime(initialTime);
  };

  return { currentTime, isRunning, start, pause, reset };
}
