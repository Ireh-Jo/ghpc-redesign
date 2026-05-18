# 03. 데이터 모델 (Supabase)

> 1차 오픈 범위의 테이블·RLS·관계. 스키마 변경 시 `supabase/migrations/` 마이그레이션 + 이 문서 동시 갱신.

## 원칙

- **회원/로그인 시스템 없음.** 공개 페이지는 무인증, 어드민만 `auth.users`로 보호.
- **RLS 기본값: 거부.** 명시적 정책 추가한 테이블만 익명 SELECT 허용.
- **개인정보 테이블(`newcomer_submissions` 등) 은 어드민만 SELECT.** 익명 INSERT는 허용, 본인이라도 SELECT 못 함.
- **타임스탬프 컬럼:** `created_at`, `updated_at` 표준. UTC 저장, KST는 표시 단계에서 변환.

## 테이블 후보 (초안 — 화면정의서 수령 후 확정)

> DECISION NEEDED: 화면정의서(6월 말 수령) 받기 전엔 컬럼 디테일은 잠정. 본 단계에선 **테이블 목록·관계·RLS 방향**만 잠근다.

### 1. `services` — 예배 시간표

| 컬럼 | 타입 | 비고 |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | 예: "주일 1부", "수요예배" |
| `day_of_week` | smallint | 0=일요일 |
| `start_time` | time | KST 기준 입력, UTC 저장 |
| `duration_min` | smallint | |
| `description` | text | |
| `order` | smallint | 표시 순서 |
| `active` | boolean | |
| `created_at` / `updated_at` | timestamptz | |

**RLS:** 익명 SELECT (active=true), 어드민 ALL.

### 2. `sermons` — 설교

| 컬럼 | 타입 | 비고 |
|---|---|---|
| `id` | uuid PK | |
| `service_id` | uuid FK → services.id | |
| `preached_at` | date | |
| `title` | text | |
| `scripture` | text | 본문 (예: "시편 81:10") |
| `preacher` | text | |
| `youtube_id` | text | 유튜브 영상 ID |
| `thumbnail_url` | text | 자동 생성 가능 |
| `published` | boolean | |

**RLS:** 익명 SELECT (published=true), 어드민 ALL.

### 3. `events` — 교회 일정 (캘린더)

| 컬럼 | 타입 | 비고 |
|---|---|---|
| `id` | uuid PK | |
| `title` | text | |
| `starts_at` | timestamptz | |
| `ends_at` | timestamptz | nullable |
| `all_day` | boolean | |
| `category` | text | "예배" / "교육" / "행사" / "기타" |
| `description` | text | |
| `link` | text | nullable |
| `published` | boolean | |

**RLS:** 익명 SELECT (published=true), 어드민 ALL.
**인덱스:** `(starts_at)`.

### 4. `bulletins` — 주보

| 컬럼 | 타입 | 비고 |
|---|---|---|
| `id` | uuid PK | |
| `published_at` | date | 발행일 (주일) |
| `title` | text | "2026년 5월 17일 주보" |
| `pdf_url` | text | Supabase Storage URL |
| `cover_image_url` | text | 썸네일 |
| `published` | boolean | |

**RLS:** 익명 SELECT (published=true), 어드민 ALL.

### 5. `posts` — 교회 소식 / 영상뉴스 / 교우소식 / 교단소식

| 컬럼 | 타입 | 비고 |
|---|---|---|
| `id` | uuid PK | |
| `category` | text | "news" / "video_news" / "members" / "denomination" |
| `title` | text | |
| `body` | text | markdown |
| `cover_image_url` | text | |
| `youtube_id` | text | nullable (영상뉴스용) |
| `published_at` | timestamptz | |
| `published` | boolean | |

**RLS:** 익명 SELECT (published=true), 어드민 ALL.

### 6. `staff` — 섬기는 사람들

| 컬럼 | 타입 | 비고 |
|---|---|---|
| `id` | uuid PK | |
| `role` | text | "담임" / "원로" / "은퇴" / "장로" / "교역자" |
| `name` | text | |
| `position` | text | 직책 |
| `bio` | text | nullable |
| `photo_url` | text | **실사진 대신 실루엣 placeholder** (`guardrails/02-design-consistency.md`) |
| `order` | smallint | |
| `active` | boolean | |

**RLS:** 익명 SELECT (active=true), 어드민 ALL.

### 7. `ministries` — 사역 (별들의학교·신학교·선교 등)

| 컬럼 | 타입 | 비고 |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | URL용 |
| `name` | text | |
| `summary` | text | |
| `description` | text | markdown |
| `cover_image_url` | text | |
| `external_link` | text | nullable |
| `order` | smallint | |
| `active` | boolean | |

**RLS:** 익명 SELECT (active=true), 어드민 ALL.

### 8. `newcomer_submissions` — 새가족 등록 (개인정보)

| 컬럼 | 타입 | 비고 |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | |
| `phone` | text | 암호화 검토 |
| `age_group` | text | "장년"/"청년"/"중고등"/... |
| `referral` | text | 어떻게 알게 됐는지 |
| `consent_privacy` | boolean | 필수 true |
| `consent_marketing` | boolean | |
| `note` | text | nullable |
| `processed` | boolean | 어드민 처리 여부 |
| `created_at` | timestamptz | |

**RLS:**
- 익명: **INSERT만** 허용 (consent_privacy=true 강제 정책).
- 익명: **SELECT/UPDATE/DELETE 금지.**
- 어드민: 전체 권한.

**보존 정책:** 1년. 처리 완료 후 익명화/삭제. (`guardrails/04-security-privacy.md`)

### 9. `form_submissions` — 일반 신청 폼 (시니어스쿨·평생교육원 등)

`newcomer_submissions`와 유사하나 `form_type` 컬럼으로 폼 종류 구분. RLS 동일.

> DECISION NEEDED: 폼 종류별 별도 테이블 vs 통합 `form_submissions`. 통합이 RLS·어드민 UI 단순하나 컬럼이 nullable 투성이 됨.

## 인증

- 어드민: `auth.users` + 운영 메일 화이트리스트 (`profiles.is_admin` 또는 Supabase Custom Claim).
- 공개 페이지: 인증 없음.

## RLS 정책 작성 패턴

```sql
-- 익명 SELECT (published=true 만)
alter table services enable row level security;
create policy "public_read_active_services"
  on services for select
  using (active = true);

-- 어드민 ALL
create policy "admin_all_services"
  on services for all
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');
```

> DECISION NEEDED: 어드민 역할 표현 — Custom Claim vs `profiles.is_admin` 조회. Custom Claim이 RLS 빠르나 운영 복잡.

## Storage 버킷

| 버킷 | 공개 여부 | 용도 |
|---|---|---|
| `public-images` | public | 카드 썸네일·사역 이미지 |
| `bulletins` | public | 주보 PDF·표지 |
| `staff-placeholders` | public | 실루엣 SVG |
| `private-uploads` | private | (현재 없음 — 추후 영상 직접 업로드 시) |

## 타입 생성

```bash
supabase gen types typescript --project-id <id> > types/database.ts
```

CI에서 마이그 후 자동 실행.

## 결정 안 된 것 (총괄)

- [ ] 화면정의서(6월 말) 받은 후 컬럼 디테일 확정
- [ ] 폼 통합 vs 분리
- [ ] 어드민 역할 모델 (Custom Claim vs profiles)
- [ ] 미디어 서버 연동 시 `sermons.video_source` 컬럼 추가 여부
- [ ] 개인정보 암호화 (phone) — pgsodium 검토
