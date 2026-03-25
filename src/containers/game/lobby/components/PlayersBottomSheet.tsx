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

  const playerListRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(inputPlayers.length);

  const focusLastInput = () => {
    if (!playerListRef.current) {
      return;
    }
    const inputs = playerListRef.current.querySelectorAll("input");
    const lastInputNode = inputs[inputs.length - 1];

    if (lastInputNode instanceof HTMLInputElement) {
      lastInputNode.focus();
      lastInputNode.setSelectionRange(0, lastInputNode.value.length);
    }
  };

  useEffect(() => {
    playerListRef.current?.scrollTo(0, playerListRef.current?.scrollHeight);

    const hasPlayerAdded = inputPlayers.length > prevLengthRef.current;
    prevLengthRef.current = inputPlayers.length;

    if (hasPlayerAdded) {
      const timer = setTimeout(focusLastInput, 50);
      return () => clearTimeout(timer);
    }
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

  const handlePlayerNameFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // ⭐️ 10ms의 아주 짧은 지연을 주어 모바일 복사 패널이 뜨는 현상을 완벽 차단
    setTimeout(() => {
      e.target.setSelectionRange(0, e.target.value.length);
    }, 10);
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

  const handlePlayerColorChange = (index: number, newColor: string) => {
    const newPlayers = [...inputPlayers];
    newPlayers[index].color = newColor;
    setInputPlayers(newPlayers);
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
        <>
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
                  onBlur={(e) => {
                    // ⭐️ 핵심: 포커스가 이동할 다음 목적지(relatedTarget)가 'INPUT'이라면
                    // 어차피 곧바로 새로운 onFocus가 실행될 테니 undefined로 초기화하지 않습니다!
                    if (e.relatedTarget?.tagName === "INPUT") {
                      return;
                    }
                  }}
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
