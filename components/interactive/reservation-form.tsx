'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/primitives/form';
import { Input } from '@/components/primitives/input';
import { Textarea } from '@/components/primitives/textarea';
import { Checkbox } from '@/components/primitives/checkbox';
import { Button } from '@/components/primitives/button';
import { toast } from '@/components/primitives/toast';
import { submitReservation } from '@/app/_actions/reservation';
import { reservationSchema, type ReservationInput } from '@/lib/schemas/reservation';
import { ROOM_GROUPS, roomName, roomsByGroup } from '@/lib/rooms';
import {
  CLOSE_TIME,
  MAX_REPEAT_COUNT,
  OPEN_TIME,
  WEEKDAY_LABELS,
  expandOccurrences,
  findConflicts,
  todayInSeoul,
  weekdayOf,
  type PublicReservation,
} from '@/lib/reservations';

/**
 * 시설 이용 신청 폼 (전용). 정책: `context/features/reservation.md` §결정 잠금 (2026-09-19).
 * 스펙: context/components/interactive/reservation-form.md
 *
 * 공용 렌더러(`ApplyForm`)를 쓰지 않는 이유: 기간·주간반복·복수 장소·비밀번호·캡차가
 * 그 폼 정의 모델(text/select/textarea)로 표현되지 않는다.
 *
 * **수정 기능은 없다** — 정책상 취소 후 재신청 (2026-09-18 TF 제안 → 사용자 승인).
 */

function RequiredMark() {
  return (
    <>
      <span aria-hidden className="text-brand-point">
        *
      </span>
      <span className="sr-only">(필수)</span>
    </>
  );
}

