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

새가족 환영 — **라이트 2컬럼 섹션** (텍스트 + 사진). 1차 CTA(새가족 등록, `bg-brand-accent`)와 2차 CTA(교회 소개, outline)를 함께 노출.
`context/pages/01-main.md` "newcomer" 섹션. `/care` 새가족 환영 카드로도 재사용 예정(`00-inventory.md`).

> **2026-07-05 라이트 전환 (환영 동선 라이트화):** 원래 다크 임팩트 섹션(이미지 35% + `bg-brand-ink/70` 오버레이)이었으나,
> 잠긴 무드 "따뜻한·환영하는"(`design/00-mood.md`)과 상충 — 환영 메시지가 가장 무거운 톤 위에 놓임.
> 담임목사 시안 위임(2026-07-05) 후 새가족 진입 동선(메인 환영 섹션 → `/newcomer` → 서브 헤로)을 라이트로 전환.
> 사진은 오버레이 없이 온전한 색으로 노출 (따뜻함은 사진 색온도가 담당).

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `eyebrow` | `string` | 상단 라벨 (예: "— 처음 오셨나요?") |
| `title` | `ReactNode` | 헤드라인 |
| `body` | `string` | 안내 문구 |
| `imageSrc` | `string` | 우측 컬럼 사진 (오버레이 없음 — 모바일에선 텍스트 아래) |
| `primaryHref` / `primaryLabel` | `string` | 1차 CTA (새가족 등록) |
| `secondaryHref` / `secondaryLabel` | `string` | 2차 CTA (교회 소개 등) |

## 디자인 일관성

- 1차 CTA는 항상 `bg-brand-accent text-white` (`guardrails/02-design-consistency.md`)
- 새가족 CTA 카피는 페이지마다 통일 — "처음 오셨나요?" (동일 의미엔 동일 카피)
