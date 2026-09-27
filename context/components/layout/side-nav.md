---
name: side-nav
category: layout
status: wip
client-component: true
pages: [education-b, education-c]
depends-on:
  design: [color, typography, spacing, iconography, motion]
  components: [layout/anchor-nav]
  features: []
---

# SideNav (`components/layout/side-nav.tsx`)

본문 **왼쪽 열에 붙어서 따라오는** 섹션 바로가기 패널. `AnchorNav`(상단 가로 탭)의 세로판이다.

## 배경 (왜 만들었나)

2026-09-27 외부 제안 — 레퍼런스(`feedbluetiger.imweb.me`의 "포트폴리오 클래스" 구간)처럼
**큰 주제 이미지 → 좌측 서브메뉴가 따라오고 우측에 콘텐츠**가 흐르는 구조로 바꿔 보자는 것.
결정 전이라 **교육 페이지에만 B안으로 시범 적용**한다 (A안 = 현재 `/education`, B안 = `/education/b`).
비교 후 채택되면 `SubPage`로 넓히고, 탈락하면 이 컴포넌트와 `/education/b`를 지운다.

효과는 CSS `position: sticky` 하나다 — 스크롤을 가로채지 않으므로 `06-motion.md`의 금지 목록
(패럴랙스·스크롤 잭킹)에 해당하지 않는다.

## 항목 / 타입 / 설명 / 데이터

| 항목 | 타입 | 설명 | 데이터 |
|---|---|---|---|
| 아이브로우 | text | 영문 소제목 (`EDUCATION`) | `eyebrow` |
| 제목 | text | 패널 제목. **h1이 아니다** — h1은 히어로가 갖는다 | `title` |
| 리드 | text | 한 줄 소개 | `lead` |
| 섹션 목록 | link list | 번호 + 라벨. 현재 섹션은 accent 색 + 화살표 | `items` |
| CTA | btn | 패널 맨 아래 1차 버튼 (교육은 대표전화) | `cta` |

## Props

```ts
interface SideNavProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** children = 2단 목록 (C안: 미취학부 > 영아부·유아부…). 하위가 활성이면 상위도 진하게 */
  items: { id: string; label: string; children?: { id: string; label: string }[] }[];
  /** 첫 항목 = 페이지 맨 위로 (기본 true — AnchorNav·GNB 규칙). C안처럼 페이지 중간 패널이면 false */
  topOnFirst?: boolean;
  /** sticky 위치 덮어쓰기 — C안은 상단 부서 탭 아래라 `top-40` */
  className?: string;
  /** detail = 전화번호처럼 끊기면 안 되는 값. 좁은 열에서는 label 아래 줄로 내려간다 */
  cta?: { label: string; detail?: string; href: string };
}
```

## 동작

- 패널은 `sticky top-28`(헤더 80px + 여백 32px). 부모 열(`aside`)이 본문 높이만큼 늘어나야 따라온다 —
  그리드 아이템 기본값(`stretch`)이면 된다. **조상에 `overflow: hidden`이 있으면 sticky가 죽는다.**
- 현재 섹션 추적·첫 항목 맨 위 스크롤은 `AnchorNav`와 **같은 로직**을 쓴다 (`lib/active-section.ts`).
  두 곳이 다르게 움직이면 안 되므로 복사하지 않고 공유한다.
- 뷰포트가 낮으면(노트북 가로) 패널 자체가 스크롤된다 (`max-h` + `overflow-y-auto`).
- 모션: 색·불투명도 전환 200ms만. 위치가 바뀌는 효과 없음.

## 반응형

- **lg(1024) 이상에서만** 보인다. 그 아래는 좌측 열을 둘 폭이 없어서 페이지가 `AnchorNav`(가로 탭)를 대신 띄운다.
  즉 B안의 모바일·태블릿은 A안과 같다.
- 좌측 열 폭: lg 200px / xl 240px. 우측 본문은 lg 1024 기준 약 650px까지 줄어든다.

## 접근성

- `<nav aria-label>`로 랜드마크. 현재 항목은 `aria-current="true"`.
- 번호는 `aria-hidden` (라벨만 읽힌다).

## 엣지케이스

- 라벨이 길면("제네바신학대학원 평생교육원") 두 줄로 넘어간다 — 번호는 첫 줄에 고정(`items-baseline`).
- 항목이 1개 이하면 목록을 렌더하지 않는다.

## 2026-09-27 — C안 확장 (2단 목록 · `topOnFirst` · `className`)

- `items[].children` — C안의 "미취학부 > 영아부·유아부…". 하위는 번호 없이 들여쓰기, 14px.
- 추적은 상·하위 id를 **한 번에** 넘긴다. 상위 섹션이 하위 행을 품고 있어 둘이 같이 화면 중앙에 걸리므로,
  `useActiveSection`이 **시작점이 가장 아래인 것(= 가장 안쪽)**을 고르도록 바꿨다 (형제끼리일 때는 경계에서
  다음 섹션으로 조금 일찍 넘어갈 뿐 동작 차이가 없다 — AnchorNav 포함).
- `topOnFirst=false` — C안 패널은 부서마다 있어서 첫 항목(소개)을 누르면 **그 부서의 소개로** 가야 한다.
