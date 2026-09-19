---
name: reservation-form
category: interactive
status: wip
pages: [church-admin/reserve]
depends-on:
  design: [color, typography, spacing, iconography]
  components: [primitives/form, primitives/input, primitives/textarea, primitives/checkbox, primitives/button, primitives/toast]
  features: [reservation, form-handling]
---

# ReservationForm (`components/interactive/reservation-form.tsx`)

시설 이용 신청 폼. 다른 신청서 4종과 달리 **전용 컴포넌트**다 — 기간·주간반복·복수 장소·비밀번호·캡차가
공용 렌더러(`ApplyForm`)의 필드 모델(단순 text/select/textarea)로 표현되지 않는다.

정책 단일 출처: `context/features/reservation.md` §결정 잠금 (2026-09-19).
필드는 현행 `/Board/Index/25484`를 기준으로 하고 정책에서 추가된 것만 얹었다.

## 필드

| 필드 | 현행 | 비고 |
|---|---|---|
| 기간 (시작일~종료일) | 있음 | **당일 이전 불가** (정책) |
| 반복 방식 | 없음 | 신설 — **반복 없음(기간 매일) / 주중(월–금) / 매주 / 매월 같은 날짜 / 매월 같은 주·요일** 5종. 횟수 기반은 최대 12회, 기간 기반은 60회 |
| 시간 (시작~종료) | 오전/오후+시+분 3단 select | `type="time"`으로 대체. **08:00~20:00**만 허용 |
| 장소 | 자유 입력 | **복수 선택 체크박스**(`lib/rooms.ts`). 현행이 "1,3,4,8교육실"처럼 쓰던 패턴을 정규화 |
| 이용기관 · 인원 · 이용용도 | 있음 | 그대로 |
| 이용 시설 및 요청사항 | 있음 | 그대로 (선택) |
| 제출자 · 연락처 · 담당 교역자 | 있음 | 그대로 (**PII**) |
| 취소 비밀번호 | 없음 | 신설 — 본인 취소 수단. 4자 이상. **해시로만 저장** |
| 개인정보 동의 | 없음(현행은 게시판) | 신설 — 폼 4종과 동일 패턴 |
| 보안문구 | 이미지 캡차 | **Cloudflare Turnstile**로 대체 |

## 검증 (클라이언트·서버 같은 함수)

`lib/reservations.ts`의 순수 함수를 양쪽에서 쓴다 — 화면에서 막고, 서버에서 다시 막는다.

1. `isWithinOperatingHours` — 08:00~20:00
2. `isBookableDate` — 당일·과거 차단
3. `expandOccurrences` — 반복 방식 → 회차 목록 (없는 날짜·다섯째 주는 건너뜀)
4. `findConflicts` — 회차 × 장소별 겹침 (A안: 취소되지 않은 예약 전부가 점유)

겹침이 있으면 **어느 날짜·어느 장소가 막혔는지** 구체적으로 보여준다 ("10/7 제2교육실 14:00–16:00 이미 예약됨").

미리보기에는 **실제로 만들어질 날짜**(앞 5개 + 마지막)를 함께 보여준다. 월 단위 반복은 건너뛰는 달이 있어
"12회 신청했는데 8회만 잡히는" 상황이 생기는데, 숫자만 보여주면 사용자가 알 수 없다.

## 수정 기능은 없다

정책상 **수정 = 취소 후 재신청** (2026-09-18 TF 제안 → 사용자 승인). 폼에 수정 모드를 만들지 않는다.
이유: 수정은 겹침 재판정·반복 회차 재계산이 얽혀 무인증 환경에서 사고 위험이 크다.

## 제출

`app/_actions/reservation.ts`. Supabase·Turnstile env가 없으면 **성공으로 위장하지 않고** 접수 불가를 반환한다
(`guardrails/04-security-privacy.md` · 폼 4종과 같은 원칙).
