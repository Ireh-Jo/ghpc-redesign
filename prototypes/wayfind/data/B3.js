/* 경향교회 길찾기 — 지하 3층(B3, 기계·창고층). 방식은 [[B1.js]] 동일.
 * 선택 가능: 헬스실·우성체육관·경향복지재단·제10교육실 + 화장실. 나머지(기계/공조/창고/서고 등)는 비선택.
 */
window.FLOOR_B3 = {
  id: 'B3', label: '지하 3층', short: 'B3',
  svg: 'svg/B3.svg',
  viewBox: [0, 0, 2097.64, 1190.55],
  walk: 'walk/B3.png',

  transfers: [
    { id:'elev_blue',  kind:'elevator', at:[870,710],  label:'중앙 엘리베이터' },
    { id:'elev_cyan',  kind:'elevator', at:[195,290],  label:'북서 엘리베이터' },
    { id:'stair_gray', kind:'stairs',   at:[195,150],  label:'북서 계단' },
    { id:'stair_pink', kind:'stairs',   at:[1150,1010],label:'남측 계단' },
  ],

  rooms: [
    { code:'B342', name:'헬스실',   door:[490,360], sel:true, area:{rect:[385,235,210,122]} }, // 입구=아래쪽(기존[490,296] 좌측위 오인)
    { code:'B371', name:'우성체육관', door:[378,426], sel:true, area:{rect:[134,426,489,581]} }, // 입구=위쪽 중앙(기존[610,500] 오른쪽 오인)
    { code:'B312', name:'경향복지재단', door:[907,789], sel:true, area:{rect:[872,752,70,74]} },
    { code:'B322', name:'제10교육실', door:[867,981], sel:true, area:{rect:[757,878,220,207]} },
    { code:'WCBN', name:'남자화장실', wc:'m', door:[417,159], sel:true, area:{rect:[378,124,78,70]} },
    { code:'WCBY', name:'여자화장실', wc:'f', door:[310,159], sel:true, area:{rect:[262,124,96,70]} },
  ],
};
