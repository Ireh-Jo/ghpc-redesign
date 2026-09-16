---
name: weekly-sermons
category: content
status: wip
pages: [main]
depends-on:
  design: [color, typography, spacing, iconography, motion]
  components: [layout/section-header, layout/fade-in, layout/container]
  features: [video-embed]
---

# WeeklySermons (`components/content/weekly-sermons.tsx`)

메인 "말씀" 섹션. 최근 설교 3편을 카드로 보여준다.

근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai` · `홈페이지 메인 디자인 모바일.ai` (2026-09-16).
검토·미결 사항: `docs/2026-09-16-메인-디자인시안-반영.md`.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `sermons` | `ArchiveVideo[]` | 보여줄 설교. 메인은 3편 (`lib/worship-videos.ts`의 주일 낮예배 최신순) |
| `eyebrow` | `string` | 기본 `— 이번주` |
| `title` | `string` | 기본 `말씀` |
| `lead` | `string` | 기본 `실시간으로 어디서든 예배의 자리에 함께 하세요` (시안 문구 그대로) |

## 반응형

- **PC**: 3열 그리드 (`md:grid-cols-3`, `gap-8`)
- **모바일**: 한 장씩 보이는 **스냅 스크롤 + 좌우 원형 버튼** (시안 모바일의 회색 원 2개)
- DOM은 하나(`flex … md:grid`)만 둔다. `md`에서 `overflow-visible`로 풀어 그리드가 되게 하고
  버튼은 `md:hidden` — 스크린리더가 같은 목록을 두 번 읽지 않는다

## 데이터

지금은 `lib/worship-videos.ts`의 `SERVICE_ARCHIVE[0].videos`(주일 낮예배) 상위 3편.
유튜브 동기화 또는 Supabase `sermons` 이관 시 페이지에서 넘기는 배열만 바뀐다 (컴포넌트 수정 없음).
썸네일은 `https://i.ytimg.com/vi/<id>/maxresdefault.jpg` (`next.config.mjs` remotePatterns 등록됨).

**`hqdefault`를 쓰지 않는 이유 (2026-09-16):** `hqdefault`는 4:3이라 16:9 영상에 **검은 띠가 박혀 있다.**
카드 비율이 16:9가 아니면 그 띠가 그대로 보인다. 그래서 ① 카드를 `aspect-video`(16:9)로 맞추고
② 16:9 원본인 `maxresdefault`를 먼저 쓴다. 없는 영상(저화질 업로드)만 `onError`로 `hqdefault`로 내려가는데,
이때는 컨테이너가 16:9라 `object-cover`가 띠를 정확히 잘라낸다 (4:3 → 16:9 = 상하 12.5%씩 크롭).

## 인터랙션·모션

- 카드 hover: 썸네일 `scale-[1.04]` 300ms + 그림자 `sm→md` + 제목 accent 색 (`context/design/06-motion.md`)
- 재생 오버레이는 hover 시에만 나타난다 (`VideoArchive`와 같은 패턴)
- 스크롤 진입 시 `FadeIn` — 카드마다 80ms 지연 (stagger)
- **자동 슬라이드 없음** (06-motion "자동재생 캐러셀 금지")

## 시안과 다른 지점

- 카드를 누르면 **유튜브 원본**으로 나간다 (기존 `SermonCard`와 같은 동작). 사이트 안에서 이어 보려는
  사람을 위해 `/worship#live`(예배 실황 아카이브) 링크를 머리 오른쪽·모바일 목록 아래에 추가했다 — 시안에 없는 추가분
- 시안의 카드 썸네일은 단색 네모(플레이스홀더)다. 실제로는 유튜브 썸네일이 들어간다
- 카드 비율은 시안 1.46:1 대신 **16:9** — 유튜브 썸네일을 잘리거나 띠 없이 담는 비율이다 (2026-09-16)

## 엣지케이스

- `sermons`가 비면 섹션 자체를 렌더하지 않는다 (페이지에서 판단 — 현재는 항상 3편 존재)
- 설교 제목이 길면 두 줄까지 자연스럽게 흐른다 (자르지 않음)
- `scripture`·`speaker`가 없으면 해당 줄을 렌더하지 않는다
