# Supabase 셋업 & 접속 가이드 (이레용)

> 작성: 2026-07-05. **현재 상태: Supabase 미적용.**
> 새가족 폼(`app/_actions/newcomer.ts`)은 검증까지 동작하고, DB 저장(INSERT)은 스텁 —
> env가 없으면 "등록 접수 준비 중입니다" 에러를 반환하도록 해둠. 아래 절차 후 연결하면 바로 저장된다.

## 1. Supabase가 뭐고 왜 내가 만들어야 하나

- Supabase = 호스팅형 PostgreSQL + 인증 + 스토리지. **웹 서비스라서 계정 소유자가 직접 생성**해야 함 (코드로 대신 못 만듦).
- 무료(Free) 티어로 시작 — 교회 폼 트래픽 수준이면 당분간 충분. 카드 등록 불필요.

## 2. 프로젝트 생성 (1회, ~5분)

1. https://supabase.com → **Sign in** (GitHub 계정 로그인 권장 — Vercel과 동일 계정이면 관리 편함)
2. **New project** 클릭
   - Organization: 개인 org 그대로
   - Name: `ghpc-redesign` (아무거나 OK)
   - **Database Password: 강력한 걸로 생성하고 비밀번호 관리자에 저장** (분실 시 리셋 가능하지만 귀찮음)
   - **Region: `Northeast Asia (Seoul)`** ← 꼭 서울로 (응답속도)
   - Pricing: Free
3. 생성 완료까지 1~2분 대기

## 3. 키 2개 복사 → `.env.local`

Dashboard → 좌측 하단 **Settings(톱니)** → **API** 탭:

| Dashboard 표기 | 우리 env 이름 | 공개 여부 |
|---|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | 공개 OK |
| `anon` `public` 키 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 공개 OK (RLS가 방어) |
| `service_role` 키 | (지금 안 씀) | **절대 복사·공유 금지** — 서버 전용, RLS 우회 키 |

프로젝트 루트에 `.env.local` 파일 생성 (**git에 안 올라감** — `.gitignore` 처리됨, 절대 커밋 금지):

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## 4. 그 다음 → Claude에게 "Supabase 연결해줘"

여기까지 되면 나머지는 코드 작업 (Claude가 진행):

1. `@supabase/supabase-js` 설치 + `lib/supabase/server.ts` 클라이언트
2. `supabase/migrations/` 에 `newcomer_submissions` 테이블 + **RLS 정책** SQL
   (익명 INSERT만, `consent_privacy=true` 강제 — `context/03-data-model.md` §8)
3. `app/_actions/newcomer.ts`의 TODO 스텁 → 실제 INSERT 활성화
4. 로컬에서 제출 테스트 → Vercel 환경변수에도 같은 값 등록 (배포용)

⚠️ **RLS 정책이 적용되기 전에는 절대 운영(실제 교인) 데이터 넣지 말 것** (`guardrails/04-security-privacy.md`).

## 5. 제출된 데이터 보는 법 (운영 중 확인)

폼 제출이 들어오면:

- Dashboard → **Table Editor** → `newcomer_submissions` 테이블 → 행이 곧 제출 1건
  - 스프레드시트처럼 보임. `processed` 컬럼 체크해서 처리 여부 표시 가능
- 또는 **SQL Editor** 에서:
  ```sql
  select created_at, name, phone, age_group, referral, note
  from newcomer_submissions
  order by created_at desc;
  ```
- 알림은 없음 (1차 범위: 자동 이메일·SMS 미발송, 수동 확인 — `context/features/form-handling.md`)
  주기적으로 들어가 보거나, 어드민 UI(옵션 B) 만들면 거기서 확인.

## 6. 자주 쓰는 Dashboard 메뉴 지도

| 메뉴 | 용도 |
|---|---|
| Table Editor | 데이터 보기/수정 (엑셀 느낌) |
| SQL Editor | 쿼리 직접 실행 |
| Database → Tables | 스키마·RLS 정책 확인 |
| Authentication | (어드민 로그인 만들 때 사용 예정) |
| Logs | 쿼리·에러 로그 |
| Settings → API | URL·키 재확인 |

## 개인정보 주의 (요약)

- `newcomer_submissions`는 이름·전화번호가 있는 **개인정보 테이블** — 화면 공유·스크린샷 시 주의
- 보존 1년, 처리 완료 후 익명화/삭제 (`context/03-data-model.md` §8)
- 데이터 내보내기(CSV)는 필요 최소한으로, 개인 PC에 방치 금지
