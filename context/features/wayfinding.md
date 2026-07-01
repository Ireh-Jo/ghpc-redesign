---
name: wayfinding
status: locked
locked-at: 2026-06-13
owner: 이레
external-systems: []
depends-on:
  design: [color, typography]
  components: [interactive/floor-map, primitives/button]
reference-impl: prototypes/wayfind/   # 동작하는 프로토타입 (이 스펙의 단일 출처)
---

# 실내 길찾기 (Indoor Wayfinding) — LOCKED

## 목적

방문자가 교회 건물 내 목적지(방·홀·화장실·주차장)를 충별 도면에서 클릭해 경로를 안내받는다.
홈페이지에 임베드(모바일 70% 비중). 키오스크 아님 → "현위치" 고정 출발점 없음(출발지도 사용자가 선택).

## 잠금 결정 (2026-06-13)

**아키텍처 = 정밀 벡터 배경 + 사용자가 칠한 보행경로 격자 라우팅.** 사유:
- 도면을 손으로 다시 그리지 않고 원본 .ai를 벡터(SVG)로 변환 → 정확.
- 복도 노드를 손으로 찍는 건 부정확/고비용 → 사용자가 도면에 다닐 수 있는 길을 **핑크로 칠해** 주면 픽셀에서 격자 그래프 자동 생성. 유지보수는 "다시 칠해서 재렌더".
- **동작하는 레퍼런스 구현이 `prototypes/wayfind/`에 있고, 상세 명세는 거기 `README.md`가 단일 출처.** 본 문서는 본 개발에서 잠근 결정만 요약.

### 잠긴 항목
- **이동수단 기본값 = 엘리베이터(배리어프리).** 고령 교인·주차 진입 동선 고려. 토글: 엘리베이터/계단/최단.
- **층 구성:** 지상 1·2층(F1·F2), 지하 1·2·3층(B1·B2·B3). 좌표계: 지하 2097.64×1190.55, 지상 841.89×595.276.
- **층간 연결 = 색상 샤프트** (사용자 도면 색 표시 기준, README §6):
  blue엘베=전층 / cyan엘베=B1·B2·B3 / gray·pink계단=B1·B2·B3 / purple·orange계단=F2~B2 / green계단=F1·B1·B2.
- **선택 불가 방**(목적지에서 제외): 창고·기계실·공조실·방재실·방송실·관리인숙소·로뎀실·서고·정화조실·탈의실·샤워실·체육관방송실·준비실·방송장비실·발전기실·분수대기계실·변전실·썬컨. (배경엔 이름 표시, 클릭만 비활성.)
- **지상층 표시 70% 축소**(지하층 대비 도면이 확대돼 보임 → 홀 크기 정합).
- 도면의 "현위치(빨강 동그라미)"·"F1 라벨" 은 .ai에서 삭제됨(`도면/*-현위치삭제.ai`).

## 데이터/자산 (재사용)

| 자산 | 위치(프로토타입) | 본 개발 이전 |
|---|---|---|
| 벡터 배경 | `prototypes/wayfind/svg/*.svg` | 그대로 |
| 보행경로 마스크 | `prototypes/wayfind/walk/*.png` | 그대로 (또는 빌드시 격자 JSON으로 굳힘) |
| 층 데이터(방·입구·층간) | `prototypes/wayfind/data/*.js` | JSON/TS로 이관 |
| 라우팅 로직 | `prototypes/wayfind/lib/wayfind.js` | 순수함수 포팅(buildGraph·dijkstra·loadMask·simplify) |

DOM 글루(렌더·애니·팬줌)는 React 컴포넌트로 재작성. 디자인 토큰·접근성·성능은 본 개발 가드레일로 재검증(README §7).

## 비잠금 — 본 개발에서 교체/재설계 (프리젠테이션 레이어)

> **잠금된 건 "무엇을·어떻게 라우팅하나"(데이터·알고리즘·IA·좌표·층간 샤프트 매핑)뿐이다. "어떻게 보여주나"는 비잠금** — 프로토타입의 임시 구현이며, 본 개발에서 디자인 토큰·접근성 기준에 맞춰 자유롭게 바꾼다.

- **경로 그리기 애니메이션** — 현재 선이 그어지는 연출(`requestAnimationFrame` dash). 연출·속도·이징 자유. `prefers-reduced-motion` 대응 필요.
- **출발/도착 표시** — 현재 원형 마커 + "출발/도착" 텍스트. 본 개발에서 **핀/아이콘/일러스트 이미지로 교체 가능**(디자이너 자산).
- **색·타이포** — 현재 임의값. `context/design/*` 토큰으로 교체.
- **팬/줌·층 전환 UX, 상태 안내 문구(`onStatus`) 스타일** — 재설계 가능.
- **이동수단 토글·층 선택 UI 외형** — 외형은 자유, 단 *기능(엘베/계단/최단 필터 의미 + 기본값=엘리베이터)*은 잠금.

검증 완료(프로토타입): 모든 방 입구 좌표·층간 계단 `.at`는 보행경로(핑크)에 도달 가능하도록 보정됨. 좌표 수정 시 **`.at`/`door`가 방과 이어진 핑크 stroke에 snap되는지** 확인할 것(고립된 핑크 얼룩에 붙으면 경로가 우회·실패함 — README §4·§8). 입구 **방향**(어느 변에서 진입)은 `door`를 그 변 모서리로 옮겨 지정하고, 계단 발판 중앙 통과는 핑크가 마커 원에 끊기지 않게 + `.at`을 중앙 핑크 위에 둔다(README §8).

## DECISION NEEDED

- `> DECISION NEEDED:` **주차장(지하 1·2층) 내부 길찾기** — 주차장 도면 미수령. 현재 "주차장(P)"은 목적지(위치 안내)까지만. 도면 수령 후 "층 하나 추가" 방식으로 확장(기존 영향 없음).
- 거리(m) 실측 축척 보정 (현재 추정 0.03 m/px).

## React 이전 완료 (2026-07-01)

`interactive/floor-map` 등록·구현 완료. `context/components/interactive/floor-map.md`가 프리젠테이션(비잠금) 결정의 단일 출처.

| 원본(prototypes/wayfind) | 이전본 |
|---|---|
| `data/*.js` | `lib/wayfind/floors.ts` (좌표 1:1 포팅) |
| `lib/wayfind.js` 순수 함수 | `lib/wayfind/engine.ts` |
| `svg/*.svg` · `walk/*.png` | `public/wayfind/{svg,walk}/*` (그대로 복제) |
| DOM 글루·팬줌·애니 | `components/interactive/floor-map.tsx` (React, 재작성) |
| `index.html` UI(컨트롤·범례) | 위 컴포넌트 내부에 브랜드 토큰으로 재스킨 |

배치: `/intro#directions` (`components/layout/sub-page.tsx`의 `overrides` prop으로 주입). 메인 페이지의 "건물 내 길찾기" 버튼(`content/MapEmbed`)이 여기로 링크.
프로토타입 원본(`prototypes/wayfind/`)은 동결 보관 — 수정하지 않음. 좌표 변경이 필요하면 README §4 워크플로로 원본을 먼저 갱신하고 `lib/wayfind/floors.ts`에 반영.
