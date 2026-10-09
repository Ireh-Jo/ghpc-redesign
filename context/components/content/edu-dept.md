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

## 2026-10-09 — 교역자 원고 반영 (김창진 우선 + 오태희)

- **하위 부서 카드에 특징 목록** (`EduGroupItem.features`, 김창진 원고 "우리 부서의 특징"). 그룹 안에 특징이 하나라도 있으면
  4열 요약 카드 대신 **2열 카드**(이름 · 교실 배지 · 대상/시간 · ✓ 특징 목록)로 펼친다. 특징이 빈 부서는 "부서 프로그램 안내 준비 중"
- **공통 프로그램 칩** (`common`, 주일학교 공통 9종) — 하위 부서 카드 바로 아래 옅은 면 상자
- **성경 구절** (`verses`, 새소식반 잠언 22:6 · 마태복음 19:14) — 소개 카드 위 왼쪽 선 인용
- **바로가기 3갈래** (`links[].href`): 외부(새 창 + ↗) · 사이트 안(`/`로 시작) · **없음 = "준비 중" 비활성** (평생교육원 수강신청서 등)
- **지회 구성표(`roster`) 삭제** — 청년회가 목양(`/care#evangelism`)으로 옮겨 쓰는 곳이 없어졌다
- 부서 수 7 → 6 (청년회 제외, 번호 01~06 재부여). 교육 방침 블록은 `content/edu-overview.md`로 옮겨 페이지 위로 올렸다
