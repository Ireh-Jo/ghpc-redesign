# Components — 00. 전체 인벤토리

> 모든 컴포넌트는 카테고리 하위에 `.md` 1개 + 코드(`components/<category>/<name>.tsx`) 1개로 존재.
> 새 컴포넌트는 **여기 등록 → frontmatter 채운 `.md` 생성 → 코드** 순서.

## 카테고리

| 카테고리 | 폴더 | 정의 |
|---|---|---|
| **primitives** | `context/components/primitives/` | shadcn/ui 래퍼. UI 빌딩블록. 비즈니스 로직 없음. |
| **layout** | `context/components/layout/` | 페이지 골격. 모든 페이지가 공유. |
| **content** | `context/components/content/` | 콘텐츠 표시 (read-only). 데이터 prop으로 받음. |
| **interactive** | `context/components/interactive/` | 사용자 인터랙션 (폼·캘린더·필터 등). 클라이언트 컴포넌트 다수. |

## 상태 정의

- `draft` — 스펙만 잡혀 있음, 코드 없음
- `wip` — 작업 중
- `shipped` — 운영 반영
- `deprecated` — 폐기 예정

## 인벤토리

### Primitives (shadcn 베이스)

| 이름 | 상태 | shadcn 베이스 | 문서 |
|---|---|---|---|
| Button | shipped | `button` | `primitives/button.md` |
| Input | shipped | `input` | `primitives/input.md` |
| Textarea | shipped | `textarea` | `primitives/textarea.md` |
| Select | shipped | `select` | `primitives/select.md` |
| Checkbox | shipped | `checkbox` | `primitives/checkbox.md` |
| RadioGroup | draft | `radio-group` | `primitives/radio-group.md` |
| Dialog | draft | `dialog` | `primitives/dialog.md` |
| Popover | draft | `popover` | `primitives/popover.md` |
| Tooltip | draft | `tooltip` | `primitives/tooltip.md` |
| Tabs | draft | `tabs` | `primitives/tabs.md` |
| Badge | draft | `badge` | `primitives/badge.md` |
| Card | draft | `card` | `primitives/card.md` |
| Separator | draft | `separator` | `primitives/separator.md` |
| Sheet | draft | `sheet` | `primitives/sheet.md` |
| Form | shipped | `form` (react-hook-form) + `label` | `primitives/form.md` |
| Toast | shipped | `sonner` (next-themes 의존 제거) | `primitives/toast.md` |
| Skeleton | draft | `skeleton` | `primitives/skeleton.md` |

> 2026-07-05: 폼 관련 7종(Button·Input·Textarea·Select·Checkbox·Form·Toast) 우선 도입 —
> 새가족 등록 폼·예약 폼(`context/features/reservation.md`) 공용 기반. 나머지는 필요 시 `shadcn add`.

### Layout

| 이름 | 상태 | 페이지 | 문서 |
|---|---|---|---|
| Container | wip | 전 페이지 | `layout/container.md` |
| Header | wip | 전 페이지 (fixed GNB · 메가메뉴는 hover한 **한 개만** 펼침 · 대메뉴 클릭 불가) | `layout/header.md` |
| MobileNav | wip | 전 페이지 (햄버거 → 드릴다운 2단) | `layout/mobile-nav.md` |
| Footer | wip | 전 페이지 | `layout/footer.md` |
| SectionHeader | wip | 메인 말씀·공지사항 (2026-09-16 시안) · 이후 서브페이지 섹션 | `layout/section-header.md` |
| FadeIn | wip | 스크롤 진입 페이드업 래퍼 (`/worship`) | `layout/fade-in.md` |
| AnchorNav | shipped | 모든 서브페이지(`SubPage`) 상단 sticky 섹션 바로가기 | `layout/anchor-nav.md` |
| SubPage | shipped | 대메뉴 5개 페이지 골격 (앵커 섹션 + 외부 라우트는 바로가기 카드) | `layout/sub-page.md` |
| StubPage | shipped | 2차 목차로 신설된 라우트 13종의 골격 (콘텐츠 이관 전) | `layout/stub-page.md` |

