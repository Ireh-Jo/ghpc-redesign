---
name: side-nav-layout
category: layout
status: shipped
client-component: false
pages: [intro, worship, education, care, activity, newcomer]
depends-on:
  design: [spacing]
  components: [layout/container, layout/side-nav, layout/anchor-nav]
  features: []
---

# SideNavLayout (`components/layout/side-nav-layout.tsx`)

서브페이지 본문의 **2단 골격** — 좌 `SideNav`(lg 이상만) / 우 섹션들. 2026-10-03 B안 확정으로
`SubPage`(대메뉴 5개)와 `/education`이 같이 쓴다. 두 곳이 다른 폭·간격을 갖지 않도록 값은 이 파일 한 곳에만 둔다.

## Export

| 이름 | 종류 | 설명 |
|---|---|---|
| `SideNavLayout` | 컴포넌트 | `nav`(좌측 패널 노드) + `children`(섹션들). `Container` 포함 |
| `sideSectionClass(isLast)` | 함수 | 우측 섹션 클래스 — 상하 여백 · `scroll-mt` · 마지막 빼고 아래 경계선 |

서버 컴포넌트 파일이다. `SideNav`가 `'use client'`라 같은 파일에 두면 `sideSectionClass`가 클라이언트
참조가 되어 서버(`SubPage`)에서 호출할 수 없다 — 그래서 분리했다.

## 값

- 좌측 열: lg 200px / xl 240px, 간격 lg 48px / xl 64px. 좌측 패널 상하 여백은 섹션과 같은 `py-20`
- `scroll-mt`: lg 미만 `32`/`md:36` (헤더 + 상단 `AnchorNav`) · lg 이상 `24` (헤더만)
- 우측 열에 `min-w-0` — 표·가로 스크롤 콘텐츠가 그리드 열을 밀어내지 않게

## 페이지 쪽 규칙

- lg 미만은 페이지가 `AnchorNav`를 `className="lg:hidden"`으로 띄운다 (좌측 패널 대신)
- 앵커 섹션이 아닌 블록(바로가기 카드·교육 방침)은 이 골격 **밖**에 전체 폭으로 둔다
