---
name: video-archive
category: content
status: wip
pages: [worship]
depends-on:
  design: [color, typography, spacing, motion]
  components: [content/youtube-embed]
  features: [video-embed, live-streaming]
---

# VideoArchive (`components/content/video-archive.tsx`)

영상 아카이브 한 덩어리 — **하위 카테고리 탭 + 큰 플레이어 1개 + 최근 영상 목록**.
`/worship#live`(예배 실황)와 `/worship#special`(특별순서)이 데이터만 바꿔 같은 컴포넌트를 쓴다.

레퍼런스(2026-09-15 사용자 제시): 사랑의교회 설교 페이지 · 선한목자교회 말씀 메뉴.
둘 다 "상단 대표 영상 + 분류 탭 + 아래 목록" 형태이고, 시안의 생방송·특별순서 화면도 같은 구조다.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `categories` | `ArchiveCategory[]` | `lib/worship-videos.ts`의 분류. 첫 번째가 기본 선택 |
| `label` | `string` | 카테고리 버튼 묶음의 접근성 라벨 (예: `예배 실황 분류`) |

## 동작

- 카테고리 전환 → 그 분류의 **최신 영상으로 플레이어 교체**
- 목록 카드 클릭 → 페이지 이동 없이 위 플레이어 교체 (현재 재생 중 카드는 테두리 `brand-ink`)
- 카테고리 버튼은 `role="tablist"`가 아니라 `role="group"` + `aria-pressed` — 화살표키 탭 네비게이션을
  구현하지 않았으므로 tab 역할을 주장하지 않는다 (잘못된 role이 없는 것보다 나쁘다)
- **현행 사이트로 나가는 "전체 보기" 링크는 두지 않는다** (2026-09-15 사용자 지시).
  전체 아카이브가 필요해지면 `/worship/live`(우리 라우트)가 생긴 뒤에 연결한다

## 디자인

- 카테고리 활성 = `bg-brand-ink text-white` — `AnchorNav`·`floor-map` 탭과 같은 톤 (`guardrails/02-design-consistency.md`)
- 썸네일 `i.ytimg.com/vi/<id>/hqdefault.jpg` (`next.config.mjs` 허용 도메인), hover 시 1.03 확대 + 재생 아이콘

## 엣지케이스

- 분류에 영상이 1개면 목록 그리드를 렌더하지 않는다
- 영상이 0개인 분류는 데이터에서 빼는 것이 원칙 (빈 화면 방지)
- 썸네일 404 → 유튜브가 회색 이미지를 반환. `maxres`가 아니라 항상 있는 `hqdefault`를 쓰는 이유
