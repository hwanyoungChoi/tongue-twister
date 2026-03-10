import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import IconX from "@/assets/icons/x.svg?react";

export interface PopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

export function Popup({
  open,
  onOpenChange,
  title,
  children,
  width = "323px",
  height = "auto",
}: PopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[calc(100%-80px)] rounded-[20px] p-0 gap-0 border-none"
        style={{ minWidth: width, maxWidth: width, height }}
      >
        {/* 커스텀 헤더 (좌측 타이틀, 우측 X 버튼) */}
        <DialogHeader className="flex flex-row items-center justify-between px-[24px] h-[74px]">
          <DialogTitle className="text-[21px] font-[700] text-[#1F1F1F]">
            {title}
          </DialogTitle>
          <DialogClose asChild>
            <button className="text-[#1F1F1F] hover:opacity-70 outline-none">
              <IconX />
            </button>
          </DialogClose>
        </DialogHeader>

        {/* 본문 영역 */}
        {children}
      </DialogContent>
    </Dialog>
  );
}
