# Ops — 모니터링

## 도구

- **Sentry** — 에러 트래킹 (`@sentry/nextjs`)
- **Uptime Robot** — 가용성 모니터링 (5분 간격 ping)
- **Vercel Analytics** — 트래픽·Core Web Vitals (선택, 무료 한도 내)
- **Supabase Dashboard** — DB·Storage 사용량·쿼리 성능

## Sentry 설정

```bash
npx @sentry/wizard@latest -i nextjs
```

`sentry.client.config.ts` / `sentry.server.config.ts`:
- `tracesSampleRate: 0.1` (10% 샘플링, 무료 한도 내)
- `replaysSessionSampleRate: 0.0` (1차 미사용 — 개인정보 위험)
- `replaysOnErrorSampleRate: 0.0` (동일)
- 운영 환경에서만 활성

> DECISION NEEDED: Session Replay 활성 여부 — 디버깅 강력하지만 개인정보(폼 입력) 캡처 위험. 기본 off.

알림:
- Sentry 이슈 → 이레 이메일·슬랙(있다면)
- 신규 에러·rate spike만 알림 (소음 방지)

## Uptime Robot

- 모니터 URL: `https://www.ghpc.or.kr/` (200 응답 체크)
- 간격: 5분
- 다운 시 알림: 이레 이메일 + (있다면) 슬랙
- 무료 50개 모니터

추가 모니터 (선택):
- `/worship` (생방송 시간엔 LIVE 상태 확인 어려움 — 단순 200만)
- Supabase 헬스 (별도)

## 운영 지표 (KPI)

| 지표 | 측정 | 목표 |
|---|---|---|
| Uptime | Uptime Robot | ≥ 99.9% (월 43분 다운) |
| LCP (메인) | Vercel Analytics | ≤ 2.5s |
| CLS | Vercel Analytics | ≤ 0.1 |
| INP | Vercel Analytics | ≤ 200ms |
| 5xx 에러율 | Sentry / Vercel | < 0.1% |
| 새가족 폼 제출 성공률 | Supabase + 로그 | ≥ 99% |

## 알림 채널

- 1차: 이메일
- 2차: 슬랙·디스코드 (운영 채널 정해지면)
- SMS: 안 함 (1인 운영, 야간 대응 부담)

> DECISION NEEDED: SSL 만료·도메인 만료 알림 (Vercel·Cloudflare가 자동 처리하지만 이중 확인용으로 별도 알림 필요?)

## 대시보드 (월 점검)

매월 1회 30분 (안건 4 — 분기 점검을 월 점검으로 살짝 강화):
1. Uptime Robot 다운 이력
2. Sentry 신규 이슈 분류 (해결 / 무시 / 추적)
3. Supabase Storage 사용량
4. Vercel 대역폭·함수 호출 한도 (Hobby 한도 모니터링)
5. Core Web Vitals 추이
6. 폼 제출 로그 (의심 활동 확인)

## 결정 안 된 것

- [ ] Session Replay 활성 여부
- [ ] 슬랙·디스코드 도입 (현재 채널 없음)
- [ ] 외부 보안 스캔 도구 (Snyk·Dependabot — github에서 무료)
