import useGameStore from "@/stores/useGameStore";
import { useNavigate } from "react-router-dom";

export default function GamePlay() {
  const navigate = useNavigate();

  const { players, penalty, levelOfDifficulty, playType, playTime } =
    useGameStore((state) => state);

  return (
    <div>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      <ul>
        <li>
          players:{" "}
          {players.map((p, i) => (
            <div key={i}>{p}</div>
          ))}
        </li>
        <li>penalty: {penalty}</li>
        <li>levelOfDifficulty: {levelOfDifficulty}</li>
        <li>playType: {playType}</li>
        <li>playTime: {playTime}</li>
      </ul>
    </div>
  );
}
