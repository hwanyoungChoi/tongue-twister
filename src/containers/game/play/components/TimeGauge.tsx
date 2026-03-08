import { motion } from "motion/react";

interface TimeGaugeProps {
  ratio: number;
}

export default function TimeGauge({ ratio }: TimeGaugeProps) {
  return (
    <div className="h-[12px] bg-[#F5F5F5] rounded-[100px]">
      <motion.div
        className={`h-full bg-[#F571A2] rounded-[100px]`}
        initial={{ width: "100%" }}
        animate={{ width: `${ratio}%` }}
        transition={{ duration: 1, ease: "linear" }}
        style={{ originX: 1 }}
      />
    </div>
  );
}
