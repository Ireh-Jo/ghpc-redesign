---
name: ApplyForm
category: interactive
status: shipped
owner: 이레
depends-on:
  design: [color, typography, spacing]
  components: [primitives/form, primitives/input, primitives/textarea, primitives/select, primitives/checkbox, primitives/button, primitives/toast]
  features: [form-handling, reservation]
  data: [form_submissions, reservations]
---

# ApplyForm — 신청 폼 공통 렌더러

## 목적

신청서 4종(영상제작 · 3대 후원회원 작정 · 평생교육원 수강 · 시설 이용)을 한 컴포넌트로 처리한다.
넷의 생김새·검증·제출 흐름이 같아 폼마다 JSX를 복붙할 이유가 없다.

**필드 구성은 현행 사이트(ghpc.or.kr)의 같은 폼을 그대로 옮긴 것**이다
(사용자 지시 2026-08-23, 근거: `docs/meetings/2026-08-23-현행사이트-메뉴-전수분석.md`).
바꾼 것은 입력 방식뿐 — 오전/오후 + 시 + 분 select 3단 → `type="time"` 하나.

## 입력

| prop | 타입 | 설명 |
|---|---|---|
| `id` | `FormId` | `lib/forms/definitions.ts`의 폼 정의 키 |

**정의 객체를 prop으로 넘기지 않는다.** 정의 안의 zod 스키마가 클래스 인스턴스라
서버 컴포넌트 → 클라이언트 컴포넌트 직렬화 경계를 넘지 못한다
(`Only plain objects ... can be passed to Client Components`). 페이지는 문자열 id만 넘긴다.

## 필드 종류

`text · tel · email · date · time · textarea · select · checkboxGroup · money`
`groupLabel`이 붙은 필드부터 새 `fieldset`이 시작된다 (현행 폼의 구획을 그대로 옮긴 것).

## 검증·보안

- 검증 단일 출처: `lib/schemas/apply.ts` · `lib/schemas/reservation.ts` (클라이언트 + Server Action 재검증)
- 봇 방지: honeypot(`website`) + 5초 미만 제출 차단 — `newcomer-form`과 동일
- **개인정보 동의 체크 필수.** 폼마다 수집 항목·목적·보유 기간을 문구로 명시하고 `/privacy`와 일치시킨다
- Supabase 미연결 상태에서는 **성공으로 위장하지 않고** "온라인 접수 준비 중 + 사무실 전화" 안내를 반환한다
  (`guardrails/04-security-privacy.md` — RLS 미설계 테이블에 운영 데이터 금지)

## 엣지 케이스

- 3대 후원회원 작정: 금액 7칸이 전부 비면 제출 불가 (`.refine`, 첫 칸에 메시지)
- 시설 이용: 종료일 < 시작일이면 제출 불가. 겹침 방지·3일 전 마감은 **회의 확정 대기**라 미구현
- 평생교육원: 신청 강의 1개 이상 필수
