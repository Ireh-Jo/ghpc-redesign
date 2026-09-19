/**
 * 시설 예약 — 정책 상수 + 판정 함수 + 목업 데이터.
 *
 * 정책 단일 출처는 `context/features/reservation.md` §결정 잠금 (2026-09-19 시설 담당자 + 사용자 확정).
 * 여기 있는 함수는 **순수 함수**라 폼(클라이언트)과 서버 액션이 같은 것을 쓴다 —
 * 화면에서 한 번 막고, 서버에서 다시 막는다. 규칙이 두 군데서 갈라지지 않게 하려는 것이다.
 *
 * ⚠️ 목업(`MOCK_RESERVATIONS`)은 달력 화면을 만들기 위한 가짜 데이터다. Supabase 연결 시
 * 공개 뷰 `reservations_public`(`context/03-data-model.md` §11)에서 읽어 오고 이 상수는 사라진다.
 * **PII(이름·연락처)는 이 타입에 없다** — 달력으로 흘러갈 경로 자체를 만들지 않는다.
 */

/** 이용 가능 시간 — 08:00 ~ 20:00 (2026-09-19 담당자 확정) */
export const OPEN_TIME = '08:00';
export const CLOSE_TIME = '20:00';

/**
 * 반복 최대 회차 — **12회 확정** (2026-09-19 담당자 피드백).
 * A안(신청=점유)이라 상한이 없으면 한 부서가 인기 시설을 장기 선점한다. 시설별 차등은 두지 않는다.
 */
export const MAX_REPEAT_COUNT = 12;

/** 달력·목록에 공개하는 예약 정보. **이름·연락처 없음** */
export type PublicReservation = {
  id: string;
  roomId: string;
  /** 이용기관 — 공개 */
  org: string;
  /** 용도 — 공개 */
  purpose: string;
  /** `YYYY-MM-DD` */
  date: string;
  /** `HH:mm` */
  startTime: string;
  endTime: string;
  /** 주간 반복 묶음 (같은 값이면 한 번에 신청된 회차들) */
  recurrenceGroupId?: string;
};

/** 신청 회차 하나 — 기간·반복을 펼친 결과 */
export type Occurrence = { date: string; startTime: string; endTime: string };

/**
 * 반복 방식 (2026-09-19 담당자 피드백 반영 — "일·주·월 단위, 주중(월–금)").
 *
 * - `none`     기간(시작~종료) **매일** — 일단위 반복이 곧 이 방식이다. 하루만 쓰면 시작=종료
 * - `weekdays` 기간 안에서 **월~금만** (주말 제외)
 * - `weekly`   시작일의 요일로 **매주** N회
 * - `monthlyDate`    시작일의 **날짜**로 매월 N회 (예: 매월 15일)
 * - `monthlyWeekday` 시작일의 **N번째 O요일**로 매월 N회 (예: 매월 셋째 화요일 — 월례회 패턴)
 *
 * 월 단위는 **해당 날짜·요일이 없는 달을 건너뛴다** (31일·다섯째 주). 건너뛰면 결과 회차가
 * 요청 횟수보다 적어지는데, 화면이 "실제 몇 회인지"를 보여 주므로 예측 가능하다.
 */
export type RepeatMode = 'none' | 'weekdays' | 'weekly' | 'monthlyDate' | 'monthlyWeekday';

/** 횟수를 입력받는 방식인가 (기간 방식은 종료일로 정해진다) */
export function usesRepeatCount(mode: RepeatMode): boolean {
  return mode === 'weekly' || mode === 'monthlyDate' || mode === 'monthlyWeekday';
}

export const REPEAT_LABELS: Record<RepeatMode, string> = {
  none: '반복 없음 (하루 또는 기간 내 매일)',
  weekdays: '주중 반복 (월–금, 기간 내)',
  weekly: '매주 반복',
  monthlyDate: '매월 반복 (같은 날짜)',
  monthlyWeekday: '매월 반복 (같은 주·요일)',
};

