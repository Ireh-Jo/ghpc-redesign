---
name: newcomer-form
status: wip
category: interactive
shadcn-base: null
client-component: true
depends-on:
  design: [color, typography, spacing]
  components: [primitives/form, primitives/input, primitives/textarea, primitives/select, primitives/checkbox, primitives/button, primitives/toast]
  features: [form-handling]
used-on-pages: [newcomer, care]
---

# NewcomerForm (`components/interactive/newcomer-form.tsx`)

## 목적

새가족 등록 신청 폼 — `/newcomer#register` + `/care#newfamily` 임베드 (2026-07-05).

## UX 원칙

- 첫 방문자가 부담 없이 쓰도록 필드 최소 (이름·연락처·소속 + 선택 2개).
- 한 화면에 폼만, 모달 없음 (`form-handling.md` UI 패턴).
- 제출 성공 시 폼 자리를 성공 카드로 교체 — toast로 끝내지 않음 (영구 표시).

## 항목 / 타입 / 설명 / 데이터

| 항목 | 타입 | 설명 | 데이터 |
|---|---|---|---|
| 이름 | Input(text) | 필수, max 50 | `name` |
| 연락처 | Input(tel) | 필수, 010 패턴 | `phone` |
| 소속 | Select | 필수 — 장년/청년/대학/중고등/주일학교 | `ageGroup` |
| 알게 된 경로 | Input(text) | 선택, max 200 | `referral` |
| 남기실 말씀 | Textarea | 선택, max 500 | `note` |
| 개인정보 동의 | Checkbox | 필수 true — 미체크 시 제출 차단 | `consentPrivacy` |
| 연락 수신 동의 | Checkbox | 선택 | `consentMarketing` |
| honeypot | hidden input | 봇 방지 — 값 있으면 서버에서 거부 | `website` (스키마 외) |

검증 스키마 단일 출처: `lib/schemas/newcomer.ts` (zod) — 클라이언트(zodResolver) + Server Action 재검증.

## Props

```ts
// props 없음 — 자체 완결 클라이언트 컴포넌트
```

## 인터랙션

- 제출 중: 버튼 disabled + Loader2 스피너
- 검증 실패: 필드 아래 `FormMessage` (brand-point)
- 서버 에러: toast.error + 폼 유지 (입력값 보존)
- 성공: 폼 자리에 성공 카드 (aria-live로 안내)

## 엣지케이스

- 5초 이내 제출 → 서버에서 봇 판정 거부 (`form-handling.md` 봇 방지)
- honeypot 채워짐 → 거부
- 모바일 360px: 1열 세로, input 높이 ≥ 44px
- Supabase 미연결 상태(현재): 서버 액션이 "접수 시스템 준비 중" 에러 반환 — UI·검증은 동작

## 접근성

- 필수 표시 `*`는 `aria-hidden`, 라벨에 시각 숨김 "(필수)" 병기
- 성공 카드 `role="status"` (aria-live polite)
- 에러 색 대비: brand-point on brand-bg ≥ 7:1

## 데이터 소스

`newcomer_submissions` INSERT (익명, consent_privacy=true 강제 — `context/03-data-model.md` §8).
Server Action: `app/_actions/newcomer.ts`. **Supabase 프로젝트 생성 전 — INSERT는 TODO 스텁.**

## 사용 예

```tsx
<SubPage sectionKey="newfamily" overrides={{ register: <NewcomerForm /> }} />
```

## 미정 사항

- [ ] 화면정의서 미수령 — 필드 구성은 `03-data-model.md` §8 잠정 컬럼 기준. 확정 시 `lib/schemas/newcomer.ts` 한 곳 수정
- [ ] 개인정보 처리방침 링크 대상 (`/privacy` 페이지 미존재)
- [ ] 제출 후 안내 문구 확정 (전화·문자 채널 미정 — `form-handling.md`)
