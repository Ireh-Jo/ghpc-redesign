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
| Header | wip | 전 페이지 (fixed GNB · 사랑의교회식 메가메뉴 hover 펼침) | `layout/header.md` |
| MobileNav | wip | 전 페이지 (햄버거 풀스크린) | `layout/mobile-nav.md` |
| Footer | wip | 전 페이지 | `layout/footer.md` |
| SectionHeader | draft | 거의 모든 섹션 | `layout/section-header.md` |
| AnchorNav | shipped | 모든 서브페이지(`SubPage`) 상단 sticky 섹션 바로가기 | `layout/anchor-nav.md` |

> **GNB 메뉴 구조 단일 출처: `lib/nav.ts`** (트리 config). 항목·라벨·순서·뎁스는 코드에 박지 않고 이 파일에서 관리.
> Header는 데스크탑 메가메뉴(전체 폭 5컬럼 트리) + 모바일 풀스크린(MobileNav)을 포함. 비주얼은 2뎁스 고정, 데이터는 트리(children)라 3뎁스 확장은 렌더만 추가.
> 룩 결정권: 담임목사가 시안 판단을 팀에 위임 (2026-07-05) — F안 다크 미니멀을 베이스로 하되,
> **환영 동선(메인 환영 섹션·서브페이지 헤로·헤더 라이트 톤)은 라이트로 전환** (무드 "따뜻한·환영하는" 정합).
> 다크는 메인 헤로·표어 배너·푸터에만 유지. Header는 route 기준 톤 분기 (`/`=다크 헤로 위 투명, 서브=라이트).

### Content

| 이름 | 상태 | 페이지 | 문서 |
|---|---|---|---|
| HeroVideo | shipped | `/` 메인 헤로 | `content/hero-video.md` |
| HeroImage | draft | `/intro`, `/worship`, `/care`, `/activity` 서브 헤로 | `content/hero-image.md` |
| ServiceTimeTable | draft | `/`, `/worship` | `content/service-time-table.md` |
| SermonCard | shipped | `/`, `/worship` 설교 다시보기 | `content/sermon-card.md` |
| YouTubeEmbed | draft | `/intro` 50주년 영상 등 | `content/youtube-embed.md` |
| BulletinCard | draft | `/activity` 주보 | `content/bulletin-card.md` |
| NewsCard | draft | `/activity` 교회소식 | `content/news-card.md` |
| MinistryGridItem | draft | `/care` 사역 6칸 | `content/ministry-grid-item.md` |
| StaffCard | draft | `/intro` 섬기는 사람들 | `content/staff-card.md` |
| TimelineItem | draft | `/intro` 역사 | `content/timeline-item.md` |
| MapEmbed | shipped | `/`, `/intro` 오시는 길 | `content/map-embed.md` |
| WelcomeCTA | shipped | `/`, `/care` 새가족 환영 카드 | `content/welcome-cta.md` |
| CampaignBanner | shipped | `/` Go & Grow 배너 | `content/campaign-banner.md` |
| FaqAccordion | shipped | `/intro` 새신자 Q&A | `content/faq-accordion.md` |

### Interactive

| 이름 | 상태 | 페이지 | 문서 |
|---|---|---|---|
| Calendar | draft | `/activity` | `interactive/calendar.md` |
| LiveBadge | draft | Header GNB (생방송 상태) | `interactive/live-badge.md` |
| NewcomerForm | wip | `/newcomer`, `/care` | `interactive/newcomer-form.md` — UI·검증 완료, Supabase INSERT 스텁 (프로젝트 미생성) |
| SeniorSchoolForm | draft | `/care` 시니어스쿨 | `interactive/senior-school-form.md` |
| LifelongEduForm | draft | `/care` 평생교육원 | `interactive/lifelong-edu-form.md` |
| NewsTabs | draft | `/activity` 영상뉴스/소식/교우/교단 탭 | `interactive/news-tabs.md` |
| ScrollToTop | draft | 전 페이지 | `interactive/scroll-to-top.md` |
| FloorMap | shipped | `/intro` 오시는 길 · 실내 길찾기 | `interactive/floor-map.md` |

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
