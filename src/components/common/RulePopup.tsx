import { Popup, type PopupProps } from "./Popup";

export default function RulePopup({
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
