---
name: ministry-sections
category: content
status: wip
client-component: false
pages: [ministry]
depends-on:
  design: [color, typography, spacing, iconography]
  components: [layout/container]
  features: []
---

# MinistrySections (`components/content/ministry-sections.tsx`)

`/ministry`(사역) 섹션 본문 6종. 데이터: `lib/ministry.ts` (원고 `사역2·3·4`, 2026-10-09).

| export | 앵커 | 내용 |
|---|---|---|
| `MinistryStars` | `#stars` | 로고 · 다니엘 12:3 · 소개 · 홈페이지 · **8단계 교육과정**(학년별 상/하반기) · 사진 자리 |
| `MinistryGts` | `#gts` | 엠블럼 · "진리와 함께 50년 / 진리를 향해 50년" · 연혁 3문단 · 홈페이지 · 사진 자리 |
| `MinistryMission` | `#mission` | 마크 · 행 1:8 · 소개 · 숫자 4칸 · 가는/보내는 선교사 · 사역 4단계 · **지역별 선교사 명단** · 사진 자리 |
| `MinistryWelfare` | `#welfare` | 기관 3곳 카드 — 소개 · 활동사진 가로 줄 · 홈페이지/인스타/후원/자원봉사 버튼 |
| `MinistrySchool` | `#school` | 경향학원 머리말 + 경복여고 · 경복비즈니스고 카드 |
| `MinistryKids` | `#childcare` | 경향키즈놀이학원 카드 |

## 선교사 명단 (⚠️)

원고의 인터랙티브 세계지도(점 찍힌 지도 + 팝업)는 **지역 카드 목록**으로 바꿨다 — 지도 점 좌표 데이터가 무겁고,
모바일에서 작은 점을 누르기 어렵다. 명단 내용은 원고 그대로.
특수지역(동아시아·M국·I국) 실명은 `lib/ministry.ts`의 `SHOW_SPECIAL_REGION_NAMES` 한 줄로 끌 수 있다
(2026-10-09 사용자 결정 "원고대로 공개" — 원래 `docs/NEXT.md` §3 착수 금지 항목이었다).

## 사진 자리

원고의 사진 placeholder는 라벨 회색 칸으로 남긴다 (`EduDept` 활동사진 칸과 같은 모양). 사진이 오면 같은 자리에 넣는다.
복지재단 사진만 실물이다 (현행 사이트에서 내려받아 메타데이터 제거, `public/ministry/welfare/`).

## 원고와 다른 점

- 기관별 고유색(세이지·머스타드·블루, 네이비·골드)은 쓰지 않는다 — 토큰만 (`guardrails/02`). 기관 구분은 로고·제목으로
- 드래그 스크롤 레일·떠다니는 별 장식·등장 애니메이션 제외 (`06-motion.md` 등재 효과만)
- 외부 링크 버튼 호버의 위로 뜨는 효과 → 색 전환만
