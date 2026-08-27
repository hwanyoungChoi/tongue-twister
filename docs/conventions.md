# 코드 컨벤션

## 컴포넌트 작성
- **export 방식**: `export default function ComponentName()` 사용
- **Props 정의**: interface로 `ComponentNameProps` 네이밍
```tsx
interface TopBarProps {
  round: number;
  playerName: string;
}

export default function TopBar({ round, playerName }: TopBarProps) {
  // ...
}
```

## 파일/폴더 네이밍
- **컴포넌트**: PascalCase (`PlayerColorPopover.tsx`, `BottomSheet.tsx`)
- **hooks**: camelCase + use prefix (`useTimer.ts`, `useGame.ts`)
- **stores**: camelCase + use prefix (`useGameStore.ts`, `useAppStore.ts`)
- **유틸리티**: camelCase (`tailwindUtils.ts`, `constants.ts`)

## 디렉토리 구조 패턴
```
containers/game/lobby/
├── index.tsx              # 메인 페이지 컴포넌트
└── components/            # 해당 페이지 전용 컴포넌트
    ├── PlayersBottomSheet.tsx
    └── PenaltyBottomSheet.tsx
```
- 페이지 컴포넌트는 `index.tsx`로 작성
- 페이지 전용 컴포넌트는 하위 `components/` 폴더에 배치

## Import 순서
```tsx
// 1. React/외부 라이브러리
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. 스토어
import useGameStore from "@/stores/useGameStore";

// 3. 컴포넌트
import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";

// 4. 에셋 (이미지 → 아이콘 → 사운드 → Lottie)
import ImageLogo from "@/assets/images/logo.svg?react";
import IconCheck from "@/assets/icons/check.svg?react";
import SoundEffect from "@/assets/sounds/effect.mp3";

// 5. 유틸리티/상수/타입
import { PLAYER_COLOR_LIST } from "@/lib/constants";
import type { Player } from "@/types/game";
```

## Zustand 사용 패턴
- 셀렉터로 필요한 상태만 구독:
```tsx
// Good - 개별 셀렉터
const players = useGameStore((state) => state.players);
const setPlayers = useGameStore((state) => state.setPlayers);

// Avoid - 전체 스토어 구독
const { players, setPlayers } = useGameStore();
```

## Tailwind 스타일링
- **픽셀 값**: arbitrary value 표기법 사용 (`px-[16px]`, `h-[56px]`, `rounded-[12px]`)
- **CSS 변수 활용**: 플레이어 색상 등 동적 값에 사용
```tsx
style={{ backgroundColor: `var(--${color})` }}
```
- **조건부 스타일**: 템플릿 리터럴 + 삼항 연산자
```tsx
className={`w-full rounded-[12px] ${isSelected ? "bg-white ring-[2px]" : "bg-[#F5F5F5]"}`}
```

## 주석
- **한국어 주석** 사용
- 복잡한 로직에 `// ⭐️` 이모지로 핵심 포인트 표시
```tsx
// ⭐️ 2초 패널티 대기 후 게임 자동 재개
useEffect(() => { ... }, [penaltyState]);
```

## UI 컴포넌트 래핑 패턴
`components/ui/`의 Radix UI 컴포넌트를 `components/common/`에서 래핑:
```tsx
// components/common/BottomSheet.tsx - Drawer를 래핑한 공통 컴포넌트
export function BottomSheet({ open, onOpenChange, title, content, footer }: BottomSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>{title}</DrawerHeader>
        {content}
        <DrawerFooter>{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
```

## 커스텀 훅 패턴
- **반환값**: 객체로 state와 actions 분리
```tsx
// useGame.ts
return {
  gameState: { subStep, currentPlayer, currentLife, ... },
  actions: { setSubStep, handleSuccess, handleFail, ... },
};
```
- **의존성 명시**: useCallback/useMemo에 의존성 배열 명확히 작성
