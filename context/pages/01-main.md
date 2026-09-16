---
name: main
route: /
status: wip
rendering: rsc-isr
revalidate: 60
composes:
  layout: [header, footer, container, section-header, fade-in]
  sections:                                 # 스크롤 순서대로 (2026-09-16 디자인팀 시안)
    - { name: hero, component: content/hero-video }        # 다크 풀블리드 영상 + 예배시간 바
    - { name: weekly-sermon, component: content/weekly-sermons }  # 말씀 3편
    - { name: banner, component: content/main-banner }     # 중앙 배너 — 관리자 영역
    - { name: quick-menu, component: content/quick-menu }  # 예배시간·약도 주차·구역공과·주보
    - { name: notice, component: content/notice-list }     # 공지사항 4줄 — 관리자 영역
    - { name: newcomer, component: content/newcomer-card } # 새가족 환영 + 등록 카드
    - { name: related-orgs, component: content/related-orgs } # 관련 기관 6칸 (시안에선 푸터 안)
depends-on:
  design: [color, typography, spacing, iconography, motion]
  features: [admin-ui, video-embed]
---

# 페이지 — 메인 (`/`)

> **베이스: 디자인팀 메인 시안 (2026-09-16 수령)** — `홈페이지 메인 디자인 전달용.ai`(PC) ·
> `홈페이지 메인 디자인 모바일.ai`. 반영 기록·미결 사항: `docs/2026-09-16-메인-디자인시안-반영.md`.
> 그전까지 쓰던 F안 임시 룩(다크 미니멀·직각)은 이 시안으로 대체됐다.

## 구성 (2026-09-16 시안 반영 완료)

| 섹션 | 컴포넌트 | 상태 | 비고 |
|---|---|---|---|
| 헤로 | `content/HeroVideo` | 영상 구조 유지 · 문구만 시안으로 교체 | 사용자 지시 — 헤로는 영상으로 간다. 영상·포스터는 디자인팀 Phase 1 대기 (지금은 임시 소스) |
| 말씀 | `content/WeeklySermons` | ✅ | 주일 낮예배 최신 3편 (`lib/worship-videos.ts`) |
| 중앙 배너 | `content/MainBanner` | ✅ | **관리자 영역.** `lib/main-banners.ts` + `public/banners/*` |
| 퀵메뉴 | `content/QuickMenu` | ✅ | 항목은 `lib/nav.ts`의 `QUICK_MENU` |
| 공지사항 | `content/NoticeList` | ✅ | **관리자 영역.** `lib/notices.ts` |
| 새가족 | `content/NewcomerCard` | ✅ | 시안 조판 (좌 문구 / 우 네이비 카드) |
| 관련 기관 | `content/RelatedOrgs` | ✅ | 시안에선 푸터 안 블록. 푸터를 안 건드리므로 페이지 섹션으로 뺐다 (2026-09-16 사용자 요청) |
| 푸터 | `layout/Footer` | 현행 유지 | 시안 푸터(관련기관 6 · SNS · 회색 하단바)는 **이번 범위 밖** — 2026-09-16 사용자 판단 |

### 내린 섹션 (F안 잔재)

시안에 없어 메인에서 제거했다 (2026-09-16 사용자 확정). 컴포넌트 파일은 서브페이지 재사용분이라 남긴다.

- 공동체 가치 3 (인라인) — 삭제. 전용 컴포넌트가 없었으므로 코드도 사라짐
- 표어 배너 `content/CampaignBanner` — 표어는 이제 이미지 배너(`MainBanner`)로 들어간다. 컴포넌트는 미사용 상태
- LIVE + 오시는 길 2컬럼 — `content/MapEmbed`는 `/intro#directions`에서 계속 쓴다

## 데이터 소스

| 섹션 | 지금 | 이후 |
|---|---|---|
| 말씀 | `lib/worship-videos.ts` (목업) | 유튜브 동기화 또는 Supabase `sermons` (`context/features/video-embed.md`) |
| 배너 | `lib/main-banners.ts` + `public/banners/` | Supabase `campaigns` + 어드민 업로드 |
| 공지 | `lib/notices.ts` | Supabase `posts`(category=notice) + 어드민 |
| 예배시간 바 | 페이지 상수 | `service_times` (`context/03-data-model.md`) |

## 렌더링

- RSC + ISR `revalidate: 60`. 배너·말씀 캐러셀만 클라이언트 컴포넌트다
- 메타데이터: `generateMetadata` — OG·title (새신자 검색 진입 고려)

## 결정 필요

> DECISION NEEDED: 헤로 영상 실제 소스 (디자인팀 제작 · 데스크탑 가로 / 모바일 세로 2종)
> DECISION NEEDED: 모바일 전용 배너 크롭 전달 여부 — 지금은 PC 배너를 16:9로 잘라 쓴다
> DECISION NEEDED: 퀵메뉴 `구역공과` 목적지 (`lib/nav.ts` OPEN_QUESTIONS)
> DECISION NEEDED: 시안 푸터 적용 시점 (헤더 생방송 CTA 유지 여부와 함께 디자인팀 회신 대기)
