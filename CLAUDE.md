# 경향교회 홈페이지 — 작업 컨텍스트

> **모드:** 본 개발 (Next.js 14 + Supabase + Vercel)
> 시안 산물은 `prototypes/`에 동결 보관. 시안 컨텍스트/가드레일은 `prototypes/_archive/`.

## 절대 규칙 — 어기지 마라

1. **결정 잠금 우선.** 디자인 토큰·IA·콘텐츠 결정사항은 `context/design/*`·`context/04-information-architecture.md`·`context/05-content-inventory.md`가 단일 출처. 코드보다 문서가 먼저 바뀐다.
2. **컴포넌트는 카테고리 안에 있다.** primitives(shadcn 래퍼) / layout / content / interactive. 새 컴포넌트는 `context/components/00-inventory.md`에 먼저 등록 → frontmatter 채운 .md 만든 후 코드.
3. **결정 안 된 것은 `> DECISION NEEDED:` 마커로 표시.** 추측해서 코드에 박지 말 것.
4. **개인정보·민감 값은 절대 커밋 금지.** `.env.local` 만 사용. RLS 미설계 테이블은 운영 데이터 넣지 말 것 (`guardrails/04-security-privacy.md`).
5. **시안 자산은 참고만.** `prototypes/`의 HTML·예전 컨텍스트는 **결정 이력**으로만 본다. 직접 import·복붙 금지.

## 작업 모드별 읽기 라우터

Claude는 작업 종류에 맞는 문서만 읽으면 충분하다. 전체 컨텍스트를 다 읽지 말 것.

| 작업 | 반드시 읽어라 | 필요 시 |
|---|---|---|
| **새 컴포넌트 만들기** | `context/design/*` 전체 · `context/components/00-inventory.md` · 해당 컴포넌트 `.md` · `guardrails/00-rules.md` · `guardrails/02-design-consistency.md` | `context/features/<관련>.md` |
| **기존 컴포넌트 수정** | 해당 컴포넌트 `.md` (frontmatter의 `depends-on` 따라 토큰·의존 컴포넌트 추가 로드) · `guardrails/02-design-consistency.md` | `context/design/*` |
| **페이지 구현** | `context/pages/<n>-*.md` → 그 페이지의 `composes` 컴포넌트들의 `.md` · `context/04-information-architecture.md` | `context/design/*` |
| **Supabase 스키마·쿼리** | `context/03-data-model.md` · `guardrails/04-security-privacy.md` | `context/features/<관련>.md` |
| **인증·권한 (RLS)** | `context/03-data-model.md` · `guardrails/04-security-privacy.md` | - |
| **콘텐츠 마이그레이션** | `context/features/content-migration.md` · `context/03-data-model.md` · `context/05-content-inventory.md` | - |
| **어드민 UI** | `context/features/admin-ui.md` · `context/03-data-model.md` · `guardrails/04-security-privacy.md` | `context/design/*` |
| **영상·생방송 임베드** | `context/features/live-streaming.md` · `context/features/video-embed.md` | - |
| **배포·환경변수** | `context/ops/deployment.md` · `guardrails/04-security-privacy.md` | - |
| **모니터링·장애 대응** | `context/ops/monitoring.md` · `context/ops/runbook.md` | - |
| **디자인 토큰 변경** | `context/design/*` 전체 · `context/components/00-inventory.md` (영향 받는 컴포넌트 식별) · `guardrails/02-design-consistency.md` | - |
| **성능 튜닝** | `guardrails/05-performance.md` · `context/02-architecture.md` | - |
| **새 의존성 추가** | `guardrails/03-tech-constraints.md` (화이트리스트 확인) | - |

## frontmatter 의존성 그래프

`context/components/**/*.md`와 `context/pages/*.md` 상단의 `depends-on` / `composes` 필드를 따라가면 필요한 문서만 자동 식별된다.

```yaml
depends-on:
  design: [color, typography, spacing, iconography]   # context/design/01-color.md ...
  components: [primitives/button, primitives/popover] # context/components/...
  features: [calendar-data]                            # context/features/calendar-data.md
```

## 디렉토리 구조

```
context/
├── 00-brief.md                  목표·대상·일정·범위
├── 01-stack.md                  Next.js + Supabase + Vercel 선택 근거
├── 02-architecture.md           App Router 구조·디렉토리·데이터 플로우
├── 03-data-model.md             Supabase 스키마·RLS·테이블별 ERD
├── 04-information-architecture.md
├── 05-content-inventory.md
├── design/                      컬러·타이포·간격·아이콘·분위기 (자주 참조)
├── components/                  컴포넌트별 풀스펙 (항목/타입/설명/데이터 + 인터랙션 + 엣지케이스)
├── pages/                       페이지 = 컴포넌트 조립도
├── features/                    횡단 기능 (어드민·마이그·생방송 등)
├── ops/                         배포·모니터링·장애 대응
└── references/                  외부 레퍼런스 사이트·패턴
guardrails/
├── 00-rules.md                  DO / DON'T
├── 01-code-quality.md           TS strict · 테스트 · 접근성
├── 02-design-consistency.md     토큰만 사용 · 임의값 금지
├── 03-tech-constraints.md       의존성 화이트리스트 · 금지 패턴
├── 04-security-privacy.md       RLS · env · 개인정보
└── 05-performance.md            Core Web Vitals · 이미지 · 번들
prototypes/                      시안 산물 동결 (수정 금지)
```

## 작업 중단 트리거

다음 상황이면 즉시 멈추고 묻는다:

- `context/03-data-model.md`에 RLS 정책이 비어 있는데 운영 데이터를 넣으라는 지시
- `> DECISION NEEDED:` 마커가 박힌 디자인 토큰이 있는데 그걸 사용하는 컴포넌트를 만들라는 지시
- `guardrails/03-tech-constraints.md` 화이트리스트에 없는 의존성 추가 요구
- 새가족 등록·신청 폼처럼 개인정보가 흐르는 컴포넌트인데 RLS·동의 처리 정의가 없는 상태

## 메모

- 현재 작업자: 이레 (단독 개발)
- 콘텐츠 운영: 미디어팀 2명
- 디자이너 협업: 미정 (Figma만 vs Figma+AI 도구 — 안건 2-2 참조)
- 도메인: https://www.ghpc.or.kr/ (.or.kr 유지)
- 공식 유튜브: https://www.youtube.com/channel/UCpPEfMA_nBf1koFnjyKu1pg
