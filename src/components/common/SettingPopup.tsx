import useAppStore from "@/stores/useAppStore";
import { Popup, type PopupProps } from "./Popup";
import { Switch } from "../ui/switch";

export default function SettingPopup({
  open,
  onOpenChange,
}: Pick<PopupProps, "open" | "onOpenChange">) {
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const setSoundEnabled = useAppStore((state) => state.setSoundEnabled);

  const bgmEnabled = useAppStore((state) => state.bgmEnabled);
  const setBgmEnabled = useAppStore((state) => state.setBgmEnabled);

  return (
    <Popup open={open} onOpenChange={onOpenChange} title="설정">
      <div className="flex flex-col">
        <div className="flex items-center justify-between h-[56px] border-b border-gray-100">
          <span className="text-[16px] font-bold text-[#4A4A4A]">효과음</span>
          <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
        </div>

        <div className="flex items-center justify-between h-[56px] border-b border-gray-100">
          <span className="text-[16px] font-bold text-[#4A4A4A]">BGM</span>
          <Switch checked={bgmEnabled} onCheckedChange={setBgmEnabled} />
        </div>

        <div
          className="flex flex-col justify-center py-[16px] cursor-pointer hover:bg-gray-50 rounded-b-[12px] transition-colors"
          onClick={() => {
            alert("리뷰 쓰러 가기");
          }}
        >
          <span className="text-[16px] font-bold text-[#4A4A4A]">
            리뷰 남기기
          </span>
          <span className="text-[12px] font-[500] text-[#8C8C8C] mt-[4px]">
            게임이 재밌었다면, 리뷰로 응원해주세요!
          </span>
        </div>
      </div>
    </Popup>
  );
}
