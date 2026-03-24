import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface TooltipProps {
  message: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
  contentStyle?: React.CSSProperties;
}

export default function Tooltip({
  message,
  children,
  side = "top",
  align = "start",
  contentStyle,
}: TooltipProps) {
  return (
    <Popover>
      {/* 트리거: (?) 아이콘 등 */}
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      {/* 툴팁 본문 */}
      <PopoverContent
        side={side}
        align={align}
        className="bg-[#1F1F1F] text-white p-[12px] border-none rounded-[8px] rounded-bl-none w-fit"
        style={contentStyle}
      >
        <span className="text-[13px] font-[500]">{message}</span>

        {/* 말풍선 꼬리 (검은색으로 색상 맞춤) */}
        {/* <PopoverArrow className="fill-[#222222]" /> */}
      </PopoverContent>
    </Popover>
  );
}
