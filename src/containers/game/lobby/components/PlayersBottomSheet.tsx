import {
  BottomSheet,
  type BottomSheetProps,
} from "@/components/common/BottomSheet";
import { Button } from "@/components/ui/button";

import IconMinusCircleFill from "@/assets/icons/minus_circle_fill.svg?react";
import IconPlusCircleFill from "@/assets/icons/plus_circle_fill.svg?react";
import IconCheck from "@/assets/icons/check.svg?react";
import useGameStore from "@/stores/useGameStore";
import { useEffect, useRef, useState } from "react";
import { PLAYER_COLOR_LIST } from "@/lib/constants";
import { toast } from "sonner";

const MIN_PLAYER_COUNT = 2;
const MAX_PLAYER_COUNT = 10;
const MAX_PLAYER_NAME_LENGTH = 6;

export default function PlayersBottomSheet({
  open,
  onOpenChange,
}: Pick<BottomSheetProps, "open" | "onOpenChange">) {
  const players = useGameStore((state) => state.players);
  const setPlayers = useGameStore((state) => state.setPlayers);

  // 저장 전 display용 입력값
  const [inputPlayers, setInputPlayers] = useState(players);
  const [focusedPlayerIndex, setFocusedPlayerIndex] = useState<number>();

  const playerListRef = useRef<HTMLDivElement>(null);

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

    const newPlayers = [...inputPlayers];
    newPlayers[index].name = newName;
    setInputPlayers(newPlayers);
  };

  const handlePlayerNameFocus = (
    index: number,
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    // ⭐️ 10ms의 아주 짧은 지연을 주어 모바일 복사 패널이 뜨는 현상을 완벽 차단
    setTimeout(() => {
      e.target.setSelectionRange(0, e.target.value.length);
    }, 10);

    setFocusedPlayerIndex(index);
  };

  const handleRemovePlayer = (index: number) => {
    if (inputPlayers.length < MIN_PLAYER_COUNT) {
      return;
    }
    setInputPlayers(inputPlayers.filter((_, i) => i !== index));
  };

  const handleAddPlayer = () => {
    if (inputPlayers.length > MAX_PLAYER_COUNT) {
      return;
    }

    const id = Math.max(...inputPlayers.map(({ id }) => id)) + 1;
    const name = `플레이어${id}`;
    const color = PLAYER_COLOR_LIST.find(
      (c) => !inputPlayers.some((p) => p.color === c),
    )!;

    setInputPlayers([
      ...inputPlayers,
      {
        id,
        name,
        color,
      },
    ]);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      fixed
      title="게임 인원/닉네임 설정"
      content={
        <>
          <div
            className="px-[24px] space-y-[12px] overflow-y-auto scrollbar-hide max-h-[258px] min-h-[258px]"
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
                <div
                  className="w-[20px] h-[20px] rounded-[4px]"
                  style={{ backgroundColor: color }}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e)}
                  onFocus={(e) => handlePlayerNameFocus(index, e)}
                  onBlur={() => setFocusedPlayerIndex(undefined)}
                  className="flex-1 min-w-0 bg-transparent text-[18px] font-[600] text-[#333333] outline-none ml-[12px]"
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

            {inputPlayers.length < MAX_PLAYER_COUNT && (
              <button
                onClick={handleAddPlayer}
                className="w-full flex items-center justify-center bg-[#F5F5F5] rounded-[12px] py-[14px] active:bg-[#E5E5E5] transition-colors"
              >
                <IconPlusCircleFill />
              </button>
            )}
          </div>
          <div className="px-[24px] mt-[24px] flex items-center justify-between">
            {PLAYER_COLOR_LIST.map((color) => {
              const isFocusedPlayerColor =
                focusedPlayerIndex !== undefined &&
                inputPlayers[focusedPlayerIndex].color === color;

              const isColorUsed = inputPlayers.some((p) => p.color === color);

              /**
               * 사용 중인 컬러는 투명도 처리, 단 현재 선택된 플레이어 컬러면 투명도 없이 표시
               * 4D는 opacity 30%이고, icon 투명도에 영향 주지 않기 위함
               */
              const backgroundColor =
                isColorUsed && !isFocusedPlayerColor ? `${color}4D` : color;

              return (
                <button
                  className="flex items-center justify-center w-[24px] h-[24px] rounded-[4px]"
                  style={{
                    backgroundColor,
                  }}
                  key={color}
                  onMouseDown={(e) => {
                    e.preventDefault();

                    if (focusedPlayerIndex === undefined) {
                      return;
                    }

                    if (isColorUsed) {
                      toast("이미 선택된 색상이야. 다른 색상을 선택해!");
                      return;
                    }

                    const newPlayers = inputPlayers.map((p, i) => {
                      if (i === focusedPlayerIndex) {
                        return { ...p, color };
                      }
                      return p;
                    });
                    setInputPlayers(newPlayers);
                  }}
                >
                  {isFocusedPlayerColor && <IconCheck />}
                </button>
              );
            })}
          </div>
        </>
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
