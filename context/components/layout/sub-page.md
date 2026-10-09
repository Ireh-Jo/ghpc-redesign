---
name: SubPage
category: layout
status: shipped
owner: 이레
depends-on:
  design: [color, typography, spacing]
  components: [layout/container, layout/anchor-nav, layout/side-nav, layout/side-nav-layout, content/hero-image]
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

## 2026-10-03 — 좌측 sticky 패널 (B안 확정)

lg 이상은 **좌측 `SideNav` + 우측 앵커 섹션**(`SideNavLayout`), lg 미만은 그대로 상단 `AnchorNav`.
결정 기록: `context/04-information-architecture.md` §서브페이지 섹션 바로가기 배치.

| prop | 설명 |
|---|---|
| `sideNav.lead` | 패널 소개 문구. 기본 GNB `tagline` |
| `sideNav.cta` | 패널 맨 아래 버튼 `{label, detail?, href}`. 기본 없음 |

- 패널 제목 = `heroImage.title` ?? GNB 라벨 (`/worship`은 "예배")
- **앵커가 1개 이하면 한 단** — `/activity`(앵커 1 + 바로가기 카드)처럼 패널에 목록이 없으면 빈 기둥만 남는다
- 바로가기 카드(다른 라우트 그룹)는 2단 **밖**, 전체 폭. 첫 카드 묶음이 위 경계선을 긋는다

## 2026-10-09 — 다른 페이지 카드는 붙이지 않는다

사용자 지시("페이지마다 자기 콘텐츠만, 뎁스 최소화")로 **모든 `SubPage`가 `hideOutboundGroups`로 바깥 그룹 카드를 숨긴다**:
`/worship`(교육) · `/intro`(헌금 · 행정) · `/care`(사역) · `/activity`(소식 · 자료). 이동은 GNB가 맡는다.
카드 렌더 코드는 남겨 둔다 — 새 대메뉴가 생겨 허브가 필요해지면 그대로 쓴다. 결정: `context/04-information-architecture.md`.
