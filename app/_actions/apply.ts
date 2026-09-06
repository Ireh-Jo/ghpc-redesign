'use server';

import { APPLY_SCHEMAS, type ApplyFormType } from '@/lib/schemas/apply';
import { reservationSchema } from '@/lib/schemas/reservation';

/**
 * 신청 폼 공통 Server Action (`context/features/form-handling.md`).
 * 클라이언트와 같은 zod 스키마로 재검증 + 봇 방지(honeypot·시간 기반) 후 INSERT.
 *
 * TODO(Supabase 미생성): 프로젝트 생성 후 아래 INSERT 스텁을 실제 연결로 교체.
 *   - 신청서 3종 → `form_submissions` (form_type으로 구분, `context/03-data-model.md` §9)
 *   - 시설 이용 → `reservations` (§11, 겹침 방지 constraint는 회의 확정 후)
 *   - 익명 INSERT만 허용 + consent_privacy=true 강제 (RLS는 `newcomer_submissions` 패턴)
 *
 * ⚠️ RLS 미설계 상태에서 운영 데이터가 들어가지 않도록, 환경변수가 없으면 **성공으로 위장하지 않고**
 *    접수 불가를 그대로 알린다 (`guardrails/04-security-privacy.md`).
 */

export type FormKind = ApplyFormType | 'reservation';

export interface SubmitMeta {
  /** honeypot — 사람은 비워둠, 봇이 채우면 거부 */
  website: string;
  /** 폼 마운트 시각 (ms) — 5초 이내 제출은 봇 판정 */
  formLoadedAt: number;
}

export async function submitApply(
  kind: FormKind,
  input: unknown,
  meta: SubmitMeta,
): Promise<{ ok: true } | { ok: false; error: string }> {
  // 봇 방지 — 사람에게는 보이지 않는 조건이므로 에러 메시지는 일반 문구
  if (meta.website !== '' || Date.now() - meta.formLoadedAt < 5_000) {
    return { ok: false, error: '전송에 실패했습니다. 잠시 후 다시 시도해주세요.' };
  }

  const schema = kind === 'reservation' ? reservationSchema : APPLY_SCHEMAS[kind];
  if (!schema) return { ok: false, error: '알 수 없는 신청 종류입니다.' };

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: '입력값을 확인해주세요.' };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Supabase 프로젝트 생성 전 — 접수 불가를 정직하게 알림
    return {
      ok: false,
      error: '온라인 접수 준비 중입니다. 당분간 교회 사무실(02-3663-0333)로 문의해주세요.',
    };
  }

  // TODO(Supabase): kind === 'reservation' ? reservations INSERT : form_submissions INSERT
  return { ok: true };
}
