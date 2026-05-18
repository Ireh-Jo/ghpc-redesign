# 04. 보안·개인정보

> 새가족 등록 폼·교우소식 등 개인정보가 흐른다. 가벼이 다루지 말 것.

## 환경 변수

- `.env.local` 절대 커밋 금지 (`.gitignore` 확인)
- `NEXT_PUBLIC_*` 접두사 = 클라이언트 노출. 비밀에 절대 붙이지 말 것.
- `SUPABASE_SERVICE_ROLE_KEY`는 **서버 컴포넌트·Route Handler·Server Action만** 접근
- Vercel Production·Preview 환경 변수 분리 — preview에서 운영 DB 쓰면 위험

### 노출 확인 명령
```bash
git grep -nE 'service_role|SERVICE_ROLE' -- '*.tsx' '*.ts'
# 결과는 lib/supabase/admin.ts 1곳뿐이어야 함

git log --all -p | grep -E 'SUPABASE_SERVICE_ROLE_KEY=' || echo "OK"
# 결과 OK여야 함
```

## RLS (Row Level Security)

- **모든 테이블 RLS 활성** (`alter table ... enable row level security`)
- 명시적 정책 추가 없는 테이블은 익명 접근 불가 — 기본 거부
- 익명이 INSERT 하는 테이블(`newcomer_submissions` 등)은 **INSERT만** 허용, SELECT/UPDATE/DELETE는 어드민
- INSERT 정책에 `consent_privacy = true` 강제

### 정책 예시
```sql
-- 익명: INSERT만, consent_privacy 강제
create policy "anon_insert_newcomer_with_consent"
  on newcomer_submissions for insert
  to anon
  with check (consent_privacy = true);

-- 익명: SELECT 금지 (정책 없음)
-- 어드민: ALL
create policy "admin_all_newcomer"
  on newcomer_submissions for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');
```

## 개인정보 처리

### 수집 원칙
- **필요 최소.** 진짜 운영에 필요한 컬럼만 수집.
- **목적·보존기간 명시.** 폼 옆에 "수집 목적 / 보존 기간 / 본인 동의" 안내.
- **동의 체크박스 필수.** 미체크 시 제출 차단 (`form-handling.md`).
- 이메일 1차 수집 안 함 (전화 우선).

### 컬럼별 정책
| 테이블·컬럼 | 분류 | 보존 | 마스킹 |
|---|---|---|---|
| `newcomer_submissions.name` | 일반 개인정보 | 1년 | 어드민 화면 풀 노출 |
| `newcomer_submissions.phone` | 민감 | 1년 | 어드민 화면 가운데 4자리 마스킹 (클릭 시 풀) |
| `newcomer_submissions.referral` | 일반 | 1년 | 풀 노출 |
| `newcomer_submissions.note` | 일반 | 1년 | 풀 노출 |
| `posts` (category=members 교우소식) | 일반 (이름 노출) | 본인 동의 시까지 | - |

> DECISION NEEDED: `phone` 컬럼 암호화 (pgsodium / pg_crypto). 트래픽 보고 결정.

### 보존·삭제
- 1년 경과: 어드민 알림 → 익명화 또는 삭제
- 정기 작업: 월 1회 어드민 점검 (`context/ops/runbook.md`)
- 사용자 삭제 요청: 24시간 내 처리, 처리 결과 알림

### 교우소식 (`posts` category=members)
- 결혼·출산·소천 등 — **본인/유족 동의 절차 필수**
- 미디어팀 운영 매뉴얼에 명시
- 노출 범위 정책 (이름 풀노출 vs 이니셜)

> DECISION NEEDED: 교우소식 이름 마스킹 정책 (예: "김OO 집사").

## 개인정보 처리방침 페이지

- `/privacy` 라우트 별도
- 필수 항목:
  - 수집 항목·목적·보존기간
  - 제3자 제공 여부 (없음 — 외부 결제·SMS 미사용)
  - 처리 위탁 (Supabase·Vercel 인프라 사용 명시 — 글로벌 호스팅 고지)
  - 정보주체 권리 (열람·정정·삭제 요청)
  - 책임자·문의처

> DECISION NEEDED: 개인정보처리방침 텍스트 작성 — 법무 검토 필요.

## 봇·스팸 방지

- Honeypot 필드 + 시간 기반 검증 (`features/form-handling.md`)
- 필요 시 hCaptcha 또는 Cloudflare Turnstile
- reCAPTCHA(Google)는 개인정보 정책 복잡 → 회피

## 감사 로그

- 어드민이 개인정보 테이블 SELECT/EXPORT 시 로그
- 테이블: `audit_log (id, actor, action, table, row_id, at)`
- 1차 오픈 범위 내 구현 권장 (옵션 B 어드민 선택 시)

> DECISION NEEDED: 옵션 A (Supabase Studio) 시 감사 로그 구현 어려움 — 정책 결정 필요.

## 의존성 보안

- `npm audit` 월 1회
- GitHub Dependabot 활성
- 의존성 추가 시 알려진 CVE 확인

## 보안 헤더

`next.config.js`:
```js
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      // CSP는 별도 — 인라인 스크립트 검토 후
    ],
  }];
}
```

> DECISION NEEDED: CSP (Content Security Policy) — Next.js 14 nonce 패턴. 도입 가치 vs 복잡도 트레이드오프.

## 결정 안 된 것 (총괄)

- [ ] phone 암호화
- [ ] 교우소식 이름 마스킹
- [ ] 개인정보처리방침 텍스트 (법무)
- [ ] 감사 로그 (옵션 A/B 결정 연관)
- [ ] CSP
