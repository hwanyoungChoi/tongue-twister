import useGameStore, { GameStep } from "@/stores/useGameStore";
import GameLobby from "./GameLobby";
import GamePlay from "./GamePlay";

export default function Game() {
  const currentStep = useGameStore((state) => state.currentStep);

  const renderGame = () => {
    switch (currentStep) {
      case GameStep.LOBBY:
        return <GameLobby />;
      case GameStep.PLAY:
        return <GamePlay />;
      default:
        return null;
    }
  };

  return renderGame();
}
