'use server';

import { reservationCancelSchema, reservationSchema } from '@/lib/schemas/reservation';
import { expandOccurrences, findConflicts, MOCK_RESERVATIONS } from '@/lib/reservations';
import { roomName } from '@/lib/rooms';

/**
 * 시설 예약 Server Action — 신청 · 취소.
 *
 * 신청 폼 4종(`app/_actions/apply.ts`)에서 분리했다. 예약은 **겹침 판정 · 회차 전개 · 캡차 검증 ·
 * 비밀번호 해시**가 붙어 공용 렌더러의 흐름과 다르다 (`context/features/reservation.md` §결정 잠금).
 *
 * TODO(Supabase 미생성) — 연결 시 할 일:
 *   1. 신청: 회차별로 `reservations` INSERT (같은 `recurrence_group_id`).
 *      겹침은 exclusion constraint가 최종 방어 → 23P01 에러를 "이미 예약된 시간" 메시지로 변환
 *   2. 비밀번호: `crypt(pw, gen_salt('bf'))`로 **해시만** 저장 (평문·복호화 가능 암호화 금지)
 *   3. 취소: `cancel_reservation(id, password)` RPC(SECURITY DEFINER) 호출 — 익명 UPDATE 권한은 열지 않는다
 *   4. 달력 조회: 공개 뷰 `reservations_public`(PII 제외)만 사용
 *
 * ⚠️ RLS 미설계 + Turnstile 키 미발급 상태에서 운영 데이터가 들어가지 않도록,
 *    환경변수가 없으면 **성공으로 위장하지 않고** 접수 불가를 알린다 (`guardrails/04-security-privacy.md`).
 */

type Result = { ok: true } | { ok: false; error: string };

/** Turnstile 서버 검증. 시크릿이 없으면 `null`(=검증 불가)을 돌려 호출부가 접수를 막게 한다 */
async function verifyCaptcha(token: string): Promise<boolean | null> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return null;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

const NOT_READY =
  '온라인 예약 준비 중입니다. 당분간 교회 사무실(02-3663-0333)로 문의해주세요.';

export async function submitReservation(input: unknown): Promise<Result> {
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: '입력값을 확인해주세요.' };
  }
  const values = parsed.data;

  // 겹침 재검사 — 화면에서 이미 막지만 그 사이 다른 사람이 잡았을 수 있다.
  // 지금은 목업 기준이고, Supabase 연결 후에는 DB 조회 + exclusion constraint가 최종 판정을 한다.
  const conflicts = findConflicts(
    expandOccurrences({ ...values, repeatCount: Number(values.repeatCount) }),
    values.roomIds,
    MOCK_RESERVATIONS,
  );
  if (conflicts.length > 0) {
    const first = conflicts[0];
    return {
      ok: false,
      error: `${first.date} ${roomName(first.roomId)}은(는) 이미 예약된 시간입니다. 달력에서 다른 시간을 확인해주세요.`,
    };
  }

  const captchaOk = await verifyCaptcha(values.captchaToken);
  if (captchaOk === false) {
    return { ok: false, error: '보안문구 확인에 실패했습니다. 다시 시도해주세요.' };
  }
  // captchaOk === null (키 미발급) 또는 Supabase 미연결 → 접수 불가
  if (captchaOk === null || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { ok: false, error: NOT_READY };
  }

  // TODO(Supabase): 회차별 INSERT + recurrence_group_id + cancel_password_hash
  return { ok: true };
}

export async function cancelReservation(input: unknown): Promise<Result> {
  const parsed = reservationCancelSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: '입력값을 확인해주세요.' };

  const captchaOk = await verifyCaptcha(parsed.data.captchaToken);
  if (captchaOk === false) {
    return { ok: false, error: '보안문구 확인에 실패했습니다. 다시 시도해주세요.' };
  }
  if (captchaOk === null || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { ok: false, error: NOT_READY };
  }

  // TODO(Supabase): cancel_reservation RPC 호출. 비밀번호 불일치는 "일치하지 않습니다"로만 알린다
  //                 (어떤 예약이 존재하는지 알려주지 않기 위해 상세 구분 금지)
  return { ok: true };
}
