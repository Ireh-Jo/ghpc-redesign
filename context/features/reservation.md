---
name: reservation
status: draft
owner: 이레
external-systems: [supabase]
depends-on:
  components: [interactive/calendar, primitives/form, primitives/input, primitives/select, primitives/checkbox, primitives/button, primitives/dialog]
  data: [rooms, reservations]
  features: [form-handling, wayfinding]
---

# 시설(장소) 예약 시스템

> **2026-07-05 신규 스코프 진입.** 확인사항 5개를 카톡으로 담당자에게 전달, 회의 답변 대기 중.
> 담당자 안내대로 **§2(겹침 처리)·§3(신청 규칙)만 확정되면 개발 시작 가능** — 나머지는 마커 달고 진행.

## 목적

교인·기관(학교 포함 여부 미정)이 교회 시설(교육실·체육관·홀 등)의 시간대를 온라인으로 신청하고,
관리자가 승인/거부하는 예약 시스템. 달력에서 점유 현황을 확인할 수 있다.

## 1. 장소 (예약 가능 시설)

카톡 제안 목록 — **"이대로 확정이면 진행"** 상태:

| 장소 | 실내 길찾기 방 코드 (`lib/wayfind/floors.ts`) | 층 |
|---|---|---|
| 제1~8교육실 | `B249` `B248` `B247` `B246` `B236` `B235` `B226` `B222` | B2 |
| 제10교육실 | `B322` | B3 |
| (제9교육실) | — 존재하지 않음 (도면에도 없음, "9 제외"와 일치) | |
| 체육관 (우성체육관) | `B371` | B2·B3 |
| 1세미나실 | `B132` (세미나실) | B1 |
| 연합회의실 | `B126` | B1 |
| 트리니티홀 | `F101` | F1·F2 |
| 비전홀 | `B101` | B1 |
| 글로브홀 | `B201` | B2 |

- 운동장·식당은 **추후** (1차 범위 외).
- **길찾기 연동**: 모든 장소가 실내 길찾기 방 코드와 1:1 매칭됨 → 예약 상세/목록에서 "위치 보기" 링크로
  `/intro#directions` 길찾기 진입 가능 (`rooms.wayfind_code` 컬럼으로 연결).

> DECISION NEEDED: 장소 목록 최종 확정 (회의).

## 2. 겹침 처리 ★가장 중요

같은 장소·같은 시간대에 두 신청이 겹칠 때, **승인 전 신청도 그 시간을 점유한 것으로 볼지**:

- **A안) 신청만 해도 그 시간대는 신청 불가** ← 담당자 추천
- B안) 승인된 것만 불가

> DECISION NEEDED: A/B 확정 (회의). **스키마는 동일** — 차이는 가용성 판정에 포함할 status 집합뿐:
> A안 = `status IN ('pending','approved')`, B안 = `status = 'approved'`.
> 겹침 방지는 Postgres exclusion constraint(`tstzrange` + `btree_gist`)로 DB 레벨 강제 —
> 동시 제출 레이스 컨디션까지 차단됨. A/B에 따라 constraint의 `WHERE (status IN ...)` 절만 교체.

## 3. 신청 규칙

> DECISION NEEDED (회의): 아래 3건.
> - **3일 전 마감** — 시스템에서 차단할지, 안내만 할지. (차단 = zod/서버 검증 + DB CHECK, 안내 = UI 문구만)
> - **신청 가능 시간대** — 예: 오전 6시 ~ 밤 10시. (시간대 밖 시작/종료 차단)
> - **매주 반복 신청** — 예: "매주 화요일 8주" 지원 여부. 지원 시 각 회차를 **개별 행으로 생성**하고
>   `recurrence_group_id`로 묶음(겹침 검사·개별 취소가 단순해짐). 미지원이면 컬럼 자체 불필요.

## 4. 승인·관리

> DECISION NEEDED (회의): 아래 4건.
> - 승인 담당자 (어드민 계정 대상 — 미디어팀? 관리집사?)
> - 승인/거부 결과 통보 방법 — 별도 연락 없음 / 문자 등. (`form-handling.md` "자동 알림 없음(1차)" 원칙과
>   정합 필요 — 문자 발송이면 외부 서비스 의존성 추가라 화이트리스트 검토)
> - 신청자 본인 취소 허용 여부 — 현재는 관리자만. 본인 취소 허용 시 무인증 사이트라 본인 확인 수단 필요
>   (신청 시 발급되는 취소 코드 등) → 복잡도 증가, 1차는 관리자 취소만이 단순
> - 학교 신청도 같은 창구로 받는지

- 승인 UI는 어드민(`/admin/reservations`)에 얹음 — `admin-ui.md` 패턴(목록 → 상세 → 승인/거부) 그대로.

## 5. 화면 표시

- **달력에는 이용기관·용도만 표시. 이름·연락처는 관리자만.** (카톡 제안 — 승인 대기 중이나 개인정보
  최소 노출 원칙상 사실상 확정 방향, `guardrails/04-security-privacy.md`)
  - 구현: 공개용 뷰 `reservations_public`(PII 제외 컬럼만) + 원본 테이블은 익명 SELECT 금지.
- **달력은 홈페이지 자체 달력** (외부 구글캘린더 임베드 아님) — 기존 계획인 `interactive/calendar`
  (react-day-picker, 화이트리스트 등재)를 교회일정(`events`)과 예약 현황 겸용으로 확장.

> DECISION NEEDED: 예약 메뉴의 IA 위치 — GNB 어디에 넣을지 (교회 활동 하위? 별도?). 카톡 범위 외,
> 회의에서 함께 확인. GNB 카테고리 추가 금지 원칙(`guardrails/00-rules.md` DON'T#8) 유의.

## 데이터 (`context/03-data-model.md` §10·§11 — 본 문서와 동시 갱신)

- `rooms` — 장소 마스터 (name, wayfind_code, capacity?, active, order)
- `reservations` — 신청 (room_id FK, applicant_name·phone(PII), org, purpose, starts_at, ends_at,
  status: pending/approved/rejected/cancelled, admin_note, recurrence_group_id?, created_at)
- RLS: 익명 INSERT만(새가족 폼과 동일 패턴), 익명 SELECT는 `reservations_public` 뷰로만, 어드민 ALL.

## 사용자 시나리오

1. 방문자가 달력에서 장소·날짜 선택 → 해당일 점유 현황(기관·용도) 확인
2. 빈 시간대 선택 → 신청 폼(이름·연락처·기관·용도·시간) 작성 → 동의 체크 → 제출
3. (A안 기준) 제출 즉시 해당 시간대는 달력에서 "대기" 표시로 점유
4. 관리자가 어드민에서 승인/거부 → 상태 변경 (통보 방법은 미정)

## 개발 착수 조건 체크리스트

- [ ] §2 겹침 처리 A/B 확정 ← **이것만 되면 스키마 마이그레이션 확정 가능**
- [ ] §3 신청 규칙 3건 확정 ← **이것까지 되면 폼·검증 로직 착수 가능**
- [ ] §1 장소 목록 확정 (기본값: 위 표대로 진행)
- [ ] §4·§5는 미정이어도 개발 진행 가능 (어드민 승인 UI·통보는 후행 작업)

## 선행 의존 작업 (예약과 무관하게 지금 진행 가능)

- `components/primitives/` 세팅 (Form·Input·Select·Checkbox·Dialog·Button) — 새가족 폼과 공유
- Supabase 프로젝트·마이그레이션 파이프라인 첫 구축 — 새가족 폼과 공유
- `interactive/calendar` 골격 — 교회일정용으로 먼저 만들고 예약 현황 확장
