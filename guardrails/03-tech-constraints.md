# 03. 기술 제약·의존성 화이트리스트

> 새 패키지 추가 전 여기 확인. 화이트리스트에 없으면 추가 PR 사유 작성.

## 코어 (필수)

| 패키지 | 용도 | 변경 가능? |
|---|---|---|
| `next` (14.x) | 프레임워크 | ✕ |
| `react` / `react-dom` (18.x) | React | ✕ |
| `typescript` (5.x) | 타입 | ✕ |
| `tailwindcss` | 스타일 | ✕ |

## UI

| 패키지 | 용도 | 비고 |
|---|---|---|
| `clsx` + `tailwind-merge` | `cn()` 유틸 | shadcn 자동 도입 |
| `class-variance-authority` | variant 패턴 | shadcn 자동 도입 |
| `tailwindcss-animate` | shadcn 애니메이션 | shadcn 자동 도입 |
| `@radix-ui/*` | shadcn 베이스 | `shadcn add` 시 자동 |
| `lucide-react` | 아이콘 | 단독 |
| `react-day-picker` | Calendar | 직접 사용 |

## 데이터·인증

| 패키지 | 용도 |
|---|---|
| `@supabase/supabase-js` | Supabase 클라이언트 |
| `@supabase/ssr` | App Router용 |
| `zod` | 입력 검증 |

## 폼

| 패키지 | 용도 |
|---|---|
| `react-hook-form` | 폼 상태 |
| `@hookform/resolvers` | zod 연결 |

## 모니터링

| 패키지 | 용도 | 활성? |
|---|---|---|
| `@sentry/nextjs` | 에러 트래킹 | 운영 환경만 |
| `@vercel/analytics` | 트래픽 분석 | 선택 |
| `@vercel/speed-insights` | Core Web Vitals | 선택 |

## 폰트

- Pretendard Variable (로컬 호스팅 또는 CDN — `context/design/02-typography.md`)

## 알림 (toast)

- `sonner` — shadcn 권장

## 금지 / 회피

| 패키지 | 사유 |
|---|---|
| `redux` / `mobx` / `zustand` | RSC + URL state로 충분 — 글로벌 상태 회피 |
| `lodash` 전체 | tree-shaking 안 됨. 필요 함수만 직접 구현 |
| `moment.js` | 큼·deprecated. `date-fns` 또는 `Intl.DateTimeFormat` |
| `axios` | `fetch` 표준이 충분 |
| `styled-components` / `emotion` | Tailwind와 중복, RSC 비호환 이슈 |
| `material-ui` / `chakra` / `antd` | shadcn과 중복 |
| `next-auth` | 1차 오픈 회원 시스템 없음. 어드민은 Supabase Auth |
| `framer-motion` | CSS transition으로 충분. 필요 시 PR 사유 작성 |
| `three.js` / `@react-three/*` | 오버스펙 |
| `recharts` / `chart.js` | 1차 차트 사용 없음 |

## 새 의존성 추가 시 절차

1. 이 문서 화이트리스트 확인
2. 없으면 PR 설명에 사유 작성:
   - 왜 필요한가
   - 대안 검토 결과
   - 번들 사이즈 (`bundle-phobia` 확인)
   - 메인테너 활동성 (GitHub 마지막 커밋, 다운로드 수)
3. 머지 후 이 문서 갱신

## 번들 사이즈 가드

- 메인 페이지 JS ≤ 200KB (gzipped)
- 인터랙티브 페이지(/care, /activity) ≤ 300KB
- 새 패키지 추가 시 영향 확인

## Node 버전

- `node: 20.x` (Vercel 권장)
- `package.json`에 `engines.node`

## 패키지 매니저

- `npm` (Vercel 자동 감지). `pnpm` 또는 `bun` 검토 가능하나 1인 운영 단순함 우선 `npm`.

## AI 코드 생성 도구 (권장)

> 1인 개발 + 빠듯한 일정(6~12월)을 감안해 AI 도구 활용을 **권장**한다 (안건 3-1 "선택" → "권장"으로 격상, 2026-05-19).
> 단, 생성된 코드도 본 문서의 제약과 다른 가드레일을 그대로 받는다.

| 도구 | 용도 |
|---|---|
| Claude Code | 컴포넌트·페이지 구현, 리팩터링, 컨텍스트 기반 작업 |
| v0 | 컴포넌트·페이지 UI 초안 생성 |
| Cursor | 에디터 내 코드 생성·수정 |

생성 코드 검수 규칙 (이레가 통합 전 확인):
- 위 화이트리스트에 없는 의존성을 끌고 오면 제거하거나 PR 사유 작성
- 임의 색상·간격 값 금지 → `context/design/*` 토큰으로 치환 (`guardrails/02-design-consistency.md`)
- 시안 HTML·v0 출력은 **참고 스펙**이며 그대로 복붙하지 않는다 (`CLAUDE.md` 절대 규칙 5)
- TS strict·접근성 기준 통과 확인 (`guardrails/01-code-quality.md`)
