import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import type { PopupProps } from "./Popup";

interface ConfirmPopupProps extends Pick<PopupProps, "open" | "title"> {
  description: string;
  okButtonLabel?: string;
  cancelButtonLabel?: string;
  okButtonClick?: () => void;
  cancelButtonClick?: () => void;
}

export default function ConfirmPopup({
  open,
  title,
  description,
  okButtonLabel,
  cancelButtonLabel,
  okButtonClick,
  cancelButtonClick,
}: ConfirmPopupProps) {
  return (
    <Dialog open={open}>
      {/* w-[calc(100%-40px)]로 모바일에서 좌우 여백 확보, 모서리 둥글게 */}
      <DialogContent className="w-[calc(100%-52px)] max-w-[323px] h-[191px] rounded-[20px] p-0 overflow-hidden gap-0 border-none">
        {/* 본문 영역 */}
        <div className="p-[24px]">
          <DialogTitle className="h-[40px] flex items-center justify-center font-[700] text-[21px] text-[#1F1F1F]">
            {title}
          </DialogTitle>
          <DialogDescription className="font-[500] text-center text-[#4A4A4A] text-[18px]">
            {description}
          </DialogDescription>
          <DialogFooter className="mt-[24px] flex flex-row gap-[8px]">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={okButtonClick}
            >
              {okButtonLabel}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={cancelButtonClick}
            >
              {cancelButtonLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
