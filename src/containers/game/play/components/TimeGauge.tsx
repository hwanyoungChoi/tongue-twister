import { motion } from "motion/react";
import { useState } from "react";

interface TimeGaugeProps {
  ratio: number;
}

export default function TimeGauge({ ratio }: TimeGaugeProps) {
  const [prevRatio, setPrevRatio] = useState(ratio);
  const [isReset, setIsReset] = useState(ratio === 100);

  if (ratio !== prevRatio) {
    setPrevRatio(ratio);
    setIsReset(ratio > prevRatio || ratio === 100);
  }

  return (
    <div className="h-[12px] bg-[#F5F5F5] rounded-[100px]">
      <motion.div
        className="h-full bg-[#F571A2] rounded-[100px]"
        initial={{ width: "100%" }}
        animate={{ width: `${ratio}%` }}
        transition={{ duration: isReset ? 0 : 1, ease: "linear" }}
        style={{ originX: 1 }}
      />
    </div>
  );
}