/* ────────────────────────────── 날짜 유틸 ──────────────────────────────
   교회 현지(서울) 기준으로 판정한다. 해외·다른 타임존 접속자도 같은 결과를 봐야 한다. */

/** 서울 기준 오늘 `YYYY-MM-DD` */
export function todayInSeoul(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** `YYYY-MM-DD` → 요일 (0=일) */
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return next.toISOString().slice(0, 10);
}

export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/* ────────────────────────────── 정책 판정 ────────────────────────────── */

/** 이용 가능 시간(08:00~20:00) 안인가. 종료가 시작보다 늦어야 한다 */
export function isWithinOperatingHours(startTime: string, endTime: string): boolean {
  return startTime >= OPEN_TIME && endTime <= CLOSE_TIME && startTime < endTime;
}

/**
 * 신청할 수 있는 날짜인가 — **당일·과거 불가** (2026-09-19 확정).
 * 담당자 표현: "당일 신청은 시스템상에서 안 되는 걸로". 현행 안내 문구의 "3일 전"은 권고로만 남긴다.
 */
export function isBookableDate(date: string, now: Date = new Date()): boolean {
  return date > todayInSeoul(now);
}

/**
 * 기간 + 주간반복을 **회차 목록**으로 펼친다.
 *
 * - 반복 없음: 시작일~종료일 **매일** (현행과 같은 "기간 점유")
 * - 주간반복: 시작일의 요일로 매주 `repeatCount`회. 사이 날짜는 점유하지 않는다
 *   (현행이 주간 반복을 기간으로 적어 안 쓰는 날까지 닫혀 있던 문제를 푼다)
 */
export function expandOccurrences(input: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  repeatMode?: RepeatMode;
  repeatCount?: number;
}): Occurrence[] {
  const { startDate, endDate, startTime, endTime } = input;
  const mode: RepeatMode = input.repeatMode ?? 'none';
  const time = { startTime, endTime };
  const count = Math.min(Math.max(input.repeatCount ?? 1, 1), MAX_REPEAT_COUNT);
  if (!startDate) return [];

  if (mode === 'weekly') {
    return Array.from({ length: count }, (_, i) => ({ date: addDays(startDate, i * 7), ...time }));
  }

  if (mode === 'monthlyDate') {
    const [, , day] = startDate.split('-').map(Number);
    return monthsFrom(startDate, count)
      .filter(({ year, month }) => day <= daysInMonth(year, month))
      .map(({ year, month }) => ({ date: ymd(year, month, day), ...time }));
  }

  if (mode === 'monthlyWeekday') {
    const weekday = weekdayOf(startDate);
    const nth = nthWeekdayOf(startDate); // 1~5
    return monthsFrom(startDate, count)
      .map(({ year, month }) => dateOfNthWeekday(year, month, weekday, nth))
      .filter((date): date is string => date !== null)
      .map((date) => ({ date, ...time }));
  }

  // none · weekdays — 기간을 훑는다
  const dates: string[] = [];
  for (let cursor = startDate; cursor <= endDate; cursor = addDays(cursor, 1)) {
    const day = weekdayOf(cursor);
    if (mode === 'weekdays' && (day === 0 || day === 6)) continue; // 주말 제외
    dates.push(cursor);
    if (dates.length >= MAX_OCCURRENCES) break; // 안전장치 — 기간 입력 실수 방지
  }
  return dates.map((date) => ({ date, ...time }));
}

/** 한 번에 만들 수 있는 최대 회차 — 기간 입력 실수와 장기 선점을 동시에 막는다 */
export const MAX_OCCURRENCES = 60;

function ymd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** 시작 달부터 `count`개월 (시작 달 포함) */
function monthsFrom(startDate: string, count: number): { year: number; month: number }[] {
  const [y, m] = startDate.split('-').map(Number);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 + i, 1));
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
  });
}

/** 그 달에서 **몇 번째** 해당 요일인가 (1~5) */
export function nthWeekdayOf(date: string): number {
  const day = Number(date.slice(-2));
  return Math.floor((day - 1) / 7) + 1;
}

