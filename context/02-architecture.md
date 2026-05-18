# 02. 아키텍처

> App Router 디렉토리 구조 + 데이터 플로우. 폴더 구조 변경 시 이 문서 먼저 갱신.

## 코드 디렉토리 (확정 전 — 초안)

```
ghpc/
├── app/
│   ├── (site)/                       공개 페이지 그룹
│   │   ├── layout.tsx                Header + Footer
│   │   ├── page.tsx                  메인 /
│   │   ├── intro/page.tsx
│   │   ├── worship/page.tsx
│   │   ├── care/page.tsx
│   │   ├── activity/page.tsx
│   │   └── newcomer/page.tsx
│   ├── (admin)/                      미디어팀 어드민 (방향 미정)
│   │   ├── layout.tsx                인증 가드
│   │   └── admin/...
│   ├── api/                          Route Handlers (필요 시)
│   ├── globals.css                   CSS 토큰 (context/design/01-color.md 기반)
│   ├── layout.tsx                    Root layout — 폰트·메타·분석
│   └── not-found.tsx
├── components/
│   ├── ui/                           shadcn/ui 생성 (primitives)
│   ├── layout/                       Header, Footer, MobileNav, Container
│   ├── content/                      HeroVideo, SermonCard, ServiceTimeTable, NewsCard, ...
│   └── interactive/                  Calendar, LiveBadge, NewcomerForm, ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 브라우저 클라이언트
│   │   ├── server.ts                 서버 컴포넌트 / Route Handler 클라이언트
│   │   └── admin.ts                  service_role 키 — 서버 사이드 한정
│   ├── utils.ts                      cn() 등
│   ├── schemas/                      zod 스키마
│   └── youtube.ts                    유튜브 임베드 헬퍼
├── types/
│   └── database.ts                   Supabase 타입 생성 (supabase gen types)
├── public/
│   ├── fonts/                        Pretendard 로컬 호스팅 (선택)
│   └── logo.svg
├── supabase/
│   ├── migrations/                   SQL 마이그레이션
│   └── seed.sql                      개발 시드 데이터
├── context/                          (이 폴더)
├── guardrails/                       (이 폴더)
└── prototypes/                       시안 동결
```

## 라우팅 원칙

- **공개 페이지는 RSC (Server Component) 기본.** 클라이언트 인터랙션 필요한 경계에서만 `'use client'`.
- **데이터 페칭은 페이지 컴포넌트 또는 server-only 모듈에서.** 클라이언트로 secret/service_role 노출 금지.
- **URL이 상태의 진실.** 필터·탭·페이지는 search params로. 클라이언트 글로벌 상태 회피.
- **메타데이터는 페이지마다 `generateMetadata`로.** 새신자 검색 진입 고려 (OG·title).

## 데이터 플로우

```
[Server Component] ─── server.ts ──→ [Supabase] (anon key + RLS)
       │
       │ props
       ▼
[Client Component] ─── client.ts ──→ [Supabase] (anon key + RLS)
                                          ▲
                                          │ realtime / mutation
[Route Handler] ─── admin.ts ─────────────┘ (service_role, 서버 한정)
```

- 읽기: 가능한 한 RSC + `server.ts`로. 캐싱은 Next.js 기본(`fetch` revalidate / `unstable_cache`).
- 쓰기 (폼 제출): Server Action + zod 검증. 폼 컴포넌트는 client.
- 인증: 1차 오픈 범위에선 어드민만. 공개 페이지는 무인증. `guardrails/04-security-privacy.md` 참조.

## 렌더링 전략

| 페이지 | 전략 | 이유 |
|---|---|---|
| `/` 메인 | RSC + ISR (revalidate 60s) | 예배 안내·캠페인이 자주 안 바뀜 |
| `/intro` | RSC + ISR (revalidate 1h) | 거의 정적 |
| `/worship` | RSC + ISR (revalidate 5m) | 라이브 상태 반영 |
| `/care` | RSC + Static | 콘텐츠 거의 정적 |
| `/activity` | RSC + ISR (revalidate 5m) | 일정·주보 자주 갱신 |
| `/admin/*` | 무캐시 + 인증 가드 | 운영 |

## 환경 변수 (개발 vs 운영)

`.env.local` (커밋 금지):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # 서버 only — admin.ts 만 사용
NEXT_PUBLIC_SITE_URL=https://www.ghpc.or.kr
SENTRY_DSN=...
```

운영(`Vercel Environment Variables`)에서 동일 키 설정. `guardrails/04-security-privacy.md` 참조.

## 결정 안 된 것

- [ ] **Server Action vs Route Handler** — 폼 제출 디폴트 방식. (Server Action으로 통일 후보)
- [ ] **이미지 도메인** — `next.config.js`의 `images.remotePatterns`. Supabase Storage · 유튜브 썸네일 도메인 등록 필요.
- [ ] **i18n** — 1차는 한국어 only. 영문 새가족 가이드는 향후.
