# Features — 횡단 기능

> 단일 컴포넌트로 떨어지지 않는 기능 단위. 보통 여러 컴포넌트 + 데이터 + 외부 시스템이 엮임.

## 파일

| 파일 | 영역 | 상태 |
|---|---|---|
| `admin-ui.md` | 미디어팀 어드민 (안건 2-3) | locked (옵션 B) |
| `design-workflow.md` | 디자이너 협업 방식 (안건 2-2) | locked |
| `content-migration.md` | 기존 미디어 서버 → Supabase 마이그레이션 | draft |
| `live-streaming.md` | 주일/수요 생방송 임베드·LIVE 상태 표시 | draft |
| `video-embed.md` | 유튜브 / 기존 미디어 서버 영상 임베드 | draft |
| `form-handling.md` | 신청·등록 폼 공통 처리 (검증·전송·알림·동의) | draft |
| `bulletin-pdf.md` | 주보 PDF 업로드·표시 (Supabase Storage) | draft |
| `wayfinding.md` | 실내 길찾기 (5개 층, 프로토타입 완성) | locked (레퍼런스: `prototypes/wayfind/`) |
| `reservation.md` | 시설(장소) 예약 시스템 — 신청·승인·달력 (2026-07-05 신규) | draft (확인사항 5건 회의 대기) |

## feature .md frontmatter 템플릿

```yaml
---
name: live-streaming
status: draft
owner: 이레
external-systems: [youtube, ghpc-media-server]
depends-on:
  components: [interactive/live-badge, content/youtube-embed]
  data: [sermons, services]
---

# 생방송

## 목적
## 현 상태 (사실관계)
## 사용자 시나리오
## 데이터 흐름
## UI 표면 (영향 컴포넌트)
## 운영 절차 (미디어팀이 매주 무엇을 하는가)
## 엣지케이스
## 결정 사항 / 미정 사항
```

## 우선순위

1. **content-migration.md** — 기존 콘텐츠 구조 파악 없이는 데이터 모델 완성 불가 (안건 2-1 의존)
2. **live-streaming.md** + **video-embed.md** — 미디어 서버 정보 수령 후
3. **form-handling.md** — 새가족 폼이 최우선 폼
4. **admin-ui.md** — 옵션 B 잠금. 8월 후반 골격 착수
5. **bulletin-pdf.md** — Supabase Storage 패턴 확립 후
