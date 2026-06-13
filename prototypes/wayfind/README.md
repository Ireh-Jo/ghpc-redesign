# 경향교회 실내 길찾기 (wayfind) — 구현 명세 · 핸드오프

> **상태:** 프로토타입 완성. 5개 층(지상 1·2층, 지하 1·2·3층) 전부 동작.
> 벡터 도면 + 사용자가 칠한 보행경로(핑크) 기반 격자 라우팅 + 층간 엘베/계단 + 모바일 핀치줌.
> **본 개발(Next.js) 이전 시 이 문서를 기준으로 포팅한다.** 데이터/SVG/알고리즘은 그대로 재사용, DOM 글루만 React로 재작성.

---

## 1. 한눈에 보는 동작 원리

```
배경(정밀)              경로망(라우팅)                 목적지
svg/<층>.svg     +   walk/<층>.png(핑크 길)    +   data/<층>.js(방·입구·층간)
 (벡터 도면)          → 격자 그래프 자동 생성         → 클릭영역·다익스트라
```

1. **배경 = 원본 .ai → 벡터 SVG** (`pdftocairo -svg`). 손으로 다시 그리지 않음 → "정밀".
2. **보행경로 = 도면에 핑크(rgb 255,64,255)로 칠한 길**을 PNG로 렌더(`walk/<층>.png`). 엔진이 런타임에 핑크 픽셀을 **격자 셀(기본 12px, 지상층 8px)** 로 검출 → 8-이웃 그래프.
3. **라우팅 = 다익스트라 + LOS(시선) 단순화**. 핑크 길을 그대로, 최단으로 따라감.
4. **층간 = 색상 샤프트**. 계단/엘베를 색으로 그룹핑(아래 §6), 같은 색 = 연결. 이동수단(엘베/계단/최단) 토글로 필터.
5. **방 = 클릭영역(area) + 입구(door/doors)**. area는 도면 색칠 영역을 픽셀 검출. 입구가 여러 개면 목적지에 맞는 입구를 자동 선택.

---

## 2. 파일 구조

```
prototypes/wayfind/
├── index.html          앱 (UI + 캐시무력화 로더). 진입점.
├── lib/
│   └── wayfind.js      엔진: 마스크 로드 → 격자 그래프 → 다익스트라 → 렌더/애니/팬줌
├── data/
│   ├── B1.js ~ F2.js   층별 데이터 (walk 경로 경로, 방, 입구, 층간 transfer)
├── svg/
│   └── B1.svg ~ F2.svg 배경 도면(현위치·F1라벨 삭제본 .ai 변환). 화면 표시용.
├── walk/
│   ├── B1.png ~ F2.png 핑크 보행경로 마스크 (도면 1:1). 라우팅 입력. ★커밋함
│   └── _src/*.pdf       경로 원본 PDF 백업 (gitignore)
├── plans/*.ai          최초 원본 도면 (gitignore, 로컬 보관)
└── lib/{grid,author,probe,autorect,painted}.html   ← 개발 도구(좌표·영역·경로 검출). 운영 불필요.
```

