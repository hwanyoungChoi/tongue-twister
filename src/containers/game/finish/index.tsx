import FixedBottom from "@/components/common/FixedBottom";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import ROUTES from "@/lib/routes";
import useGameStore from "@/stores/useGameStore";
import { useNavigate } from "react-router-dom";

export default function GameFinish() {
  const navigate = useNavigate();

  const penalty = useGameStore((state) => state.penalty);
  const players = useGameStore((state) => state.players);

  console.log(players);

  return (
    <div className="min-h-dvh bg-[#F8FAFA]">
      <Header type="finish" />

      <main className="min-h-dvh bg-white flex">
        <div className="flex flex-col flex-1 items-center justify-center -mt-[48px] bg-[red]">
          {penalty ? <FinishPenalty penalty={penalty} /> : <FinishRanking />}
        </div>
      </main>

      <FixedBottom>
        <div className="flex items-center gap-[8px]">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            다시하기
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => navigate(ROUTES.LOBBY, { replace: true })}
          >
            홈으로
          </Button>
        </div>
      </FixedBottom>
    </div>
  );
}

function FinishPenalty({ penalty }: { penalty: string }) {
  return <div>{penalty}</div>;
}

function FinishRanking() {
  return <div>랭킹</div>;
}
