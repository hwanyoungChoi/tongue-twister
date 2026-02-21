import useGameStore, {
  GameLevelOfDifficulty,
  GamePlayType,
} from "@/stores/useGameStore";

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

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PenaltyBottomSheet from "./components/PenaltyBottomSheet";
import PlayersBottomSheet from "./components/PlayersBottomSheet";
import ShadowBox from "./components/ShadowBox";
import Header from "@/components/common/Header";
import FixedBottom from "@/components/common/FixedBottom";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/lib/routes";

export default function GameLobby() {
  const navigate = useNavigate();

  const players = useGameStore((state) => state.players);
  const penalty = useGameStore((state) => state.penalty);
  const levelOfDifficulty = useGameStore((state) => state.levelOfDifficulty);
  const playType = useGameStore((state) => state.playType);

  const setLevelOfDifficulty = useGameStore(
    (state) => state.setLevelOfDifficulty,
  );
  const setPlayType = useGameStore((state) => state.setPlayType);

  const isLong = levelOfDifficulty === GameLevelOfDifficulty.Long;
  const isTimer = playType === GamePlayType.Timer;

  const [openPenalty, setOpenPenlaty] = useState(false);
  const [openPlayers, setOpenPlayers] = useState(false);

  return (
    <>
      <div className="bg-[#F8FAFA] flex flex-col min-h-dvh">
        <Header type="main" />

        <div className="px-[16px] mt-[17px] pb-[120px]">
          <div className="space-y-[12px]">
            <ShadowBox>
              <div className="flex items-center justify-between ">
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
            </ShadowBox>
            <ShadowBox>
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
            </ShadowBox>
            <ShadowBox>
              <div className="flex items-center justify-between">
                <div className="font-bold text-[#4A4A4A] text-[16px]">
                  문구 길이
                </div>
                <div className="font-one-pop text-[#F571A2] text-[18px]">
                  {isLong ? "긴 문구" : "짧은 단어"}
                </div>
              </div>
              <div className="mt-[12px] mb-[8px] flex gap-[8px]">
                <button
                  className="w-full"
                  onClick={() =>
                    setLevelOfDifficulty(GameLevelOfDifficulty.Long)
                  }
                >
                  <img
                    src={isLong ? ImageModeLong : ImageModeLongDisabled}
                    alt={isLong ? "긴 문장 모드" : "긴 문장 모드 비활성"}
                  />
                </button>
                <button
                  className="w-full"
                  onClick={() =>
                    setLevelOfDifficulty(GameLevelOfDifficulty.Short)
                  }
                >
                  <img
                    src={!isLong ? ImageModeShort : ImageModeShortDisabled}
                    alt={!isLong ? "짧은 문장 모드" : "짧은 문장 모드 비활성화"}
                  />
                </button>
              </div>
              <p className="text-center text-[#8C8C8C] text-[13px] font-[500]">
                {isLong
                  ? "복잡하고 길어서 혀가 꼬일 수 있어!"
                  : "짧은 단어라도 혀가 꼬이기도 하지!"}
              </p>
            </ShadowBox>
            <ShadowBox>
              <div className="flex items-center justify-between">
                <div className="font-bold text-[#4A4A4A] text-[16px]">
                  진행 방식
                </div>
                <div className="font-one-pop text-[#F571A2] text-[18px]">
                  {isTimer ? "타이머 모드" : "양심 모드"}
                </div>
              </div>
              <div className="mt-[12px] mb-[8px] flex gap-[8px]">
                <button
                  className="w-full"
                  onClick={() => setPlayType(GamePlayType.Timer)}
                >
                  <img
                    src={isTimer ? ImageModeTimer : ImageModeTimerDisabled}
                    alt={isTimer ? "타이머 모드" : "타이머 모드 비활성"}
                  />
                </button>
                <button
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
                </button>
              </div>
              <p className="text-center text-[#8C8C8C] text-[13px] font-[500]">
                {isTimer
                  ? "제한 시간 안에 꼬이지 않고 빠르게 읽는 거야!"
                  : "잘 읽었다면 성공, 혀가 꼬였으면 실패! 양심에 맡겨봐!"}
              </p>
            </ShadowBox>
          </div>
        </div>
      </div>

      <FixedBottom>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.PLAY_TYPE_SETUP)}
        >
          게임 시작
        </Button>
      </FixedBottom>

      <PenaltyBottomSheet
        open={openPenalty}
        close={() => setOpenPenlaty(false)}
      />

      <PlayersBottomSheet
        open={openPlayers}
        close={() => setOpenPlayers(false)}
      />
    </>
  );
}
