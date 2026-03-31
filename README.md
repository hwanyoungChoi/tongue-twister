# 혀가 꼬이네! (Tongue Twister) 👅

> **"실수 없이 말할 수 있겠어?"**

![Thumbnail](./public/images/thumbnail.png)

친구들과 함께 즐기는 **한국어 잰말놀이 모바일 웹 게임**입니다.
긴장감 넘치는 타이머 모드와 양심에 맡기는 양심 모드로 누가 발음 챔피언인지 겨뤄보세요!

<br/>

## ✨ 주요 기능

### 🎮 두 가지 게임 모드

| 타이머 모드 ⏱ | 양심 모드 ⏳ |
|:---:|:---:|
| 제한 시간 내 정확히 읽기 | 시간 제한 없는 자율형 |
| 남은 시간 = 보너스 점수! | 스스로 성공/실패 판단 |
| 긴장감 MAX | 친구들의 양심 테스트 |

### 🎯 게임 시스템
- **2~10명** 플레이어 지원
- 플레이어별 **커스텀 닉네임** & **10가지 테마 색상**
- **라이프 시스템** (2개의 기회)
- **3라운드 × 10문제** 구성
- **벌칙 설정** 기능으로 긴장감 200%!

### 📱 모바일 최적화
- 네이티브 앱과 유사한 **매끄러운 UX**
- 텍스트 선택/드래그 비활성화
- 더블탭 확대 방지 & 롱프레스 메뉴 비활성화

<br/>

## 🛠 기술 스택

### Frontend
| 분류 | 기술 |
|------|------|
| **Framework** | React 19, TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS v4, CVA (Class Variance Authority) |
| **State** | Zustand (with persist middleware) |
| **Routing** | React Router v7 |
| **UI** | Radix UI, Vaul (Drawer) |
| **Animation** | Lottie React, Motion |
| **Audio** | use-sound |

### Infrastructure
| 분류 | 기술 |
|------|------|
| **Deployment** | Vercel |

<br/>

## 🏗 아키텍처 & 기술적 의사결정

### 1. 고정밀 타이머 시스템

**문제점**: 기존 `setInterval` 기반 타이머는 React 렌더링 사이클에 따라 시간 지연(Drift)이 발생

**해결책**: `Date.now()` 기반 **절대 시간 계산** 방식으로 전면 재설계

```typescript
// useTimer.ts - 렌더링 지연과 무관한 정밀 타이머
const expectedEndTimeRef = useRef<number | null>(null);

// 타이머 시작 시 목표 종료 시간 계산
expectedEndTimeRef.current = Date.now() + remainingTimeRef.current;

// 50ms마다 절대 시간 기준으로 역산
const timeLeft = Math.max(0, expectedEndTimeRef.current - Date.now());
```

- 50ms 간격 업데이트로 **부드러운 TimeGauge 애니메이션**
- `Math.ceil` 적용으로 **자연스러운 카운트다운 UX**

---

### 2. Lottie 애니메이션 동적 로딩

**100개 이상의 Lottie 파일**을 효율적으로 관리

```typescript
// Vite의 import.meta.glob으로 빌드 타임에 자동 수집
const allLotties = import.meta.glob("@/assets/lotties/**/*.json", {
  eager: true,
  import: "default",
});

// 플레이어 색상 × 애니메이션 타입 조합으로 동적 로딩
export const getLottieData = (type: string, color: string) => {
  const targetFileName = `${type}_${color}.json`;
  const foundKey = Object.keys(allLotties).find(path => path.endsWith(targetFileName));
  return foundKey ? allLotties[foundKey] : null;
};
```

---

### 3. 데이터 라우터 패턴 전환

**문제점**: 기존 `BrowserRouter`에서는 `useBlocker` 같은 고급 훅 사용 불가

**해결책**: `createBrowserRouter` + `RouterProvider` 패턴으로 전환

