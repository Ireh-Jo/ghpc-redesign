/* 경향교회 길찾기 — 지하 2층(B2). 방식은 [[B1.js]] 와 동일.
 * walk = 사용자가 핑크로 칠한 길(walk/B2.png). area = autorect 픽셀검출.
 * 비선택 방(관리인숙소·로뎀·창고·방송실·방재실·체육관방송실)은 배경에 이름만 표시되므로 생략.
 */
window.FLOOR_B2 = {
  id: 'B2', label: '지하 2층', short: 'B2',
  svg: 'svg/B2.svg',
  viewBox: [0, 0, 2097.64, 1190.55],
  walk: 'walk/B2.png',

  transfers: [
    { id:'elev_blue',   kind:'elevator', at:[910,760],  label:'중앙 엘리베이터' },
    { id:'elev_cyan',   kind:'elevator', at:[220,250],  label:'북서 엘리베이터' },
    { id:'stair_gray',  kind:'stairs',   at:[195,130],  label:'북서 계단' },
    { id:'stair_purple',kind:'stairs',   at:[1390,310], label:'북동 계단' },
    { id:'stair_orange',kind:'stairs',   at:[910,650],  label:'중앙 계단' },
    { id:'stair_green', kind:'stairs',   at:[700,500],  label:'중앙서 계단' },
    { id:'stair_pink',  kind:'stairs',   at:[1190,1000],label:'남측 계단' },
  ],

  rooms: [
    { code:'B246', name:'제4교육실', door:[800,248],  sel:true, area:{rect:[707,130,185,236]} },
    { code:'B247', name:'제3교육실', door:[1030,248], sel:true, area:{rect:[905,130,251,236]} },
    { code:'B248', name:'제2교육실', door:[1260,248], sel:true, area:{rect:[1168,130,183,236]} },
    { code:'B249', name:'제1교육실', door:[1488,246], sel:true, area:{rect:[1363,130,249,233]} },
    { code:'B236', name:'제5교육실', door:[1710,502], sel:true, area:{rect:[1625,418,171,169]} },
    { code:'B235', name:'제6교육실', door:[1778,621], sel:true, area:{rect:[1690,533,177,177]} },
    { code:'B226', name:'제7교육실', door:[1861,757], sel:true, area:{rect:[1763,656,197,202]} },
    { code:'B202', name:'한나실',   door:[1353,511], sel:true, area:{rect:[1268,431,170,160]} },
    { code:'B201', name:'글로브홀', door:[1450,890], sel:true, hall:true,
      area:{poly:[[1524,455],[1514,493],[1448,530],[1415,568],[1345,605],[1321,643],[1311,680],[1314,718],[1294,755],[1279,793],[1268,830],[1295,868],[1439,905],[1733,905],[1764,868],[1751,830],[1729,793],[1706,755],[1684,718],[1661,680],[1638,643],[1615,605],[1593,568],[1570,530],[1551,493],[1525,455]]} },
    { code:'B234', name:'키즈그라운드', door:[1221,773], sel:true, area:{rect:[1132,644,178,258]} },
    { code:'B212', name:'스튜디오', door:[895,838],  sel:true, area:{rect:[807,767,176,142]} },
    { code:'B204', name:'교육국',   door:[761,1032], sel:true, area:{rect:[665,962,193,141]} },
    { code:'B223', name:'미디어부', door:[946,1032], sel:true, area:{rect:[871,962,151,141]} },
    { code:'B233', name:'수유실',   door:[1282,1005], sel:true, area:{rect:[1235,962,94,87]} },
    { code:'B227', name:'청년회실', door:[1393,1032], sel:true, area:{rect:[1342,962,102,141]} },
    { code:'B222', name:'제8교육실', door:[1622,1032], sel:true, area:{rect:[1456,962,333,141]} },
    { code:'B259', name:'남전도회연합회실', door:[1871,1058], sel:true, area:{rect:[1801,1015,140,87]} },
    { code:'WCTN', name:'남자화장실', wc:'m', door:[1645,367], sel:true, area:{rect:[1600,340,90,55]} },
    { code:'WCTY', name:'여자화장실', wc:'f', door:[1677,434], sel:true, area:{rect:[1625,398,105,72]} },
    { code:'WCBN', name:'남자화장실', wc:'m', door:[1071,1037], sel:true, area:{rect:[1034,975,74,124]} },
    { code:'WCBY', name:'여자화장실', wc:'f', door:[1160,1037], sel:true, area:{rect:[1121,975,78,124]} },
    { code:'B371', name:'우성체육관', door:[600,450], sel:true, area:{rect:[134,426,489,581]} },
    { code:'P',    name:'주차장', door:[345,400], sel:true, area:{circle:[345,400,42]} },
  ],
};
