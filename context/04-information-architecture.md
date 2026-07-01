# 04. Information Architecture (IA)

> 5개 공개 페이지 + 새가족 + 어드민. GNB 구조와 페이지별 섹션 우선순위.
> 시안 단계에서 잠금된 구조를 본 개발에 그대로 승계.

## 전역 GNB

```
[로고] 교회소개 | 예배와 교육 | 목양과 사역 | 교회 활동 | 새가족 [생방송 보기 CTA]
```

- **새가족** 메뉴는 시각적 강조 (다른 색 또는 우측 정렬) — 새신자 진입 최우선
- **생방송 보기** CTA는 헤더 우측 고정 — 주일/수요예배 시간엔 빨간 점 활성 (`context/components/interactive/live-badge.md`)
- 데스크탑: 드롭다운 2뎁스 (`context/components/layout/header.md`)
- 모바일: 햄버거 → 풀스크린 메뉴 (`context/components/layout/mobile-nav.md`)

### GNB → 라우트 매핑

| GNB | 라우트 | 페이지 문서 |
|---|---|---|
| 교회소개 | `/intro` | `context/pages/02-intro.md` |
| 예배와 교육 | `/worship` | `context/pages/03-worship.md` |
| 목양과 사역 | `/care` | `context/pages/04-care.md` |
| 교회 활동 | `/activity` | `context/pages/05-activity.md` |
| 새가족 | `/newcomer` | `context/pages/06-newcomer.md` |
| (로고) | `/` | `context/pages/01-main.md` |

## 페이지별 IA (스크롤 순서)

### 1. 메인 `/` (`context/pages/01-main.md`)

1. **헤로 영상** — 교회전경+햇빛 영상, 환영 카피 + 주일예배 시간
2. **이번 주일 예배 안내** — 시간/장소/설교제목/말씀본문
3. **설교 다시보기** — 최근 3개 영상 썸네일
4. **생방송 안내** — 다음 생방송 + 진입 버튼
5. **Go & Grow 캠페인 배너** — 인라인 또는 우하단 닫기 가능 카드
6. **새가족 환영** — 등록 CTA + 첫 방문 안내
7. **오시는 길** + 푸터

### 2. 교회 소개 `/intro` (`context/pages/02-intro.md`)

1. 헤로 — "경향교회 50주년" + 50주년 영상 큰 임베드
2. 인사말 (신승욱 담임)
3. 비전 / 신학 노선
4. 역사 (1973 → 2023 타임라인)
5. 섬기는 사람들 (실루엣 placeholder)
6. 교회 정보 (지도·시설·연락처)
7. (Q&A AI 자리만 — 1차 오픈 범위 외, 폼만 비활성)

### 3. 예배와 교육 `/worship` (`context/pages/03-worship.md`)

1. 헤로 — "예배와 교육"
2. 예배 시간표 (표 또는 카드)
3. 생방송 / 예배 실황
4. 특별순서 (특송·간증)
5. 주일학교
6. 중·고·대학부
7. 청년회

### 4. 목양과 사역 `/care` (`context/pages/04-care.md`)

1. 헤로 — "함께 자라고 함께 섬깁니다"
2. **새가족 (최상단 강조)** — 등록·모임·학습·세례
3. 구역모임
4. 경향시니어스쿨
5. 평생교육원
6. 사역 6칸 그리드 (별들의학교·신학교·선교·새소식반·복지·문화)

### 5. 교회 활동 `/activity` (`context/pages/05-activity.md`)

1. 헤로 — "이번 달 교회 일정"
2. 캘린더 (월/주 토글)
3. 주보 (이번 주 + 지난 주보 목록)
4. 영상뉴스
5. 교회소식
6. 교우소식
7. 교단소식
8. 경향의 일주일 (영상 시리즈)

