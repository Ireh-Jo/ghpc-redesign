import { z } from 'zod';

/**
 * 시설 이용 신청 스키마 — `context/features/reservation.md` · `context/03-data-model.md` §10·§11.
 *
 * 필드는 현행 `시설이용신청`(`/Board/Index/25484`)을 그대로 옮겼다 (2026-08-23).
 * 현행의 오전/오후 + 시 + 분 3단 select만 `type="date"` / `type="time"`으로 바꿨고
 * 수집 항목·필수 여부는 동일하다.
 *
 * > DECISION NEEDED: `place`는 현행처럼 자유 입력 text로 둔다. `rooms` 마스터(§10)의
 * > 장소 목록이 회의에서 확정되면 select로 교체한다 — 그때 이 파일만 수정.
 * > DECISION NEEDED: 겹침 방지 규칙(A/B안)·3일 전 마감·반복 신청은 회의 대기라 폼에 넣지 않았다.
 */

export const reservationSchema = z
  .object({
    startDate: z.string().min(1, '시작일을 선택해주세요'),
    endDate: z.string().min(1, '종료일을 선택해주세요'),
    startTime: z.string().min(1, '시작 시각을 입력해주세요'),
    endTime: z.string().min(1, '종료 시각을 입력해주세요'),
    place: z.string().trim().min(1, '장소를 입력해주세요').max(100),
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
    consentPrivacy: z.boolean().refine((v) => v === true, '개인정보 수집·이용 동의가 필요합니다'),
  })
  .refine((v) => v.endDate >= v.startDate, {
    message: '종료일은 시작일 이후여야 합니다',
    path: ['endDate'],
  });

export type ReservationInput = z.infer<typeof reservationSchema>;