/** 내일 날짜 — 당일 신청 불가라 date input의 min으로 쓴다 */
function tomorrow(): string {
  const today = todayInSeoul();
  const [y, m, d] = today.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

export function ReservationForm({ reservations }: { reservations: PublicReservation[] }) {
  const [submitted, setSubmitted] = useState(false);
  const minDate = useRef(tomorrow());

  const form = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      roomIds: [],
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      repeatWeekly: false,
      repeatCount: '1',
      org: '',
      headcount: '',
      purpose: '',
      facilityNote: '',
      applicantName: '',
      applicantPhone: '',
      pastor: '',
      cancelPassword: '',
      consentPrivacy: false,
      captchaToken: '',
    },
  });

  const values = form.watch();

  // 시작일을 고르면 종료일을 같은 날로 맞춰 준다 (하루 신청이 대다수)
  useEffect(() => {
    if (values.startDate && !values.endDate) form.setValue('endDate', values.startDate);
  }, [values.startDate, values.endDate, form]);

  /** 입력한 조건이 기존 예약과 겹치는지 — 제출 전에 미리 보여준다 (최종 판정은 DB) */
  const conflicts = useMemo(() => {
    if (!values.startDate || !values.startTime || !values.endTime || values.roomIds.length === 0) {
      return [];
    }
    const occurrences = expandOccurrences({
      startDate: values.startDate,
      endDate: values.endDate || values.startDate,
      startTime: values.startTime,
      endTime: values.endTime,
      repeatWeekly: values.repeatWeekly,
      repeatCount: Number(values.repeatCount),
    });
    return findConflicts(occurrences, values.roomIds, reservations);
  }, [values, reservations]);

  const occurrenceCount = useMemo(() => {
    if (!values.startDate || !values.startTime || !values.endTime) return 0;
    return expandOccurrences({
      startDate: values.startDate,
      endDate: values.endDate || values.startDate,
      startTime: values.startTime,
      endTime: values.endTime,
      repeatWeekly: values.repeatWeekly,
      repeatCount: Number(values.repeatCount),
    }).length;
  }, [values]);

  async function onSubmit(input: ReservationInput) {
    if (conflicts.length > 0) {
      toast.error('이미 예약된 시간이 있습니다. 아래 안내를 확인해주세요.');
      return;
    }
    const result = await submitReservation(input);
    if (result.ok) {
      setSubmitted(true);
      toast.success('신청이 접수됐습니다.');
    } else {
      toast.error(result.error);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-line bg-brand-surface p-8 text-center md:p-10">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand-support" />
        <p className="mt-4 text-[18px] font-bold text-brand-ink">신청이 접수됐습니다</p>
        <p className="mt-2 text-[14px] leading-relaxed text-brand-ink-muted">
          달력에 바로 표시됩니다. 취소가 필요하면 신청 때 정한 비밀번호로 직접 취소하실 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ── 장소 (복수 선택) ── */}
        <FormField
          control={form.control}
          name="roomIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                장소 <RequiredMark />
              </FormLabel>
              <FormDescription>
                여러 곳을 함께 쓰실 수 있습니다. 장소별로 예약이 나뉘어 달력에 표시됩니다.
              </FormDescription>
              <div className="mt-3 space-y-4">
                {ROOM_GROUPS.map((group) => (
                  <fieldset key={group}>
                    <legend className="mb-2 text-[12px] font-bold tracking-[0.15em] text-brand-ink-muted">
                      {group}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {roomsByGroup(group).map((room) => {
                        const checked = field.value.includes(room.id);
                        return (
                          <label
                            key={room.id}
                            className={`btn-round cursor-pointer border px-3.5 py-2 text-[13px] font-bold transition-colors duration-200 ${
                              checked
                                ? 'border-brand-accent bg-brand-accent text-white'
                                : 'border-brand-line text-brand-ink hover:border-brand-accent'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.checked
                                    ? [...field.value, room.id]
                                    : field.value.filter((id: string) => id !== room.id),
                                )
                              }
                            />
                            {room.name}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── 기간 · 시간 ── */}
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  시작일 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input type="date" min={minDate.current} {...field} />
                </FormControl>
                <FormDescription>당일·지난 날짜는 신청할 수 없습니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  종료일 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={values.startDate || minDate.current}
                    disabled={values.repeatWeekly}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {values.repeatWeekly ? '주간 반복을 쓰면 회차로 날짜가 만들어집니다.' : '하루만 쓰시면 시작일과 같게 두세요.'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  시작 시각 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input type="time" min={OPEN_TIME} max={CLOSE_TIME} step={600} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  종료 시각 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input type="time" min={OPEN_TIME} max={CLOSE_TIME} step={600} {...field} />
                </FormControl>
                <FormDescription>
                  이용 가능 시간 {OPEN_TIME}~{CLOSE_TIME}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── 주간 반복 ── */}
        <div className="rounded-2xl border border-brand-line bg-brand-subtle p-5">
          <FormField
            control={form.control}
            name="repeatWeekly"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                        if (checked === true && values.startDate) {
                          form.setValue('endDate', values.startDate);
                        }
                      }}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="cursor-pointer">매주 반복해서 신청</FormLabel>
                    <FormDescription>
                      같은 요일·같은 시간으로 여러 주를 한 번에 신청합니다. 사이 날짜는 비어 있어 다른 부서가 쓸 수 있습니다.
                    </FormDescription>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {values.repeatWeekly && (
            <FormField
              control={form.control}
              name="repeatCount"
              render={({ field }) => (
                <FormItem className="mt-4 max-w-[14rem]">
                  <FormLabel>반복 횟수</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" min={1} max={MAX_REPEAT_COUNT} {...field} />
                  </FormControl>
                  <FormDescription>
                    {values.startDate
                      ? `매주 ${WEEKDAY_LABELS[weekdayOf(values.startDate)]}요일 · 최대 ${MAX_REPEAT_COUNT}회`
                      : `최대 ${MAX_REPEAT_COUNT}회`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* ── 신청 내용 미리보기 · 겹침 안내 ── */}
        {occurrenceCount > 0 && (
          <div
            className={`rounded-2xl border p-5 ${
              conflicts.length > 0
                ? 'border-brand-point/40 bg-brand-point/5'
                : 'border-brand-support/40 bg-brand-support/5'
            }`}
          >
            <p className="text-[14px] font-bold text-brand-ink">
              {conflicts.length > 0
                ? '이미 예약된 시간이 있습니다'
                : `신청 예정 ${occurrenceCount}회 · 장소 ${values.roomIds.length}곳 — 겹치는 예약 없음`}
            </p>
            {conflicts.length > 0 && (
              <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-brand-ink">
                {conflicts.slice(0, 6).map((conflict, i) => (
                  <li key={`${conflict.date}-${conflict.roomId}-${i}`}>
                    · {conflict.date.replace(/-/g, '.')} {roomName(conflict.roomId)}{' '}
                    {conflict.reservation.startTime}–{conflict.reservation.endTime}{' '}
                    <span className="text-brand-ink-muted">({conflict.reservation.org})</span>
                  </li>
                ))}
                {conflicts.length > 6 && (
                  <li className="text-brand-ink-muted">그 외 {conflicts.length - 6}건</li>
                )}
              </ul>
            )}
          </div>
        )}

        {/* ── 이용 정보 ── */}
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="org"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이용기관 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input placeholder="예: 36여전도회" {...field} />
                </FormControl>
                <FormDescription>달력에 공개되는 항목입니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="headcount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  인원 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input inputMode="numeric" placeholder="20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                이용 용도 <RequiredMark />
              </FormLabel>
              <FormControl>
                <Input placeholder="예: 월례회" {...field} />
              </FormControl>
              <FormDescription>달력에 공개되는 항목입니다.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facilityNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이용 시설 및 요청사항</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="필요한 기자재나 요청사항을 적어주세요." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── 신청자 (개인정보) ── */}
        <div className="grid gap-5 md:grid-cols-3">
          <FormField
            control={form.control}
            name="applicantName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  제출자 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="applicantPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  연락처 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input inputMode="tel" placeholder="010-1234-5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pastor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  담당 교역자 <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="text-[13px] leading-relaxed text-brand-ink-muted">
          제출자 이름과 연락처는 <strong className="font-bold text-brand-ink">달력에 공개되지 않습니다.</strong>{' '}
          관리자만 확인합니다.
        </p>

        {/* ── 취소 비밀번호 ── */}
        <FormField
          control={form.control}
          name="cancelPassword"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>
                취소 비밀번호 <RequiredMark />
              </FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormDescription>
                이 비밀번호로 직접 취소하실 수 있습니다. <strong>수정 기능은 없어</strong> 내용을 바꾸려면
                취소하고 다시 신청해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── 보안문구 (Turnstile) ── */}
        <div className="rounded-2xl border border-brand-line bg-brand-subtle p-5">
          <p className="flex items-center gap-2 text-[14px] font-bold text-brand-ink">
            <ShieldCheck className="h-4 w-4 text-brand-accent" />
            보안문구 확인
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-brand-ink-muted">
            매크로 신청을 막기 위한 절차입니다.{' '}
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
              ? '아래 확인을 완료해주세요.'
              : '준비 중입니다 — Cloudflare Turnstile 사이트 키가 등록되면 이 자리에 확인 위젯이 표시됩니다.'}
          </p>
          {/* TODO(Turnstile): 사이트 키 발급 후 위젯 마운트 + 토큰을 captchaToken에 set.
              키가 없는 동안은 토큰이 비어 있어 zod가 제출을 막는다 (의도된 동작). */}
          <FormField
            control={form.control}
            name="captchaToken"
            render={() => (
              <FormItem className="mt-3">
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── 동의 ── */}
        <FormField
          control={form.control}
          name="consentPrivacy"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                </FormControl>
                <div>
                  <FormLabel className="cursor-pointer">
                    개인정보 수집·이용 동의 <RequiredMark />
                  </FormLabel>
                  <FormDescription>
                    시설 이용 확인·연락 목적으로 이름·연락처를 수집합니다. 보유기간·문의처는{' '}
                    <a href="/privacy" className="link-wipe font-bold text-brand-ink">
                      개인정보처리방침
                    </a>
                    을 확인해주세요.
                  </FormDescription>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="w-full md:w-auto">
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          시설 이용 신청하기
        </Button>
      </form>
    </Form>
  );
}
