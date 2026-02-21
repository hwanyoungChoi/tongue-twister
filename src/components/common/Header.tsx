import ImageLogo from "@/assets/images/logo.png";

import IconArrowLeft from "@/assets/icons/arrow_left.svg?react";

import useGameStore from "@/stores/useGameStore";
import { useState } from "react";
import { Popup, type PopupProps } from "./Popup";
import { Switch } from "../ui/switch";

type Header = "main" | "back" | "playing" | "finished";

interface HeaderProps {
  type: Header;
}

export default function Header({ type }: HeaderProps) {
  const renderHeader = () => {
    switch (type) {
      case "main":
        return MainHeaderContent();
      case "back":
        return BackHeaderContent();
      case "playing":
        return null;
      case "finished":
        return null;
      default:
        return null;
    }
  };

  return renderHeader();
}

function MainHeaderContent() {
  const [openRule, setOpenRule] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  return (
    <header className="h-[48px] px-[20px] flex items-center justify-between">
      <img src={ImageLogo} alt="팅틀러 로고" className="w-[78px] h-auto" />

      <div className="font-bold text-[#4A4A4A] text-[15px] flex gap-[20px]">
        <button onClick={() => setOpenRule(true)}>게임방법</button>
        <button onClick={() => setOpenSetting(true)}>설정</button>
      </div>

      <RulePopup open={openRule} onOpenChange={setOpenRule} />
      <SettingPopup open={openSetting} onOpenChange={setOpenSetting} />
    </header>
  );
}

function BackHeaderContent() {
  const backStep = useGameStore((state) => state.backStep);

  return (
    <header className="h-[48px] px-[16px] flex items-center">
      <button onClick={backStep}>
        <IconArrowLeft width={32} height={32} />
      </button>
    </header>
  );
}

function RulePopup({
  open,
  onOpenChange,
}: Pick<PopupProps, "open" | "onOpenChange">) {
  return (
    <Popup open={open} onOpenChange={onOpenChange} title="게임 방법">
      <div className="flex flex-col items-center justify-center font-one-pop">
        <h2 className="text-[40px] text-[#1F1F1F]">게임 방법</h2>
        <span className="text-[32px]">🚧</span>
      </div>
    </Popup>
  );
}

function SettingPopup({
  open,
  onOpenChange,
}: Pick<PopupProps, "open" | "onOpenChange">) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(false);

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
