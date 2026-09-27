---
name: edu-chapter
category: content
status: wip
client-component: false
pages: [education-c]
depends-on:
  design: [color, typography, spacing, iconography, motion]
  components: [content/edu-dept, layout/side-nav, layout/container, layout/fade-in]
  features: []
---

# EduChapter (`components/content/edu-chapter.tsx`)

교육 **C안**(`/education/c`)의 부서 1개 = 한 "챕터". 7개 부서가 데이터만 바꿔 반복한다.

## 배경

2026-09-27 사용자 제안. B안(페이지 전체에 좌측 패널 1개)에서 한 단계 더 나가서
**부서마다 배너가 하나씩 있고, 그 부서 영역에 들어가면 좌측에 그 부서의 하위 메뉴가 새로 나온다.**
예: 주일학교 배너 → 좌측 `소개 / 미취학부(영아부·유아부·유치1부·유치2부) / 초등부(초등1~4부) / 주요 시설 / 주요 행사`
→ 중·고등부 배너가 나오면 좌측이 `소개 / 부서 구성(중등부·고등부) / 주요 행사`로 바뀐다.

바뀌는 효과는 **sticky가 부서 영역 안에서만 유효하기 때문에 저절로** 생긴다 (패널이 자기 부서 끝에서 멈추고
다음 부서의 패널이 올라온다). 스크롤을 가로채는 JS는 없다.

## 구성

1. **부서 배너** — 둥근 박스. `dept.banner`가 있으면 사진 + 다크 그라데이션, 없으면 `bg-brand-accent-2` 면에
   "배너 이미지 자리" 표시. 번호·영문·제목·리드·바로가기(카페) 흰 글씨
2. **모바일 하위 메뉴** (lg 미만) — 배너 아래 칩 목록. sticky 아님 (상단은 부서 탭이 이미 차지)
3. **2단** (lg 이상) — 좌 `SideNav`(부서 하위 메뉴, 2단 목록) / 우 하위 섹션들

## 하위 섹션 = 데이터에 있는 블록만

| 순서 | 블록 | 메뉴 라벨 | 하위 항목 |
|---|---|---|---|
| 1 | `intro` | 소개 | — |
| 2 | `groups[]` (그룹마다) | 그룹 라벨 (`미취학부`) | 그룹 안 부서 (`영아부`…) — **행 1개씩** |
| 3 | `facts` | `facts.title` ?? `안내` | — |
| 4 | `roster` | `roster.title` | — |
| 5 | `bullets` | `bullets.title` | — |
| 6 | `events` | 주요 행사 | — |
| 7 | `faq` | 자주 묻는 질문 | — |

`notes`(각주)는 메뉴에 넣지 않고 마지막 섹션 아래에 붙는다.
블록 조판은 `EduDept`의 export 블록을 그대로 쓴다 — A·B·C안의 콘텐츠가 같아야 비교가 된다.
**예외는 그룹**: A·B안은 4열 카드, C안은 부서별 **행**(이름·대상·시간·장소 + 활동사진 자리)이다.
메뉴가 영아부·유아부를 따로 가리키려면 각자 스크롤 목적지가 있어야 해서다.

## id 규칙

- 챕터 = `dept.id` (GNB `/education#kids`와 같다)
- 하위 섹션 = `${dept.id}-intro` · `${dept.id}-g${n}` · `${dept.id}-facts` …
- 그룹 안 부서 = `${dept.id}-g${n}-${m}`

## 스크롤 오프셋

C안은 상단 부서 탭(`AnchorNav`)이 **모든 폭에서** 떠 있다 — 부서 간 이동 수단이 그것뿐이라서.
그래서 좌측 패널은 헤더(80) + 탭(약 57) 아래인 `top-40`, 하위 섹션은 `scroll-mt-40`.

## 엣지케이스

- 블록이 1개뿐인 부서(없음 — 전부 소개 + 1개 이상)면 목록이 1개 → `SideNav`가 목록을 숨긴다
- 배너 사진이 없으면 placeholder — 디자인팀이 주면 `lib/education.ts`의 `banner` 한 줄