```typescript
// router.tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: ROUTES.LOBBY, element: <GameLobby /> },
      { path: ROUTES.PLAY, element: <GamePlay /> },
      // ...
    ],
  },
]);
```

- `useBlocker`로 **게임 중 이탈 방지** 구현
- 잘못된 경로 자동 리다이렉트

---

### 4. 상태 관리 전략

```
┌─────────────────────────────────────────────────┐
│  useAppStore (Zustand + persist)                │
│  └─ soundEnabled, bgmEnabled                    │
│  └─ localStorage 영속화                          │
├─────────────────────────────────────────────────┤
│  useGameStore (Zustand)                         │
│  └─ players, levelOfDifficulty, playType        │
│  └─ penalty, playTime                           │
├─────────────────────────────────────────────────┤
│  useGame Hook                                   │
│  └─ 복잡한 게임 로직 캡슐화                        │
│  └─ 턴 관리, 점수, 라이프 시스템                   │
└─────────────────────────────────────────────────┘
```

<br/>

## 📁 프로젝트 구조

```
src/
├── assets/
│   ├── lotties/      # 컬러별 Lottie 애니메이션 (100+)
│   ├── icons/        # SVG 아이콘
│   ├── images/       # 이미지 에셋
│   └── sounds/       # BGM, 효과음
├── components/
│   ├── ui/           # 재사용 UI (Button, Dialog, Drawer, Switch)
│   └── common/       # 공통 컴포넌트 (Header, Popup, BottomSheet)
├── containers/
│   └── game/
│       ├── lobby/    # 게임 설정 화면
│       ├── play/     # 메인 게임 플레이
│       └── finish/   # 결과 화면
├── hooks/
│   ├── useGame.ts    # 게임 로직 훅
│   ├── useTimer.ts   # 정밀 타이머 훅
│   └── useRandomLottie.ts
├── stores/           # Zustand 스토어
├── lib/              # 유틸리티, 상수, 라우트
├── styles/           # global.css (Tailwind 테마)
└── types/            # 타입 정의
```

<br/>

## 🎲 게임 플로우

```
┌──────────┐    ┌────────────────┐    ┌─────────┐    ┌───────────┐
│   로비   │ -> │ 게임 타입 설정  │ -> │  인트로  │ -> │ 카운트다운 │
└──────────┘    └────────────────┘    └─────────┘    └───────────┘
      │                                                      │
      │         ┌───────────────────────────────────────────┘
      │         ▼
      │   ┌───────────┐    ┌───────────┐         ┌───────────┐
      │   │ 게임 플레이 │ -> │  턴 결과   │ -> ... -> │ 최종 결과  │
      │   └───────────┘    └───────────┘         └───────────┘
      │
      ├── 플레이어 설정 (닉네임, 색상)
      ├── 벌칙 설정
      ├── 문구 길이 (긴 문구 / 짧은 단어)
      └── 진행 방식 (타이머 / 양심)
```

<br/>

## 🚀 시작하기

### 요구사항
- Node.js 18+
- pnpm

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview

# 린트 실행
pnpm lint
```

<br/>

## 📜 게임 규칙

### 게임 구성
- **플레이어 수**: 2~10명
- **카드 구성**: 1세트당 10장
- **총 라운드**: 3라운드 (총 30장)

### 타이머 모드 ⏱
- 제한 시간 내 문장을 정확히 읽고 '성공' 버튼 클릭
- 시간 초과 시 목숨 -1
- 남은 시간이 보너스 점수로 환산
- 탈락자 중 가장 먼저 탈락한 플레이어가 벌칙 대상

### 양심 모드 ⏳
- 시간 제한 없이 스스로 '성공 / 실패' 선택
- 실패 2회 누적 시 탈락
- 가장 많은 실패 횟수 기록 플레이어가 벌칙 대상

<br/>

## 📝 라이선스

Private Project

---

*이 프로젝트는 Gemini Code Assist와의 코드 검토 및 Pull Request 상호작용을 통해 개발되었습니다.*
