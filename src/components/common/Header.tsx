import ImageLogo from "@/assets/images/logo.png";
import IconArrowLeft from "@/assets/icons/arrow_left.svg?react";

import useGameStore from "@/stores/useGameStore";

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
  return (
    <header className="h-[48px] px-[20px] flex items-center justify-between">
      <img src={ImageLogo} alt="팅틀러 로고" className="w-[78px] h-auto" />

      <div className="font-bold text-[#4A4A4A] text-[15px] flex gap-[20px]">
        <button>게임방법</button>
        <button>설정</button>
      </div>
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
