/**
 * 실내 길찾기 데이터 타입. 좌표·구조는 잠긴 결정(context/features/wayfinding.md) —
 * prototypes/wayfind/data/*.js 를 그대로 포팅. 값 변경 시 원본 워크플로(README §4) 따를 것.
 */

export type Point = [number, number];

export type RoomArea =
  | { rect: [number, number, number, number]; poly?: undefined; circle?: undefined }
  | { poly: Point[]; rect?: undefined; circle?: undefined }
  | { circle: [number, number, number]; rect?: undefined; poly?: undefined };

export type Room = {
  code: string;
  name: string;
  /** 목적지로 선택 가능. false/undefined면 배경에 이름만 표시(클릭 불가). */
  sel?: boolean;
  muted?: boolean;
  hall?: boolean;
  wc?: 'm' | 'f';
  door?: Point;
  /** 입구가 여러 개면 목적지에 맞는 입구를 자동으로 골라 라우팅한다. */
  doors?: Point[];
  area?: RoomArea;
};

export type TransferKind = 'elevator' | 'stairs';

export type Transfer = {
  /** 색상 샤프트 id — 인접 층에 같은 id가 있으면 연결된다 (README §6). */
  id: string;
  kind: TransferKind;
  at: Point;
  label: string;
};

export type FloorId = 'F1' | 'F2' | 'B1' | 'B2' | 'B3';

export type FloorData = {
  id: FloorId;
  label: string;
  short: string;
  /** public/ 기준 경로 */
  svg: string;
  viewBox: [number, number, number, number];
  walk: string;
  /** 격자 셀 px, 기본 12 */
  cell?: number;
  /** 화면 표시 배율 (지상층 0.7) */
  display?: number;
  transfers: Transfer[];
  rooms: Room[];
};

export type Mode = TransferKind | 'any';
export type EdgeType = 'corridor' | TransferKind;

export type Mask = { C: number; gw: number; gh: number; walk: Uint8Array };

export type Graph = {
  adj: Record<string, [string, number, EdgeType][]>;
  pos: Record<string, Point>;
  info: Record<FloorId, Mask>;
};

export type PathNode = { id: string; viaType: EdgeType | null };
export type PathResult = { path: PathNode[]; cost: number };
