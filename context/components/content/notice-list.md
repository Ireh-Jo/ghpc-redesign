---
name: notice-list
category: content
status: wip
pages: [main]
depends-on:
  design: [color, typography, spacing, iconography, motion]
  components: [layout/section-header, layout/container, layout/fade-in]
  features: [admin-ui]
---

# NoticeList (`components/content/notice-list.tsx`)

메인 공지사항 — 제목만 나열하는 4줄 목록. **관리자(미디어팀)가 넣고 빼는 영역**
(다른 하나는 `MainBanner`) — 2026-09-16 사용자 지시.

근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai` · `… 모바일.ai` (2026-09-16).

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `notices` | `Notice[]` | `lib/notices.ts`. 메인은 `MAIN_NOTICE_COUNT`(4)건 |
| `moreHref` | `string` | "더보기" 목적지. 기본 `/church-admin/notice` |

`Notice` = `{ id, title, href, date? }`.

## 데이터·운영

- 지금: `lib/notices.ts` 목업 (시안에 실린 4건을 그대로 옮김)
- 이후: Supabase `posts` 최신 N건 + 어드민 작성 화면 (`context/03-data-model.md` §5)
- ⚠️ 지금 `posts.category`에 **`notice`가 없다** (`news/video_news/members/denomination` 넷뿐 · 2026-09-16 확인)
- 상세 페이지가 아직 없어 링크는 목록 스텁(`/church-admin/notice`)으로 간다.
  게시판형 목록 UI(`docs/NEXT.md` 1-4)가 생기면 글 URL로 바꾼다

## 시안과 다른 지점

- 시안 **모바일에만** 있던 어두운 알약 버튼을 "더보기"로 확정하고 **PC에도 같이 뒀다** —
  전체 목록으로 가는 길이 없으면 막다른 길이 된다
- 시안에는 날짜가 없다. 데이터에 `date`가 있으면 제목 오른쪽에 보조로 붙는다 (지금은 비어 있음)

## 반응형

- 제목은 모바일에서 **두 줄까지 흐르고**(`line-clamp-2`), PC에서는 한 줄로 자른다(`md:truncate`).
  시안 모바일처럼 한 줄로 자르면 "…직원 채용 공고"가 통째로 잘려 무슨 공지인지 알 수 없다

## 인터랙션·모션

- 행 hover: 제목 accent 색 + 오른쪽 화살표가 `opacity 0→1` + `translate-x-1` (200ms)
- 제목 아래 굵은 선(2px ink)은 `SectionHeader`의 `rule`, 행 사이는 `border-brand-line` 1px
