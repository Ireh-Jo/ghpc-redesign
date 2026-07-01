---
name: hero-video
category: content
status: shipped
pages: [main]
depends-on:
  design: [color, typography, spacing, motion]
  components: []
  features: []
---

# HeroVideo (`components/content/hero-video.tsx`)

메인 헤로 — 다크 풀블리드 영상(데스크탑) / 정지 이미지(모바일) + 헤드라인 + 예배시간 바.
`context/pages/01-main.md` "hero" 섹션.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `eyebrow` | `string` | 영상 위 작은 라벨 (예: "— 1973년부터") |
| `title` | `ReactNode` | 헤드라인 (줄바꿈은 `<br/>`로 직접 전달) |
| `subtitle` | `string` | 헤드라인 아래 서브카피 |
| `verse` | `string` | 인용 성경구절 본문 |
| `verseRef` | `string` | 구절 출처 |
| `videoSrc` | `string` | 데스크탑 헤로 영상 (mp4) |
| `posterSrc` | `string` | 영상 poster |
| `mobileImageSrc` / `mobileImageAlt` | `string` | 모바일 정지 이미지 + alt (`guardrails/00-rules.md` DO#8 — placeholder도 의미 있는 alt) |
| `serviceTimes` | `HeroServiceTime[]` | 하단 바 예배시간. 배열 첫 항목만 LIVE 펄스 도트로 강조(`emphasize` 의도상 항상 index 0) |

`HeroServiceTime = { label, time, emphasize?, hideOnMobile? }` — `hideOnMobile`은 좁은 화면에서 우선순위 낮은 항목(예: 2부) 숨김.

## 데이터 소스 (예정)

정적 설정 또는 `service_times` 테이블(`context/03-data-model.md`). 콘텐츠 입수 전까지 `app/(site)/page.tsx`에서 placeholder 상수로 전달.

## 엣지케이스

- 영상 로드 실패 시에도 `poster` + 그라데이션 오버레이로 레이아웃 유지(별도 fallback UI 불필요, `<video>` 자체가 poster를 보여줌)
- `serviceTimes` 5개 초과 시 그리드가 깨질 수 있음 — 데스크탑 5칸/모바일 3칸 그리드 고정, 늘어날 경우 그리드 열 수 재검토 필요
