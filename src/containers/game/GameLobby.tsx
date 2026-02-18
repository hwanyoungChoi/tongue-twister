import useGameStore, {
  GameLevelOfDifficulty,
  GamePlayType,
} from "@/stores/useGameStore";

import ImageLogo from "@/assets/images/logo.png";
import ImageModeLong from "@/assets/images/lobby/mode_long.png";
import ImageModeLongDisabled from "@/assets/images/lobby/mode_long_disabled.png";
import ImageModeShort from "@/assets/images/lobby/mode_short.png";
import ImageModeShortDisabled from "@/assets/images/lobby/mode_short_disabled.png";
import ImageModeTimer from "@/assets/images/lobby/mode_timer.png";
import ImageModeTimerDisabled from "@/assets/images/lobby/mode_timer_disabled.png";
import ImageModeConscience from "@/assets/images/lobby/mode_conscience.png";
import ImageModeConscienceDisabled from "@/assets/images/lobby/mode_conscience_disabled.png";

import IconChevronRight from "@/assets/icons/chevron_right.svg?react";
import IconQuestionFill from "@/assets/icons/question_fill.svg?react";
import IconMinusCircleFill from "@/assets/icons/minus_circle_fill.svg?react";
import IconPlusCircleFill from "@/assets/icons/plus_circle_fill.svg?react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/common/BottomSheet";
import { useState } from "react";

