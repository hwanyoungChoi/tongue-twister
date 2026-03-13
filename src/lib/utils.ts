export const formatMsToS = (ms: number) => {
  return Math.ceil(ms / 1000);
};

// ⭐️ 1. Vite의 마법: lotties 폴더 하위의 모든 json 파일을 빌드 시점에 싹 다 긁어모아 객체로 만듭니다.
// { eager: true, import: 'default' } 덕분에 비동기 처리 없이 바로 JSON 객체를 쓸 수 있습니다.
const allLotties = import.meta.glob("@/assets/lotties/**/*.json", {
  eager: true,
  import: "default",
});

/**
 * 타입과 컬러를 받아서 매핑된 Lottie JSON 객체를 반환하는 헬퍼 함수
 * @param type 예: "player_circle1", "player_triangle" 등
 * @param color 예: "default-pink", "default-red" 등
 */
export const getLottieData = (type: string, color: string) => {
  // CSS 표준 네이밍("default-pink")을 파일 네이밍("default_pink")으로 변환
  const formattedColor = color.replace(/-/g, "_");
  const targetFileName = `${type}_${formattedColor}.json`;

  // 긁어온 40~50개의 파일 경로 중, 내가 찾는 파일명으로 끝나는 경로를 찾습니다.
  const foundKey = Object.keys(allLotties).find((path) =>
    path.endsWith(targetFileName),
  );

  return foundKey ? allLotties[foundKey] : null;
};
