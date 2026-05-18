# 05. 성능

> 새신자 첫 진입 = 첫 인상. 느리면 다 끝남. Core Web Vitals 사수.

## 목표 (모바일 4G 기준)

| 지표 | 목표 | 비고 |
|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 헤로 이미지·영상 포스터가 LCP 후보 |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 이미지·임베드 너비·높이 고정 |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 폼·메뉴 토글 |
| **TTFB** | ≤ 600ms | Vercel + Supabase 지역 (Seoul region) |

## 렌더링

- **RSC 기본.** 클라이언트 컴포넌트 최소화.
- ISR(`revalidate`) 적극 활용 (`context/02-architecture.md`):
  - 메인: 60s
  - intro: 1h
  - worship/activity: 5m
- 페이지가 동적이어야 하는 이유 명확하지 않으면 정적/ISR

## 이미지

- **Next/Image 필수** (raw `<img>` 금지, 예외: lite-youtube 썸네일)
- `priority` 는 헤로(LCP 후보)만
- `sizes` 정확히 (반응형)
- AVIF/WebP 자동 (Next 기본)
- Supabase Storage 이미지: `next.config.js`의 `images.remotePatterns`에 등록

```tsx
<Image
  src={url}
  alt="..."
  width={1200}
  height={675}
  priority      // 헤로만
  sizes="(min-width: 1024px) 1200px, 100vw"
  className="..."
/>
```

## 영상

- 헤로 영상: 짧은 루프 (< 10MB), `preload="metadata"`, 모바일은 정적 이미지 대체 (`design/05-imagery.md`)
- 유튜브 임베드: lite-youtube 패턴 (`features/video-embed.md`)
- `youtube-nocookie.com` 사용 (트래커 무게 ↓)

## JS 번들

- 메인 페이지 JS ≤ 200KB (gzipped)
- 'use client' 경계 최소화 — 작은 인터랙티브 부분만 클라이언트
- 동적 import (`next/dynamic`) for heavy components:
  ```tsx
  const Calendar = dynamic(() => import('@/components/interactive/calendar'), {
    loading: () => <Skeleton />,
    ssr: false, // 캘린더는 클라이언트만
  });
  ```
- 번들 분석: `@next/bundle-analyzer` 정기 점검

## CSS

- Tailwind JIT (Next 14 기본)
- 사용 안 하는 클래스 자동 제거
- 인라인 스타일 회피 (CSS-in-JS 금지 — `guardrails/03`)

## 폰트

- Pretendard `display: 'swap'` (FOIT 회피)
- 로컬 호스팅 시 `next/font` 최적화 자동
- subset 필요 시 한국어 + 영문·숫자만 (subset CDN)

## DB 쿼리

- 페이지 컴포넌트에서 `.select()`는 필요 컬럼만 — `select('*')` 피하기
- 인덱스: 자주 필터·정렬되는 컬럼 (`published_at`, `starts_at`, `service_id`)
- N+1 회피 — `.select('a, related(b)')` 형태로 1쿼리
- 페이지네이션 — `.range(from, to)` + 카운트는 별도 쿼리 (또는 head)

## 캐싱

- ISR (위)
- `unstable_cache` for expensive computations
- YouTube API: 5분 캐시 (`features/live-streaming.md`)
- Sermon 조회 등 비-개인정보 데이터: tag 기반 revalidation

## 모바일 성능

- 360px 첫 진입 LCP ≤ 2.5s
- 메모리 200MB 디바이스에서도 동작 (heavy carousel 회피)
- `prefers-reduced-data` 검토 (이미지 품질 낮추기)

## 측정

- Vercel Speed Insights (선택)
- Lighthouse 매 PR (수동 또는 GitHub Action)
- WebPageTest 분기 1회 (외부 시각)

## 안티 패턴

- `useEffect` 데이터 페칭 (RSC로 대체)
- 클라이언트에서 큰 JSON 임포트
- 모든 데이터를 첫 페이지 로드에 — 페이지네이션·lazy
- 큰 이미지 raw `<img>`
- 인라인 SVG 너무 큼 (별도 파일 + Next/Image)
- 자동재생 영상·캐러셀
- LCP 후보 위에 `priority` 안 붙임

## PR 체크

- [ ] 새 페이지: Lighthouse Performance ≥ 85 (모바일)
- [ ] 새 이미지: Next/Image + width/height + sizes
- [ ] 새 임베드: lite 패턴 또는 lazy
- [ ] 'use client' 추가 시 사유 명확 (RSC로 안 되는 이유)
- [ ] 번들 사이즈 증가 확인 (`bundle-analyzer`)
