---
name: edu-dept
category: content
status: wip
pages: [education]
depends-on:
  design: [color, typography, spacing, iconography, motion]
  components: [layout/container, layout/fade-in, content/faq-accordion]
  features: []
---

# EduDept (`components/content/edu-dept.tsx`)

`/education`의 **부서 섹션 하나**를 렌더한다. 7개 부서(주일학교·중고등부·대학부·청년회·경향시니어스쿨·
평생교육원·새소식반)가 같은 컴포넌트를 데이터만 바꿔 쓴다.

근거 시안: 디자인팀 교육 화면 시안 (2026-09-18) — 주일학교 한 부서만 그려져 있고 나머지는 미완성이라
**TF 화면안(`docs/meetings/screens/교육.html`)의 콘텐츠를 시안 조판에 얹었다.**
반영 기록: `docs/2026-09-18-교육페이지-시안-반영.md`.

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `dept` | `EduDept` | `lib/education.ts`의 한 부서 |

## 블록 순서 (데이터에 있는 것만 렌더)

1. **머리** — `01 SUNDAY SCHOOL`(번호+영문) · h2 제목 · 리드 · 오른쪽 바로가기 알약(`links`)
2. **구분선**
3. **소개 카드** — 연한 accent 배경 라운드 박스. 좌측 `01 주일학교 소개` + 본문, 우측 활동사진 슬롯(`photoSlots`)
4. **부서 카드 그룹**(`groups`) — 그룹 제목 + 카드 4열 (이름 / 연령·시간 / 장소)
5. **정보 리스트**(`facts`) — 라벨·값 (개강·수업시간·모임 구성 등)
6. **지회 구성표**(`roster`) — 청년회 전용. 라벨·값 2열 목록 + 안내 문구
7. **특징·혜택**(`bullets`)
8. **주요 행사**(`events`) — 번호가 붙은 카드 그리드
9. **FAQ**(`faq`) — 기존 `content/FaqAccordion` 재사용
10. **각주**(`notes`)

제목은 **h2**다 — `SubPage`의 섹션 h2를 `bareSections`로 숨기고 이 제목이 그 자리를 대신한다
(같은 부서명이 두 번 나오는 걸 피한다). 그룹 제목은 h3.

## 디자인

- 소개 카드·부서 카드는 `bg-brand-accent/5`(연한 네이비 틴트) + `rounded-2xl` — 시안의 연블루 박스
- 활동사진 슬롯은 `bg-brand-line/70` + "활동사진" 라벨. **어드민 업로드 전까지 자리만 잡아 둔다**
- 행사 번호는 `text-brand-accent/40`으로 크게 — 장식이므로 `aria-hidden`
- 임의 HEX 없음 (전부 brand 토큰 알파)

## 엣지케이스

- 데이터에 없는 블록은 **렌더하지 않는다** (빈 제목만 남는 자리 금지)
- `photoSlots`가 없으면 소개 카드는 1열로 꽉 찬다 (평생교육원)
- 카드 이름이 길면 두 줄로 흐른다 — 자르지 않는다
