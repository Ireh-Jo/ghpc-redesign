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

## 비주얼 재조정 예정

F안 임시 룩의 `.btn-square`(2px 라운드)와 shadcn 기본 `rounded-md`가 공존 중 — 담임목사 시안 확정 후
이 래퍼 한 곳에서 radius·스타일 통일(기존 페이지의 수제 버튼들도 이 primitive로 순차 교체).