> **결정(2026-07-01): 게시판형(수년치 누적·페이지네이션 필요) 하위 메뉴는 `/activity` 앵커섹션이 아니라
> 독립 라우트(`/activity/<slug>`)로 분리한다.** `/activity` 자체는 캘린더 + 각 게시판형 항목의
> 미리보기(이번 주 주보 카드, 최근 소식 N개)와 "전체보기" 링크만 갖는 허브 페이지가 된다.
>
> **사유**: `주보`(`bulletins` 테이블)·`교회소식/교우소식/교단소식`(`posts` 테이블, `category`로 구분)이
> 전부 "몇 년치 누적 → 페이지네이션" 구조로 설계돼 있음(`context/features/bulletin-pdf.md` "지난 주보 목록 —
> 페이지네이션(20개씩)"). 이걸 지금의 `SubPage`/`AnchorNav` 앵커-스크롤 패턴(한 페이지 안에 섹션 나열) 위에
> 그대로 얹으면 페이지가 지나치게 길어지고, 여러 목록의 페이지네이션 상태가 한 페이지에서 얽히고, 과거
> 게시물에 대한 개별 링크·SEO가 안 됨. 어드민 쪽(`/admin/bulletins`, `/admin/posts`, `context/features/admin-ui.md`
> locked)도 이미 독립 목록 라우트라 대칭적.
>
> **적용 방법**: `lib/nav.ts`의 해당 하위 메뉴 href를 `/activity#bulletin` 같은 해시 앵커에서 실제 라우트
> (`/activity/bulletin`)로 교체. 캘린더(교회 일정)는 이미 별도 UI 성격(`interactive/calendar.md`)이라 앵커
> 섹션이 아니라 `/activity` 안의 전용 위젯으로 유지(별도 라우트 불필요).
>
> `> DECISION NEEDED:` **정확히 어떤 하위 메뉴가 여기 해당하는지**(주보·교회소식류는 확정, 영상뉴스·경향의
> 일주일은 뉴스보다 영상 아카이브 성격이라 재검토 필요) — 사용자가 추후 지정 예정. 그 전까지
> `context/pages/05-activity.md`는 작성하지 않음(이 결정이 그 문서의 라우트 구조를 좌우하므로 순서상 먼저
> 확정해야 함).

### 6. 새가족 `/newcomer` (`context/pages/06-newcomer.md`)

1. 헤로 — "처음 오셨나요?"
2. 첫 방문 안내 (시간·장소·동선)
3. 연령별 기관 소개
4. **새가족 온라인 등록 폼** (`context/components/interactive/newcomer-form.md`)
5. 새가족 모임 안내
6. 학습·세례 안내

### 7. 어드민 `/admin/*`

> DECISION NEEDED: Supabase Studio 그대로 사용 (옵션 A) vs 자체 어드민 (옵션 B, +2~3주). `context/features/admin-ui.md` 참조.

## 공통 푸터 (전 페이지 동일)

- 좌상: 로고 + 한 줄 슬로건
- 1열: 주소 / 전화 / 이메일 / 오시는 길 링크
- 2열: 메인 메뉴 5개 링크
- 3열: 온라인 헌금 / e-행정 / 주보 링크
- 4열: SNS (유튜브·인스타·페이스북)
- 하단: 저작권 + 개인정보처리방침 + 이용약관

(`context/components/layout/footer.md`)

## 메타데이터 정책

각 페이지 `generateMetadata`:

| 페이지 | title | description |
|---|---|---|
| `/` | 경향교회 — 환영합니다 | 새신자·3040 친화·50주년… |
| `/intro` | 경향교회 소개 \| 1973년부터 | 50주년 교회의 비전과 역사… |
| `/worship` | 예배와 교육 \| 경향교회 | 주일예배·생방송·교육과정… |
| `/care` | 목양과 사역 \| 경향교회 | 새가족·구역모임·시니어스쿨… |
| `/activity` | 교회 일정과 소식 \| 경향교회 | 이번 달 일정·주보… |
| `/newcomer` | 처음 오신 분께 \| 경향교회 | 새가족 등록… |

OG 이미지·검색 노출 키워드는 `context/05-content-inventory.md` 카피 톤 가이드 참조.

## 새신자 진입 동선 보증

- 메인에서 "주일예배 시간"이 첫 화면(스크롤 없이)에 보여야 함
- 메인 → "오시는 길" 1뎁스 진입
- 모든 페이지의 GNB에 "새가족" 시각 강조
- 모바일 햄버거 메뉴 최상단에 "새가족" 배치

(`guardrails/02-design-consistency.md` 체크리스트 항목)
