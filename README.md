# 경향교회 홈페이지 — 사용 가이드

> **모드:** 본 개발 (Next.js 14 + Supabase + Vercel)
> 작업자: 이레 단독 · 콘텐츠 운영: 미디어팀 2명 · 오픈 목표: 2026-11말 ~ 12초

이 리포지토리는 **코드보다 컨텍스트가 먼저**다. Claude(또는 다른 AI 도구)와 함께 작업할 때, 우리가 잠가둔 결정사항을 단일 출처로 삼아 일관성을 유지하는 게 핵심.

---

## 1. 핵심 메커니즘 — 한 줄 요약

> **새 채팅을 열고 작업 종류 한 줄만 던지면, Claude가 [CLAUDE.md](CLAUDE.md) 라우터를 보고 필요한 문서만 읽어서 작업한다.**

매번 전체 컨텍스트를 다 읽지 않는다. 작업 종류별로 필요한 문서가 라우터 표에 매핑돼 있고, 컴포넌트 `.md`의 frontmatter `depends-on` 으로 의존 그래프를 자동 따라간다.

---

## 2. 디렉토리 — 어디에 뭐가 있나

```
ghpc/
├── CLAUDE.md            ← Claude 자동 로드. 작업 타입별 읽기 라우터.
├── README.md            ← (이 파일) 사람용 사용 가이드.
│
├── context/             결정사항·스펙 — "무엇을 만드는가 / 어떻게 동작하는가"
│   ├── 00~05            프로젝트 브리프·스택·아키텍처·데이터모델·IA·콘텐츠
│   ├── design/          컬러·타이포·간격·아이콘·이미지·모션 (디자인 토큰)
│   ├── components/      컴포넌트별 풀스펙 (TEMPLATE.md 참고)
│   ├── pages/           페이지 = 컴포넌트 조립도 (실제 작업 시 채움)
│   ├── features/        횡단 기능 (어드민·마이그·생방송·폼·주보)
│   ├── ops/             배포·모니터링·백업·장애대응
│   └── references/      외부 참고 (교회 사이트·shadcn 패턴)
│
├── guardrails/          규칙·체크리스트 — "어기면 폐기"
│   └── 00~05            DO/DONT·코드품질·디자인일관성·기술제약·보안·성능
│
└── prototypes/          시안 자산 동결 (수정 금지, 참고만)
    ├── designs/         5개 HTML 시안 산물
    └── _archive/        구 context/guardrails (결정 이력)
```

---

## 3. 일상 워크플로 — 시나리오 5개

각 시나리오마다 **새 채팅을 열고 시작하는 한 줄 예시**를 적어둠.

### A. 새 컴포넌트 만들기 (예: 캘린더)

> "캘린더 컴포넌트 만들어줘. `/activity` 페이지 월/주 토글용."

Claude가 하는 것:
1. [CLAUDE.md](CLAUDE.md) 라우터에서 "새 컴포넌트 만들기" 행 확인
2. `context/design/*` 전체 + `context/components/00-inventory.md` + `guardrails/00,02` 읽음
3. `components/interactive/calendar.md`가 없으면 [TEMPLATE.md](context/components/TEMPLATE.md) 복사해서 frontmatter 채우고 시작
4. `depends-on`에 적힌 의존 토큰·컴포넌트·feature 추가 로드
5. 스펙 합의 후 코드 (`components/interactive/calendar.tsx`)

**팁:** "스펙부터 잡고 코드는 다음에" 또는 "스펙+코드 한 번에" 명시하면 더 매끄러움.

---

### B. 페이지 구현 (예: 메인)

> "메인 페이지 `/` 구현하자. 헤로 영상부터."

Claude가 하는 것:
1. 라우터 "페이지 구현" 행 확인
2. `context/pages/01-main.md` 읽음 (없으면 [pages/README.md](context/pages/README.md) frontmatter 템플릿으로 생성 먼저)
3. 그 페이지의 `composes` 필드 따라 각 컴포넌트 `.md` 로드
4. `context/04-information-architecture.md`, `context/05-content-inventory.md` 참조
5. `app/(site)/page.tsx` 작성

---

### C. 디자인 토큰 변경 (예: 컬러 미세 조정)

> "본문 텍스트 색을 `#18253F`에서 `#1A2640`으로 바꾸고 싶어. 영향 받는 곳 보여줘."

Claude가 하는 것:
1. 라우터 "디자인 토큰 변경" 행 확인
2. `context/design/*` 전체 + `context/components/00-inventory.md` (영향 컴포넌트 식별) 읽음
3. `context/design/01-color.md` 먼저 수정 → `app/globals.css` → `tailwind.config.ts` → 컴포넌트 코드 순
4. 영향 컴포넌트 grep해서 시각 확인 필요한 곳 알려줌

**중요:** 코드만 고치고 문서 안 고치면 다음 작업 때 또 어긋남. **항상 문서 먼저.**

---

