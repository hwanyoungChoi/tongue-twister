import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

import useGameStore from "@/stores/useGameStore";

import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";
import FixedBottom from "@/components/common/FixedBottom";

import ROUTES from "@/lib/routes";
import { getLottieData } from "@/lib/utils";
import { getPenaltyTarget, getRanking } from "@/lib/gameResult";
import type { GamePlayType, PlayerResult } from "@/types/game";

const RANK_EMOJI = ["🥇", "🥈", "🥉"];

export default function GameFinish() {
  const navigate = useNavigate();

  const results = useGameStore((state) => state.results);
  const playType = useGameStore((state) => state.playType);
  const penalty = useGameStore((state) => state.penalty);
  const exitGame = useGameStore((state) => state.exitGame);

  const ranking = getRanking(results);
  const penaltyTarget = getPenaltyTarget(results, playType);

  const [winner, ...rest] = ranking;

  return (
    <div className="min-h-dvh bg-[#F8FAFA] flex flex-col">
      <Header type="finish" />

      <main className="flex-1 px-[16px] pt-[8px] pb-[120px]">
        {/* 우승자 */}
        <div className="flex flex-col items-center bg-white rounded-[24px] shadow-[0_10px_40px_0_rgba(0,0,0,0.1)] pt-[32px] pb-[24px] px-[20px]">
          <p className="text-[13px] text-[#8C8C8C] font-[500]">
            혀가 꼬이지 않은 최후의 승자
          </p>
          <h1 className="text-[26px] leading-[1.5] text-[#1F1F1F] font-np mt-[4px] text-center">
            <span className="text-[#F571A2]">{winner.player.name}</span> 우승!
          </h1>
          <Lottie
            animationData={getLottieData(
              "confirm_score_1",
              winner.player.color,
            )}
            className="w-[200px] h-auto -mt-[10px]"
          />
          <div className="text-[18px] text-[#4A4A4A] font-np -mt-[10px]">
            {winner.score}점
          </div>
        </div>

        {/* 벌칙 */}
        {penalty && penaltyTarget && (
          <div className="mt-[12px] bg-white rounded-[24px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] p-[20px]">
            <p className="text-center text-[13px] text-[#8C8C8C] font-[500]">
              {playType === "timer"
                ? "가장 먼저 탈락했으니 벌칙이야!"
                : "가장 많이 꼬였으니 벌칙이야!"}
            </p>
            <h2 className="text-center text-[22px] leading-[1.5] text-[#1F1F1F] font-np mt-[4px]">
              <span className="text-[#F571A2]">{penaltyTarget.player.name}</span>{" "}
              당첨!
            </h2>
            <div className="py-[12px] bg-[#F5F5F5] rounded-[12px] px-[14px] text-center text-[#1F1F1F] text-[18px] font-np mt-[12px] break-all">
              {penalty}
            </div>
          </div>
        )}

        {/* 전체 순위 */}
        {rest.length > 0 && (
          <div className="mt-[12px] bg-white rounded-[24px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] px-[20px] py-[8px]">
            {rest.map((result, index) => (
              <RankRow
                key={result.player.id}
                rank={index + 2}
                result={result}
                playType={playType}
              />
            ))}
          </div>
        )}
      </main>

      <FixedBottom>
        <div className="flex items-center gap-[8px]">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => navigate(ROUTES.PLAY, { replace: true })}
          >
            다시하기
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => {
              exitGame();
              navigate(ROUTES.LOBBY, { replace: true });
            }}
          >
            홈으로
          </Button>
        </div>
      </FixedBottom>
    </div>
  );
}

interface RankRowProps {
  rank: number;
  result: PlayerResult;
  playType: GamePlayType;
}

function RankRow({ rank, result, playType }: RankRowProps) {
  const { player, score, failCount, eliminatedOrder } = result;

  return (
    <div className="flex items-center gap-[12px] h-[56px] border-b border-gray-100 last:border-b-0">
      <div className="w-[24px] text-center text-[15px] text-[#8C8C8C] font-np">
        {RANK_EMOJI[rank - 1] ?? rank}
      </div>
      <div
        className="w-[28px] h-[28px] rounded-full shrink-0"
        style={{ backgroundColor: `var(--${player.color})` }}
      />
      <p className="flex-1 text-[16px] text-[#4A4A4A] font-np truncate">
        {player.name}
      </p>
      <p className="text-[13px] text-[#BDBDBD] font-[500]">
        {playType === "timer" && eliminatedOrder !== null
          ? "탈락"
          : `${failCount}번 꼬임`}
      </p>
      <p className="text-[16px] text-[#1F1F1F] font-np w-[52px] text-right">
        {score}점
      </p>
    </div>
  );
}
