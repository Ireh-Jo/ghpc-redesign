---
name: anchor-nav
category: layout
status: shipped
pages: [intro, worship, care, activity, newcomer]
depends-on:
  design: [color, typography, spacing, motion]
  components: []
  features: []
---

# AnchorNav (`components/layout/anchor-nav.tsx`)

서브페이지 상단에 sticky로 붙는 섹션 바로가기 탭바. 스크롤에 따라 현재 보고 있는 섹션을 자동 하이라이트.

## 배경 (왜 만들었나)

서브페이지(`SubPage`)는 GNB 하위 메뉴 항목 수만큼 섹션이 세로로 길게 이어진다(교회소개 기준 7개).
콘텐츠가 실데이터로 채워지면 페이지가 매우 길어져 가독성이 떨어질 수 있다는 우려 → 각 섹션을 아코디언으로
접는 대신, **연속 스크롤은 유지하고 상단에 앵커 탭바를 붙여 원하는 섹션으로 바로 이동**하는 방식을 선택
(2026-07-01 결정, 이유: 콘텐츠가 실할 섹션—역사 타임라인·섬기는 사람들 카드 등—을 접어두면 클릭 비용·SEO·
스크린리더 접근성이 나빠짐). 단, "새신자 Q&A"처럼 짧은 질문-답이 여러 개 나열되는 섹션은 예외로
`content/faq-accordion`을 사용(그 섹션 내부만 아코디언).

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `items` | `{ id: string; label: string }[]` | 앵커 대상 섹션 id·라벨. `SubPage`가 `section.children`(lib/nav.ts)에서 추출해 전달 |

## 동작

- `position: sticky`, `top-16 md:top-20`(Header 높이와 동일) — 스크롤해도 Header 바로 아래 고정
- `IntersectionObserver`(rootMargin `-45% 0 -45% 0`)로 뷰포트 중앙에 걸린 섹션을 `activeId`로 추적 → 해당 탭만 `bg-brand-ink text-white`, 나머지는 `text-brand-ink-muted`
- 탭 클릭 = 일반 `<a href="#id">` (전역 `scroll-smooth` + 각 섹션 `scroll-mt-24`로 부드럽게 이동, JS 스크롤 로직 불필요)
- 모바일: `overflow-x-auto`로 가로 스크롤, 줄바꿈 없음(`whitespace-nowrap`)

## 디자인

- 탭 스타일은 `interactive/floor-map`의 층 탭·이동수단 토글과 동일한 톤(`.btn-square`, 활성=`bg-brand-ink text-white`) — 같은 의미엔 같은 스타일(`guardrails/02-design-consistency.md`)
- 색은 7토큰만 사용, 임의값 없음

## 엣지케이스

- 섹션이 1개뿐이면 탭바 자체가 무의미 — 현재 모든 GNB 하위 메뉴가 4개 이상이라 해당 없음. 향후 짧은 서브페이지가 생기면 `items.length <= 1`일 때 렌더 생략 고려
- IntersectionObserver는 클라이언트 전용 → `'use client'`. JS 비활성 환경에서도 `<a href="#id">` 자체는 동작(점진적 향상)
