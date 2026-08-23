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
