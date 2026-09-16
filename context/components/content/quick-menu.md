---
name: quick-menu
category: content
status: wip
pages: [main]
depends-on:
  design: [color, typography, spacing, iconography, motion]
  components: [layout/container, layout/fade-in]
  features: []
---

# QuickMenu (`components/content/quick-menu.tsx`)

메인 퀵메뉴 — 자주 찾는 4곳(예배시간 · 약도 주차 · 구역공과 · 주보)을 네모 타일로.

근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai` · `… 모바일.ai` (2026-09-16).

## 데이터

항목·라벨·링크는 **`lib/nav.ts`의 `QUICK_MENU`** 단일 출처 (GNB와 같은 원칙).
아이콘은 데이터에 두지 않고 `key → lucide` 매핑을 컴포넌트가 갖는다 (`lib/nav.ts`는 React 의존 없는 데이터 파일).

| key | 라벨 | 링크 | 아이콘 |
|---|---|---|---|
| `worship-time` | 예배시간 | `/worship#times` | `AlarmClockCheck` |
| `directions` | 약도 주차 | `/intro#directions` | `MapPin` |
| `district-study` | 구역공과 | `/church-admin/resources` | `BookOpen` |
| `bulletin` | 주보 | `/activity/bulletin` | `FileText` |

> DECISION NEEDED: **구역공과 목적지.** 2차 목차 어디에도 없는 항목이라 잠정으로 자료실에 걸었다.
> `lib/nav.ts`의 `OPEN_QUESTIONS` '구역공과'(게시 여부·대상) 회신이 오면 확정한다.

## 시안과 다른 지점

시안은 네 칸 중 둘이 뜻과 무관한 아이콘(ⓘ · 말풍선)이라 **의미가 맞는 아이콘으로 바꿨다**
(약도=`MapPin` · 구역공과=`BookOpen`). 시안 그대로 가야 하면 컴포넌트의 `ICONS` 매핑만 되돌린다.

## 반응형

- PC 4열 (`md:grid-cols-4`), 타일 높이 150px
- 모바일 2×2 (`grid-cols-2`), 타일 높이 104px — 시안과 동일
- 라벨은 **타일 밖 아래**에 둔다 (시안 그대로). 타일 안에 넣으면 긴 라벨이 아이콘을 밀어낸다

## 인터랙션·모션

- hover: **색 채우기** — 타일 안에서 ink 면이 아래→위로 차오른다(`scale-y` 450ms ease-out) +
  `-translate-y-1` + 그림자 `sm→md` + 아이콘 `scale-110` + 우상단 화살표(`ArrowUpRight`) 페이드인
- 라벨도 같이 accent 색으로 — 타일/라벨이 한 링크임을 보여준다
- 진입 시 `FadeIn` 60ms stagger
- `motion-reduce`: 채우기 면을 숨기고 타일 배경색만 바꾼다 (이동·확대 없음)

## 라벨 아래 설명 한 줄

2026-09-16 "타일이 비어 보인다"는 피드백으로 `QUICK_MENU[].desc`를 추가했다 (시안에는 없는 줄).
링크 목적지를 예고하는 보조 문구라 스크린리더에도 그대로 읽힌다.
