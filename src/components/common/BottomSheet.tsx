import * as React from "react";
import IconX from "@/assets/icons/x.svg?react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dismissible?: boolean;
  fixed?: boolean;
  title?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
}

export function BottomSheet({
  open,
  onOpenChange,
  dismissible,
  fixed,
  title,
  content,
  footer,
}: BottomSheetProps) {
  return (
    <Drawer
      open={open}
      dismissible={dismissible}
      fixed={fixed}
      onOpenChange={onOpenChange}
    >
      <DrawerContent className="rounded-t-[20px] max-w-[480px] min-w-[375px] mx-auto">
        {/* 헤더: 타이틀 & 닫기 버튼 */}
        <DrawerHeader className="relative flex flex-row items-center justify-between px-[24px] h-[74px]">
          <DrawerTitle className="text-[21px] font-bold text-[#1F1F1F] text-left">
            {title}
          </DrawerTitle>
          <DrawerClose asChild>
            <button className="text-gray-400 hover:text-gray-600">
              <IconX className="w-6 h-6" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* 본문: 설명 & 입력창 */}
        {content}

        {/* 푸터: 적용하기 버튼 */}
        <DrawerFooter className="px-5 pt-4">{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