### D. 결정사항 확정 (`> DECISION NEEDED:` → 잠금)

> "어드민 UI 옵션 B(자체 제작)로 결정됐어. 잠그자."

Claude가 하는 것:
1. `git grep -n 'DECISION NEEDED' context/features/admin-ui.md` 로 미정 마커 찾음
2. 해당 부분 잠금 텍스트로 갱신 + "LOCKED YYYY-MM-DD" 표기
3. 영향 받는 다른 문서 갱신 (`context/02-architecture.md`의 `/admin/*` 라우트 등)
4. 잠금 이후 그 결정을 의존하는 작업이 풀릴 수 있다고 알림

---

### E. 새 의존성 추가

> "주소 검색 라이브러리 `daum-postcode` 추가하고 싶어."

Claude가 하는 것:
1. 라우터 "새 의존성 추가" 행 → `guardrails/03-tech-constraints.md` 화이트리스트 확인
2. 없으면 멈추고 PR 사유 요구 (왜 필요한가 / 대안 / 번들 사이즈)
3. 합의되면 화이트리스트 갱신 + 코드 도입

---

## 4. 새 채팅 시작하는 좋은 1문장 패턴

```
[작업 타입]: [구체 대상] [추가 제약]
```

예시:
- "새 컴포넌트: SermonCard. /와 /worship 양쪽에서 씀."
- "페이지 구현: /intro. 50주년 영상 헤로부터."
- "Supabase 스키마: `sermons` 테이블 마이그 작성. RLS 포함."
- "디자인 토큰 변경: 보더 색 미세 조정."
- "결정 잠금: 미디어 서버 영상 → 유튜브 일원화."
- "장애 대응: Vercel에서 빌드 실패. 로그 봐줘."

**나쁜 예시 (왜 나쁜가):**
- "캘린더 어떻게 할까?" — 너무 모호. 작업 타입 불명. → "새 컴포넌트: 캘린더"
- "메인 페이지 좀 해줘" — 범위 불명. → "페이지 구현: /. 헤로+예배안내 섹션까지."

---

## 5. 새 채팅창에서 이어가기 — 그래도 되나?

**그렇다.** 이 구조 자체가 그 목적으로 설계됨.

**작동 원리:**
- 모든 채팅이 시작될 때 [CLAUDE.md](CLAUDE.md) 가 자동 로드됨 (Claude Code 기본 동작)
- 잠긴 결정사항은 모두 `context/`·`guardrails/` 파일에 있으니 채팅 히스토리 없이도 재구성 가능
- Claude는 작업 타입에 맞는 문서만 골라 읽기 때문에 컨텍스트 윈도우 부담 적음
- 메모리 시스템(자동)도 누적되므로 다음 채팅이 더 매끄러워짐

**주의사항:**
- 채팅 중에 잠근 결정사항을 **문서에 반영했는지** 확인. 채팅에서만 "결정함" 하고 문서 안 고치면 다음 채팅 Claude는 모름.
- `> DECISION NEEDED:` 마커가 작업 경로에 있으면 Claude가 멈추고 물어볼 것. 무시하라고 하지 말 것 — 추측해서 박으면 일관성 깨짐.
- 새 채팅 첫 메시지는 작업 타입 한 줄로 시작하는 게 가장 효율적.

---

## 6. 다음 작업 후보 — 우선순위 순

### 즉시 가능 (현재 잠긴 결정만으로)

1. **PoC 환경 셋업**
   - 가이드: [context/ops/deployment.md](context/ops/deployment.md) 첫 배포 체크리스트
   - 한 줄 시작: "PoC 환경 셋업: Next.js + Supabase + Vercel 무료 플랜으로 hello-world 띄우자."
   - 산출물: 빈 메인 페이지가 https://...vercel.app 에 떠 있고 도메인 연결 직전까지

2. **shadcn/ui init + 디자인 토큰 매핑**
   - 가이드: [context/references/shadcn-patterns.md](context/references/shadcn-patterns.md)
   - 한 줄 시작: "shadcn init 하고 우리 brand 토큰을 shadcn 변수에 매핑하자."
   - 산출물: `components/ui/` 생성, `app/globals.css`에 HSL 변환된 brand 토큰, button 1개 추가해서 동작 확인

3. **컴포넌트 스펙 1개 풀로 채워보기 (TEMPLATE 검증)**
   - 후보: `Button` (가장 단순) 또는 `HeroVideo` (가장 임팩트 큼)
   - 한 줄 시작: "새 컴포넌트: primitives/button. TEMPLATE 풀로 채워보자."
   - 산출물: `context/components/primitives/button.md` (frontmatter + 항목/타입/설명/데이터 + 인터랙션 + 엣지케이스) + `components/primitives/button.tsx`

### 안건 회의 후 (외부 결정 필요)

