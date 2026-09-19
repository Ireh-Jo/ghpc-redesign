'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck, X } from 'lucide-react';
import { Input } from '@/components/primitives/input';
import { Button } from '@/components/primitives/button';
import { toast } from '@/components/primitives/toast';
import { cancelReservation } from '@/app/_actions/reservation';
import { roomName } from '@/lib/rooms';
import { WEEKDAY_LABELS, weekdayOf, type PublicReservation } from '@/lib/reservations';

/**
 * 예약 취소 — 달력의 날짜 상세에서 연다. 스펙: context/components/interactive/reservation-cancel.md
 * 정책: `context/features/reservation.md` §결정 잠금 (2026-09-19).
 *
 * **단건이면 범위를 묻지 않는다.** 반복 예약(남은 회차 2건 이상)일 때만 `이 회차만 / 남은 회차 전부`를 고른다.
 * 기본값은 덜 위험한 "이 회차만" — 전체 취소는 그 시간대를 모두에게 여는 행동이라 되돌릴 수 없다.
 *
 * 수정 기능은 없다 (정책: 취소 후 재신청).
 */
export function ReservationCancel({
  reservation,
  remaining,
  onClose,
}: {
  reservation: PublicReservation;
  /** 같은 반복 묶음에서 남은 회차 (오늘 이후). 단건이면 `null` */
  remaining: PublicReservation[] | null;
  onClose: () => void;
}) {
  const isSeries = !!remaining && remaining.length > 1;
  const [scope, setScope] = useState<'single' | 'series'>('single');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }
    setPending(true);
    const result = await cancelReservation({
      reservationId: reservation.id,
      scope: isSeries ? scope : 'single',
      cancelPassword: password,
      // TODO(Turnstile): 사이트 키 발급 후 토큰을 넣는다. 지금은 빈 값이라 서버가 접수를 막는다
      captchaToken: '',
    });
    setPending(false);
    if (result.ok) {
      toast.success('예약이 취소됐습니다.');
      onClose();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-3 rounded-2xl border border-brand-line bg-brand-subtle p-5"
      aria-label={`${reservation.date} ${roomName(reservation.roomId)} 예약 취소`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] font-bold text-brand-ink">예약 취소</p>
          <p className="mt-1 text-[13px] leading-relaxed text-brand-ink-muted">
            {reservation.date.replace(/-/g, '.')}({WEEKDAY_LABELS[weekdayOf(reservation.date)]}){' '}
            {reservation.startTime}–{reservation.endTime} · {roomName(reservation.roomId)} ·{' '}
            {reservation.org}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="취소 창 닫기"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brand-ink-muted transition-colors duration-200 hover:bg-brand-surface hover:text-brand-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 반복 예약일 때만 범위를 묻는다 */}
      {isSeries && (
        <fieldset className="mt-4">
          <legend className="text-[13px] font-bold text-brand-ink">무엇을 취소할까요?</legend>
          <div className="mt-2 space-y-2">
            <label className="flex cursor-pointer items-start gap-2.5 text-[14px] text-brand-ink">
              <input
                type="radio"
                name={`scope-${reservation.id}`}
                checked={scope === 'single'}
                onChange={() => setScope('single')}
                className="mt-1"
              />
              <span>
                이 회차만
                <span className="block text-[13px] text-brand-ink-muted">
                  {reservation.date.replace(/-/g, '.')} 하루만 취소되고 나머지는 그대로 남습니다.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 text-[14px] text-brand-ink">
              <input
                type="radio"
                name={`scope-${reservation.id}`}
                checked={scope === 'series'}
                onChange={() => setScope('series')}
                className="mt-1"
              />
              <span>
                남은 회차 전부 ({remaining.length}건)
                <span className="block text-[13px] text-brand-ink-muted">
                  {remaining[0].date.replace(/-/g, '.')} ~{' '}
                  {remaining[remaining.length - 1].date.replace(/-/g, '.')} · 지난 회차는 그대로 둡니다.
                  되돌릴 수 없고, 그 시간대는 다른 부서가 신청할 수 있게 열립니다.
                </span>
              </span>
            </label>
          </div>
        </fieldset>
      )}

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex-1 md:max-w-xs">
          <span className="mb-1.5 block text-[13px] font-bold text-brand-ink">
            취소 비밀번호
          </span>
          <Input
            type="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="신청 때 정한 비밀번호"
          />
        </label>
        <Button type="submit" variant="destructive" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSeries && scope === 'series' ? `${remaining.length}건 취소` : '취소하기'}
        </Button>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-relaxed text-brand-ink-muted">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        내용을 바꾸시려면 취소 후 다시 신청해주세요. 수정 기능은 없습니다.
      </p>
    </form>
  );
}
