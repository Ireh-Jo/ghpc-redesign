---
name: main
route: /
status: wip
rendering: rsc-isr
revalidate: 60
composes:
  layout: [header, footer, container]
  sections:                                 # 스크롤 순서대로
    - { name: hero, component: content/hero-video }       # 다크 풀블리드 + 예배시간 바
    - { name: weekly-sermon, component: content/sermon-card }     # 이번 주 말씀 + 지난 설교
    - { name: theme-banner, component: content/campaign-banner }  # 2026 표어(큰 인용)
    - { name: values, component: content/welcome-cta }            # 공동체 가치 3 (재검토)
    - { name: newcomer, component: content/welcome-cta }          # 새가족 환영 임팩트
    - { name: live-visit, component: content/map-embed }          # LIVE + 오시는 길 2컬럼
depends-on:
  design: [color, typography, spacing, iconography, motion]
  features: []
---

# 페이지 — 메인 (`/`)

> 베이스 시안: `prototypes/designs/01-main-f.html` (미니멀형) + 헤로 직하 퀵메뉴.
> ⚠️ **F안 임시 룩** — 다크 미니멀·blue·square 는 담임목사 시안 확정 전 잠정.
>    락된 무드/색(`context/design/00-mood.md`·`01-color.md`)과 충돌 지점은 확정 시 정합.

## 현재 구현 상태 (스캐폴드 2차 — 전 섹션 인라인 이식 완료)

> 모든 섹션 `app/(site)/page.tsx`에 인라인 구현. 다음 리팩터: content 컴포넌트로 분리.
> 콘텐츠·이미지는 placeholder (unsplash). 영상은 디자인팀 제작 전까지 정지 이미지.

| 섹션 | 상태 | 비고 |
|---|---|---|
| 헤로 | ✅ 인라인 구현 | `content/HeroVideo` 추출 예정. placeholder 이미지 + 그라데이션 오버레이 |
| 이번 주 말씀 | ✅ 인라인 구현 | `content/SermonCard` 분리 예정. 메인 영상 + 지난 설교 리스트 |
| 표어 배너 | ✅ 인라인 구현 | `content/CampaignBanner`. 다크 + solid 오버레이 |
| 공동체 가치 3 | ✅ 인라인 구현 | gap-px 보더 그리드. 컴포넌트 방향 재검토 여지 |
| 새가족 환영 | ✅ 인라인 구현 | `content/WelcomeCTA`. 다크 임팩트 |
| LIVE + 오시는 길 | ✅ 인라인 구현 | 2컬럼(`content/MapEmbed`+LIVE). **건물 내 길찾기** 진입점 포함 (→ wayfinding) |

## 데이터 소스 (예정)

- 예배 시간: 정적 설정 또는 `service_times` 테이블 (`context/03-data-model.md`)
- 설교: YouTube 최신 N개 (`context/features/video-embed.md` 결정 후)
- 표어/캠페인: 정적 또는 `campaigns` 테이블
- 콘텐츠 입수 시점: ~2026년 7월 말 (담임목사) → 그 전까지 placeholder

## 렌더링

- RSC + ISR `revalidate: 60` (예배 안내·캠페인 저빈도 변경, `context/02-architecture.md`)
- 메타데이터: `generateMetadata` — OG·title (새신자 검색 진입 고려)

## 결정 필요

> DECISION NEEDED: 헤로 영상 실제 소스 (디자인팀 제작 · 데스크탑 가로 / 모바일 세로 2종)
> DECISION NEEDED: 공동체 가치 3섹션을 유지할지, 새가족 환영과 통합할지