> **GNB 메뉴 구조 단일 출처: `lib/nav.ts`** (트리 config). 항목·라벨·순서·뎁스는 코드에 박지 않고 이 파일에서 관리.
> Header는 데스크탑 메가메뉴 + 모바일 풀스크린(MobileNav)을 포함. 비주얼은 2뎁스 고정, 데이터는 트리(children)라 3뎁스 확장은 렌더만 추가.
> **상호작용 잠금 (2026-08-12, `context/04-information-architecture.md` § GNB 상호작용):** 메가메뉴는 hover/focus한
> 대메뉴 **하나만** 펼치고(좌측 제목+tagline / 우측 하위 목록), 대메뉴 자체는 링크가 아니라 패널 컨트롤이다.
> 모바일은 hover가 없어 같은 성격을 드릴다운 2단으로 옮겼다.
> **룩 기준 (2026-09-16 갱신): 디자인팀 시안이 단일 출처다.** 2026-07-05의 "F안 다크 미니멀 베이스"는
> 메인 시안 확정으로 종료됐다 — 라운드는 전역 적용(`context/design/03-spacing.md`), 다크는 **메인 헤로와
> 푸터에만** 남는다. 나머지는 라이트(웜 화이트) 기조.
> Header는 route 기준 톤 분기 — **사진 히어로가 깔린 라우트**(메인 + 대메뉴 5개)는 투명 + 흰 글씨(볼드) + 흰 로고,
> 스텁·본문형은 라이트. 목록은 `header.tsx`의 `PHOTO_HERO_ROUTES` (2026-09-18).

### Content

| 이름 | 상태 | 페이지 | 문서 |
|---|---|---|---|
| HeroVideo | shipped | `/` 메인 헤로 (2026-09-16: 문구 슬롯 `lead`·`titleEn` 추가, 영상 구조 그대로) | `content/hero-video.md` |
| HeroImage | wip | `/intro`, `/worship`, `/care`, `/activity`, `/newcomer` 서브 헤로 (unsplash 예시 — 디자인팀 교체 가이드 포함) | `content/hero-image.md` |
| ServiceTimeTable | wip | `/worship#times` 표 3종 (데스크탑=표 / 모바일=카드) | `content/service-time-table.md` |
| WeeklySermons | wip | `/` 말씀 3편 (PC 3열 / 모바일 스냅 캐러셀) | `content/weekly-sermons.md` |
| MainBanner | wip | `/` 중앙 배너 슬라이드 — **관리자 영역** | `content/main-banner.md` |
| QuickMenu | wip | `/` 퀵메뉴 4종 (예배시간·약도 주차·구역공과·주보) | `content/quick-menu.md` |
| NoticeList | wip | `/` 공지사항 4줄 — **관리자 영역** | `content/notice-list.md` |
| NewcomerCard | wip | `/` 새가족 환영 + 등록 카드 (안내 문구·칩 3·주 버튼) | `content/newcomer-card.md` |
| RelatedOrgs | wip | `/` 관련 기관 6칸 (카드 뒤집기) | `content/related-orgs.md` |
| EduDept | wip | `/education` 부서 섹션 7종 (번호·소개카드·부서카드·행사·FAQ) | `content/edu-dept.md` |
| VideoArchive | wip | `/worship#live`·`/worship#special` 영상 아카이브 (분류 탭 + 플레이어 + 목록) | `content/video-archive.md` |
| LivePanel | wip | `/worship#live` 상단 생방송 상태 (수동 on/off 없음) | `content/live-panel.md` |
| YouTubeEmbed | wip | `/worship#live`(채널 라이브) · `/worship#special` · `/intro` 50주년 영상 | `content/youtube-embed.md` |
| BulletinCard | draft | `/activity` 주보 | `content/bulletin-card.md` |
| NewsCard | draft | `/activity` 교회소식 | `content/news-card.md` |
| MinistryGridItem | draft | `/care` 사역 6칸 | `content/ministry-grid-item.md` |
| StaffCard | draft | `/intro` 섬기는 사람들 | `content/staff-card.md` |
| TimelineItem | draft | `/intro` 역사 | `content/timeline-item.md` |
| WelcomeCTA | **보류(미사용)** | `/care` 새가족 섹션에 쓸 예정. 메인은 `NewcomerCard`로 교체됨 (2026-09-16) | `content/welcome-cta.md` |
| MapEmbed | **보류(미사용)** | `/intro#directions`에 쓸 예정. 지금 그 자리는 `interactive/FloorMap`이 차지 | `content/map-embed.md` |
| FaqAccordion | shipped | `/intro` 새신자 Q&A | `content/faq-accordion.md` |

