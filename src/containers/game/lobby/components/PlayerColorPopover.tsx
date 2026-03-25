import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import IconCheck from "@/assets/icons/check.svg?react";
import { toast } from "sonner";
import { PLAYER_COLOR_LIST } from "@/lib/constants";

interface PlayerColorPopoverProps {
  playerIndex: number;
  currentColor: string;
  allPlayers: { id: number; name: string; color: string }[];
  onColorChange: (index: number, newColor: string) => void;
}

export default function PlayerColorPopover({
  playerIndex,
  currentColor,
  allPlayers,
  onColorChange,
}: PlayerColorPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {/* 1. 트리거: 리스트에 있는 플레이어의 현재 컬러 네모 박스 */}
      <PopoverTrigger asChild>
        <button
          className="w-[20px] h-[20px] rounded-[4px] shrink-0 active:scale-95 transition-transform"
          style={{ backgroundColor: `var(--${currentColor})` }}
        />
      </PopoverTrigger>

      {/* 2. 팔레트 본문: 누른 박스 바로 아래(bottom)에 등장 */}
      <PopoverContent
        side="bottom"
        align="center"
        sideOffset={8}
        collisionPadding={16}
        className="w-auto px-[12px] py-[19px] rounded-[12px] bg-white border-[1px] border-[#BDBDBD]"
      >
        <div className="flex items-center gap-[8px]">
          {PLAYER_COLOR_LIST.map((color) => {
            const isSelected = color === currentColor;

            const isUsedByOther = allPlayers.some(
              (p, idx) => p.color === color && idx !== playerIndex,
            );

            // 다른 사람이 쓰는 색상은 투명도 30% 처리
            const backgroundColor = isUsedByOther
              ? `color-mix(in srgb, var(--${color}) 30%, transparent)`
              : `var(--${color})`;

            return (
              <button
                key={color}
                className="flex items-center justify-center w-[24px] h-[24px] rounded-[4px] active:scale-95 transition-transform"
                style={{ backgroundColor }}
                onClick={() => {
                  if (isUsedByOther) {
                    toast("이미 선택된 색상이야. 다른 색상을 선택해!");
                    return;
                  }
                  onColorChange(playerIndex, color);
                  setIsOpen(false);
                }}
              >
                {isSelected && <IconCheck />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