서버: `.claude/launch.json` 의 `wayfind` = `python3 -m http.server 8777`. **반드시 서버로 열 것**(file:// 안 됨).

---

## 3. 데이터 포맷 — `data/<층>.js`

```js
window.FLOOR_B1 = {
  id: 'B1', label: '지하 1층', short: 'B1',
  svg: 'svg/B1.svg',                 // 배경
  viewBox: [0,0,2097.64,1190.55],    // 좌표계 (지하 2097×1190 / 지상 841×595)
  walk: 'walk/B1.png',               // 핑크 경로 마스크
  cell: 8,                           // (선택) 격자 셀 px, 기본 12. 지상층은 8.
  display: 0.7,                      // (선택) 화면 표시 배율. 지상층 70% 축소.

  transfers: [                       // 층간 수직이동. id=색상 샤프트(전 층 공통).
    { id:'elev_blue', kind:'elevator', at:[910,750], label:'중앙 엘리베이터' },
    { id:'stair_gray', kind:'stairs',  at:[195,130], label:'북서 계단' },
    // ... at=좌표(가장 가까운 walkable 셀로 자동 연결)
  ],

  rooms: [                           // 선택 가능한 목적지만. (비선택 방은 배경에 이름만 → 생략)
    { code:'B143', name:'식당', door:[1000,360], sel:true, area:{rect:[760,124,832,234]} },
    { code:'B101', name:'비전홀', door:[1110,735], sel:true, hall:true, area:{poly:[[..],..]} },
    { code:'F101', name:'트리니티홀', doors:[[339,414],[532,118]], sel:true, area:{...} }, // 입구 여러 개
    // area: rect:[x,y,w,h] | poly:[[x,y]..] | circle:[cx,cy,r]
    // door: 단일 입구 [x,y] / doors: 입구 여러 개 [[x,y],..] (목적지에 맞는 입구 자동 선택)
  ],
};
```

- **좌표는 모두 viewBox 기준**(원본 도면 px). 모든 area/door/transfer가 같은 좌표계.
- 비선택 방(창고·기계실 등)은 **data에 안 넣으면** 클릭만 안 되고 배경엔 이름이 보임.

---

## 4. 층/경로 추가·수정 워크플로 (가장 중요)

**원칙: 좌표를 손으로 추정하지 말 것. 전부 픽셀에서 검출.**

### A. 경로 바꾸기
1. 사용자가 도면 PDF에 다닐 수 있는 길을 **핑크(255,64,255)** 로 칠함.
2. `pdftoppm -r 72 -singlefile "경로.pdf" walk/<층>` → `walk/<층>.png` 생성(도면과 1:1).
3. 끝. 엔진이 자동으로 격자 재생성.
   > ⚠️ **경로 PDF와 "주석표시" PDF를 같은 파일명으로 받지 말 것.** (덮어쓰기 사고 이력) 합쳐서 1개로 받거나 이름 분리.

### B. 방 클릭영역(area) 검출
`lib/autorect.html?f=<층>&s=1` 열고 콘솔에서:
- `detect(x,y)` — 색칠 방의 rect (seed가 글자/벽이면 주변 채움픽셀로 스냅)
- `detectPoly(x,y)` — 큰 홀의 윤곽 폴리곤(스캔라인)
- 화장실: 남=cyan(85,195,241)·여=amber(250,191,0) 색 스캔
- void(채움없는) 방(F2 트리니티홀 등)은 수동 rect.

### C. 배경 도면 교체 (현위치 등 수정 시)
`.ai`에서 수정 → `pdftocairo -svg "<층>.ai" svg/<층>.svg`. viewBox 동일하면 좌표 그대로 유효.

---

## 5. 엔진 API (`lib/wayfind.js`)

```js
const wf = new Wayfinder({ floors:[FLOOR_F2,FLOOR_F1,FLOOR_B1,FLOOR_B2,FLOOR_B3],
  order:['F2','F1','B1','B2','B3'],   // 위→아래. 인접 층끼리만 transfer 연결.
  mode:'elevator',                     // 'elevator'(기본·배리어프리) | 'stairs' | 'any'
  onStatus: html=>{...} });
await wf.load();                        // walk PNG들 로드 → 격자 그래프 구성 (async)
wf.mountFloors(stageEl);
wf.showFloor('B1'); wf.setMode('stairs'); wf.pick('B1','B143'); // 클릭 시뮬
```

- 라우팅: `nearestCell(door)` → 다익스트라(이동수단 필터) → 층별 구간 분할 → LOS 단순화 → 애니.
- 다중 입구: 모든 (출발도어×도착도어) 조합을 라우팅해 **최단 유효경로** 선택.

---

## 6. 층간 수직 샤프트 (색상 = 연결 그룹)

사용자가 도면에 색 동그라미로 표시. **같은 색 = 같은 샤프트 = 연결.**

| 샤프트 id | 종류 | 연결 층 |
|---|---|---|
| `elev_blue` | 엘리베이터 | F2·F1·B1·B2·B3 (전층) |
| `elev_cyan` | 엘리베이터 | B1·B2·B3 |
| `stair_gray` | 계단 | B1·B2·B3 |
| `stair_pink` | 계단 | B1·B2·B3 |
| `stair_purple` | 계단 | F2·F1·B1·B2 |
| `stair_orange` | 계단 | F2·F1·B1·B2 |
| `stair_green` | 계단 | F1·B1·B2 |

`order` 상 인접 층끼리만 연결되므로(F2-F1-B1-B2-B3), 한 샤프트가 여러 층에 있으면 연쇄 연결된다.

---

## 7. 본 개발(Next.js/React) 이전 가이드

**그대로 재사용:**
- `svg/*.svg` (벡터 배경), `walk/*.png` (경로 마스크), `data/*.js`의 좌표 데이터(→ JSON/TS로).
- 라우팅 로직(`buildGraph`·`nearestCell`·`dijkstra`·`simplify`·`loadMask`) — 순수 함수, 그대로 포팅.

**재작성:**
- DOM 글루(mountFloors·렌더·애니·팬줌·이벤트) → React 컴포넌트 + SVG.
- `index.html`의 캐시무력화 로더는 dev 전용 → 번들러가 대체.

**검증 재수행(가드레일):**
- 디자인 토큰(색/타이포)을 `context/design/*` 토큰으로 교체 (지금은 임의값).
- 접근성: 방 클릭영역에 aria-label/키보드 선택, 색상 대비, 스크린리더 안내 텍스트.
- 성능: walk PNG는 offscreen 1회 디코드. SVG 배경 lazy-load. 격자 그래프는 빌드시 미리 계산해 JSON으로 굳혀도 됨(런타임 PNG 디코드 제거).
- `> DECISION NEEDED:` 주차장 내부 — 주차장 도면 수령 후 층 추가. P는 현재 위치 안내만.

**관련 문서:** `context/features/wayfinding.md`(본 개발 컨텍스트, 잠긴 결정사항).

---

## 8. 알려진 미결 / 한계

- `> DECISION NEEDED:` **주차장(지하 1·2층) 내부 길찾기** — 도면 미수령. 현재 P는 목적지(위치 안내)까지만.
- 거리(m)는 추정 축척(scaleMPerPx=0.03). 실측 시 보정.
- F2 트리니티홀·만나의집은 도면상 채움 없음(void) → area 수동 지정.
- walk PNG 안의 다른 핑크(예: 주석 핑크 동그라미)는 경로로 오검출될 수 있음 → 경로 PDF엔 핑크는 길만.
