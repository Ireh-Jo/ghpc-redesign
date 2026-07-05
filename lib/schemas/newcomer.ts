import { z } from 'zod';

/**
 * 새가족 등록 폼 스키마 — 클라이언트(zodResolver) + Server Action 재검증 단일 출처
 * (guardrails/00-rules.md DO#5, context/features/form-handling.md).
 *
 * DECISION NEEDED: 화면정의서 미수령 — 필드 구성은 context/03-data-model.md §8 잠정 컬럼 기준.
 * 확정본 반영 시 이 파일만 수정하면 폼·서버 검증 동시 갱신.
 */

export const AGE_GROUPS = ['장년', '청년', '대학', '중고등', '주일학교'] as const;

export const newcomerSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해주세요').max(50, '이름은 50자 이내로 입력해주세요'),
  phone: z
    .string()
    .trim()
    .regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, '010-1234-5678 형식으로 입력해주세요'),
  ageGroup: z.enum(AGE_GROUPS, { error: '소속을 선택해주세요' }),
  referral: z.string().trim().max(200, '200자 이내로 입력해주세요').optional(),
  consentPrivacy: z
    .boolean()
    .refine((v) => v === true, '개인정보 처리방침 동의가 필요합니다'),
  consentMarketing: z.boolean().optional(),
  note: z.string().trim().max(500, '500자 이내로 입력해주세요').optional(),
});

export type NewcomerInput = z.infer<typeof newcomerSchema>;
