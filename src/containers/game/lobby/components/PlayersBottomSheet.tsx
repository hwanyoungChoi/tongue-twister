import {
  BottomSheet,
  type BottomSheetProps,
} from "@/components/common/BottomSheet";
import { Button } from "@/components/ui/button";

import IconMinusCircleFill from "@/assets/icons/minus_circle_fill.svg?react";
import IconPlusCircleFill from "@/assets/icons/plus_circle_fill.svg?react";
import useGameStore from "@/stores/useGameStore";
import { useEffect, useRef, useState } from "react";
import { PLAYER_COLOR_LIST } from "@/lib/constants";
import PlayerColorPopover from "./PlayerColorPopover";

const MIN_PLAYER_COUNT = 2;
// 플레이어마다 고유 색상을 배정하므로 최대 인원은 색상 개수를 넘을 수 없음
const MAX_PLAYER_COUNT = PLAYER_COLOR_LIST.length;
const MAX_PLAYER_NAME_LENGTH = 6;

export default function PlayersBottomSheet({
  open,
  onOpenChange,
}: Pick<BottomSheetProps, "open" | "onOpenChange">) {
  const players = useGameStore((state) => state.players);
  const setPlayers = useGameStore((state) => state.setPlayers);

  // 저장 전 display용 입력값
  const [inputPlayers, setInputPlayers] = useState(players);

  const playerListRef = useRef<HTMLDivElement>(null);

  // ⭐️ 적용하지 않고 닫은 편집값이 남지 않도록, 열리는 순간 스토어 값으로 되돌림
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setInputPlayers(players);
    }
  }

  useEffect(() => {
    playerListRef.current?.scrollTo(0, playerListRef.current?.scrollHeight);
  }, [inputPlayers.length]);

  const handlePlayerNameChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newName = e.target.value.replace(/\s/g, "").trim();

    if (newName.length > MAX_PLAYER_NAME_LENGTH) {
      return;
    }

    setInputPlayers((prevInputPlayers) =>
      prevInputPlayers.map((p, i) =>
        i === index ? { ...p, name: newName } : p,
      ),
    );
  };

  const handlePlayerNameFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // ⭐️ 10ms의 아주 짧은 지연을 주어 모바일 복사 패널이 뜨는 현상을 완벽 차단
    setTimeout(() => {
      e.target.setSelectionRange(0, e.target.value.length);
    }, 10);
  };

  const handleRemovePlayer = (index: number) => {
    if (inputPlayers.length <= MIN_PLAYER_COUNT) {
      return;
    }
    setInputPlayers(inputPlayers.filter((_, i) => i !== index));
  };

  const handleAddPlayer = () => {
    if (inputPlayers.length >= MAX_PLAYER_COUNT) {
      return;
    }

    const id = Math.max(...inputPlayers.map(({ id }) => id)) + 1;
    const name = `플레이어${id}`;
    const color = PLAYER_COLOR_LIST.find(
      (c) => !inputPlayers.some((p) => p.color === c),
    );

    if (!color) {
      return;
    }

    setInputPlayers([...inputPlayers, { id, name, color }]);
  };

  const handlePlayerColorChange = (index: number, newColor: string) => {
    setInputPlayers((prevInputPlayers) =>
      prevInputPlayers.map((p, i) =>
        i === index ? { ...p, color: newColor } : p,
      ),
    );
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      fixed
      title="게임 인원/닉네임 설정"
      contentStyle={{
        height: "90dvh",
      }}
      content={
      <div
          className="px-[24px] space-y-[12px] overflow-y-auto scrollbar-hide h-full"
          ref={playerListRef}
        >
          {inputPlayers.map(({ id, name, color }, index) => (
            <div
              key={id}
              className="flex items-center bg-[#F5F5F5] rounded-[12px] px-[16px] h-[56px]"
            >
              <span className="font-[900] text-[18px] text-[#333333] w-[24px] text-center mr-[16px]">
                {index + 1}
              </span>
              <PlayerColorPopover
                playerIndex={index}
                currentColor={color}
                allPlayers={inputPlayers}
                onColorChange={handlePlayerColorChange}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => handlePlayerNameChange(index, e)}
                onFocus={handlePlayerNameFocus}
                className="flex-1 min-w-0 bg-transparent text-[18px] font-[600] text-[#333333] outline-none ml-[12px]"
              />
              <button
                onClick={() => handleRemovePlayer(index)}
                className={`flex shrink-0 ${inputPlayers.length <= MIN_PLAYER_COUNT ? "opacity-30 cursor-not-allowed" : "active:opacity-70"}`}
                disabled={inputPlayers.length <= MIN_PLAYER_COUNT}
              >
                <IconMinusCircleFill />
              </button>
            </div>
          ))}

          {inputPlayers.length < MAX_PLAYER_COUNT && (
            <button
              onClick={handleAddPlayer}
              className="w-full flex items-center justify-center bg-[#F5F5F5] rounded-[12px] py-[14px] active:bg-[#E5E5E5] transition-colors"
            >
              <IconPlusCircleFill />
            </button>
          )}
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
