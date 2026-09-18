/**
 * 예약 가능 시설 마스터 — **단일 출처**.
 *
 * 2026-09-19 시설 담당자 확정 (`context/features/reservation.md` §결정 잠금 #1):
 * 교육실 1·2·3·4·7·8·10 (5·6·9 제외) · 체육관 · 제1세미나실 · 연합회의실 ·
 * 트리니티홀 · 비전홀 · 글로브홀 · 운동장. **식당은 추후.**
 *
 * Supabase 연결 뒤에는 `rooms` 테이블(`context/03-data-model.md` §10)의 **시드**가 된다.
 * 그때까지는 이 배열이 곧 목록이고, 장소가 늘거나 빠지면 여기만 고친다.
 *
 * ⚠️ `id`는 예약 데이터가 참조하는 키다. **한 번 쓰기 시작하면 바꾸지 않는다**
 * (바꾸면 기존 예약의 장소가 사라진다). 이름만 바뀌면 `name`만 고칠 것.
 */

export type Room = {
  id: string;
  name: string;
  /** 달력·폼에서 묶어 보여주는 분류 */
  group: '교육실' | '회의·세미나' | '예배·행사' | '체육·야외';
  /** 실내 길찾기 방 코드 — `interactive/floor-map`의 "위치 보기" 연동 (확인 후 채움) */
  wayfindCode?: string;
};

export const ROOMS: Room[] = [
  { id: 'edu-1', name: '제1교육실', group: '교육실' },
  { id: 'edu-2', name: '제2교육실', group: '교육실' },
  { id: 'edu-3', name: '제3교육실', group: '교육실' },
  { id: 'edu-4', name: '제4교육실', group: '교육실' },
  // 제5·6교육실은 담당자 지시로 제외 (2026-09-19), 제9교육실은 최초 후보에서 제외
  { id: 'edu-7', name: '제7교육실', group: '교육실' },
  { id: 'edu-8', name: '제8교육실', group: '교육실' },
  { id: 'edu-10', name: '제10교육실', group: '교육실' },
  { id: 'seminar-1', name: '제1세미나실', group: '회의·세미나' },
  { id: 'union-meeting', name: '연합회의실', group: '회의·세미나' },
  { id: 'trinity-hall', name: '트리니티홀 (1층)', group: '예배·행사' },
  { id: 'vision-hall', name: '비전홀 (지하 1층)', group: '예배·행사' },
  { id: 'globe-hall', name: '글로브홀 (지하 2층)', group: '예배·행사' },
  { id: 'gym', name: '체육관', group: '체육·야외' },
  // 학교·동호회 사용 때문에 포함 (2026-09-19 담당자 지시)
  { id: 'playground', name: '운동장', group: '체육·야외' },
];

/** 폼·달력에서 쓰는 분류 순서 */
export const ROOM_GROUPS: Room['group'][] = ['교육실', '회의·세미나', '예배·행사', '체육·야외'];

const ROOM_BY_ID = new Map(ROOMS.map((room) => [room.id, room]));

export function roomName(id: string): string {
  return ROOM_BY_ID.get(id)?.name ?? id;
}

export function roomsByGroup(group: Room['group']): Room[] {
  return ROOMS.filter((room) => room.group === group);
}