4. **화면정의서 수령(6월 말) 후** → [context/03-data-model.md](context/03-data-model.md) 컬럼 디테일 확정 + `supabase/migrations/0001_initial.sql` 작성
5. **미디어 서버 정보 수령 후** → [content-migration.md](context/features/content-migration.md), [video-embed.md](context/features/video-embed.md) 잠금
6. **디자이너 협업 방식 결정 후** → 협업 흐름 문서 추가 (Figma → 코드 컨버전 패턴)
7. **미디어팀 인터뷰 후** → [admin-ui.md](context/features/admin-ui.md) 옵션 A/B 잠금

### 본격 페이지 작업 (위 1~3 마친 후)

8. **메인 페이지 골격** → [context/pages/01-main.md](context/pages/README.md) 작성 후 `app/(site)/page.tsx`
9. **Header / Footer / MobileNav** → 전 페이지 공유 레이아웃
10. **새가족 폼** → 개인정보 흐름 + RLS + 동의 처리. 가드레일이 가장 빡센 부분이라 일찍 잡고 가는 게 좋음.

---

## 7. 자주 하는 실수 / 함정

| 실수 | 왜 안 되나 | 대신 어떻게 |
|---|---|---|
| 채팅에서 결정만 하고 문서 안 고침 | 다음 채팅 Claude는 모름 | "결정 잠금" 시나리오로 문서 갱신 요청 |
| `prototypes/`의 HTML을 그대로 복붙 | 시안은 Tailwind CDN + 임시 HEX. 본 개발은 토큰 기반 | 컴포넌트 스펙(.md) 먼저 작성 후 코드 |
| `> DECISION NEEDED:` 무시하고 진행 | 추측한 값이 다른 결정과 충돌 | 결정 잠그거나, 잠기지 않은 채로 진행할 거면 명시적으로 "임시값" 표기 |
| 디자인 토큰 외 HEX 직접 사용 | 변경 비용 폭증 | `context/design/*` 토큰만. 새 색 필요하면 토큰부터 추가 |
| shadcn 컴포넌트를 페이지에서 직접 import | 디자인 변경 시 페이지마다 손 | `components/primitives/` 래퍼 거침 |
| service_role 키 클라이언트 노출 | 보안 사고 | `lib/supabase/admin.ts` 서버 전용 |
| 가드레일 화이트리스트 외 의존성 추가 | 번들 비대·1인 운영 부담 | PR 사유 작성 후 화이트리스트 갱신 |

---

## 8. 도구 / 명령어 (참고)

```bash
# 디자인 토큰 외 HEX 사용 확인
git grep -nE '#[0-9a-fA-F]{6}\b' -- '*.tsx' '*.ts' '*.css' | grep -v 'globals.css'

# DECISION NEEDED 마커 찾기
git grep -n 'DECISION NEEDED' context/ guardrails/

# 컴포넌트 인벤토리에 등록된 컴포넌트 vs 실제 코드 매칭
ls components/**/*.tsx
grep -nE '^\| [A-Z]' context/components/00-inventory.md

# Supabase 타입 생성
supabase gen types typescript --project-id <id> > types/database.ts

# 마이그
supabase db push
```

---

## 9. 잠금된 핵심 결정 (요약)

| 영역 | 잠긴 값 | 출처 |
|---|---|---|
| 스택 | Next.js 14 (App Router) + Supabase + Vercel | [context/01-stack.md](context/01-stack.md) |
| 컬러 | Logo Brand v2 (7토큰) | [context/design/01-color.md](context/design/01-color.md) |
| 분위기 | 따뜻한·환영하는·모던한·영상 중심 | [context/design/00-mood.md](context/design/00-mood.md) |
| 폰트 | Pretendard Variable 단독 | [context/design/02-typography.md](context/design/02-typography.md) |
| 아이콘 | lucide-react, stroke 1.5 | [context/design/04-iconography.md](context/design/04-iconography.md) |
| GNB | 5개 + 새가족 + 생방송 CTA | [context/04-information-architecture.md](context/04-information-architecture.md) |
| 도메인 | https://www.ghpc.or.kr/ (.or.kr 유지) | [context/ops/domain-dns.md](context/ops/domain-dns.md) |
| 유튜브 | UCpPEfMA_nBf1koFnjyKu1pg | [context/05-content-inventory.md](context/05-content-inventory.md) |

---

## 10. 막혔을 때

- "어디부터 봐야 할지 모르겠어" → [CLAUDE.md](CLAUDE.md) 라우터 표 다시 보거나 Claude에게 작업 종류 물어보기
- "결정이 너무 많이 미정이라 진행이 안 됨" → `git grep -n 'DECISION NEEDED'` 으로 차단 항목 목록화 → 안건 문서에 추가 → 회의에서 결정
- "Claude가 잘못된 가정을 하고 있는 것 같음" → 어떤 문서가 잘못됐는지 식별 → 문서 먼저 수정 → 새 채팅으로 재시작
- "이 가이드 자체를 바꾸고 싶음" → 이 파일도 그냥 수정 OK. 워크플로 진화하면 갱신.
