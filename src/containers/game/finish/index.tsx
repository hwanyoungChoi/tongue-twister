import FixedBottom from "@/components/common/FixedBottom";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import ROUTES from "@/lib/routes";
import { useNavigate } from "react-router-dom";

export default function GameFinish() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#F8FAFA]">
      <Header type="finish" />

      <main>
        <p>탈락자 누구누구</p>
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
