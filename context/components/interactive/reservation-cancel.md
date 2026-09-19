---
name: reservation-cancel
category: interactive
status: wip
pages: [church-admin/reserve]
depends-on:
  design: [color, typography, spacing, iconography]
  components: [primitives/input, primitives/button, primitives/toast]
  features: [reservation]
---

# ReservationCancel (`components/interactive/reservation-cancel.tsx`)

달력의 날짜 상세에서 예약 한 건을 **비밀번호로 취소**한다. 정책: `context/features/reservation.md` §결정 잠금.

## 왜 취소만 있고 수정은 없나

정책상 **수정 = 취소 후 재신청** (2026-09-18 TF 제안 → 사용자 승인). 수정은 겹침 재판정·반복 회차
재계산이 얽혀 무인증 환경에서 사고 위험이 크다.

## 취소 범위 (2026-09-19 사용자 확정)

| 상황 | 화면 |
|---|---|
| **단건 예약** | 범위를 **묻지 않는다.** 비밀번호만 넣으면 그 건이 취소된다 |
| **반복 예약** | `이 회차만` / `남은 회차 전부(N건)` 중 선택. 기본값은 **이 회차만** (덜 위험한 쪽) |

- "남은 회차"는 **오늘 이후**만 센다 — 지난 회차는 취소 대상이 아니다 (`seriesRemaining`)
- 남은 게 이 건뿐이면 반복이라도 단건처럼 취급한다 (선택지를 띄울 이유가 없다)
- 전체 취소는 되돌릴 수 없으므로 **몇 건이 취소되는지 숫자를 문구에 넣는다**

## 왜 이 판단이 무거운가 (문구를 신중히 쓰는 이유)

겹침이 A안(신청=점유)이라, 전체 취소는 그 시간대를 **모두에게 여는** 행동이다. 한 회차를 빼려고 전체를
취소하면 다시 신청하는 사이 다른 부서가 채갈 수 있다. 그래서 기본값을 "이 회차만"으로 두고,
전체 취소를 고를 때 대상 건수를 분명히 보여준다.

## 보안

- 비밀번호는 서버로만 가고 **해시와 대조**한다 (`cancel_reservation` RPC). 클라이언트는 판정하지 않는다
- 실패 응답은 "일치하지 않습니다" 하나로 통일 — 예약 존재 여부를 알려주지 않는다
- 매크로 방지는 **Turnstile 재검증**으로 충분하다고 확정 (2026-09-19). 실패 횟수 기록 테이블은 두지 않는다
