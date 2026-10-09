---
name: edu-overview
category: content
status: wip
client-component: false
pages: [education]
depends-on:
  design: [color, typography, spacing]
  components: [layout/container, layout/fade-in]
  features: []
---

# EduOverview (`components/content/edu-overview.tsx`)

`/education` 부서 목록 **앞**에 오는 교육 개요. 2026-10-09 김창진 목사 원고의 "교육목표 · 교육방법" 블록.
전에는 페이지 끝의 "교육 방침" 3카드(`_principles.tsx`)였는데 원고가 더 넓은 내용을 줘서 위로 올리고 합쳤다.

## 구성 (데이터: `lib/education.ts`)

1. 머리 문장 `EDU_HEADLINE` — "말씀과 예배로 자라는 언약의 자녀"
2. **실천 원리** `EDU_PRINCIPLES` 3개 — 하나님·성경·교회 중심 (풀이 문장은 오태희 원고)
3. **교육목표** `EDU_GOALS` 3개 — 예배적·인화협동적·문화적 인격자
4. **교육방법** `EDU_STEPS` 3단계 — 화살표로 잇는다 (모바일은 세로)
5. **성장 로드맵** `EDU_ROADMAP` 9단계 — 영아부(느낀다)→대학부(확장한다). 각 칸은 그 부서 섹션 앵커로 가는 링크
6. 부서 문의 대표전화 한 줄 (lg 미만은 좌측 패널 CTA가 없으므로)

## 배치

히어로 → 상단 탭(`AnchorNav`, lg 미만) → **EduOverview(전체 폭)** → 2단(`SideNavLayout`) 부서들.
좌측 패널 목록에는 넣지 않는다 — 부서 바로가기 패널이라서.

## 디자인

- 토큰만. 다크 면은 쓰지 않는다 (원고는 다크 히어로였지만 우리 서브페이지 본문은 라이트 기조)
- 로드맵은 가로 스크롤 줄 (`overflow-x-auto`) — 모바일에서 9칸이 한 줄에 안 들어가서. 자동 스크롤 없음
