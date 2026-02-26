import ImageLogo from "@/assets/images/logo.svg?react";

import IconArrowLeft from "@/assets/icons/arrow_left.svg?react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingPopup from "./SettingPopup";
import RulePopup from "./RulePopup";

type Header = "main" | "back" | "playing" | "finished";

interface HeaderProps {
  type: Header;
}

export default function Header({ type }: HeaderProps) {
  const renderHeader = () => {
    switch (type) {
      case "main":
        return <MainHeaderContent />;
      case "back":
        return <BackHeaderContent />;
      case "playing":
        return <PlayinHeaderContent />;
      case "finished":
        return <FinishedHeaderContent />;
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
    <header className="h-[48px] px-[20px] flex items-center justify-between sticky top-0 bg-[#F8FAFA]">
      <ImageLogo className="w-[78px] h-auto" />

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
  const navigate = useNavigate();

  return (
    <header className="h-[48px] px-[16px] flex items-center sticky top-0 bg-white">
      <button onClick={() => navigate(-1)}>
        <IconArrowLeft width={32} height={32} />
      </button>
    </header>
  );
}

function PlayinHeaderContent() {
  const navigate = useNavigate();

  const [openRule, setOpenRule] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  return (
    <header className="h-[48px] pl-[16px] pr-[20px] flex items-center justify-between sticky top-0 bg-[#F8FAFA]">
      <button onClick={() => navigate(-1)}>
        <IconArrowLeft width={32} height={32} />
      </button>

      <div className="font-bold text-[#4A4A4A] text-[15px] flex gap-[20px]">
        <button onClick={() => setOpenRule(true)}>게임방법</button>
        <button onClick={() => setOpenSetting(true)}>설정</button>
      </div>

      <RulePopup open={openRule} onOpenChange={setOpenRule} />
      <SettingPopup open={openSetting} onOpenChange={setOpenSetting} />
    </header>
  );
}

function FinishedHeaderContent() {
  return (
    <header className="h-[48px] px-[20px] flex items-center justify-between sticky top-0 bg-[#F8FAFA]">
      <ImageLogo className="w-[78px] h-auto" />
      <button
        className="font-bold text-[#4A4A4A] text-[15px]"
        onClick={() => alert("추후 제공됩니다.")}
      >
        공유하기
      </button>
    </header>
  );
}
