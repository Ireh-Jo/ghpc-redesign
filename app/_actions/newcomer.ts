'use server';

import { newcomerSchema } from '@/lib/schemas/newcomer';

/**
 * 새가족 등록 Server Action (context/features/form-handling.md).
 * 클라이언트와 같은 zod 스키마로 재검증 + 봇 방지(honeypot·시간 기반) 후 INSERT.
 *
 * TODO(Supabase 미생성): 프로젝트 생성 후 아래 INSERT 스텁을 실제 연결로 교체.
 *   - `@supabase/supabase-js` 설치 → `lib/supabase/server.ts` 생성
 *   - `newcomer_submissions` 익명 INSERT (RLS: consent_privacy=true 강제, 03-data-model.md §8)
 */

export interface NewcomerSubmitMeta {
  /** honeypot — 사람은 비워둠, 봇이 채우면 거부 */
  website: string;
  /** 폼 마운트 시각 (ms) — 5초 이내 제출은 봇 판정 */
  formLoadedAt: number;
}

export async function submitNewcomer(
  input: unknown,
  meta: NewcomerSubmitMeta,
): Promise<{ ok: true } | { ok: false; error: string }> {
  // 봇 방지 — 사람에게는 보이지 않는 조건이므로 에러 메시지는 일반 문구
  if (meta.website !== '' || Date.now() - meta.formLoadedAt < 5_000) {
    return { ok: false, error: '전송에 실패했습니다. 잠시 후 다시 시도해주세요.' };
  }

  const parsed = newcomerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: '입력값을 확인해주세요.' };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Supabase 프로젝트 생성 전 — 접수 불가를 정직하게 알림 (성공으로 위장하지 않음)
    return {
      ok: false,
      error: '등록 접수 준비 중입니다. 당분간 교회 사무실(전화)로 문의해주세요.',
    };
  }

  // TODO(Supabase): newcomer_submissions INSERT
  // const supabase = createServerClient();
  // const { error } = await supabase.from('newcomer_submissions').insert({
  //   name: parsed.data.name,
  //   phone: parsed.data.phone,
  //   age_group: parsed.data.ageGroup,
  //   referral: parsed.data.referral || null,
  //   consent_privacy: parsed.data.consentPrivacy,
  //   consent_marketing: parsed.data.consentMarketing ?? false,
  //   note: parsed.data.note || null,
  // });
  // if (error) return { ok: false, error: '전송에 실패했습니다. 잠시 후 다시 시도해주세요.' };
  return { ok: true };
}
