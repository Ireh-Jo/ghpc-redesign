/* 경향교회 길찾기 — 지상 2층(F2). 좌표계 841.89×595.276 (F1과 공유).
 * 선택 가능: 트리니티홀·만나의집2층·화장실 (로뎀실 제외).
 * 트리니티홀·만나의집은 도면상 채움 없음(void) → 영역 수동 지정.
 */
window.FLOOR_F2 = {
  id: 'F2', label: '지상 2층', short: 'F2',
  svg: 'svg/F2.svg',
  viewBox: [0, 0, 841.89, 595.276],
  walk: 'walk/F2.png',
  cell: 8,
  display: 0.7,   // 지하층 대비 도면이 확대돼 보여 70%로 축소 표시

  transfers: [
    { id:'elev_blue',   kind:'elevator', at:[136,346], label:'엘리베이터' },
    { id:'stair_purple',kind:'stairs',   at:[460,92],  label:'북동 계단' }, // 계단발치(트리니티·남자화장실측 복도)에 부착. [446,68]은 고립 stub에 snap돼 룸에서 도달 불가였음
    { id:'stair_orange',kind:'stairs',   at:[157,300], label:'중앙 계단' },
  ],

  rooms: [
    { code:'F101', name:'트리니티홀', doors:[[450,360],[450,520],[470,200]], sel:true, hall:true, area:{poly:[[572,58],[1008,310],[756,746],[320,494]]} }, // 기존 rect[440,150,560,560]을 좌5%이동+우10%·하10% 컷 후 중심기준 30° 우회전(방 기울기 정합)
    { code:'F102', name:'만나의 집 2층', door:[210,510], sel:true, area:{rect:[130,455,165,110]} },
    { code:'WCFN', name:'남자화장실', wc:'m', door:[367,262], sel:true, area:{rect:[330,211,74,103]} },
    { code:'WCFY', name:'여자화장실', wc:'f', door:[307,384], sel:true, area:{rect:[270,332,74,105]} },
  ],
};
