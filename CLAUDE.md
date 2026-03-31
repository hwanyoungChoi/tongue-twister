# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

한국어 발음 게임(잰말놀이) 모바일 웹 앱. React 19, TypeScript, Vite로 구축. 플레이어들이 돌아가며 발음 문구를 읽고, 난이도/진행 방식/벌칙을 설정할 수 있음.

## 명령어

```bash
pnpm dev      # 개발 서버 실행
pnpm build    # tsc 타입 체크 후 Vite 빌드
pnpm lint     # ESLint 실행
pnpm preview  # 프로덕션 빌드 미리보기
```

## 아키텍처

### 상태 관리
Zustand 스토어 (`src/stores/`):
- `useGameStore` - 게임 설정 (플레이어, 난이도, 진행 방식, 벌칙, 타이머)
- `useAppStore` - 앱 설정 (효과음/BGM 토글), localStorage에 영속화

### 라우팅
React Router 기반, `src/router.tsx`에서 정의:
- `/` (Lobby) - 게임 설정: 플레이어, 벌칙, 문구 길이, 진행 방식
- `/play-type-setup` - 게임 시작 전 셋업 화면
- `/play` - 메인 게임 플레이
- `/finish` - 결과 화면

### 게임 로직
핵심 게임 흐름은 `src/hooks/useGame.ts`:
- 플레이 단계: INTRO → COUNTDOWN → GAME → TURN_RESULT
- 플레이어 턴, 점수, 라이프 시스템 (플레이어당 2개) 관리
- 진행 방식: "timer" (타이머 모드) / "conscience" (양심 모드)
- 난이도: "long" (긴 문구) / "short" (짧은 단어)

### 주요 디렉토리
- `src/containers/game/` - 라우트별 페이지 컴포넌트 (lobby, play, finish)
- `src/components/ui/` - 재사용 UI 컴포넌트 (Button, Switch, Dialog, Drawer) - Radix UI + CVA 사용
- `src/components/common/` - 공통 컴포넌트 (Header, Popup, FixedBottom)
- `src/assets/lotties/` - 컬러별 Lottie 애니메이션 (`import.meta.glob`으로 동적 로드)
- `src/lib/constants.ts` - 게임 문구, 플레이어 색상, 게임 제한값 (MAX_ROUND=3, MAX_SEQUENCE=10, MAX_LIFE=2)

### 스타일링
- Tailwind CSS v4 + `@tailwindcss/vite` 플러그인
- `cn()` 유틸리티 (`src/lib/tailwindUtils.ts`) - clsx + tailwind-merge 조합
- 커스텀 폰트: `font-np` 클래스 사용

### 경로 별칭
`@/*` → `./src/*` (vite.config.ts, tsconfig.json에서 설정)

### SVG 처리
`vite-plugin-svgr` 사용, `?react` 접미사로 React 컴포넌트로 임포트:
```tsx
import Icon from "@/assets/icons/icon.svg?react";
```

## 코드 컨벤션

### 컴포넌트 작성
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

### 파일/폴더 네이밍
- **컴포넌트**: PascalCase (`PlayerColorPopover.tsx`, `BottomSheet.tsx`)
- **hooks**: camelCase + use prefix (`useTimer.ts`, `useGame.ts`)
- **stores**: camelCase + use prefix (`useGameStore.ts`, `useAppStore.ts`)
- **유틸리티**: camelCase (`tailwindUtils.ts`, `constants.ts`)

### 디렉토리 구조 패턴
```
containers/game/lobby/
├── index.tsx              # 메인 페이지 컴포넌트
└── components/            # 해당 페이지 전용 컴포넌트
    ├── PlayersBottomSheet.tsx
    └── PenaltyBottomSheet.tsx
```
- 페이지 컴포넌트는 `index.tsx`로 작성
- 페이지 전용 컴포넌트는 하위 `components/` 폴더에 배치

### Import 순서
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

### Zustand 사용 패턴
- 셀렉터로 필요한 상태만 구독:
```tsx
// Good - 개별 셀렉터
const players = useGameStore((state) => state.players);
const setPlayers = useGameStore((state) => state.setPlayers);

// Avoid - 전체 스토어 구독
const { players, setPlayers } = useGameStore();
```

### Tailwind 스타일링
- **픽셀 값**: arbitrary value 표기법 사용 (`px-[16px]`, `h-[56px]`, `rounded-[12px]`)
- **CSS 변수 활용**: 플레이어 색상 등 동적 값에 사용
```tsx
style={{ backgroundColor: `var(--${color})` }}
```
- **조건부 스타일**: 템플릿 리터럴 + 삼항 연산자
```tsx
className={`w-full rounded-[12px] ${isSelected ? "bg-white ring-[2px]" : "bg-[#F5F5F5]"}`}
```

### 주석
- **한국어 주석** 사용
- 복잡한 로직에 `// ⭐️` 이모지로 핵심 포인트 표시
```tsx
// ⭐️ 2초 패널티 대기 후 게임 자동 재개
useEffect(() => { ... }, [penaltyState]);
```

### UI 컴포넌트 래핑 패턴
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

### 커스텀 훅 패턴
- **반환값**: 객체로 state와 actions 분리
```tsx
// useGame.ts
return {
  gameState: { subStep, currentPlayer, currentLife, ... },
  actions: { setSubStep, handleSuccess, handleFail, ... },
};
```
- **의존성 명시**: useCallback/useMemo에 의존성 배열 명확히 작성
