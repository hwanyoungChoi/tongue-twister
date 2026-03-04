import useTimer from "@/hooks/useTimer";
import { formatMsToS } from "@/lib/utils";
import { useEffect } from "react";

export default function Countdown({
  onNext,
  isPause,
}: {
  onNext: () => void;
  isPause: boolean;
}) {
  const { start, pause, currentTime } = useTimer({
    initialTime: 3000,
    onTimerEnd: () => onNext(),
  });

  useEffect(() => {
    if (isPause) {
      pause();
    } else {
      start();
    }
  }, [isPause, pause, start]);

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
        {formatMsToS(currentTime)}
      </div>
    </main>
  );
}
