# 아키텍처

한국어 발음 게임(잰말놀이) 모바일 웹 앱. React 19, TypeScript, Vite로 구축. 플레이어들이 돌아가며 발음 문구를 읽고, 난이도/진행 방식/벌칙을 설정할 수 있음.

## 명령어

```bash
pnpm dev      # 개발 서버 실행
pnpm build    # tsc 타입 체크 후 Vite 빌드
pnpm lint     # ESLint 실행
pnpm preview  # 프로덕션 빌드 미리보기
```


## 상태 관리
Zustand 스토어 (`src/stores/`):
- `useGameStore` - 게임 설정 (플레이어, 난이도, 진행 방식, 벌칙, 타이머)
- `useAppStore` - 앱 설정 (효과음/BGM 토글), localStorage에 영속화

## 라우팅
React Router 기반, `src/router.tsx`에서 정의:
- `/` (Lobby) - 게임 설정: 플레이어, 벌칙, 문구 길이, 진행 방식
- `/play-type-setup` - 게임 시작 전 셋업 화면
- `/play` - 메인 게임 플레이
- `/finish` - 결과 화면

## 게임 로직
핵심 게임 흐름은 `src/hooks/useGame.ts`:
- 플레이 단계: INTRO → COUNTDOWN → GAME → TURN_RESULT
- 플레이어 턴, 점수, 라이프 시스템 (플레이어당 2개) 관리
- 진행 방식: "timer" (타이머 모드) / "conscience" (양심 모드)
- 난이도: "long" (긴 문구) / "short" (짧은 단어)

## 주요 디렉토리
- `src/containers/game/` - 라우트별 페이지 컴포넌트 (lobby, play, finish)
- `src/components/ui/` - 재사용 UI 컴포넌트 (Button, Switch, Dialog, Drawer) - Radix UI + CVA 사용
- `src/components/common/` - 공통 컴포넌트 (Header, Popup, FixedBottom)
- `src/assets/lotties/` - 컬러별 Lottie 애니메이션 (`import.meta.glob`으로 동적 로드)
- `src/lib/constants.ts` - 게임 문구, 플레이어 색상, 게임 제한값 (MAX_ROUND=3, MAX_SEQUENCE=10, MAX_LIFE=2)

## 스타일링
- Tailwind CSS v4 + `@tailwindcss/vite` 플러그인
- `cn()` 유틸리티 (`src/lib/tailwindUtils.ts`) - clsx + tailwind-merge 조합
- 커스텀 폰트: `font-np` 클래스 사용

## 경로 별칭
`@/*` → `./src/*` (vite.config.ts, tsconfig.json에서 설정)

## SVG 처리
`vite-plugin-svgr` 사용, `?react` 접미사로 React 컴포넌트로 임포트:
```tsx
import Icon from "@/assets/icons/icon.svg?react";
```

