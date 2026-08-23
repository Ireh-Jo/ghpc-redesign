import type { z } from 'zod';
import type { FieldValues } from 'react-hook-form';
import {
  LECTURES,
  STUDENT_TYPES,
  lifelongEduSchema,
  sponsorPledgeSchema,
  videoRequestSchema,
  type ApplyFormType,
} from '@/lib/schemas/apply';
import { reservationSchema } from '@/lib/schemas/reservation';

/**
 * 신청 폼 화면 정의 — "어떤 입력을 어떤 순서로 받는가"의 단일 출처.
 *
 * 폼이 4종(영상제작·후원작정·평생교육원·시설이용)인데 생김새가 전부 같아서,
 * 폼마다 JSX를 복붙하지 않고 **필드 서술 → `ApplyForm`이 렌더**하는 구조로 뒀다.
 * 필드가 바뀌면 여기 배열과 `lib/schemas/*`만 고치면 된다.
 *
 * 필드 구성 근거: 현행 사이트 동일 폼 전수 조사
 * (`docs/meetings/2026-08-23-현행사이트-메뉴-전수분석.md`).
 */

export type FieldDef = {
  name: string;
  label: string;
  kind: 'text' | 'tel' | 'email' | 'date' | 'time' | 'textarea' | 'select' | 'checkboxGroup' | 'money';
  required?: boolean;
  placeholder?: string;
  /** 라벨 아래 보조 설명 (현행 폼의 괄호 안내문) */
  hint?: string;
  /** select · checkboxGroup 선택지 */
  options?: readonly string[];
  /** 2열 배치 (좁은 입력) */
  half?: boolean;
  /** 소제목 — 이 필드부터 새 묶음 시작 */
  groupLabel?: string;
};

export type FormDef = {
  /** `form_submissions.form_type` (시설 예약은 `reservations` 테이블) */
  id: ApplyFormType | 'reservation';
  /** 페이지 안 앵커 id */
  anchor: string;
  title: string;
  lead?: string;
  /** 현행 사이트 같은 폼 — 이관 전 대조용 */
  legacy?: string;
  /** RHF zodResolver에 그대로 넘긴다 — 폼마다 다른 스키마를 한 타입으로 묶기 위한 상한 */
  schema: z.ZodType<FieldValues, FieldValues>;
  defaults: Record<string, unknown>;
  fields: FieldDef[];
  submitLabel: string;
  /** 개인정보 동의 문구 — 수집 항목·목적·보유기간을 폼마다 정확히 적는다 */
  consentNote: string;
  /** 접수 후 안내 */
  successNote: string;
  /** 폼 위 주의사항 (현행 안내문) */
  notice?: string[];
};

const LEGACY = 'https://www.ghpc.or.kr';

export const VIDEO_REQUEST_FORM: FormDef = {
  id: 'video_request',
  anchor: 'video',
  title: '영상 제작 신청',
  lead: '헌신예배 영상·홍보영상 등 미디어팀 제작 요청.',
  legacy: `${LEGACY}/Page/Index/25630`,
  schema: videoRequestSchema,
  defaults: {
    org: '',
    pastor: '',
    name: '',
    phone: '',
    showDate: '',
    showTime: '',
    meetingDate: '',
    meetingTime: '',
    videoType: '',
    detail: '',
    consentPrivacy: false,
  },
  fields: [
    { name: 'org', label: '기관', kind: 'text', required: true, half: true },
    { name: 'pastor', label: '담당 교역자', kind: 'text', required: true, half: true },
    { name: 'name', label: '신청자 이름', kind: 'text', required: true, half: true },
    { name: 'phone', label: '연락처', kind: 'tel', required: true, half: true, placeholder: '010-1234-5678' },
    { name: 'showDate', label: '상영 날짜', kind: 'date', required: true, half: true, groupLabel: '상영' },
    {
      name: 'showTime',
      label: '상영 시각',
      kind: 'text',
      required: true,
      half: true,
      hint: '예: 주일밤예배 오후 7시. 상영 없이 홈페이지 업로드만 하면 "업로드"라고 적어주세요.',
    },
    { name: 'meetingDate', label: '회의 날짜', kind: 'date', required: true, half: true, groupLabel: '사전 회의' },
    { name: 'meetingTime', label: '회의 시각', kind: 'text', required: true, half: true, hint: '예: 오후 2-5시 사이' },
    {
      name: 'videoType',
      label: '영상 종류',
      kind: 'text',
      required: true,
      hint: '예: 헌신예배 영상, 홍보영상, 드라마 등',
      groupLabel: '영상 내용',
    },
    {
      name: 'detail',
      label: '원하는 영상 방향 또는 비슷한 영상의 URL',
      kind: 'textarea',
      hint: '최대한 자세하게 적어주세요. 예: 사진 슬라이드 영상 / 인터뷰 영상 / 5분 분량 드라마 / 참고 영상 주소',
    },
  ],
  submitLabel: '영상 제작 신청',
  consentNote: '수집 항목: 이름·연락처·소속 기관 · 이용 목적: 영상 제작 일정 협의 · 보유 기간: 제작 완료 후 1년',
  successNote: '미디어팀이 확인 후 회의 일정으로 연락드리겠습니다.',
};

