## Tongue-twister (TT)

텅틀려!

**"실수 없이 말할 수 있겠어?"**

![Alt text](./public/images/thumbnail.png)

## 게임 규칙 (Game Rules)

### 1. 게임 구성
*   **플레이어 수**: 10명
*   **카드 구성**: 1세트당 10장의 잰말놀이 카드
*   **총 라운드**: 3라운드 (총 30장 카드 소진)

### 2. 게임 모드

#### ⏱ 타이머 모드 (시간 제한 경쟁형)
*   각 카드마다 제한 시간 설정 (예: 3초).
*   플레이어는 주어진 시간 내 문장을 정확히 읽고 '통과' 버튼 클릭.
*   시간 내 통과하지 못하면 자동으로 목숨 -1.
*   1인당 목숨 2개, 2개 이상 소진 시 자동 탈락.
*   **점수**: 성공 시 각 라운드의 남은 시간 초가 점수로 환산.
*   **승리**: 탈락하지 않은 플레이어 중 남은 초가 가장 많은 플레이어가 1등.
*   **벌칙 대상**: 탈락자 중 가장 먼저 탈락한 플레이어.

#### ⏳ 양심 모드 (시간 제한 없는 자율형)
*   시간 제한 없이 문장을 읽은 뒤 플레이어가 직접 '성공 / 실패' 선택.
*   실패 시 1벌점, 누적 실패 2회 시 탈락.
*   **승리**: 3라운드 종료 후 가장 적은 실패 횟수를 기록한 플레이어 (가장 많은 실패자가 꼴찌).
*   **벌칙 대상**: 가장 많은 실패 횟수를 기록한 플레이어 (동률일 경우 랜덤 또는 미리 정한 규칙).

### 3. 벌칙 시스템
*   게임 시작 전 벌칙 설정 가능 (예: 아이스크림 사기, 커피 내기 등).
*   최종 탈락자에게 벌칙 자동 적용 (직접 입력 또는 제안 리스트 중 선택).



## 기술 스택

**Frontend**

- Framework: React (Vite)
- Styling: TailwindCSS
- State Management: Zustand
- ~~Animation: Framer Motion & Lottie~~

**Infrastructure**

- Deployment: Vercel

## 기술 고려 사항

**1. App-like UX 구현**

Single Page Architecture: 모든 게임 흐름을 상태(State) 기반으로 관리하여, 페이지 새로고침 없는 매끄러운 화면 전환과 게임 데이터의 연속성 보장.

AppEntry: 스플래시 화면 처리 및 핵심 에셋(폰트, 사운드) 프리로딩 로직을 분리하여 네이티브 앱과 유사한 진입 경험 제공.

**2. 연출 (Interactive UI)**

~~Framer Motion: 버튼 피드백, 페이지 전환, 바텀시트 모션 등 인터랙션을 통해 게임의 몰입감을 극대화.~~

~~Design: Tailwind CSS를 활용하여 피그마 디자인 명세를 100% 반영한 UI 구축.~~

## Project Structure

```
src/
├── assets/           # 폰트, 이미지, 사운드 에셋
├── components/       # UI 컴포넌트 (ui/Button, common/GameButton 등)
├── containers/       # 비즈니스 로직이 포함된 뷰 (Splash, GameBoard 등)
├── hooks/            # useTimer, useSound 등 커스텀 훅
├── store/            # Zustand 전역 상태 (인원, 점수, 모드 관리)
├── styles/           # globals.css (Tailwind v4 테마 변수)
├── types/            # 게임 도메인 타입 정의
└── utils/            # 사운드 매니저 및 게임 엔진 로직
```

## Docs

- [AI 컨텍스트](./gemini.md)
