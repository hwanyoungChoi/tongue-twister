import useGameStore from "../../stores/useGameStore";

export default function GameLobby() {
  const nextStep = useGameStore((state) => state.nextStep);

  return (
    <div>
      Game Lobby View입니다. 이 단계에서 인원, 게임 등 설정을 하고 메인화면을
      겸합니다.
      <button onClick={nextStep}>다음</button>
    </div>
  );
}
