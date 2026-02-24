import { useEffect, useState } from "react";

import ImageLogo from "@/assets/images/logo.svg?react";
import LottieSplash from "@/assets/lotties/splash.json";

import Lottie from "lottie-react";

export default function AppEntry({ children }: { children: React.ReactNode }) {
  const [splashStep, setSplashStep] = useState(0); // 0: first splash, 1: seconds splash, 2: done

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setSplashStep(1);
    }, 1000);

    const timer2 = setTimeout(() => {
      setSplashStep(2);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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
