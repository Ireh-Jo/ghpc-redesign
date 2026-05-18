# 00. DO / DON'T — 절대 규칙

> 야생마(AI)에게 마구(harness)를 채우는 룰. 어기면 PR 반려·코드 폐기.

## DO — 무조건 한다

1. **작업 시작 전 `CLAUDE.md` 라우터로 필요한 컨텍스트 파악.** 작업 종류에 맞는 문서만 읽는다. 전체 읽지 말 것.
2. **`context/components/<카테고리>/<이름>.md` 먼저 작성 → 코드.** 컴포넌트 스펙 없이 코드 쓰지 말 것.
3. **컬러·타이포·간격은 `context/design/*` 토큰만 사용.** 임의 HEX·임의 px 금지.
4. **shadcn 컴포넌트는 `components/primitives/`에 래퍼 만든 후 사용.** 페이지에서 shadcn 직접 import 금지 — 디자인 변경 비용 ↑.
5. **모든 폼 입력은 zod 검증.** 클라이언트 + 서버 양쪽. 스키마는 `lib/schemas/`에 단일 출처.
6. **개인정보 테이블은 RLS 정책 작성 후에만 데이터 입력.** `guardrails/04-security-privacy.md` 체크리스트.
7. **모바일 360px 가로 스크롤 없어야 한다.** 새 컴포넌트마다 모바일부터 확인.
8. **이미지에 alt.** placeholder도 의미 있는 alt.
9. **결정사항 변경 시 → `context/` 문서 먼저 수정 → 코드 반영.** 코드만 고치면 다음 작업에서 또 어긋남.
10. **모르면 placeholder + `> DECISION NEEDED:` 코멘트.** 추측해서 박지 말 것.
11. **PR마다 `guardrails/01-code-quality.md` 체크리스트 통과.**

## DON'T — 절대 하지 않는다

1. **임의 컬러 추가 금지.** `context/design/01-color.md` 외 토큰 사용 안 함. "예뻐 보여서" 추가하지 말 것.
2. **이모지 사용 금지.** UI 아이콘은 `lucide-react` 만. (`context/design/04-iconography.md`)
3. **자동재생 캐러셀 금지.** 접근성·성능 저하. 카드 그리드로 대체.
4. **무거운 애니메이션 금지.** 패럴랙스·풀스크린 Lottie·자동 슬라이드 모두 금지. (`context/design/06-motion.md`)
5. **헤더·푸터 통일 깨기 금지.** 5개+ 페이지 모두 동일 마크업. 현재 페이지 active 표시는 OK.
6. **인물 실사진·AI 생성 인물 사용 금지.** 본인 동의 받은 사진만 미디어팀이 어드민으로 업로드. (`context/design/05-imagery.md`)
7. **신학적 단언 금지.** 인사말·신학노선 텍스트는 담임목사 검토본만. AI 생성 금지.
8. **카테고리 추가 금지.** GNB 5개(교회소개·예배와교육·목양과사역·교회활동·새가족)만. 기획서 핵심.
9. **service_role 키 클라이언트 노출 금지.** `lib/supabase/admin.ts`는 서버 전용. `NEXT_PUBLIC_*` 접두사 절대 금지.
10. **하드코딩 시크릿 금지.** API 키·토큰·DB URL은 `.env.local` + Vercel env. 코드에 박지 말 것.
11. **마이그레이션 없이 스키마 변경 금지.** `supabase/migrations/*.sql` 통해서만. 직접 Dashboard SQL 편집은 dev 환경에서만.
12. **시안 자산 직접 import·복붙 금지.** `prototypes/` 코드를 production 코드로 옮길 때는 디자인 토큰·접근성·성능 재검증.
13. **빌드 도구 우회 금지.** `next.config.js`의 `eslint.ignoreDuringBuilds` / `typescript.ignoreBuildErrors` true로 두지 말 것.
14. **`any` 남발 금지.** zod 추론·Supabase 생성 타입 우선 (`guardrails/01-code-quality.md`).

## 작업 중단 트리거

다음 상황이면 즉시 멈추고 사용자에게 묻는다:

- `context/03-data-model.md`에 RLS 정책이 비어 있는데 운영 데이터 입력 지시
- `> DECISION NEEDED:` 마커가 박힌 토큰·기능이 의존 경로에 있음
- `guardrails/03-tech-constraints.md` 화이트리스트에 없는 의존성 추가 요구
- 개인정보 흐르는 컴포넌트인데 동의 처리·RLS 미정
- `prototypes/` 코드를 그대로 production에 박으라는 지시 (재검증 없이)
- 디자인 토큰을 임의값으로 바꾸라는 지시 (`context/design/*` 업데이트 없이)

## 상위 가드레일과의 관계

- `01-code-quality.md` — 코드 품질·테스트·접근성 체크리스트
- `02-design-consistency.md` — 디자인 토큰·일관성 체크리스트
- `03-tech-constraints.md` — 의존성 화이트리스트·금지 패턴
- `04-security-privacy.md` — RLS·env·개인정보
- `05-performance.md` — Core Web Vitals·이미지·번들
