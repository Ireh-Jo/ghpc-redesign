'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROOMS_IN_USE, WEEKDAY_LABELS, todayInSeoul, type PublicReservation } from '@/lib/reservations';
import { roomName } from '@/lib/rooms';

/**
 * 시설 예약 월간 달력 — 빈 시간을 눈으로 확인하고 신청하게 한다.
 * 정책: `context/features/reservation.md` §결정 잠금 (2026-09-19) · 스펙: context/components/interactive/reservation-calendar.md
 *
 * **표시는 공개 정보만** — 장소·이용기관·용도·시간. 이름·연락처는 관리자 화면에서만 본다
 * (담당자 확정 사항). 그래서 `PublicReservation` 타입 자체에 PII가 없다.
 */
export function ReservationCalendar({ reservations }: { reservations: PublicReservation[] }) {
  const today = todayInSeoul();
  const [cursor, setCursor] = useState(() => today.slice(0, 7)); // `YYYY-MM`
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [openDate, setOpenDate] = useState<string | null>(null);

  const visible = useMemo(
    () => reservations.filter((r) => roomFilter === 'all' || r.roomId === roomFilter),
    [reservations, roomFilter],
  );

  const byDate = useMemo(() => {
    const map = new Map<string, PublicReservation[]>();
    for (const reservation of visible) {
      const list = map.get(reservation.date) ?? [];
      list.push(reservation);
      map.set(reservation.date, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return map;
  }, [visible]);

  const [year, month] = cursor.split('-').map(Number);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${cursor}-${String(i + 1).padStart(2, '0')}`),
  ];

  const shiftMonth = (delta: number) => {
    const next = new Date(Date.UTC(year, month - 1 + delta, 1));
    setCursor(next.toISOString().slice(0, 7));
    setOpenDate(null);
  };

  const monthLabel = `${year}년 ${month}월`;
  const openList = openDate ? (byDate.get(openDate) ?? []) : [];

  return (
    <div>
      {/* 월 이동 + 장소 필터 */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="이전 달"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-line text-brand-ink transition-colors duration-200 hover:border-brand-accent hover:text-brand-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p aria-live="polite" className="min-w-[8.5rem] text-center text-[18px] font-bold text-brand-ink md:text-[20px]">
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="다음 달"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-line text-brand-ink transition-colors duration-200 hover:border-brand-accent hover:text-brand-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCursor(today.slice(0, 7));
              setOpenDate(null);
            }}
            className="btn-round ml-1 border border-brand-line px-3 py-2 text-[13px] font-bold text-brand-ink-muted transition-colors duration-200 hover:text-brand-ink"
          >
            오늘
          </button>
        </div>

        <label className="flex items-center gap-2 text-[13px] text-brand-ink-muted">
          장소
          <select
            value={roomFilter}
            onChange={(e) => {
              setRoomFilter(e.target.value);
              setOpenDate(null);
            }}
            className="btn-round border border-brand-line bg-brand-surface px-3 py-2 text-[13px] font-bold text-brand-ink"
          >
            <option value="all">전체</option>
            {ROOMS_IN_USE.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 요일 머리 */}
      <div className="grid grid-cols-7 border-b border-brand-line pb-2 text-center text-[12px] font-bold text-brand-ink-muted">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      {/* 날짜 칸 */}
      <div className="grid grid-cols-7 gap-px bg-brand-line">
        {cells.map((date, i) => {
          if (!date) return <div key={`pad-${i}`} className="min-h-[76px] bg-brand-bg md:min-h-[104px]" />;
          const list = byDate.get(date) ?? [];
          const day = Number(date.slice(-2));
          const isToday = date === today;
          const isPast = date <= today; // 당일·과거는 신청 불가 (정책)
          return (
            <button
              key={date}
              type="button"
              onClick={() => setOpenDate(openDate === date ? null : date)}
              aria-expanded={openDate === date}
              className={cn(
                'min-h-[76px] bg-brand-surface p-2 text-left align-top transition-colors duration-200 hover:bg-brand-bg md:min-h-[104px] md:p-2.5',
                isPast && 'bg-brand-bg/60',
                openDate === date && 'ring-2 ring-inset ring-brand-accent',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-bold',
                  isToday ? 'bg-brand-accent text-white' : isPast ? 'text-brand-ink-muted' : 'text-brand-ink',
                )}
              >
                {day}
              </span>
              <span className="mt-1 block space-y-0.5">
                {list.slice(0, 2).map((reservation) => (
                  <span
                    key={reservation.id}
                    className="block truncate rounded bg-brand-accent/10 px-1.5 py-0.5 text-[11px] leading-tight text-brand-accent"
                  >
                    {reservation.startTime} {reservation.org}
                  </span>
                ))}
                {list.length > 2 && (
                  <span className="block px-1.5 text-[11px] text-brand-ink-muted">
                    +{list.length - 2}건
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* 선택한 날짜의 예약 목록 */}
      {openDate && (
        <div className="mt-5 rounded-2xl border border-brand-line bg-brand-surface p-5 md:p-6">
          <p className="text-[15px] font-bold text-brand-ink">
            {openDate.replace(/-/g, '.')} ({WEEKDAY_LABELS[new Date(`${openDate}T00:00:00Z`).getUTCDay()]})
          </p>
          {openList.length === 0 ? (
            <p className="mt-2 text-[14px] text-brand-ink-muted">등록된 예약이 없습니다.</p>
          ) : (
            <ul className="mt-3 divide-y divide-brand-line">
              {openList.map((reservation) => (
                <li key={reservation.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3">
                  <span className="text-[14px] font-bold text-brand-accent">
                    {reservation.startTime}–{reservation.endTime}
                  </span>
                  <span className="text-[14px] font-bold text-brand-ink">
                    {roomName(reservation.roomId)}
                  </span>
                  <span className="text-[14px] text-brand-ink">{reservation.org}</span>
                  <span className="text-[13px] text-brand-ink-muted">{reservation.purpose}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {visible.length === 0 && (
        <p className="mt-5 text-[14px] text-brand-ink-muted">
          조건에 맞는 예약이 없습니다. 날짜를 눌러 비어 있는 시간을 확인하세요.
        </p>
      )}
    </div>
  );
}
