# 01. 기술 스택

> 결정 근거 + 화이트리스트. 새 의존성 추가 시 `guardrails/03-tech-constraints.md` 함께 확인.

## 전체 구성 (안건 3-1)

| 영역 | 기술 | 비고 |
|---|---|---|
| 프론트엔드 | **Next.js 14 (App Router)** + **Tailwind CSS** + **shadcn/ui** | React Server Components 적극 활용 |
| 백엔드 | Next.js API Routes / Route Handlers | 별도 백엔드 서버 없음 |
| DB | **Supabase** (PostgreSQL) | RLS로 권한 처리 |
| 이미지 스토리지 | Supabase Storage | 주보·교회소식 이미지 |
| 영상 | YouTube embed + (기존 미디어 서버 연결 — TBD) | 자체 트랜스코딩 안 함 |
| 호스팅 | **Vercel** | 자동 배포·SSL·CDN |
| 도메인/DNS | 기존 `.or.kr` + **Cloudflare DNS** | SSL은 Vercel이 자동 |
| 모니터링 | **Sentry** (에러) + **Uptime Robot** (가용성) | 무료 티어 |
| 개발 도구 | Cursor / VSCode / WebStorm | v0 선택적 활용 |

## 선택 근거

- 회원 시스템·결제 없음 → Spring Boot 같은 풀백엔드 오버스펙
- Next.js 풀스택 통합 → **운영 포인트 최소화** (1인 운영 핵심 제약)
- Supabase = DB + 스토리지 + 어드민(Studio) + 자동 백업 통합 → 어드민 1차안 옵션 A 가능
- Vercel = 자동 배포·SSL·CDN → SSL 만료 사람 손 안 댐
- 본업 스택(Spring Boot)과 분리 → 학습 효과 + 본업 충돌 최소

## 의존성 화이트리스트 (현 시점)

`package.json`에 들어갈 후보. 추가 시 `guardrails/03-tech-constraints.md` 갱신.

### 코어
- `next` (14.x)
- `react` / `react-dom` (18.x)
- `typescript` (5.x)

### 스타일·UI
- `tailwindcss`
- `@tailwindcss/typography` (주보·소식 본문)
- `clsx` + `tailwind-merge` (`cn` 유틸)
- `class-variance-authority` (shadcn 패턴)
- **shadcn/ui** — 컴포넌트는 복사 방식이라 dependency 아님

### 컴포넌트 빌딩블록 (shadcn 베이스)
- `@radix-ui/*` — shadcn add 시 자동 도입
- `lucide-react` — 아이콘 (`context/design/04-iconography.md`)
- `react-day-picker` — Calendar 컴포넌트
- `embla-carousel-react` — 필요 시 (자동재생 금지, `guardrails/02`)

### 데이터·인증
- `@supabase/supabase-js`
- `@supabase/ssr` — App Router용 클라이언트
- `zod` — 폼/입력 검증

### 폼
- `react-hook-form`
- `@hookform/resolvers` (zod 연결)

### 분석·모니터링
- `@sentry/nextjs`
- `@vercel/analytics` (선택)
- `@vercel/speed-insights` (선택)

### 폰트
- Pretendard Variable (next/font 또는 CDN, `context/design/02-typography.md`)

## 운영 비용 (안건 3-3, 월 예상)

| 항목 | 비용 |
|---|---|
| 도메인 (.or.kr) | 1~2만원/년 |
| Vercel | 무료 (Hobby) — 트래픽 증가 시 Pro $20/월 검토 |
| Supabase | 무료 시작 → 트래픽 증가 시 Pro $25/월 |
| Cloudflare DNS | 무료 |
| Sentry / Uptime Robot | 무료 |
| **월 합계** | **1~3만원** (성장 후 5~7만원) |

## 결정 안 된 것

- [ ] **유튜브 임베드 vs 기존 미디어 서버 연결** — 미디어 서버 정보 수령 후 결정. `context/features/video-embed.md` 참조
- [ ] **이미지 최적화 전략** — Next/Image + Supabase Storage 직접 vs Cloudflare Images. 트래픽 가시성 후 결정
- [ ] **어드민 UI** — Supabase Studio 직접 사용 vs 자체 제작 (안건 2-3, +2~3주)

## 금지

- 풀백엔드 프레임워크 도입 (Spring/Nest 등) — 1인 운영 부담
- 자체 호스팅 인프라 (EC2/온프렘) — SSL·장애 책임 증가
- 회원/결제 SDK 도입 — 1차 오픈 범위 밖
- 무거운 클라이언트 상태 관리(redux/mobx) — RSC + URL state로 충분
