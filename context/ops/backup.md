# Ops — 백업·복구

## DB 백업 (Supabase)

- **자동 백업**: 무료 플랜은 7일 PITR(Point-in-Time Recovery) 미포함. Pro 플랜($25/월)부터 7일 PITR.
- 1차 오픈은 무료로 시작, 트래픽·중요도 보고 Pro 전환 검토.

### 무료 플랜 보완책
- **수동 스냅샷**: 주 1회 `pg_dump` 로컬 + 외부 스토리지(개인 Drive/S3) 저장
- 스크립트:
```bash
# scripts/backup.sh
DATE=$(date +%Y%m%d)
supabase db dump --project-ref <id> -f backups/db-$DATE.sql
gzip backups/db-$DATE.sql
# 외부 업로드 (rclone 등)
```
- `cron` 또는 GitHub Action으로 주 1회 자동화

> DECISION NEEDED: Pro 플랜 전환 시점. 폼 데이터(개인정보) 축적되기 시작하면 PITR 가치 ↑.

## Storage 백업

- Supabase Storage는 자동 백업 없음 (Pro 포함)
- 주보 PDF·이미지 등은 **원본을 별도 보관** 권장
- 미디어팀에 운영 매뉴얼: 업로드 전 원본 보관 (`context/ops/runbook.md`)

## 코드 백업

- GitHub (private 리포지토리) — 자동
- 도메인·계정 정보: 1Password (안건 4) — 여러 명 공유

## 복구 시나리오

### 시나리오 1: 데이터 잘못 수정·삭제
- Pro 플랜: PITR로 N분 전 상태로 복원
- 무료: 마지막 수동 스냅샷 시점으로 복원 (데이터 손실 최대 1주)
- 대응: 발견 즉시 작업 중단, 백업 시점 확인, 복원 결정

### 시나리오 2: Supabase 프로젝트 장애·삭제
- Supabase 측 장애: status.supabase.com 확인, 자동 복구 대기
- 프로젝트 실수 삭제: 백업 스냅샷 → 새 프로젝트 복원
- 환경 변수 (Vercel) 교체 → 재배포

### 시나리오 3: Vercel 장애
- 사이트 다운 — 다른 호스팅으로 임시 이전 검토
- 정적 페이지(메인·교회소개)는 GitHub Pages·Cloudflare Pages로 비상 운영 가능
- DB가 살아 있어야 폼·동적 데이터 작동 → Supabase URL은 그대로

### 시나리오 4: 도메인 만료
- 안건 4: 도메인 정보 1Password 공유
- 자동 갱신 설정 (등록 대행 사이트)
- 만료 30일 전 이메일 알림

## 운영 절차

| 주기 | 작업 |
|---|---|
| 매주 | 수동 DB 스냅샷 (무료 플랜 시) |
| 매월 | 백업 파일 무결성 확인 (랜덤 1개 복원 테스트) |
| 분기 | 전체 복구 시나리오 리허설 (30분, 안건 4) |

## 결정 안 된 것

- [ ] Pro 플랜 전환 시점
- [ ] 외부 백업 저장소 (Drive vs S3 vs Backblaze)
- [ ] 복구 책임자 비상 연락 체계 (안건 2-4)
