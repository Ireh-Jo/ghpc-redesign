---
name: newcomer-card
category: content
status: wip
pages: [main]
depends-on:
  design: [color, typography, spacing, iconography, motion]
  components: [layout/container, layout/fade-in]
  features: []
---

# NewcomerCard (`components/content/newcomer-card.tsx`)

메인 새가족 섹션 — 왼쪽 환영 문구 + 오른쪽 "새가족 등록" 큰 카드.

근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai` · `… 모바일.ai` (2026-09-16).

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `eyebrow` | `string` | 기본 `— 바른 신앙, 따뜻한 사랑이 있는` |
| `lines` | `string[]` | 제목 줄바꿈. 기본 `['경향교회에','오신 것을','환영합니다']` (시안 3줄) |
| `lead` | `string` | 좌측 제목 아래 안내 문구 (2026-09-16 추가) |
| `cardLabel` | `string` | 기본 `새가족 등록` — 카드 좌상단 라벨(시안 문구) |
| `href` | `string` | 기본 `/newcomer` — 주 버튼 목적지 |

## 카드 안 구성 (2026-09-16 보강)

시안의 네이비 카드는 라벨 한 줄 + 아이콘뿐이라 실제로 보면 비어 보인다는 피드백이 있었다.
조판은 그대로 두고 **안을 채웠다**:

1. 라벨 `새가족 등록` (시안 문구)
2. 안내 문장 2줄 — "처음 오신 분을 위한 / 안내를 준비했습니다"
3. 바로가기 칩 3개 — 처음 오신 날 안내 · 새가족 모임(4주) · 오시는 길 (`/newcomer` 앵커)
4. 주 버튼 — **`새가족 안내 보기`**
5. 배경 장식으로 큰 아이콘을 `text-white/10`으로 깔았다 (`aria-hidden`)

⚠️ **온라인 새가족 등록 폼은 1차 오픈 범위 밖**이다 (2026-08-09 결정, `app/(site)/newcomer/page.tsx`).
그래서 주 버튼은 "등록하기"가 아니라 "안내 보기"다. 폼이 살아나면 문구를 바꾼다.

칩·버튼이 각각 링크라 **카드 전체를 링크로 감싸지 않는다** (`a` 안의 `a`는 잘못된 마크업).

## WelcomeCTA와의 관계

목적은 같지만 조판이 다르다(`WelcomeCTA`=다크 사진 배경 임팩트형). 메인은 이 컴포넌트,
`/care` 등 서브페이지는 기존 `WelcomeCTA`를 계속 쓴다. 통합은 하지 않는다 — 시안이 둘을 다르게 정의했다.

## 반응형

- PC: 12열 그리드에서 문구 5 / 카드 7
- 모바일: 세로로 쌓임 (시안 동일). 카드 비율 `16/7`

## 인터랙션·모션

- 칩 hover: **색 채우기** — 흰 면이 왼쪽→오른쪽으로 차오르고 글자가 accent로 반전 (300ms ease-out)
- 주 버튼 hover: 흰 배경 → `brand-support`(초록) + 화살표 `translate-x-1`
- 진입 시 `FadeIn` (카드는 80ms 지연)
- `motion-reduce`: 채우기 면을 숨기고 색 전환만 남긴다

## 접근성

- 아이콘은 장식이라 `aria-hidden` — 의미는 "새가족 등록" 텍스트가 전달한다
