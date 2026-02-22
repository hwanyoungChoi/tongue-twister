import {
  BottomSheet,
  type BottomSheetProps,
} from "@/components/common/BottomSheet";
import { Button } from "@/components/ui/button";
import useGameStore from "@/stores/useGameStore";
import { useState } from "react";

export default function PenaltyBottomSheet({
  open,
  onOpenChange,
}: Pick<BottomSheetProps, "open" | "onOpenChange">) {
  const penalty = useGameStore((state) => state.penalty);
  const setPenalty = useGameStore((state) => state.setPenalty);

  const [inputPenalty, setInputPenalty] = useState(penalty ?? "");

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      fixed
      title="벌칙 적용"
      content={
        <div className="px-5">
          <p className="text-center text-[18px] text-[#333333] font-[600] leading-[130%] mb-[4px]">
            탈락자의 벌칙을 직접 적용할 수 있어!
          </p>

          <p className="text-center text-[14px] text-[#8C8C8C] font-[500] leading-[130%] mb-[16px]">
            예) 아이스크림 내기, 1차 쏘기, 원샷하기
          </p>

          <input
            type="text"
            value={inputPenalty}
            onChange={(e) => setInputPenalty(e.target.value)}
            className="w-full bg-[#F5F5F5] rounded-[12px] py-[16.5px] px-[16px] text-[18px] text-[600] outline-none transition-all"
          />
        </div>
      }
      footer={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPenalty(inputPenalty);
            onOpenChange(false);
          }}
          // 삭제할 땐 비워져있는 경우에도 적용하기 버튼 활성화
          disabled={!inputPenalty && !penalty}
        >
          적용하기
        </Button>
      }
    />
  );
}
