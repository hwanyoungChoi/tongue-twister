import useGameStore from "@/stores/useGameStore";

export default function GamePlay() {
  const backStep = useGameStore((state) => state.backStep);

  const {
    currentStep,
    players,
    penalty,
    levelOfDifficulty,
    playType,
    playTime,
  } = useGameStore((state) => state);

  return (
    <div>
      <button onClick={backStep}>뒤로가기</button>
      <ul>
        <li>
          players:{" "}
          {players.map((p, i) => (
            <div key={i}>{p}</div>
          ))}
        </li>
        <li>currentStep: {currentStep}</li>
        <li>penalty: {penalty}</li>
        <li>levelOfDifficulty: {levelOfDifficulty}</li>
        <li>playType: {playType}</li>
        <li>playTime: {playTime}</li>
      </ul>
    </div>
  );
}
