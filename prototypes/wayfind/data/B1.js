/* 경향교회 길찾기 — 지하 1층(B1) 데이터
 * 좌표계: 원본 SVG viewBox 0 0 2097.64 1190.55 (좌상단 원점, y 아래로)
 * 배경(svg/B1.svg)은 벡터 원본 그대로. 이 파일은 그 위에 얹는 길찾기 레이어.
 *
 * walk  : 보행 경로망 — 사용자가 핑크로 칠한 길 이미지(walk/B1.png, 원본 1:1).
 *         엔진이 로드 시 핑크(255,64,255) 픽셀을 walkable 격자로 검출 → 그 위에서 라우팅.
 * room  : 클릭 가능한 목적지. door = 방에서 나오는 진입점(가장 가까운 walkable 셀로 연결).
 *         area = 클릭영역(실제 방 형태). rect:[x,y,w,h] | poly:[[x,y],...] | circle:[cx,cy,r]
 * transfer: 층간 이동(계단/엘베). id 는 B1/B2/B3 공통(좌표 공유)이라 층 통합 시 수직 연결.
 *           at = 좌표(가장 가까운 walkable 셀로 연결). kind = 'stairs' | 'elevator'.
 */
window.FLOOR_B1 = {
  id: 'B1', label: '지하 1층', short: 'B1',
  svg: 'svg/B1.svg',
  viewBox: [0, 0, 2097.64, 1190.55],

  walk: 'walk/B1.png',

  // 층간 수직이동: id=색상 샤프트(전 층 공통). 사용자 색표시 기준.
  transfers: [
    { id:'elev_blue',   kind:'elevator', at:[910,750],  label:'중앙 엘리베이터' },
    { id:'elev_cyan',   kind:'elevator', at:[220,235],  label:'북서 엘리베이터' },
    { id:'stair_gray',  kind:'stairs',   at:[195,130],  label:'북서 계단' },
    { id:'stair_purple',kind:'stairs',   at:[1450,388], label:'북동 계단' }, // 계단 발치(식당측 복도)에 부착. [1390,300]은 비전홀 둘레 고립 stroke에 snap돼 식당↔이 계단이 1420비용 우회였음
    { id:'stair_orange',kind:'stairs',   at:[910,650],  label:'중앙 계단' },
    { id:'stair_green', kind:'stairs',   at:[714,495],  label:'중앙서 계단' }, // 발판 중앙 핑크에 부착(B2와 동일 보정). [690,490]은 좌/중앙 핑크 정중간이라 왼쪽벽으로 snap됐음
    { id:'stair_pink',  kind:'stairs',   at:[1190,1000],label:'남측 계단' },
  ],

  // area 좌표 = 도면 픽셀 flood-fill 자동 검출(lib/autorect.html). door = 방 진입점.
  rooms: [
    { code:'B141', name:'직원식당', door:[460,360],  sel:true, area:{rect:[404,124,124,234]} },
    { code:'B142', name:'주방',     muted:true },
    { code:'B143', name:'식당',     doors:[[1000,360],[1450,360]], sel:true, area:{rect:[760,124,832,234]} }, // 우측 입구 추가=북동(purple)계단 바로옆 → F1·B2 이동 시 인접 계단 활용
    { code:'B134', name:'공조실',   muted:true },
    { code:'B133', name:'예단실',   door:[1640,520], sel:true,
      area:{poly:[[1718,406],[1608,472],[1646,538],[1668,572],[1776,506],[1738,440]]} },
    { code:'B132', name:'세미나실', door:[1740,700], sel:true,
      area:{poly:[[1780,516],[1690,568],[1726,674],[1790,778],[1880,726],[1812,568]]} },
    { code:'B131', name:'공조실',   muted:true },
    { code:'B103', name:'대기실',   muted:true },
    { code:'B104', name:'방송실',   muted:true },
    { code:'B105', name:'조명실',   muted:true },
    { code:'B101', name:'비전홀',   door:[1110,735], sel:true, hall:true,
      area:{poly:[[1324,424],[1292,462],[1284,502],[1312,540],[1280,578],[1268,618],[1170,656],[1154,694],[1138,734],[1130,772],[1150,810],[1168,850],[1260,888],[1728,888],[1752,850],[1728,810],[1706,772],[1684,734],[1658,694],[1636,656],[1612,618],[1588,578],[1566,540],[1542,502],[1460,462],[1472,424]]} },
    { code:'B102', name:'수유실',   door:[1190,945], sel:true, area:{rect:[1168,900,95,44]} },
    { code:'B111', name:'교회사무실', door:[746,900], sel:true, area:{rect:[700,756,92,140]} },
    { code:'B112', name:'친교실',   door:[890,900], sel:true, area:{rect:[806,756,168,140]} },
    { code:'B123', name:'목양실',   door:[800,950], sel:true, area:{rect:[656,950,354,136]} },
    { code:'B124', name:'경향선교회', door:[1426,948], sel:true, area:{rect:[1328,950,196,136]} },
    { code:'B125', name:'당회실',   door:[1595,948], sel:true, area:{rect:[1538,950,114,136]} },
    { code:'B126', name:'연합회의실', door:[1719,948], sel:true, area:{rect:[1665,950,108,139]} },
    { code:'B127', name:'밧모연구실', door:[1853,1004], sel:true, area:{rect:[1786,1004,134,82]} },
    { code:'B0',   name:'헌당기념홀', door:[1790,930], sel:true, area:{circle:[1849,924,80]} },
    // 화장실 (남=cyan·여=amber, 픽셀 검출). 상단 NE / 하단 복도
    { code:'WCTN', name:'남자화장실', wc:'m', door:[1600,375], sel:true, area:{rect:[1562,312,96,70]} },
    { code:'WCTY', name:'여자화장실', wc:'f', door:[1636,420], sel:true, area:{rect:[1600,386,98,68]} },
    { code:'WCBN', name:'남자화장실', wc:'m', door:[1060,948], sel:true, area:{rect:[1024,950,72,138]} },
    { code:'WCBY', name:'여자화장실', wc:'f', door:[1148,948], sel:true, area:{rect:[1109,950,78,138]} },
    { code:'P',    name:'주차장', door:[330,400], sel:true, area:{circle:[330,400,42]} },
  ],
};
