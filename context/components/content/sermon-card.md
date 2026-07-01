---
name: sermon-card
category: content
status: shipped
pages: [main]
depends-on:
  design: [color, typography, spacing, iconography]
  components: []
  features: [video-embed]
---

# SermonCard (`components/content/sermon-card.tsx`)

"이번 주 말씀" 섹션 — 대표 설교 1편(영상 카드) + 지난 설교 리스트.
`context/pages/01-main.md` "weekly-sermon" 섹션. `/worship` 재사용 예정(`00-inventory.md`).

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `youtubeUrl` | `string` | 채널 전체 설교 링크 ("전체 설교"·"더보기") |
| `featuredWatchUrl` | `string` | 대표 설교 개별 영상 링크 |
| `featuredThumbnailSrc` | `string` | 대표 설교 썸네일 |
| `featuredMeta` | `string` | 날짜·본문 메타 (예: "2026.05.17 · 누가복음 24:44–49") |
| `featuredTitle` / `featuredPreacher` | `string` | 대표 설교 제목·설교자 |
| `pastSermons` | `PastSermon[]` | 지난 설교 리스트 (`{date, title, preacher}`) |

## 데이터 소스 (예정)

YouTube 최신 N개 (`context/features/video-embed.md` 결정 후 API/RSS 연동). 현재는 페이지에서 상수 전달.

## 엣지케이스

- `pastSermons`가 비면 리스트 영역이 빈 채로 남음 — 최소 1개 이상 전달 가정(0개 UI는 아직 미정, 콘텐츠 입수 후 재검토)
- 제목에 줄바꿈(`\n`) 포함 가능 — `whitespace-pre-line`으로 렌더
