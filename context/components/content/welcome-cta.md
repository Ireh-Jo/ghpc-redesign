---
name: welcome-cta
category: content
status: shipped
pages: [main, care]
depends-on:
  design: [color, typography, spacing, iconography]
  components: []
  features: []
---

# WelcomeCTA (`components/content/welcome-cta.tsx`)

새가족 환영 — 다크 임팩트 섹션. 1차 CTA(새가족 등록, `bg-brand-accent`)와 2차 CTA(교회 소개, outline)를 함께 노출.
`context/pages/01-main.md` "newcomer" 섹션. `/care` 새가족 환영 카드로도 재사용 예정(`00-inventory.md`).

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `eyebrow` | `string` | 상단 라벨 (예: "— 처음 오셨나요?") |
| `title` | `ReactNode` | 헤드라인 |
| `body` | `string` | 안내 문구 |
| `imageSrc` | `string` | 배경 이미지 (35% opacity + `bg-brand-ink/70` 오버레이) |
| `primaryHref` / `primaryLabel` | `string` | 1차 CTA (새가족 등록) |
| `secondaryHref` / `secondaryLabel` | `string` | 2차 CTA (교회 소개 등) |

## 디자인 일관성

- 1차 CTA는 항상 `bg-brand-accent text-white` (`guardrails/02-design-consistency.md`)
- 새가족 CTA 카피는 페이지마다 통일 — "처음 오셨나요?" (동일 의미엔 동일 카피)
