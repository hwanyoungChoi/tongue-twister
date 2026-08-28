import { createBrowserRouter, Navigate } from "react-router-dom";

import GameLobby from "./containers/game/lobby";
import GamePlay from "./containers/game/play";
import GamePlayTypeSetup from "./containers/game/play-type-setup";
import GameFinish from "./containers/game/finish";
import GameGuard from "./containers/game/GameGuard";
import ROUTES from "./lib/routes";
import AppLayout from "./containers/AppLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.LOBBY,
        element: <GameLobby />,
      },
      {
        // ⭐️ 게임 진행 중에만 진입 가능한 구간
        element: <GameGuard />,
        children: [
          {
            path: ROUTES.PLAY_TYPE_SETUP,
            element: <GamePlayTypeSetup />,
          },
          {
            path: ROUTES.PLAY,
            element: <GamePlay />,
          },
          {
            path: ROUTES.FINISH,
            element: <GameFinish />,
          },
        ],
      },
      {
        path: "*", // Catch-all for invalid routes, redirects to Lobby
        element: <Navigate to={ROUTES.LOBBY} replace />,
      },
    ],
  },
]);

export default router;
