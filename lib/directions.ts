/**
 * 오시는 길 (`/intro#directions`) — 건물 · 좌표 · 대중교통. 단일 출처.
 *
 * 출처: 현행 사이트 `https://www.ghpc.or.kr/Page/Index/36` (2026-10-09 확인). 좌표는 그 페이지 카카오맵 스크립트의 마커 값 그대로.
 * 주차 안내는 현행 사이트에도 없다 — 받으면 `PARKING`에 넣는다 (docs/NEXT.md §2).
 */

export type Building = {
  name: string;
  postcode: string;
  address: string;
  lat: number;
  lng: number;
  /** 주 건물 — 카드에서 강조 */
  main?: boolean;
};

export const BUILDINGS: Building[] = [
  { name: '경향교회 본당', postcode: '07589', address: '서울시 강서구 화곡로 375', lat: 37.557415, lng: 126.8523379, main: true },
  { name: '경향선교회관', postcode: '07589', address: '서울시 강서구 화곡로 371', lat: 37.5569893, lng: 126.8522167 },
  { name: '경향교회 교육관', postcode: '07589', address: '서울 강서구 화곡로63길 19', lat: 37.5572217, lng: 126.8516453 },
];

/** 지도 중심 — 현행 사이트 값 (세 건물의 가운데쯤) */
export const MAP_CENTER = { lat: 37.5574095, lng: 126.8519708 };

const MAIN = BUILDINGS[0];

/** 지도 앱 바로가기 — 키가 필요 없는 공개 URL */
export const MAP_LINKS = {
  kakaoView: `https://map.kakao.com/link/map/${encodeURIComponent('경향교회')},${MAIN.lat},${MAIN.lng}`,
  kakaoRoute: `https://map.kakao.com/link/to/${encodeURIComponent('경향교회')},${MAIN.lat},${MAIN.lng}`,
  naver: `https://map.naver.com/p/search/${encodeURIComponent('경향교회 화곡로 375')}`,
};

/** 건물별 카카오맵 길찾기 (목적지 = 그 건물) */
export const routeTo = (b: Building) =>
  `https://map.kakao.com/link/to/${encodeURIComponent(b.name)},${b.lat},${b.lng}`;

export const SUBWAY = {
  line: '9',
  station: '가양역',
  guide: '9호선 가양역 8번 출구에서 마포중·고등학교 방면으로 도보 5분',
};

/**
 * 버스 종류별 색 — 서울시 버스 체계(간선 파랑 · 지선/마을 초록). 토큰은 `transit-*` (01-color.md §기능 색).
 * `null` = 공식 색을 확인 못 해 중립으로 둔 종류 (공항 · 경기 일반) — DECISION NEEDED.
 */
export type BusTone = 'trunk' | 'branch' | null;

export const BUS: { stops: string[]; lines: { type: string; tone: BusTone; numbers: string[] }[] } = {
  stops: ['KBS스포츠월드', '경복비즈니스고등학교', '강서구청사거리 · 서울디지털대학교'],
  lines: [
    { type: '간선', tone: 'trunk', numbers: ['601', '604', '605', '606', '650', '652', '654', '661', '673', 'N26 (심야)'] },
    { type: '지선', tone: 'branch', numbers: ['5712', '6514', '6627', '6629', '6633', '6642', '6645', '6715'] },
    { type: '공항', tone: null, numbers: ['6003', '6018'] },
    { type: '일반', tone: null, numbers: ['60', '60-3', '70-2', '70-3'] },
    { type: '마을', tone: 'branch', numbers: ['강서04', '강서05'] },
  ],
};

/** 주차 — 현행 사이트에 안내가 없다. 원고가 오면 문장으로 채운다 */
export const PARKING: string | null = null;
