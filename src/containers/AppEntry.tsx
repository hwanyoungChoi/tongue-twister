import { useEffect, useState } from "react";

import ImageLogo from "@/assets/images/logo.svg?react";
import LottieSplash from "@/assets/lotties/splash.json";

import SoundBgm from "@/assets/sounds/bgm.mp3";

import Lottie from "lottie-react";
import useAppStore from "@/stores/useAppStore";
import useSound from "use-sound";
import { Button } from "@/components/ui/button";
import useTimer from "@/hooks/useTimer";

export default function AppEntry({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  const bgmEnabled = useAppStore((state) => state.bgmEnabled);

  const [play, { pause }] = useSound(SoundBgm, {
    loop: true,
    soundEnabled: bgmEnabled,
    interrupt: true,
  });

  useEffect(() => {
    if (!bgmEnabled) {
      pause();
      return;
    }

    play();
  }, [bgmEnabled, pause, play]);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return <>{children}</>;
}

const MAX_SPLASH_TIME = 2000;

interface SplashProps {
  onFinish: () => void;
}

function Splash({ onFinish }: SplashProps) {
  const [splashStep, setSplashStep] = useState(1); // 1: first splash, 2: second splash
  const [isFinishedSplash, setIsFinishedSplash] = useState(false);

  const { start: startFirstSplashTimer } = useTimer({
    initialTime: MAX_SPLASH_TIME,
    onTimerEnd: () => {
      setSplashStep(2);
      startSecondSplashTimer();
    },
  });

  const { start: startSecondSplashTimer } = useTimer({
    initialTime: MAX_SPLASH_TIME,
    onTimerEnd: () => setIsFinishedSplash(true),
  });

  useEffect(() => {
    startFirstSplashTimer();
  }, [startFirstSplashTimer]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center font-np bg-white">
      {splashStep === 1 && <ImageLogo className="w-[163px] h-auto" />}
      {splashStep === 2 && (
        <>
          <h1 className="text-center text-[26px] leading-[1.5] text-[#1F1F1F]">
            실수 없이
            <br />
            말할 수 있겠어?
          </h1>
          <Lottie
            animationData={LottieSplash}
            loop
            className="w-[186px] h-auto"
          />

          {isFinishedSplash ? (
            <Button
              size="sm"
              variant="outline"
              onClick={onFinish}
              className="mt-[20px] w-[167.5px]"
            >
              도전하기
            </Button>
          ) : (
            // 영역 차지하고 있게 하기 위한 요소
            <div className="mt-[20px] h-[56px]" />
          )}
        </>
      )}
    </div>
  );
}
