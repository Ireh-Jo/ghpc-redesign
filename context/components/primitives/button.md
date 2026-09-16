---
name: button
status: shipped
category: primitives
shadcn-base: button
client-component: false
depends-on:
  design: [color, typography, spacing]
  components: []
  features: []
used-on-pages: []
---

# Button (`components/primitives/button.tsx`)

## 목적

모든 버튼의 단일 출처 — shadcn `button` 얇은 래퍼(현재 재수출). 페이지·컴포넌트는
`components/ui/button` 직접 import 금지, 반드시 이 파일 경유(`guardrails/00-rules.md` DO#4).

## Variants (shadcn 기본 유지)

`default`(bg-primary) / `destructive` / `outline` / `secondary` / `ghost` / `link` · 크기 `default(h-10)`/`sm`/`lg`/`icon`

- shadcn semantic 토큰(`--primary` 등)은 `app/globals.css`에서 brand 팔레트에 매핑돼 있음 —
  현재 primary = brand-accent(파랑 #002D60) 근사 HSL.
- 아이콘 포함 시 16px(h-4 w-4)이 기본(`context/design/04-iconography.md`).

## 라운드 기준 (2026-09-16 확정)

시안 확정으로 **전역 라운드**가 됐다 (`context/design/03-spacing.md`). 값은 두 종류만 쓴다:

| 쓰임 | 값 |
|---|---|
| 페이지 안 버튼·탭·알약 | `.btn-round` (10px) |
| 폼 컨트롤(shadcn Button/Input 등) | `--radius` (8px, `rounded-md`) |

두 값이 나란히 보이는 자리가 생기면 `.btn-round`로 맞춘다.
**남은 일:** 페이지에 흩어진 수제 버튼(`btn-round` + 인라인 클래스 조합)을 이 primitive로 순차 흡수.
