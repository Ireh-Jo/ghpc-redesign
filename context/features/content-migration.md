---
name: content-migration
status: blocked
owner: 이레
external-systems: [ghpc-current-site, ghpc-media-server, youtube]
depends-on:
  data: [sermons, posts, bulletins, events]
---

# 콘텐츠 마이그레이션

## 목적

현 ghpc.or.kr 사이트와 별도 미디어 서버에 있는 콘텐츠(설교·주보·소식·영상)를 신규 Supabase로 이전.

## 차단 사유 (블락)

- 미디어 서버 접속 정보 미수령 (안건 2-1)
- 콘텐츠 메타정보 구조 미파악 (제목·일자·카테고리)
- 현재 사이트의 콘텐츠 연결 방식 (링크/임베드) 미파악

→ **이 항목들이 풀려야 작업 가능.**

## 작업 가설 (수령 후 구체화)

### 1. 현황 조사
- 현 사이트 게시판 종류·게시물 수 카운트
- 미디어 서버 영상 수·메타·파일 포맷
- 이미지·PDF 저작권·라이선스 확인

### 2. 마이그 범위 결정
- **전체 이전 vs 최근 N년만** — 콘텐츠 양에 따라
- 영상: 미디어 서버 → 유튜브 채널 (`UCpPEfMA_nBf1koFnjyKu1pg`)로 일괄 업로드 후 youtube_id만 보관
  - 자체 미디어 서버 유지 = 비용 + SSL + 백업 부담 (1인 운영 리스크)
  - 유튜브 일원화 = 운영 단순, 단 일부 영상은 비공개 처리 필요할 수 있음

> DECISION NEEDED: 미디어 서버 → 유튜브 일원화 vs 미디어 서버 유지 + 신규에서 임베드.

### 3. 자동화 스크립트 (검토)
- 게시물 수 100+ 이면 스크립트 필수
- 파이썬 또는 Node — 크롤링/스크래핑 → 변환 → Supabase Insert
- 이미지: 다운로드 → Supabase Storage 업로드 → URL 치환

### 4. 검증
- 카운트 일치 (구 N건 ↔ 신 N건)
- 샘플 100건 시각 비교 (글·이미지·링크)
- 검색 가능 여부 (slug·published_at 기준)

### 5. DNS 전환 후
- 구 사이트 URL → 신 사이트 URL 매핑 (301)
- 검색엔진 sitemap 갱신

## 데이터 매핑 가설

| 출처 | 목적지 테이블 | 변환 메모 |
|---|---|---|
| 구 게시판 "설교" | `sermons` | youtube_id 추출·날짜 파싱·말씀본문 분리 |
| 구 게시판 "주보" | `bulletins` | PDF 다운로드 → Storage `bulletins` 버킷 |
| 구 게시판 "교회소식" | `posts` (category=news) | 본문 HTML → markdown |
| 구 게시판 "영상뉴스" | `posts` (category=video_news) | youtube_id 매핑 |
| 구 게시판 "교우소식" | `posts` (category=members) | **개인정보 검토** — 본인 동의 없는 이름 노출 정책 |
| 미디어 서버 영상 | YouTube 업로드 → `sermons` / `posts.youtube_id` | metadata.csv 작성 후 일괄 |

## 운영 절차 변경 영향

- 미디어팀이 기존 게시판 어드민 → 신 어드민(or Studio)로 작업 흐름 변경
- 마이그 직후 1~2주는 신/구 병행 운영 (안전망)
- 신규 사이트 안정화 후 구 사이트 archive 처리

## 결정 안 된 것

- [ ] 미디어 서버 접속 정보 (안건 2-1 핵심)
- [ ] 마이그 범위 (전체 / 최근 N년 / 큐레이션 N건)
- [ ] 미디어 서버 → 유튜브 일원화 여부
- [ ] 교우소식 카테고리 마이그 정책 (개인정보)
- [ ] 마이그 시점 (오픈 전 / 오픈 직후)
