---
name: form-handling
status: draft
owner: 이레
external-systems: [supabase]
depends-on:
  components: [primitives/form, primitives/input, primitives/textarea, primitives/select, primitives/checkbox, primitives/button]
  data: [newcomer_submissions, form_submissions]
---

# 폼 처리 (공통)

## 목적

새가족 등록·시니어스쿨 신청·평생교육원 수강신청 등 모든 폼을 동일한 패턴으로 처리.

## 핵심 원칙

1. **개인정보 최소 수집** — 진짜 필요한 컬럼만
2. **수집 전 동의** — 개인정보 처리방침 동의 체크박스 필수, 미체크 시 제출 차단
3. **수집 즉시 알림 없음** — 자동 이메일·SMS 발송하지 않음 (1차 범위). 미디어팀이 어드민에서 수동 처리
4. **수동 처리 합의됨** (안건 6)
5. **검증은 클라이언트 + 서버 양쪽** — zod 단일 스키마 재사용

## 폼 종류

| 폼 | 테이블 | 라우트 |
|---|---|---|
| 새가족 등록 | `newcomer_submissions` | `/newcomer`, `/care` 임베드 |
| 시니어스쿨 신청 | `form_submissions` (form_type='senior_school') | `/care` |
| 평생교육원 수강신청 | `form_submissions` (form_type='lifelong_edu')  | `/care` |
| Q&A (AI) | (1차 오픈 범위 외) | - |

## 폼 컴포넌트 패턴

```tsx
// components/interactive/newcomer-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newcomerSchema } from '@/lib/schemas/newcomer';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
// ...

const form = useForm<NewcomerInput>({
  resolver: zodResolver(newcomerSchema),
  defaultValues: { /* ... */ },
});

async function onSubmit(values: NewcomerInput) {
  // Server Action 호출
  const result = await submitNewcomer(values);
  if (result.error) toast.error('전송 실패. 잠시 후 다시 시도해주세요.');
  else toast.success('등록되었습니다. 곧 연락 드리겠습니다.');
}
```

## zod 스키마 (`lib/schemas/`)

```ts
// lib/schemas/newcomer.ts
import { z } from 'zod';

export const newcomerSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(50),
  phone: z.string().regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, '010-1234-5678 형식으로 입력해주세요'),
  ageGroup: z.enum(['장년', '청년', '대학', '중고등', '주일학교']),
  referral: z.string().max(200).optional(),
  consentPrivacy: z.literal(true, { errorMap: () => ({ message: '개인정보 처리방침 동의가 필요합니다' }) }),
  consentMarketing: z.boolean().optional(),
  note: z.string().max(500).optional(),
});

export type NewcomerInput = z.infer<typeof newcomerSchema>;
```

## Server Action

```ts
// app/_actions/newcomer.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { newcomerSchema } from '@/lib/schemas/newcomer';

export async function submitNewcomer(input: unknown) {
  const parsed = newcomerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: '입력값을 확인해주세요' };
  }
  const supabase = createServerClient();
  const { error } = await supabase
    .from('newcomer_submissions')
    .insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      age_group: parsed.data.ageGroup,
      referral: parsed.data.referral ?? null,
      consent_privacy: parsed.data.consentPrivacy,
      consent_marketing: parsed.data.consentMarketing ?? false,
      note: parsed.data.note ?? null,
    });
  if (error) return { error: error.message };
  return { ok: true };
}
```

## 검증 규칙

- `phone`: 한국 010 패턴 강제 (마스킹 표시 정규식)
- `consentPrivacy`: literal(true) — false 불가
- 모든 텍스트 필드: max length 강제 (DB 측에서도 trigger 또는 CHECK)
- 이메일은 1차 오픈에선 수집 안 함 (전화 우선 — 미디어팀 응답 채널)

## UI 패턴

- 한 화면에 폼만 보여주기 (모달 회피)
- 필수 표시: `*` 빨간 별 (`brand-point`)
- 에러 메시지: 필드 바로 아래, `brand-point` 컬러 (2026-07-05 변경 — 원문 "brand-accent"는 accent가 크림슨이던 시절 지정. 7-02 색 재잠금 후 accent=파랑이라 원래 의도인 빨강 = brand-point로 정정. `design/01-color.md` 잠정 사용처 참조)
- 제출 중: 버튼 disabled + 스피너
- 제출 후: 폼 자리에 성공 메시지 카드 (toast 대신 영구 표시)

## 보안 (`guardrails/04-security-privacy.md`)

- 익명 INSERT만 허용, SELECT/UPDATE/DELETE는 어드민
- RLS 정책에서 `consent_privacy=true` 강제
- 어드민이 데이터 조회·내보내기 시 감사 로그
- 보존 기한 1년 (`newcomer_submissions`), 처리 완료 후 익명화

## 봇·스팸 방지

- 1차: Honeypot 필드 + 시간 기반 검증 (5초 이내 제출 차단)
- 2차 (필요 시): hCaptcha 또는 Cloudflare Turnstile
- reCAPTCHA는 Google 의존성 + 개인정보 정책 복잡 → 회피

## 결정 안 된 것

- [ ] 제출 후 안내 채널 (전화·문자·둘 다)
- [ ] form_submissions 통합 vs 폼별 분리 (`03-data-model.md` 참조)
- [ ] 봇 방지 1차로 충분한지 (트래픽 보고 결정)
- [ ] 이메일 수집 여부 (미수집 권장)
