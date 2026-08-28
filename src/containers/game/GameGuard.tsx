import { Navigate, Outlet, useLocation } from "react-router-dom";

import useGameStore from "@/stores/useGameStore";

import ROUTES from "@/lib/routes";

/**
 * ⭐️ 게임 진행 중에만 접근 가능한 라우트 가드
 * 게임 상태는 영속화하지 않으므로, 새로고침이나 URL 직접 진입 시에는 로비로 되돌린다
 * - /play-type-setup, /play : 로비에서 "게임 시작"을 눌렀어야 함
 * - /finish : 최종 성적이 커밋돼 있어야 함
 */
export default function GameGuard() {
  const { pathname } = useLocation();

  const hasStarted = useGameStore((state) => state.hasStarted);
  const results = useGameStore((state) => state.results);

  const isAllowed = pathname === ROUTES.FINISH ? results.length > 0 : hasStarted;

  if (!isAllowed) {
    return <Navigate to={ROUTES.LOBBY} replace />;
  }

  return <Outlet />;
}
