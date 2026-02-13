import useGameStore, { GameStep } from "../../stores/useGameStore";
import GameLobby from "./GameLobby";
import GamePlay from "./GamePlay";

export default function Game() {
  const currentStep = useGameStore((state) => state.currentStep);

  return (
    <>
      {currentStep === GameStep.LOBBY && <GameLobby />}
      {currentStep === GameStep.PLAY && <GamePlay />}
    </>
  );
}
