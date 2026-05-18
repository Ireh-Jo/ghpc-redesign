# Ops — 배포

## 호스팅: Vercel

- Git 푸시 → 자동 배포 (main → production, 그 외 → preview)
- SSL 자동 발급·갱신 (사람 손 안 댐)
- CDN 자동
- Hobby 플랜으로 시작, 트래픽 증가 시 Pro $20/월

## 도메인·DNS

- 기존 `.or.kr` 유지
- DNS는 Cloudflare로 이관 (안건 3-1)
- A/CNAME 레코드: Vercel이 가이드 (`cname.vercel-dns.com`)
- SSL: Vercel이 Let's Encrypt 자동 발급

## 환경 변수

Vercel Project Settings → Environment Variables:

| 키 | Production | Preview | Development |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | ✓ | (.env.local) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | ✓ | (.env.local) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | preview에선 별도 프로젝트 권장 | (.env.local) |
| `NEXT_PUBLIC_SITE_URL` | https://www.ghpc.or.kr | https://*-preview.vercel.app | http://localhost:3000 |
| `SENTRY_DSN` | ✓ | (선택) | - |
| `YOUTUBE_API_KEY` | ✓ | ✓ | (.env.local) |
| `YOUTUBE_CHANNEL_ID` | UC... | UC... | UC... |

> **service_role 키는 Production·Preview 분리 권장.** Preview에서 운영 DB에 쓰면 위험.

## Supabase 프로젝트 분리

- `ghpc-prod` — 운영
- `ghpc-dev` — 개발·Preview (시드 데이터 자유롭게)

## 빌드 설정

- Node 20+
- Framework Preset: Next.js (자동 감지)
- Build Command: `next build`
- Output Directory: `.next` (기본)
- Install Command: `npm ci`

## 배포 가드

`main` 브랜치 보호:
- PR + 리뷰 (1인 운영이라 self-review 또는 코드 리뷰 자동화)
- CI 통과 필수 (린트·타입체크·빌드 성공)

## 마이그레이션

Supabase 마이그레이션:
```bash
supabase db push                  # 로컬 → 원격
supabase gen types typescript --project-id <id> > types/database.ts
```

> DECISION NEEDED: 운영 마이그는 Supabase CLI 수동 vs GitHub Action 자동. 1인 운영이면 수동이 안전.

## 롤백

- Vercel: 이전 배포로 1클릭 롤백 (Deployments → "Promote to Production")
- Supabase: 마이그 롤백은 수동 SQL. PITR(Point-in-Time Recovery) 백업으로 복원 가능 (Pro 플랜 이상)

## 첫 배포 체크리스트

- [ ] Supabase 프로젝트 생성 (prod/dev)
- [ ] Vercel 프로젝트 연결
- [ ] 환경 변수 입력
- [ ] 도메인 연결 (Cloudflare DNS 변경 30분~24시간)
- [ ] SSL 발급 확인
- [ ] Sentry 연결
- [ ] Uptime Robot 모니터 등록
- [ ] sitemap.xml + robots.txt 생성
- [ ] Google Search Console 등록 (선택)