/** 그 달의 `nth`번째 `weekday` 날짜. 없으면 `null` (다섯째 주가 없는 달) */
function dateOfNthWeekday(
  year: number,
  month: number,
  weekday: number,
  nth: number,
): string | null {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const day = 1 + ((weekday - firstWeekday + 7) % 7) + (nth - 1) * 7;
  return day <= daysInMonth(year, month) ? ymd(year, month, day) : null;
}

/** 시간대가 겹치는가 (끝과 시작이 맞닿는 건 겹침 아님 — 10:00 종료 / 10:00 시작은 허용) */
export function overlaps(a: Occurrence, b: { startTime: string; endTime: string }): boolean {
  return a.startTime < b.endTime && b.startTime < a.endTime;
}

export type Conflict = { date: string; roomId: string; reservation: PublicReservation };

/**
 * 겹침 찾기 — **A안**: 취소되지 않은 예약이 그 시간을 점유한다 (2026-09-19 확정).
 * 승인 단계가 없으므로 달력에 있는 모든 예약이 곧 점유다.
 *
 * 최종 방어선은 DB의 exclusion constraint다 (`context/03-data-model.md` §11).
 * 이 함수는 **사용자에게 어디가 막혔는지 알려주기 위한 것** — 동시 제출 레이스는 DB가 막는다.
 */
export function findConflicts(
  occurrences: Occurrence[],
  roomIds: string[],
  existing: PublicReservation[],
): Conflict[] {
  const conflicts: Conflict[] = [];
  for (const occurrence of occurrences) {
    for (const roomId of roomIds) {
      for (const reservation of existing) {
        if (reservation.roomId !== roomId || reservation.date !== occurrence.date) continue;
        if (overlaps(occurrence, reservation)) {
          conflicts.push({ date: occurrence.date, roomId, reservation });
        }
      }
    }
  }
  return conflicts;
}

/* ────────────────────────────── 목업 데이터 ──────────────────────────────
   현행 게시판(`/Board/Index/25484`)의 실제 신청 패턴을 옮겼다 — 여전도회·학교·대학부가
   교육실과 홀을 주로 쓰고, 한 건이 여러 교육실을 잡는 경우가 흔하다.
   날짜는 "오늘 기준 상대값"으로 만들어 언제 열어도 이번 달에 뭔가 보이게 한다. */

const T = todayInSeoul();
const mock = (
  offset: number,
  roomId: string,
  org: string,
  purpose: string,
  startTime: string,
  endTime: string,
  recurrenceGroupId?: string,
): PublicReservation => ({
  id: `${roomId}-${offset}-${startTime}`,
  roomId,
  org,
  purpose,
  date: addDays(T, offset),
  startTime,
  endTime,
  recurrenceGroupId,
});

export const MOCK_RESERVATIONS: PublicReservation[] = [
  mock(2, 'edu-2', '36여전도회', '월례회', '10:00', '12:00'),
  mock(2, 'edu-3', '별들의학교후원회', '임원 모임', '14:00', '16:00'),
  mock(3, 'trinity-hall', '경복여고', '전교생 예배', '09:00', '11:00'),
  mock(5, 'edu-1', '샬롬대학부', '조장 성경공부', '13:00', '15:00'),
  mock(5, 'edu-7', '샬롬대학부', '새내기 모임', '13:00', '15:00'),
  mock(6, 'union-meeting', '경향관관리위원회', '정기 회의', '19:00', '20:00'),
  mock(7, 'gym', '남자풋살 동호회', '주간 운동', '19:00', '20:00', 'futsal-weekly'),
  mock(14, 'gym', '남자풋살 동호회', '주간 운동', '19:00', '20:00', 'futsal-weekly'),
  mock(21, 'gym', '남자풋살 동호회', '주간 운동', '19:00', '20:00', 'futsal-weekly'),
  mock(9, 'vision-hall', '여전도회연합회', '찬양·율동 경연대회 리허설', '14:00', '18:00'),
  mock(12, 'playground', '경복비즈니스고등학교', '체육대회', '08:00', '13:00'),
  mock(16, 'edu-8', '49여전도회', '성경공부', '10:00', '12:00'),
];
