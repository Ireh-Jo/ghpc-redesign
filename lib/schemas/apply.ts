import { z } from 'zod';

/**
 * 신청 폼 스키마 — 클라이언트(zodResolver) + Server Action 재검증 단일 출처
 * (`guardrails/00-rules.md` DO#5, `context/features/form-handling.md`).
 *
 * ── 필드 구성 근거 (2026-08-23) ──
 * 현행 사이트(ghpc.or.kr)의 같은 폼을 **필드 단위로 그대로 옮겼다** (사용자 지시:
 * "e교회행정도 입력폼 구성 똑같이 따라가면 될 것 같아"). 전수 조사 결과는
 * `docs/meetings/2026-08-23-현행사이트-메뉴-전수분석.md`.
 * 바꾼 것은 입력 방식뿐 — 오전/오후 + 시 select + 분 select 3단 → `type="time"` 하나.
 * 수집 항목·필수 여부는 현행과 동일하다.
 *
 * 저장 테이블: `form_submissions` (form_type으로 구분, `context/03-data-model.md` §9).
 */

/** 현행 폼들이 공통으로 받는 연락처 형식 */
const phone = z
  .string()
  .trim()
  .regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, '010-1234-5678 형식으로 입력해주세요');

const required = (label: string, max = 100) =>
  z.string().trim().min(1, `${label}을(를) 입력해주세요`).max(max, `${max}자 이내로 입력해주세요`);

const consentPrivacy = z
  .boolean()
  .refine((v) => v === true, '개인정보 수집·이용 동의가 필요합니다');

/** 금액 — 빈 값 허용, 숫자만 (현행은 "매월 ___ 원" text) */
const amount = z
  .string()
  .trim()
  .regex(/^[0-9,]*$/, '숫자만 입력해주세요')
  .optional();

/** 1. 영상제작신청 (현행 `/Page/Index/25630`) */
export const videoRequestSchema = z.object({
  org: required('기관'),
  pastor: required('담당 교역자', 50),
  name: required('신청자 이름', 50),
  phone,
  showDate: required('상영 날짜', 20),
  showTime: required('상영 시각', 60),
  meetingDate: required('회의 날짜', 20),
  meetingTime: required('회의 시각', 60),
  videoType: required('영상 종류', 60),
  detail: z.string().trim().max(1000, '1000자 이내로 입력해주세요').optional(),
  consentPrivacy,
});

/** 2. 3대 후원회원 작정 (현행 `/Page/Index/18269`) */
export const SPONSOR_FUNDS = [
  { key: 'mission', label: '경향선교회 후원' },
  { key: 'gts', label: '제네바신학대학원 후원' },
  { key: 'stars', label: '별들의 학교 후원' },
] as const;

export const sponsorPledgeSchema = z
  .object({
    district: z.string().trim().max(50).optional(),
    position: z.string().trim().max(30).optional(),
    // 현행 안내: 주일학교 및 S.F.C.는 이름 뒤에 부모 이름을 함께 적는다
    name: required('이름', 50),
    phone,
    missionGeneral: amount,
    missionSpecial: amount,
    gtsGeneral: amount,
    gtsSpecial: amount,
    starsGeneral: amount,
    starsSpecial: amount,
    /** 3대 후원회 중 교회가 지정 — 현행 "특별회원 미정" */
    undecidedSpecial: amount,
    consentPrivacy,
  })
  .refine(
    (v) =>
      [
        v.missionGeneral,
        v.missionSpecial,
        v.gtsGeneral,
        v.gtsSpecial,
        v.starsGeneral,
        v.starsSpecial,
        v.undecidedSpecial,
      ].some((a) => !!a && a.replace(/[^0-9]/g, '') !== ''),
    { message: '후원 금액을 한 곳 이상 입력해주세요', path: ['missionGeneral'] }
  );

/** 3. 평생교육원 수강신청 (현행 `/Page/Index/11185`) */
export const STUDENT_TYPES = ['경향교회 성도', '타교인', '지역 주민'] as const;
export const LECTURES = [
  '평생교육원 성경아카데미',
  '모세대학',
  '부부성경공부',
  '별들의 학교',
] as const;

export const lifelongEduSchema = z.object({
  name: required('이름', 50),
  phone,
  email: z.union([z.literal(''), z.email('이메일 형식을 확인해주세요')]).optional(),
  studentType: z.enum(STUDENT_TYPES, { error: '수강생 구분을 선택해주세요' }),
  district: required('교구(지역)', 50),
  lectures: z.array(z.enum(LECTURES)).min(1, '신청 강의를 하나 이상 선택해주세요'),
  consentPrivacy,
});

export type VideoRequestInput = z.infer<typeof videoRequestSchema>;
export type SponsorPledgeInput = z.infer<typeof sponsorPledgeSchema>;
export type LifelongEduInput = z.infer<typeof lifelongEduSchema>;

/** `form_submissions.form_type` 값 */
export const APPLY_SCHEMAS = {
  video_request: videoRequestSchema,
  sponsor_pledge: sponsorPledgeSchema,
  lifelong_edu: lifelongEduSchema,
} as const;

export type ApplyFormType = keyof typeof APPLY_SCHEMAS;
