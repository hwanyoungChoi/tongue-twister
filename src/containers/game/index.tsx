import useGameStore, { GameStep } from "@/stores/useGameStore";
import GameLobby from "./lobby";
import GamePlay from "./play";
import GamePlayTypeSetup from "./play-type-setup";

export default function Game() {
  const currentStep = useGameStore((state) => state.currentStep);

  const renderGame = () => {
    switch (currentStep) {
      case GameStep.LOBBY:
        return <GameLobby />;
      case GameStep.PLAY_TYPE_SETUP:
        return <GamePlayTypeSetup />;
      case GameStep.PLAY:
        return <GamePlay />;
      default:
        return null;
    }
  };

  return renderGame();
}
