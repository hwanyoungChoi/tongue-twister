import { Popup, type PopupProps } from "./Popup";

import ImageBasicRules from "@/assets/images/rule/basic_rules.svg?react";
import ImageLong from "@/assets/images/rule/long.svg?react";
import ImageShort from "@/assets/images/rule/short.svg?react";
import ImageTimer from "@/assets/images/rule/timer.svg?react";
import ImageConscience from "@/assets/images/rule/conscience.svg?react";

export default function RulePopup({
  open,
  onOpenChange,
}: Pick<PopupProps, "open" | "onOpenChange">) {
  return (
    <Popup
      open={open}
      onOpenChange={onOpenChange}
      title="게임 방법"
      width="335px"
      height="100%"
    >
      <div className="px-[16px] pb-[48px] space-y-[32px] overflow-y-auto h-full">
        <div>
          <h3 className="font-[800] text-[16px] text-[#1F1F1F] leading-[1.6] mb-[8px]">
            기본 규칙
          </h3>
          <ImageBasicRules />
        </div>
        <div>
          <h3 className="font-[800] text-[16px] text-[#1F1F1F] leading-[1.6] mb-[8px]">
            문구 길이
          </h3>
          <div className="flex justify-center gap-[8px]">
            <ImageLong />
            <ImageShort />
          </div>
        </div>
        <div>
          <h3 className="font-[800] text-[16px] text-[#1F1F1F] leading-[1.6] mb-[8px]">
            진행 방식
          </h3>
          <div className="flex flex-col justify-center gap-[16px]">
            <ImageTimer />
            <ImageConscience />
          </div>
        </div>
      </div>
    </Popup>
  );
}
