---
name: SubPage
category: layout
status: shipped
owner: 이레
depends-on:
  design: [color, typography, spacing]
  components: [layout/container, layout/anchor-nav, content/hero-image]
  data: []
---

# SubPage — 대메뉴 페이지 골격

## 목적

5개 대메뉴 페이지(`/intro` `/worship` `/care` `/activity` `/newcomer`)의 공통 뼈대.
`lib/nav.ts`를 단일 출처로 헤로 + `AnchorNav` + 섹션들을 만든다.

## 입력

| prop | 타입 | 설명 |
|---|---|---|
| `sectionKey` | string | `lib/nav.ts`의 대메뉴 key |
| `overrides` | `Record<string, ReactNode>`? | 앵커 id별 실제 콘텐츠 (없으면 "준비 중") |
| `heroImage` | `{src, alt, lead}`? | 있으면 사진 분할 헤로, 없으면 텍스트 헤로 |

## 2단 그룹 승계 (2026-08-23)

하위 항목이 `groups[].items[]`가 되면서 두 종류가 섞였다.

- **자기 페이지 앵커**(`/care#deacons`) → 앵커 섹션으로 렌더. `AnchorNav` 대상.
- **다른 라우트**(`/ministry#stars`, `/activity/bulletin`) → 앵커 섹션으로 만들지 않는다.
  그 페이지에 없는 내용이 여기 있는 것처럼 보이기 때문. 그룹별 **바로가기 카드**로 묶는다.

`/activity`가 이 규칙 때문에 사실상 허브 페이지가 된다 (앵커 1 + 카드 11) —
2026-07-01 "게시판형은 독립 라우트" 결정과 같은 방향이다.

## 엣지 케이스

- 앵커가 1개 이하면 `AnchorNav`는 스스로 렌더하지 않는다.
- 없는 `sectionKey`는 `notFound()`.

## 2026-09-18 추가 — 히어로 문구 오버라이드 · `bareSections`

| prop | 언제 쓰나 |
|---|---|
| `heroImage.eyebrow` / `.title` / `.titleEn` | **시안 문구가 GNB 라벨과 다를 때만.** 기본값은 GNB 라벨(`section.label`)이다. `/worship`이 첫 사례 — GNB는 "예배와 교육"인데 시안 제목은 "예배", 아이브로우는 "예배와 교육 - 예배" |
| `hideOutboundGroups` | 그 그룹이 독립 페이지로 완성돼 이 페이지에 바로가기를 둘 이유가 없어졌을 때. 그룹 라벨로 숨긴다 (예: `/worship`의 "교육" — `/education` 완성으로 2026-09-18 제거). GNB 링크는 그대로 |
| `bareSections` | override가 자기 제목을 갖고 있어 섹션 h2와 **같은 문구가 두 번** 나오는 경우. 해당 앵커의 h2를 숨긴다. 이때 override 쪽 제목을 `h2`로 올려야 제목 계층이 안 끊긴다 (`ServiceTimeTable`의 `headingLevel="h2"`) |

남용 주의: `bareSections`는 "제목이 중복될 때"만 쓴다. 섹션 제목이 그냥 마음에 안 든다고 숨기면
`AnchorNav`의 탭 라벨과 본문 사이 연결이 끊긴다.

## `SubPage`를 쓰면 안 되는 경우 (2026-09-18)

`SubPage`는 **"대메뉴 = 라우트"** 를 가정한다 — `sectionKey` 섹션의 앵커(`<section.href>#*`)만 모은다.
그래서 **대메뉴의 하위 그룹이 독립 라우트를 갖는 경우**엔 맞지 않는다.
`/education`이 그 사례다 (앵커는 `/education#*`, 섹션 href는 `/worship`) — `HeroImage` + `AnchorNav` +
섹션을 직접 조립했다. 억지로 끼우지 말 것. 판단 기록: `docs/2026-09-18-교육페이지-시안-반영.md` §3.