export const SPONSOR_PLEDGE_FORM: FormDef = {
  id: 'sponsor_pledge',
  anchor: 'sponsor',
  title: '3대 후원회원 작정',
  lead: '경향선교회 · 제네바신학대학원 · 별들의 학교 후원 작정.',
  legacy: `${LEGACY}/Page/Index/18269`,
  schema: sponsorPledgeSchema,
  defaults: {
    district: '',
    position: '',
    name: '',
    phone: '',
    missionGeneral: '',
    missionSpecial: '',
    gtsGeneral: '',
    gtsSpecial: '',
    starsGeneral: '',
    starsSpecial: '',
    undecidedSpecial: '',
    consentPrivacy: false,
  },
  fields: [
    { name: 'district', label: '교구', kind: 'text', half: true },
    { name: 'position', label: '직분', kind: 'text', half: true },
    {
      name: 'name',
      label: '이름',
      kind: 'text',
      required: true,
      half: true,
      hint: '주일학교·S.F.C.는 이름 뒤에 부모님 성함을 함께 적어주세요.',
    },
    { name: 'phone', label: '연락처', kind: 'tel', required: true, half: true, placeholder: '010-1234-5678' },
    { name: 'missionGeneral', label: '일반회원 (매월)', kind: 'money', half: true, groupLabel: '경향선교회 후원' },
    { name: 'missionSpecial', label: '특별회원 (매월 · 10만원 이상)', kind: 'money', half: true },
    { name: 'gtsGeneral', label: '일반회원 (매월)', kind: 'money', half: true, groupLabel: '제네바신학대학원 후원' },
    { name: 'gtsSpecial', label: '특별회원 (매월 · 10만원 이상)', kind: 'money', half: true },
    { name: 'starsGeneral', label: '일반회원 (매월)', kind: 'money', half: true, groupLabel: '별들의 학교 후원' },
    { name: 'starsSpecial', label: '특별회원 (매월 · 10만원 이상)', kind: 'money', half: true },
    {
      name: 'undecidedSpecial',
      label: '특별회원 (매월 · 10만원 이상)',
      kind: 'money',
      half: true,
      hint: '미정으로 신청하시면 3대 후원회 중 더 필요한 곳을 교회에서 지정해 드립니다.',
      groupLabel: '후원처 미정',
    },
  ],
  submitLabel: '후원 작정 신청',
  consentNote: '수집 항목: 이름·연락처·교구·직분 · 이용 목적: 후원 작정 등록 및 안내 · 보유 기간: 작정 종료 후 1년',
  successNote: '담당 부서가 확인 후 안내드리겠습니다.',
};

export const LIFELONG_EDU_FORM: FormDef = {
  id: 'lifelong_edu',
  anchor: 'lifelong',
  title: '평생교육원 수강신청',
  lead: '성경아카데미 · 모세대학 · 부부성경공부 · 별들의 학교.',
  legacy: `${LEGACY}/Page/Index/11185`,
  schema: lifelongEduSchema,
  defaults: {
    name: '',
    phone: '',
    email: '',
    studentType: undefined,
    district: '',
    lectures: [],
    consentPrivacy: false,
  },
  fields: [
    { name: 'name', label: '이름', kind: 'text', required: true, half: true },
    { name: 'phone', label: '연락처', kind: 'tel', required: true, half: true, placeholder: '010-1234-5678' },
    { name: 'email', label: '이메일', kind: 'email', half: true },
    {
      name: 'studentType',
      label: '수강생 구분',
      kind: 'select',
      required: true,
      half: true,
      options: STUDENT_TYPES,
    },
    { name: 'district', label: '교구(지역)', kind: 'text', required: true, half: true },
    { name: 'lectures', label: '신청 강의', kind: 'checkboxGroup', required: true, options: LECTURES },
  ],
  submitLabel: '수강 신청',
  consentNote: '수집 항목: 이름·연락처·이메일·교구 · 이용 목적: 수강 신청 접수 및 안내 · 보유 기간: 학기 종료 후 1년',
  successNote: '담당자가 확인 후 개강 안내를 드리겠습니다.',
};

