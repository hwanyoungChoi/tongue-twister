import { Route, Routes, useLocation } from "react-router-dom";

import GameLobby from "./containers/game/lobby";
import GamePlay from "./containers/game/play";
import GamePlayTypeSetup from "./containers/game/play-type-setup";
import ROUTES from "./lib/routes";
import { useEffect } from "react";

export default function AppRoutes() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path={ROUTES.LOBBY} element={<GameLobby />} />
      <Route path={ROUTES.PLAY_TYPE_SETUP} element={<GamePlayTypeSetup />} />
      <Route path={ROUTES.PLAY} element={<GamePlay />} />
    </Routes>
  );
}
