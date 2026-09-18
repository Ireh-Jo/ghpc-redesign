---
name: reservation-calendar
category: interactive
status: wip
pages: [church-admin/reserve]
depends-on:
  design: [color, typography, spacing, motion]
  components: []
  features: [reservation]
---

# ReservationCalendar (`components/interactive/reservation-calendar.tsx`)

시설 예약 **월간 달력**. 빈 시간을 눈으로 확인하고 신청하도록 폼 위에 놓는다.

정책 단일 출처: `context/features/reservation.md` §결정 잠금 (2026-09-19).

## Props

| 이름 | 타입 | 설명 |
|---|---|---|
| `reservations` | `PublicReservation[]` | 공개 정보만 (`lib/reservations.ts`). 이름·연락처는 **여기 오지 않는다** |

## 공개 범위 (개인정보)

달력에 표시하는 것: **장소 · 이용기관 · 용도 · 시간**. 이름·연락처는 관리자 화면에서만 본다
(2026-09-19 담당자 확정 · `guardrails/04-security-privacy.md`). Supabase 연결 후에는 공개 뷰
`reservations_public`에서만 읽어 **PII가 클라이언트로 갈 경로 자체를 없앤다.**

## 동작

- 월 이동(이전/다음) · "오늘" 버튼. 날짜를 누르면 그날 예약 목록이 달력 아래에 펼쳐진다
- **장소 필터** — 전체 / 특정 장소. 장소별로 겹침이 판정되므로 필터가 곧 가용성 확인 수단이다
- 날짜 칸에는 건수 배지 + 최대 2건 요약, 넘치면 `+N`
- 지난 날짜는 흐리게, 오늘은 테두리 강조. **당일·과거는 신청 불가**라 시각적으로도 구분한다

## 엣지케이스

- 예약 0건인 달: 빈 달력 + "이 달에는 등록된 예약이 없습니다"
- 같은 예약이 여러 장소를 잡은 경우: **장소별로 분리된 행**으로 표시 (겹침 판정 단위와 일치)
- 반복 예약: 회차마다 독립 행이므로 해당 날짜에만 나타난다
