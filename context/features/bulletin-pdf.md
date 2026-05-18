---
name: bulletin-pdf
status: draft
owner: 이레
external-systems: [supabase-storage]
depends-on:
  components: [content/bulletin-card]
  data: [bulletins]
---

# 주보 PDF

## 목적

매주 주일 주보 PDF를 미디어팀이 업로드, 사용자가 다운로드/조회.

## 데이터 (`bulletins`)

| 컬럼 | 비고 |
|---|---|
| published_at | 발행일 (주일) |
| title | "2026년 5월 17일 주보" 형태 |
| pdf_url | Supabase Storage public URL |
| cover_image_url | 표지 썸네일 (선택) |
| published | 토글 |

## 업로드 (어드민)

- 어드민 → 주보 → "새 주보" → PDF 업로드 → 메타 입력 → 발행
- Storage 버킷: `bulletins` (public)
- 파일명 컨벤션: `bulletins/YYYY-MM-DD-bulletin.pdf` (충돌 방지·정렬)
- 표지 썸네일: 자동 생성 안 함 (1차). 미디어팀이 수동 업로드 또는 빈 카드

> DECISION NEEDED: PDF → 표지 이미지 자동 생성 (pdf.js 첫 페이지 렌더링). 운영 단계에서 추가 검토.

## 표시 (`/activity`)

### 이번 주 주보
- 큰 카드 1개: 표지 이미지 + 발행일 + "PDF 다운로드" 버튼
- 표지 없으면 placeholder (브랜드 컬러 + 발행일)

### 지난 주보 목록
- 목록 형태 또는 그리드
- 페이지네이션 (20개씩) 또는 "더 보기"
- 발행일 내림차순

## 컴포넌트

- `content/bulletin-card.md` — 카드 (썸네일 + 메타 + 다운로드)
- shadcn `Card` 기반

## 모바일

- 다운로드 버튼 클릭 → 모바일 브라우저가 PDF 뷰어로 열거나 저장
- 인앱 PDF 뷰어는 사용 안 함 (`@react-pdf/renderer` 등 무거움)

## 접근성

- 다운로드 링크에 `download` 속성 + 파일명
- 표지 이미지 alt: "{발행일} 주보 표지"
- 파일 사이즈 표시 (예: "PDF · 2.4MB")

## 보안

- `bulletins` 버킷은 public — 다운로드 URL이 노출돼도 OK
- 단, 업로드는 어드민(service_role) 만
- 개인정보가 포함된 PDF 업로드는 미디어팀 정책으로 금지 (운영 매뉴얼)

## 운영 절차

매주 주일 또는 직전 토요일:
1. 미디어팀이 어드민 접속
2. PDF 업로드 (드래그앤드롭)
3. 표지 이미지 업로드 (선택)
4. 발행일·제목 입력
5. "발행" 토글 → 즉시 노출

## 결정 안 된 것

- [ ] 표지 자동 생성
- [ ] 지난 주보 검색 기능 (1차 범위 외 가능성)
- [ ] PDF에 워터마크·교회 로고 자동 삽입 (PDF 편집 → 1차 범위 외)
