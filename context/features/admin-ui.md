---
name: admin-ui
status: decision-needed
owner: 이레
external-systems: [supabase]
depends-on:
  data: [services, sermons, events, bulletins, posts, staff, ministries, newcomer_submissions, form_submissions]
---

# 미디어팀 어드민 UI

## 목적

미디어팀 2명이 매주 콘텐츠(설교 영상·주보·소식·일정 등)를 직접 업로드하고 관리.

## 옵션 (안건 2-3)

### A. Supabase Studio 그대로 사용
- 개발자용 UI지만 테이블 직접 편집
- 개발 추가 시간 0
- 단점: IT 친숙도 낮으면 진입 장벽, 권한 분리 어려움

### B. 자체 어드민 페이지 직접 제작
- `/admin/*` 라우트, shadcn 기반
- 미디어팀 친화 UI (사진 업로드·텍스트 입력·발행/비공개 토글)
- **+2~3주 추가 공수**
- 장점: 권한·UX 통제, 1인 운영 시 미디어팀 의존도 감소

## 결정 인풋 (수집 필요)

미디어팀 사전 인터뷰 항목:
- 블로그·카페24·유튜브 업로드 등 IT 도구 사용 경험
- 매주 업로드 콘텐츠 종류·양
- 선호 UI 스타일

> DECISION NEEDED: 위 인터뷰 결과 받은 후 A vs B 확정.

## 옵션 B 선택 시 — 어드민 UI 스펙 (초안)

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

## 옵션 A 선택 시 — 보조 작업

- Supabase Studio 사용 매뉴얼 문서 (`context/ops/runbook.md` 보강)
- 미디어팀 계정 권한 분리 (read/write 테이블별)
- 핵심 테이블 RLS·정책 미디어팀 친화 표현 (column 한글 코멘트)

## 미정

- [ ] 옵션 A vs B 최종 결정 (미디어팀 인터뷰 후)
- [ ] 미디어팀 인터뷰 일정
- [ ] 옵션 B 시 디자인 — 공개 페이지와 같은 분위기 vs 어드민 전용 미니멀 (다크 모드 포함)
