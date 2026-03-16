// src/containers/GamePlay/components/GameTopBar.tsx
import ImageIntroCharacter from "@/assets/images/intro-character.png";
import IconTongue from "@/assets/icons/tongue.svg?react";
import IconTongueGray from "@/assets/icons/tongue_gray.svg?react";
import { MAX_LIFE } from "@/lib/constants";

interface GameTopBarProps {
  round: number;
  playerName: string;
  score: number;
  life: number;
}

export default function GameTopBar({
  round,
  playerName,
  score,
  life,
}: GameTopBarProps) {
  return (
    <div className="flex items-center justify-between gap-[8px] h-[72px] bg-white rounded-[1000px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] pl-[12px] pr-[8px] mb-[16px]">
      <div className="flex items-center justify-between gap-[8px]">
        <img
          src={ImageIntroCharacter}
          className="w-[48px] h-[48px]"
          alt="character"
        />
        <div className="flex flex-col justify-center gap-[4px]">
          <div className="bg-[#F5F5F5] rounded-[100px] w-fit h-[18px] px-[6px] font-[700] text-[11px] text-[#8C8C8C] flex items-center">
            {round}Round
          </div>
          <p className="text-[18px] text-[#4A4A4A] font-np">{playerName}</p>
        </div>
      </div>
      <div className="flex gap-[4px] items-center h-[58px] bg-[#F8FAFA] rounded-[10000px] px-[10px]">
        <div className="flex flex-col justify-center gap-[2px] w-[48px]">
          <p className="font-[600] text-[12px] text-[#8C8C8C] text-center">
            점수
          </p>
          <p className="text-[18px] text-[#F571A2] text-center font-np">
            {score}
          </p>
        </div>
        <div className="border" />
        <div className="flex flex-col justify-center gap-[2px] w-[80px]">
          <p className="font-[600] text-[12px] text-[#8C8C8C] text-center">
            남은 기회
          </p>
          <div className="flex gap-[2px] items-center justify-center">
            {Array.from({ length: MAX_LIFE }).map((_, i) =>
              life > i ? <IconTongue key={i} /> : <IconTongueGray key={i} />,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
