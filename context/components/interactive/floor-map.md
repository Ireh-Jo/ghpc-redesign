---
name: floor-map
category: interactive
status: shipped
pages: [intro#directions]
depends-on:
  design: [color, typography, spacing, iconography, motion]
  components: []
  features: [wayfinding]
---

# FloorMap (`components/interactive/floor-map.tsx`)

React 이전본. **라우팅 로직·좌표·데이터는 잠긴 결정** — `context/features/wayfinding.md` ·
`prototypes/wayfind/README.md` 가 단일 출처. 이 문서는 **본 개발 프리젠테이션(비잠금) 구현**만 다룬다.

## 데이터 흐름

```
lib/wayfind/floors.ts   층별 데이터 (prototypes/wayfind/data/*.js 1:1 포팅, 좌표 불변)
lib/wayfind/engine.ts   순수 함수 포팅 (loadMask·buildGraph·nearestCell·dijkstra·simplify)
public/wayfind/{svg,walk}/*   벡터 배경 + 보행경로 마스크 (prototypes/wayfind 자산 그대로 복제)
components/interactive/floor-map.tsx   React 글루 (렌더·팬줌·애니·상태)
```

## Props

없음 (자기완결형). 페이지에서 `<FloorMap />` 로만 사용.

## 상태

- `floorId` — 표시 중인 층 (기본 `B1`, 원본과 동일)
- `mode` — `elevator`(기본) | `stairs` | `any`
- `start` / `end` — 선택된 방 (`${floorId}:${code}`)
- `status` — 안내 문구 판별 유니온(`Status`). 문자열 HTML 조립 대신 타입으로 분기해 렌더(esc 불필요, XSS 여지 없음)
- `ready` — 5개 층 walk 마스크 로드 + 그래프 구성 완료 여부 (완료 전 스켈레톤)
- pan/zoom 값은 `useRef`에만 보관(리렌더 없이 `style.transform` 직접 갱신) — 60fps 드래그/피치줌 대응

## 인터랙션

1. 방 클릭(1st) → 출발지 지정, 하이라이트
2. 방 클릭(2nd) → 도착지 지정 → 자동 라우팅 실행(다중 입구는 최短 조합 자동 선택)
3. 다시 클릭 → 새 여정 시작(초기화)
4. 이동수단 토글 → 경로 있으면 해당 수단으로 재계산
5. 층 탭 클릭 / 핀치·휠 줌 / 드래그 팬
6. "다시 선택" 버튼 → `reset()`
7. **검색** — 상단 입력창에 방 이름 입력(부분일치, 5개 층 전체 대상) → 목록에서 클릭(또는 Enter=첫 결과) → 해당 층으로 전환 + `pick()` 동일 동작. 클릭 없이도 길찾기 진입 가능(2026-07-01 추가, 비잠금 프리젠테이션 기능— 잠긴 데이터/알고리즘엔 영향 없음).

## 프리젠테이션 결정 (본 개발에서 새로 정함 — 비잠금 영역)

> `context/features/wayfinding.md` "비잠금" 절 참조. 아래는 프로토타입 임의값을 7토큰 팔레트로 재매핑한 것.

- **컬러 — 7토큰 + `brand-support`만 사용** (프로토타입의 green/rose 임의 HEX 제거):
  - 출발 마커·하이라이트 = `brand-support` (이미 헤로 LIVE 도트에 쓰인 토큰 재사용)
  - 도착 마커·하이라이트 = `brand-accent` (크림슨) — **테두리·마커점에만**, 방 폴리곤 전체를 레드로 채우지 않음(`fill-brand-accent/10` 저채도 틴트 + 얇은 stroke). `guardrails/02-design-consistency.md` "레드 5% 이하·큰 영역 금지" 준수
  - 경로 선 = `brand-accent` 위에 `brand-surface` 케이싱(흰 테두리) — 얇은 선이라 면적 영향 미미
  - 호버 = `brand-ink`의 6% 틴트
- **버튼·패널 = `.btn-square`**(2px 라운드) — 사이트 전역 다크 미니멀 톤과 통일. 라운드 사용 안 함(원 마커·dot 제외)
- **아이콘 = lucide-react만**: 엘리베이터=`ArrowUpDown`, 계단=`Footprints`, 최단=`Zap`, 초기화=`RotateCcw`, 검색=`Search`, 줌=`ZoomIn`/`ZoomOut`, 지도 원래대로=`Scan`(2026-07-01: `Maximize2`는 "전체화면"으로 오인되기 쉬워 교체)
- **지도 fit** — `<svg>`를 뷰포트 100%(h-full w-full) + `preserveAspectRatio="xMidYMid meet"`로 내부 레터박스. 이전엔 `width:100%;height:auto`로 그려 뷰포트보다 콘텐츠가 커지는 종횡비 불일치가 있었음(확대/축소 후 하단이 잘리는 버그) → 팬 클램프(`clampPan`)가 뷰포트 크기를 그대로 신뢰할 수 있게 됨. 줌 버튼도 `window` 중심이 아니라 지도 뷰포트 자체의 중심으로 확대/축소하도록 수정.
- **층별 배율(`floor.display`) 폐기(2026-07-01)** — contain-fit으로 바꾼 뒤엔 각 층이 자기 종횡비대로 박스에 꽉 차므로, 프로토타입에서 넘어온 지상층 0.7배 보정(`context/features/wayfinding.md` 참조)이 오히려 지상층을 과하게 작게 만들었음 → `lib/wayfind/types.ts`·`floors.ts`에서 `display` 필드 완전 제거. 지상(1.41:1)·지하(1.76:1) 도면의 종횡비 차이로 인한 약간의 여백 차이는 남지만(왜곡 없이 완전 통일은 좌표 정합상 불가), 체감 크기 차이는 크게 줄었음.
- **모션**: 경로 그리기 dash 애니메이션 유지하되 `prefers-reduced-motion: reduce`면 애니메이션 생략(즉시 표시) — `context/design/06-motion.md` 필수 대응 항목
- **접근성**: 방 클릭영역 `role="button"` + `tabIndex` + `aria-label`(방 이름) + 키보드 Enter/Space 선택. 층 도면 `<svg role="img" aria-label>`
- **터치**: 모바일 70% 비중(README §목적) — 컨트롤 버튼 높이 ≥44px, pinch-zoom 유지

## DECISION NEEDED (승계, 미해결)

- 주차장 내부 길찾기 — 도면 미수령. `lib/wayfind/floors.ts`의 `P` 코드는 위치 안내까지만.
- 거리 축척(`SCALE_M_PER_PX = 0.03`) 실측 보정 전 추정값.

## 알려진 비호환/차이

- 원본 HTML 프로토타입(`prototypes/wayfind/index.html`)은 개발 도구로 그대로 둔다(동결). 본 구현이 신규 단일 출처.

## 2026-10-10 — 크게 보기 (휴대폰 전체 화면 · PC 가운데 팝업)

사용자 요청: 지도를 팝업처럼 크게 볼 수 있게.

- 줌 컨트롤 맨 아래에 **"크게 보기"(`Maximize2`)** 버튼. 누르면 **같은 컴포넌트가 화면 전체(`fixed inset-0`, z-[71] — 헤더 z-50 · 모바일 메뉴 z-[60] 위)**로 커진다.
  다시 그리지 않고 키우는 방식이라 **출발지·도착지·경로·층·이동수단이 그대로** 남는다.
- 큰 화면 구성: 상단 바(제목 · 검색 · 닫기 X) → 이동수단 · 층 탭(한 줄 가로 스크롤) · 상태 안내(여백 축소) → **지도가 남은 높이 전부**.
  **검색 · 범례는 숨긴다** — 도면이 가로로 길어 지도 크기를 **높이**가 정하기 때문 (검색을 남기면 PC에서 지도가 겨우 5% 커졌다).
  → 같은 날 수정 (사용자: "확대 화면에 이름 검색이 없네"): **검색은 상단 바(제목 · X 줄) 안으로 옮겨 되살렸다** — 줄이 늘지 않아 지도 높이는 그대로.
  휴대폰은 폭이 좁아 상단 바의 "실내 길찾기" 제목을 빼고 검색창이 그 자리를 쓴다(dialog 이름이 제목 역할). 자리표시 문구도 짧게("방·시설 이름으로 검색").
  검색어가 있을 때 Esc는 **검색어만 지우고** 크게 보기는 닫지 않는다 (한 번 더 누르면 닫힘).
  실측(크게 보기 전 → 후): 모바일 375×812 지도 높이 380 → 525px · PC 1440×900 지도 높이 520 → 669px
- **같은 날 수정 — PC는 가운데 팝업** (사용자: "적당히 커지는 건 안 되나?"). `md` 이상에서 `min(1120px, 화면폭−4rem) × min(92vh, 880px)`,
  모서리 둥글게 · 그림자, 뒤에 반투명 배경(`bg-brand-ink/50`, z-[70] — 패널은 z-[71]) — **배경을 눌러도 닫힌다**.
  휴대폰은 전체 화면 유지: 여백을 두면 지도가 평소(380px)보다 작아져 크게 보기 의미가 없다.
  실측 PC 1440×900: 팝업 1120×828 · 지도 높이 520 → **597px** (전체 화면이었을 때 669px). 모바일 375×812: 525px 그대로.
  안의 줌 버튼 4번째는 **"작게 보기"(`Minimize2`)**로 바뀐다.
- 닫기: X · "작게 보기" · **Esc** · (PC) 배경 클릭. 열려 있는 동안 뒤 페이지 스크롤 잠금(`body overflow hidden`). 열 때 닫기 버튼에 포커스, 닫으면 "크게 보기" 버튼으로 복귀.
  `role="dialog"` + `aria-modal`.
- 크기가 바뀌므로 열고 닫을 때 확대·이동은 초기화(`resetView`)한다 — 이전 확대 상태로는 화면 밖으로 밀린다.
- **브라우저 전체화면 API는 쓰지 않는다** — 아이폰 사파리가 요소 전체화면을 지원하지 않는다.
- 2026-07-01 기록("`Maximize2`는 전체화면으로 오인 → 원래대로 아이콘을 `Scan`으로 교체")과 충돌하지 않는다 — 이번엔 **진짜 크게 보기**라서 그 아이콘이 맞다.