export const RESERVATION_FORM: FormDef = {
  id: 'reservation',
  anchor: 'reserve',
  title: '시설 이용 신청',
  legacy: `${LEGACY}/Board/Index/25484`,
  schema: reservationSchema,
  defaults: {
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    place: '',
    org: '',
    headcount: '',
    purpose: '',
    facilityNote: '',
    applicantName: '',
    applicantPhone: '',
    pastor: '',
    consentPrivacy: false,
  },
  fields: [
    { name: 'startDate', label: '시작일', kind: 'date', required: true, half: true, groupLabel: '이용 기간' },
    { name: 'endDate', label: '종료일', kind: 'date', required: true, half: true },
    { name: 'startTime', label: '시작 시각', kind: 'time', required: true, half: true },
    { name: 'endTime', label: '종료 시각', kind: 'time', required: true, half: true },
    {
      name: 'place',
      label: '장소',
      kind: 'text',
      required: true,
      half: true,
      hint: '예: 교육실 3, 비전홀, 체육관',
      groupLabel: '이용 내용',
    },
    { name: 'org', label: '이용기관', kind: 'text', required: true, half: true },
    { name: 'headcount', label: '인원 (명)', kind: 'text', required: true, half: true },
    { name: 'purpose', label: '이용 용도', kind: 'text', required: true, half: true },
    { name: 'facilityNote', label: '이용 시설 및 요청사항', kind: 'textarea' },
    { name: 'applicantName', label: '제출자', kind: 'text', required: true, half: true, groupLabel: '신청자' },
    {
      name: 'applicantPhone',
      label: '연락처',
      kind: 'tel',
      required: true,
      half: true,
      placeholder: '010-1234-5678',
    },
    { name: 'pastor', label: '담당 교역자', kind: 'text', required: true, half: true },
  ],
  submitLabel: '시설 이용 신청',
  consentNote: '수집 항목: 제출자 이름·연락처·소속 기관 · 이용 목적: 시설 예약 확인 및 연락 · 보유 기간: 이용일로부터 1년',
  successNote: '교회 사무실에서 확인 후 연락드리겠습니다.',
  notice: [
    '최소 이용일 3일 전에 신청해 주세요. (이용이 중복되면 먼저 신청한 부서가 이용합니다)',
    '이용 후 반드시 소등(냉·난방)하고 주변을 정돈해 주세요.',
    '이용 중 기물이 훼손되거나 분실되지 않도록 주의해 주세요.',
    '문의 — 경비실(출입문) 070-7586-4411 · 기계실(에어컨·전기) 070-7586-4391 (근무시간 09:30~17:30 이후에는 경비실만)',
  ],
};

/** `/activity/apply` 한 페이지에 앵커로 함께 놓이는 신청서들 */
export const APPLY_FORMS: FormDef[] = [VIDEO_REQUEST_FORM, SPONSOR_PLEDGE_FORM, LIFELONG_EDU_FORM];

/**
 * id → 정의. **폼 정의를 서버 컴포넌트에서 클라이언트로 prop으로 넘기면 안 된다** —
 * `schema`가 zod 인스턴스(클래스)라 RSC 직렬화 경계를 넘지 못한다
 * ("Only plain objects ... can be passed to Client Components").
 * 그래서 페이지는 문자열 id만 넘기고, 클라이언트 컴포넌트가 이 맵에서 정의를 꺼낸다.
 */
export const FORM_DEFS = {
  video_request: VIDEO_REQUEST_FORM,
  sponsor_pledge: SPONSOR_PLEDGE_FORM,
  lifelong_edu: LIFELONG_EDU_FORM,
  reservation: RESERVATION_FORM,
} as const satisfies Record<FormDef['id'], FormDef>;

export type FormId = keyof typeof FORM_DEFS;