> **2026-09-16 삭제:** `SermonCard`·`CampaignBanner` — 메인 시안 반영으로 각각 `WeeklySermons`·`MainBanner`에
> 완전히 대체됐고 남은 사용처가 없어 코드·문서를 지웠다 (복구는 git). `WelcomeCTA`·`MapEmbed`는 예정된
> 사용처가 있어 **보류**로 남긴다 — 3개월 안에 안 쓰이면 같이 정리할 것.

### Interactive

| 이름 | 상태 | 페이지 | 문서 |
|---|---|---|---|
| Calendar | draft | `/activity` | `interactive/calendar.md` |
| LiveBadge | draft | Header GNB (생방송 상태) | `interactive/live-badge.md` |
| NewcomerForm | wip | `/newcomer`, `/care` | `interactive/newcomer-form.md` — UI·검증 완료, Supabase INSERT 스텁 (프로젝트 미생성) |
| ApplyForm | shipped | `/church-admin/apply`(영상제작·후원작정·평생교육원) · `/church-admin/reserve`(시설이용) | `interactive/apply-form.md` — 폼 정의 기반 공통 렌더러. 현행 사이트 필드 그대로 (2026-08-23) |
| ~~SeniorSchoolForm~~ | 폐기 | — | `ApplyForm` + 폼 정의로 흡수. 시니어스쿨 신청은 현행 사이트에 폼이 없어 정의만 추가하면 됨 |
| ~~LifelongEduForm~~ | 폐기 | — | `ApplyForm`의 `lifelong_edu` 정의로 대체 |
| NewsTabs | draft | `/activity` 영상뉴스/소식/교우/교단 탭 | `interactive/news-tabs.md` |
| ScrollToTop | draft | 전 페이지 | `interactive/scroll-to-top.md` |
| FloorMap | shipped | `/intro` 오시는 길 · 실내 길찾기 | `interactive/floor-map.md` |
| ReservationCalendar | wip | `/church-admin/reserve` 시설 예약 월간 달력 (공개 정보만) | `interactive/reservation-calendar.md` |
| ReservationForm | wip | `/church-admin/reserve` 시설 이용 신청 폼 (기간·주간반복·복수 장소·비밀번호·Turnstile) | `interactive/reservation-form.md` |
| ReservationCancel | wip | `/church-admin/reserve` 달력에서 예약 취소 (비밀번호 · 반복이면 범위 선택) | `interactive/reservation-cancel.md` |

## 의존성 그래프 시각화 (요약)

```
Primitives (shadcn)
    ▲
    │ used by
    │
Content / Interactive ◀──── Layout
    ▲                          ▲
    │                          │
    │ composed by              │ composed by
    │                          │
    └──── Pages ────────────────┘
```

- Primitives는 의존 없음 (shadcn + design 토큰)
- Layout/Content/Interactive는 Primitives + design 토큰에 의존
- Pages는 모든 카테고리 컴포넌트를 조립

## 컴포넌트 .md 작성 순서

1. **카테고리 결정** (primitives / layout / content / interactive)
2. **이 인벤토리에 행 추가** (위 표)
3. **`.md` 파일 생성** — `context/components/TEMPLATE.md` 복사
4. **frontmatter `depends-on` 채우기** — 토큰·다른 컴포넌트·feature
5. **항목/타입/설명/데이터 표 작성**
6. **인터랙션·엣지케이스·접근성·데이터 소스 작성**
7. (있으면) **연관 페이지 `.md`의 `composes` 필드에 추가**

## 영향 추적

토큰·디자인 변경 시 이 인벤토리를 grep해서 영향 받는 컴포넌트 파악.
