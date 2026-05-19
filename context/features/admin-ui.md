---
name: admin-ui
status: locked
locked-at: 2026-05-19
owner: 이레
external-systems: [supabase]
depends-on:
  data: [services, sermons, events, bulletins, posts, staff, ministries, newcomer_submissions, form_submissions]
---

# 미디어팀 어드민 UI — LOCKED: 옵션 B (자체 제작)

## 목적

미디어팀 2명이 매주 콘텐츠(설교 영상·주보·소식·일정 등)를 직접 업로드하고 관리.

## 잠금 결정 (2026-05-19)

**옵션 B (자체 어드민 페이지) 채택.** 사유:
- 미디어팀 IT 친숙도 매우 낮음 (서리: "프로그램 만지는 건 어렵다", "그냥 업로드하는 정도 뿐이었다")
- Supabase Studio는 개발자용 UI라 진입 장벽이 너무 높음 → 미디어팀이 못 쓰면 이레가 매주 대신 입력하게 됨 → 1인 운영 부담 ↑
- 옵션 B 추가 공수(+1달, PM 산정)를 감수하는 게 장기 운영비용 ↓

## 일정 — 8월 후반 조기 착수

원래 안건 일정에선 9월 통째로 "게시판 + 어드민 + 콘텐츠 마이그"였으나 도미노 리스크가 커서 **8월 후반 2주에 어드민 골격 조기 착수**:

| 시점 | 작업 |
|---|---|
| 8월 후반 (2주) | 어드민 골격 — 인증·미들웨어·테이블 CRUD 페이지(목록+편집 폼) |
| 9월 전반 | 어드민 UX 다듬기 (미디어팀 친화) + 게시판 |
| 9월 후반 | 콘텐츠 마이그레이션 (미디어 서버 정보 수령 후) |

## ~~옵션 A~~ (참고 보존)

원래 검토했던 안: Supabase Studio 직접 사용. 위 사유로 폐기.

## 어드민 UI 스펙

### 라우트
```
/admin                  대시보드 (이번 주 할 일)
/admin/sermons          설교 목록·생성·편집
/admin/services         예배 시간표 관리
/admin/events           일정 캘린더 관리
/admin/bulletins        주보 업로드
/admin/posts            소식 (영상/텍스트/교우/교단)
/admin/staff            섬기는 사람들
/admin/ministries       사역 관리
/admin/submissions      새가족·신청 폼 수신함 (개인정보 보호)
```

### 공통 패턴
- 좌측 사이드바 네비 + 우측 메인
- 목록 = shadcn DataTable
- 폼 = shadcn Form + zod
- 이미지 업로드 = Supabase Storage 다이렉트 (signed URL)
- 발행/비공개 토글 = 큰 스위치
- "예약 발행" 기능은 1차 범위 제외 (`published_at` 수동)

### 인증·권한
- `auth.users` + 이메일 화이트리스트 또는 `profiles.is_admin`
- middleware로 `/admin/*` 가드
- service_role 키는 서버 사이드만, 클라이언트는 anon + RLS

### 개인정보 화면 (`/admin/submissions`)
- 새가족·신청 폼 데이터
- 마스킹 옵션 (기본: 연락처 가운데 4자리 마스킹, 클릭 시 풀 노출)
- 처리 완료 토글 → `processed=true`
- **다운로드 로그** 기록 (누가 언제 데이터 조회/내보냈는지)
- 보존 기한 경과 데이터 표시 (1년 초과 → 익명화 알림)

## 미디어팀 사용성 — 옵션 B의 전제 조건

옵션 B를 택한 이유가 "미디어팀이 쓸 수 있게" 이므로, 어드민은 매뉴얼 없이도 이해되는 UX가 목표:
- 화면당 동작은 하나의 주요 행동에 집중 (목록 → 편집 → 발행)
- 전문 용어 대신 미디어팀 언어 사용 ("게시" / "임시저장" / "숨김")
- 파괴적 동작(삭제)은 확인 단계 + 되돌리기 안내
- 운영 매뉴얼은 스크린샷 기반 의무 작성 (`context/ops/runbook.md`)

## 미정

- [ ] 어드민 디자인 — 공개 페이지와 같은 분위기 vs 어드민 전용 미니멀 (다크 모드 포함)
- [ ] 어드민 골격 완성 후 미디어팀 사용성 테스트 일정 (9월 전반)
