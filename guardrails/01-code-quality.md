# 01. 코드 품질·테스트·접근성

> PR 머지 전 체크리스트.

## TypeScript

- `strict: true` (`tsconfig.json`)
- `noUncheckedIndexedAccess: true`
- `any` 금지 — 모르면 `unknown` + 좁히기
- Supabase 타입은 `supabase gen types` 산출물 사용 (`types/database.ts`)
- zod 추론 타입 우선 (`z.infer<typeof schema>`)

## 린트

- ESLint Next.js 권장 + import 정렬 (eslint-plugin-import 또는 simple-import-sort)
- 빌드 시 lint 통과 강제 (`next build`에서 실패하면 머지 금지)
- `// eslint-disable-next-line` 사용은 PR에서 사유 코멘트 필수

## 포맷

- Prettier
- 탭 vs 스페이스: 스페이스 2개 (Next.js 기본)
- 줄 끝 LF
- 80~100자 줄 길이 권장

## 테스트

> 1인 운영 + 빠른 출시 → **선택적 테스트**. 핵심 로직만 유닛 테스트.

| 영역 | 테스트 | 도구 |
|---|---|---|
| zod 스키마 | 단위 (정상/실패 케이스) | `vitest` |
| 폼 server action | 통합 (Supabase mock) | `vitest` + `@supabase/supabase-js` mock |
| 컴포넌트 (인터랙티브) | 렌더링·이벤트 | `@testing-library/react` (선택) |
| E2E | 핵심 흐름만 (메인 진입·새가족 폼 제출) | `playwright` (선택) |

> DECISION NEEDED: E2E 테스트 도입 시점. 1차 오픈 전 최소 1개 흐름은 권장.

## 접근성 (a11y) 체크리스트

각 컴포넌트·페이지마다:
- [ ] 모든 이미지에 alt (장식은 `alt=""`)
- [ ] 모든 버튼·링크 클릭 영역 ≥ 44×44px
- [ ] 폼 input에 `<label>` (또는 aria-label)
- [ ] 키보드만으로 모든 기능 가능 (Tab·Enter·Space·Esc·화살표)
- [ ] focus-visible 스타일 명확
- [ ] 색만으로 정보 전달하지 않음 (LIVE 빨간 점 옆 "LIVE" 텍스트)
- [ ] 색 대비 WCAG AA (본문 4.5:1, 라지 텍스트 3:1)
- [ ] `prefers-reduced-motion` 대응 (`context/design/06-motion.md`)
- [ ] 스크린리더에 의미 있는 순서 (DOM 순서 = 시각 순서)
- [ ] aria-live (동적 알림·toast)
- [ ] heading 위계 (h1 → h2 → h3, 점프 없음)

## SEO

- 각 페이지 `generateMetadata` (title, description, openGraph)
- OG 이미지 1200×630
- `app/sitemap.ts`로 사이트맵 자동 생성
- `<html lang="ko">`
- 정규 URL (canonical) 설정

## 명명

- 파일: kebab-case (`hero-video.tsx`)
- 컴포넌트: PascalCase (`HeroVideo`)
- 함수·변수: camelCase
- 상수: SCREAMING_SNAKE_CASE (전역 상수만)
- DB 테이블·컬럼: snake_case (Supabase 컨벤션)

## 폴더 컨벤션

- `app/` 라우트는 라우트만, 비즈니스 로직은 `lib/` 또는 컴포넌트로 분리
- `components/`는 카테고리 하위 (`primitives/`, `layout/`, `content/`, `interactive/`)
- `lib/schemas/`에 zod 스키마 모음
- `lib/supabase/`에 클라이언트 (client/server/admin)
- `types/`에 글로벌 타입

## Git

- 브랜치: `feat/...`, `fix/...`, `docs/...`, `chore/...`
- PR 단위는 작게 (200~400 라인 권장)
- 커밋 메시지: `feat: ...`, `fix: ...` (Conventional Commits)
- 머지 전 자가 리뷰 (1인 운영)

## PR 머지 체크

- [ ] `npm run lint` 통과
- [ ] `npm run typecheck` 통과 (`tsc --noEmit`)
- [ ] `npm run build` 성공
- [ ] (있으면) 테스트 통과
- [ ] 디자인 토큰만 사용 (grep `#[0-9a-fA-F]{3,6}` 결과 0)
- [ ] 새 컴포넌트는 `.md` 스펙 있음
- [ ] `> DECISION NEEDED:` 잔존 시 PR 설명에 명시
- [ ] 모바일 360px 확인 (DevTools)
- [ ] 접근성 체크리스트 통과
