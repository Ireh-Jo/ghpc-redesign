---
name: campaign-banner
category: content
status: shipped
pages: [main]
depends-on:
  design: [color, typography]
  components: []
  features: []
---

# CampaignBanner (`components/content/campaign-banner.tsx`)

다크 풀블리드 인용 배너 — 연간 표어("Go & Grow") 등 큰 카피 강조.
`context/pages/01-main.md` "theme-banner" 섹션.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `eyebrow` | `string` | 상단 작은 라벨 (예: "— 2026년 표어") |
| `quote` | `ReactNode` | 큰 인용구 (줄바꿈은 `<br/>`로 직접 전달) |
| `verseRef` | `string` | 출처 (예: "시편 81:10 · Go & Grow") |
| `imageSrc` | `string` | 배경 이미지 (25% opacity + `bg-brand-ink/70` solid 오버레이) |

## 데이터 소스 (예정)

정적 또는 `campaigns` 테이블(`context/03-data-model.md`). 연 1회 변경 빈도 — ISR revalidate로 충분.
