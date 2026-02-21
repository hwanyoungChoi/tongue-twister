import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import IconX from "@/assets/icons/x.svg?react";

interface PopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export function Popup({ open, onOpenChange, title, children }: PopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* w-[calc(100%-40px)]로 모바일에서 좌우 여백 확보, 모서리 둥글게 */}
      <DialogContent className="w-[calc(100%-52px)] max-w-[323px] rounded-[20px] p-0 overflow-hidden gap-0 border-none">
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
        <div className="px-[24px] pb-[16px]">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
