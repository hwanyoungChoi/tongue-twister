import {
  BottomSheet,
  type BottomSheetProps,
} from "@/components/common/BottomSheet";
import { Button } from "@/components/ui/button";

import IconMinusCircleFill from "@/assets/icons/minus_circle_fill.svg?react";
import IconPlusCircleFill from "@/assets/icons/plus_circle_fill.svg?react";
import useGameStore from "@/stores/useGameStore";
import { useState } from "react";

export default function PlayersBottomSheet({
  open,
  onOpenChange,
}: Pick<BottomSheetProps, "open" | "onOpenChange">) {
  const players = useGameStore((state) => state.players);
  const setPlayers = useGameStore((state) => state.setPlayers);

  // 저장 전 display용 입력값
  const [inputPlayers, setInputPlayers] = useState(players);

  const handlePlayerNameChange = (index: number, newName: string) => {
    const newPlayers = [...inputPlayers];
    newPlayers[index] = newName;
    setInputPlayers(newPlayers);
  };

  const handleRemovePlayer = (index: number) => {
    if (inputPlayers.length <= 2) return; // 게임 최소 인원 방어 로직 (2명)
    setInputPlayers(inputPlayers.filter((_, i) => i !== index));
  };

  const handleAddPlayer = () => {
    if (inputPlayers.length >= 10) return; // 최대 인원 제한 (필요시 조절)
    setInputPlayers([...inputPlayers, `플레이어${inputPlayers.length + 1}`]);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      fixed
      title="게임 인원/닉네임 설정"
      content={
        <div className="px-[24px] space-y-[12px] overflow-y-auto scrollbar-hide max-h-[258px] min-h-[258px]">
          {inputPlayers.map((player, index) => (
            <div
              key={index}
              className="flex items-center bg-[#F5F5F5] rounded-[12px] px-[16px] h-[56px]"
            >
              <span className="font-[900] text-[18px] text-[#333333] w-[24px] text-center">
                {index + 1}
              </span>
              <input
                type="text"
                value={player}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-[18px] font-[600] text-[#333333] outline-none ml-[16px]"
                placeholder={`플레이어${index + 1}`}
              />
              <button
                onClick={() => handleRemovePlayer(index)}
                className={`flex shrink-0 ${inputPlayers.length <= 2 ? "opacity-30 cursor-not-allowed" : "active:opacity-70"}`}
                disabled={inputPlayers.length <= 2}
              >
                <IconMinusCircleFill />
              </button>
            </div>
          ))}

          <button
            onClick={handleAddPlayer}
            className="w-full flex items-center justify-center bg-[#F5F5F5] rounded-[12px] py-[14px] active:bg-[#E5E5E5] transition-colors"
          >
            <IconPlusCircleFill />
          </button>
        </div>
      }
      footer={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPlayers(inputPlayers);
            onOpenChange(false);
          }}
        >
          적용하기
        </Button>
      }
    />
  );
}
