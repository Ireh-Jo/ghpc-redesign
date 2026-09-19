import { z } from 'zod';
import { ROOMS } from '@/lib/rooms';
import {
  CLOSE_TIME,
  MAX_OCCURRENCES,
  MAX_REPEAT_COUNT,
  OPEN_TIME,
  expandOccurrences,
  isBookableDate,
  isWithinOperatingHours,
  usesRepeatCount,
} from '@/lib/reservations';

/**
 * 시설 이용 신청 스키마 — 정책 단일 출처: `context/features/reservation.md` §결정 잠금 (2026-09-19).
 *
 * 필드 골격은 현행 `시설이용신청`(`/Board/Index/25484`)을 그대로 따르고, 확정된 정책에서 생긴 것만 얹었다:
 * 장소 **복수 선택** · **주간 반복** · **취소 비밀번호** · Turnstile 토큰.
 *
 * 날짜·시간·겹침 규칙은 `lib/reservations.ts`의 순수 함수를 불러 쓴다 — 화면과 서버가 같은 판정을 하게.
 * (겹침 자체는 기존 예약 목록이 필요해서 스키마 밖에서 검사한다. 최종 방어선은 DB exclusion constraint.)
 */

const ROOM_IDS = ROOMS.map((room) => room.id) as [string, ...string[]];

export const reservationSchema = z
  .object({
    roomIds: z
      .array(z.enum(ROOM_IDS))
      .min(1, '장소를 한 곳 이상 선택해주세요')
      .max(ROOMS.length),
    startDate: z.string().min(1, '시작일을 선택해주세요'),
    endDate: z.string().min(1, '종료일을 선택해주세요'),
    startTime: z.string().min(1, '시작 시각을 입력해주세요'),
    endTime: z.string().min(1, '종료 시각을 입력해주세요'),
    /** 반복 방식 — 일(기간)·주중·매주·매월 2종 (2026-09-19 담당자 피드백) */
    repeatMode: z.enum(['none', 'weekdays', 'weekly', 'monthlyDate', 'monthlyWeekday']),
    /**
     * 반복 횟수 — **문자열**로 받는다. `z.coerce`/`.default()`를 쓰면 zod의 입력 타입과 출력 타입이
     * 갈라져 `react-hook-form`의 resolver 타입과 맞지 않는다 (`headcount`와 같은 방식으로 통일).
     * 기간 방식(`none`·`weekdays`)에서는 쓰이지 않는다 — 종료일이 회차를 정한다.
     */
    repeatCount: z
      .string()
      .trim()
      .regex(/^[0-9]+$/, '반복 횟수는 숫자로 입력해주세요')
      .refine((v) => Number(v) >= 1 && Number(v) <= MAX_REPEAT_COUNT, {
        message: `반복은 1~${MAX_REPEAT_COUNT}회까지 신청할 수 있습니다`,
      }),
    org: z.string().trim().min(1, '이용기관을 입력해주세요').max(100),
    headcount: z
      .string()
      .trim()
      .regex(/^[0-9]+$/, '인원은 숫자로 입력해주세요')
      .max(5),
    purpose: z.string().trim().min(1, '이용 용도를 입력해주세요').max(200),
    facilityNote: z.string().trim().max(1000, '1000자 이내로 입력해주세요').optional(),
    applicantName: z.string().trim().min(1, '제출자 이름을 입력해주세요').max(50),
    applicantPhone: z
      .string()
      .trim()
      .regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, '010-1234-5678 형식으로 입력해주세요'),
    pastor: z.string().trim().min(1, '담당 교역자를 입력해주세요').max(50),
    /** 본인 취소용. 평문은 서버까지만 오고 **해시로만 저장**한다 (`03-data-model.md` §11) */
    cancelPassword: z
      .string()
      .min(4, '취소 비밀번호는 4자 이상으로 정해주세요')
      .max(64, '64자 이내로 입력해주세요'),
    consentPrivacy: z.boolean().refine((v) => v === true, '개인정보 수집·이용 동의가 필요합니다'),
    /** Cloudflare Turnstile 토큰 — 서버에서 검증한다 */
    captchaToken: z.string().min(1, '보안문구 확인을 완료해주세요'),
  })
  .refine((v) => v.endDate >= v.startDate, {
    message: '종료일은 시작일 이후여야 합니다',
    path: ['endDate'],
  })
  // 당일·과거 차단 (2026-09-19 확정) — 시작일만 보면 된다. 종료일은 시작일 이후로 이미 강제됨
  .refine((v) => isBookableDate(v.startDate), {
    message: '당일과 지난 날짜는 신청할 수 없습니다. 하루 이상 앞선 날짜를 선택해주세요',
    path: ['startDate'],
  })
  .refine((v) => isWithinOperatingHours(v.startTime, v.endTime), {
    message: `이용 시간은 ${OPEN_TIME}~${CLOSE_TIME} 안에서, 종료가 시작보다 늦게 입력해주세요`,
    path: ['endTime'],
  })
  // 횟수 기반 반복(매주·매월)은 시작일 하나로 회차를 만든다 — 기간을 같이 넓히면 의도가 모호해진다
  .refine((v) => !usesRepeatCount(v.repeatMode) || v.startDate === v.endDate, {
    message: '매주·매월 반복은 기간을 하루로 두세요 (반복 횟수로 날짜가 만들어집니다)',
    path: ['endDate'],
  })
  // 주중 반복인데 기간에 평일이 하나도 없는 경우 (주말만 고른 기간)
  .refine(
    (v) => expandOccurrences({ ...v, repeatCount: Number(v.repeatCount) }).length > 0,
    { message: '선택한 기간에 신청할 수 있는 날이 없습니다. 기간을 다시 확인해주세요', path: ['endDate'] },
  )
  .refine(
    (v) => {
      const occurrences = expandOccurrences({ ...v, repeatCount: Number(v.repeatCount) });
      return occurrences.every((o) => isBookableDate(o.date)) && occurrences.length <= MAX_OCCURRENCES;
    },
    { message: '신청 회차의 날짜를 다시 확인해주세요', path: ['repeatCount'] },
  );

export type ReservationInput = z.infer<typeof reservationSchema>;

/** 취소 — 신청 시 정한 비밀번호로 본인 확인. **수정은 없다 (취소 후 재신청)** */
export const reservationCancelSchema = z.object({
  reservationId: z.string().min(1),
  cancelPassword: z.string().min(1, '비밀번호를 입력해주세요').max(64),
  captchaToken: z.string().min(1, '보안문구 확인을 완료해주세요'),
});

export type ReservationCancelInput = z.infer<typeof reservationCancelSchema>;