export default function GameLobby() {
  const nextStep = useGameStore((state) => state.nextStep);
  const players = useGameStore((state) => state.players);
  const penalty = useGameStore((state) => state.penalty);
  const levelOfDifficulty = useGameStore((state) => state.levelOfDifficulty);
  const playType = useGameStore((state) => state.playType);
  const setPlayers = useGameStore((state) => state.setPlayers);
  const setPenalty = useGameStore((state) => state.setPenalty);
  const setLevelOfDifficulty = useGameStore(
    (state) => state.setLevelOfDifficulty,
  );
  const setPlayType = useGameStore((state) => state.setPlayType);

  const isLong = levelOfDifficulty === GameLevelOfDifficulty.Long;
  const isTimer = playType === GamePlayType.Timer;

  const [openPenalty, setOpenPenlaty] = useState(false);
  const [inputPenalty, setInputPenalty] = useState(penalty ?? "");

  const [openPlayers, setOpenPlayers] = useState(false);
  const [inputPlayers, setInputPlayers] = useState(players);

  const handlePlayerNameChange = (index: number, newName: string) => {
    const newPlayers = [...inputPlayers];
    newPlayers[index] = newName;
    setInputPlayers(newPlayers);
  };

  const handleRemovePlayer = (index: number) => {
    if (inputPlayers.length <= 2) return; // 게임 최소 인원 방어 로직 (2명)
    setInputPlayers(inputPlayers.filter((_, i) => i !== index));
  };

  const handleAddPlayer = () => {
    if (inputPlayers.length >= 10) return; // 최대 인원 제한 (필요시 조절)
    setInputPlayers([...inputPlayers, `플레이어${inputPlayers.length + 1}`]);
  };

  return (
    <>
      <div className="bg-[#F8FAFA] flex flex-col min-h-dvh">
        <header className="h-[48px] py-[7px] px-[20px] flex items-center justify-between">
          <img src={ImageLogo} alt="팅틀러 로고" className="w-[78px] h-auto" />

          <div className="font-bold text-[#4A4A4A] text-[15px] flex gap-[20px]">
            <button>게임방법</button>
            <button>설정</button>
          </div>
        </header>

        <div className="px-[16px] mt-[17px]">
          <div className="space-y-[12px]">
            <div className="bg-white p-[16px] rounded-[16px] flex items-center justify-between shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
              <div className="font-bold text-[#4A4A4A] text-[16px]">
                게임 인원/닉네임
              </div>
              <button
                className="font-one-pop text-[#F571A2] text-[18px] flex items-center"
                onClick={() => setOpenPlayers(true)}
              >
                {players.length}명
                <IconChevronRight
                  className="text-[#F571A2]"
                  width={20}
                  height={20}
                />
              </button>
            </div>
            <div className="bg-white p-[16px] rounded-[16px] shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between ">
                <div className="font-bold text-[#4A4A4A] text-[16px] flex items-center gap-[4px]">
                  벌칙 설정
                  <IconQuestionFill width={20} height={20} />
                </div>
                <Switch
                  onClick={() => setOpenPenlaty(true)}
                  checked={!!penalty}
                />
              </div>
              {penalty && (
                <>
                  <div className="py-[12px] bg-[#F5F5F5] rounded-[12px] p-[14px] text-center text-[#1F1F1F] text-[20px] font-one-pop my-[12px]">
                    {penalty}
                  </div>
                  <p className="text-center text-[#8C8C8C] text-[13px] font-[500]">
                    탈락자에게 벌칙 부여!
                  </p>
                </>
              )}
            </div>
            <div className="bg-white p-[16px] rounded-[16px] shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <div className="font-bold text-[#4A4A4A] text-[16px]">
                  문구 길이
                </div>
                <div className="font-one-pop text-[#F571A2] text-[18px]">
                  {isLong ? "긴 문구" : "짧은 단어"}
                </div>
              </div>
              <div className="mt-[12px] mb-[8px] flex gap-[8px]">
                <div
                  className="w-full"
                  onClick={() =>
                    setLevelOfDifficulty(GameLevelOfDifficulty.Long)
                  }
                >
                  <img
                    src={isLong ? ImageModeLong : ImageModeLongDisabled}
                    alt={isLong ? "긴 문장 모드" : "긴 문장 모드 비활성"}
                  />
                </div>
                <div
                  className="w-full"
                  onClick={() =>
                    setLevelOfDifficulty(GameLevelOfDifficulty.Short)
                  }
                >
                  <img
                    src={!isLong ? ImageModeShort : ImageModeShortDisabled}
                    alt={!isLong ? "짧은 문장 모드" : "짧은 문장 모드 비활성화"}
                  />
                </div>
              </div>
              <p className="text-center text-[#8C8C8C] text-[13px] font-[500]">
                {isLong
                  ? "복잡하고 길어서 혀가 꼬일 수 있어!"
                  : "짧은 단어라도 혀가 꼬이기도 하지!"}
              </p>
            </div>
            <div className="bg-white p-[16px] rounded-[16px] shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <div className="font-bold text-[#4A4A4A] text-[16px]">
                  진행 방식
                </div>
                <div className="font-one-pop text-[#F571A2] text-[18px]">
                  {isTimer ? "타이머 모드" : "양심 모드"}
                </div>
              </div>
              <div className="mt-[12px] mb-[8px] flex gap-[8px]">
                <div
                  className="w-full"
                  onClick={() => setPlayType(GamePlayType.Timer)}
                >
                  <img
                    src={isTimer ? ImageModeTimer : ImageModeTimerDisabled}
                    alt={isTimer ? "타이머 모드" : "타이머 모드 비활성"}
                  />
                </div>
                <div
                  className="w-full"
                  onClick={() => setPlayType(GamePlayType.Conscience)}
                >
                  <img
                    src={
                      !isTimer
                        ? ImageModeConscience
                        : ImageModeConscienceDisabled
                    }
                    alt={!isTimer ? "양심 모드" : "양심 모드 비활성화"}
                  />
                </div>
              </div>
              <p className="text-center text-[#8C8C8C] text-[13px] font-[500]">
                {isTimer
                  ? "제한 시간 안에 꼬이지 않고 빠르게 읽는 거야!"
                  : "잘 읽었다면 성공, 혀가 꼬였으면 실패! 양심에 맡겨봐!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 pb-[24px] px-[16px] w-full max-w-[480px] min-w-[375px]">
        <Button variant="primary" size="md" onClick={nextStep}>
          게임 시작
        </Button>
      </div>

      <BottomSheet
        open={openPenalty}
        close={() => setOpenPenlaty(false)}
        dismissible={false}
        title="벌칙 적용"
        content={
          <div className="px-5">
            <p className="text-center text-[18px] text-[#333333] font-[600] leading-[130%] mb-[4px]">
              탈락자의 벌칙을 직접 적용할 수 있어!
            </p>

            <p className="text-center text-[14px] text-[#8C8C8C] font-[500] leading-[130%] mb-[16px]">
              예) 아이스크림 내기, 1차 쏘기, 원샷하기
            </p>

            <input
              type="text"
              value={inputPenalty}
              onChange={(e) => setInputPenalty(e.target.value)}
              className="w-full bg-[#F5F5F5] rounded-[12px] py-[16.5px] px-[16px] text-[18px] text-[600] outline-none transition-all"
            />
          </div>
        }
        footer={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPenalty(inputPenalty);
              setOpenPenlaty(false);
            }}
            disabled={!inputPenalty && !penalty}
          >
            적용하기
          </Button>
        }
      />

      <BottomSheet
        open={openPlayers}
        close={() => setOpenPlayers(false)}
        dismissible={false}
        title="게임 인원/닉네임 설정"
        content={
          <div className="px-[24px] space-y-[12px] overflow-y-auto scrollbar-hide max-h-[258px] min-h-[258px]">
            {inputPlayers.map((player, index) => (
              <div
                key={index}
                className="flex items-center bg-[#F5F5F5] rounded-[12px] px-[16px] h-[56px]"
              >
                <span className="font-[900] text-[18px] text-[#333333] w-[24px] text-center">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={player}
                  onChange={(e) =>
                    handlePlayerNameChange(index, e.target.value)
                  }
                  className="flex-1 min-w-0 bg-transparent text-[18px] font-[600] text-[#333333] outline-none ml-[16px]"
                  placeholder={`플레이어${index + 1}`}
                />
                <button
                  onClick={() => handleRemovePlayer(index)}
                  className={`flex shrink-0 ${inputPlayers.length <= 2 ? "opacity-30 cursor-not-allowed" : "active:opacity-70"}`}
                  disabled={inputPlayers.length <= 2}
                >
                  <IconMinusCircleFill />
                </button>
              </div>
            ))}

            <button
              onClick={handleAddPlayer}
              className="w-full flex items-center justify-center bg-[#F5F5F5] rounded-[12px] py-[14px] active:bg-[#E5E5E5] transition-colors"
            >
              <IconPlusCircleFill />
            </button>
          </div>
        }
        footer={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPlayers(inputPlayers);
              setOpenPlayers(false);
            }}
          >
            적용하기
          </Button>
        }
      />
    </>
  );
}
