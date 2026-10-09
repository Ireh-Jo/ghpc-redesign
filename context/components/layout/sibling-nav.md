---
name: sibling-nav
category: layout
status: wip
client-component: false
pages: [giving, church-admin/notice, church-admin/resources, church-admin/apply, church-admin/reserve, activity/bulletin, activity/news, activity/denomination]
depends-on:
  design: [color, typography, spacing]
  components: [layout/container]
  features: []
---

# SiblingNav (`components/layout/sibling-nav.tsx`)

**같은 GNB 그룹의 형제 페이지로 바로 넘어가는 탭 줄.** 2026-10-09 사용자 요청 — `헌금 · 행정`처럼 하위 항목이
전부 독립 페이지인 그룹은 옆 페이지로 갈 때마다 GNB를 열어야 해서 번거롭다.

## 동작

- `route`로 `lib/nav.ts`에서 그룹을 찾아(`findByHref`) 그 그룹의 항목을 탭으로 그린다. 현재 페이지는 `aria-current="page"` + 진한 탭
- **그룹의 항목이 모두 독립 페이지(해시 없음)이고 2개 이상일 때만** 나온다. 앵커 그룹(같은 페이지 안 섹션)은 좌측 패널·상단 앵커 탭이 맡는다
- 현재 대상: `교회소개 > 헌금 · 행정`(5) · `교회 활동 > 소식 · 자료`(3)
- `StubPage`가 히어로 바로 아래에 자동으로 붙인다 — 페이지 파일은 손대지 않는다

## 디자인

- 모양은 `AnchorNav` 탭과 같다 (활성 = `bg-brand-ink text-white`) — 같은 의미엔 같은 모양
- 앞에 그룹 이름을 작게(`헌금 · 행정`) 붙여 "이 줄이 무엇인지" 알린다
- **sticky가 아니다** — `/church-admin/apply`가 이미 sticky `AnchorNav`(서식 종류)를 쓰고 있어 같은 자리에 겹친다.
  긴 페이지에서 형제 페이지로 갈 땐 맨 위로 올라오거나 GNB를 쓴다
- 모바일: 가로 스크롤 한 줄 (`overflow-x-auto`, 줄바꿈 없음)
