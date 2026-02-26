import { useEffect, useState } from "react";

import ImageLogo from "@/assets/images/logo.svg?react";
import LottieSplash from "@/assets/lotties/splash.json";

import SoundBgm from "@/assets/sounds/bgm.mp3";

import Lottie from "lottie-react";
import useAppStore from "@/stores/useAppStore";
import useSound from "use-sound";

export default function AppEntry({ children }: { children: React.ReactNode }) {
  const [splashStep, setSplashStep] = useState(0); // 0: first splash, 1: seconds splash, 2: done

  const bgmEnabled = useAppStore((state) => state.bgmEnabled);

  const [play, { pause }] = useSound(SoundBgm, {
    loop: true,
    soundEnabled: bgmEnabled,
    interrupt: true,
  });

  useEffect(() => {
    if (!bgmEnabled) {
      pause();
    }
  }, [bgmEnabled, pause]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setSplashStep(1);
    }, 2000);

    const timer2 = setTimeout(() => {
      setSplashStep(2);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (splashStep === 2) {
      play();
    }
  }, [play, splashStep]);

  if (splashStep === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center font-one-pop bg-white">
        <ImageLogo className="w-[163px] h-auto" />
      </div>
    );
  }

  if (splashStep === 1) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center font-one-pop bg-white">
        <h1 className="text-center text-[28px] text-[#1F1F1F]">
          실수 없이
          <br />
          말할 수 있겠어?
        </h1>
        <Lottie
          animationData={LottieSplash}
          loop
          className="w-[186px] h-auto mt-[15px]"
        />
      </div>
    );
  }

  return <>{children}</>;
}
