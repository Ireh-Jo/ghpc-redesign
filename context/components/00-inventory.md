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
| Button | draft | `button` | `primitives/button.md` |
| Input | draft | `input` | `primitives/input.md` |
| Textarea | draft | `textarea` | `primitives/textarea.md` |
| Select | draft | `select` | `primitives/select.md` |
| Checkbox | draft | `checkbox` | `primitives/checkbox.md` |
| RadioGroup | draft | `radio-group` | `primitives/radio-group.md` |
| Dialog | draft | `dialog` | `primitives/dialog.md` |
| Popover | draft | `popover` | `primitives/popover.md` |
| Tooltip | draft | `tooltip` | `primitives/tooltip.md` |
| Tabs | draft | `tabs` | `primitives/tabs.md` |
| Badge | draft | `badge` | `primitives/badge.md` |
| Card | draft | `card` | `primitives/card.md` |
| Separator | draft | `separator` | `primitives/separator.md` |
| Sheet | draft | `sheet` | `primitives/sheet.md` |
| Form | draft | `form` (react-hook-form) | `primitives/form.md` |
| Toast | draft | `sonner` | `primitives/toast.md` |
| Skeleton | draft | `skeleton` | `primitives/skeleton.md` |

### Layout

| 이름 | 상태 | 페이지 | 문서 |
|---|---|---|---|
| Container | draft | 전 페이지 | `layout/container.md` |
| Header | draft | 전 페이지 (sticky GNB) | `layout/header.md` |
| MobileNav | draft | 전 페이지 (햄버거 풀스크린) | `layout/mobile-nav.md` |
| Footer | draft | 전 페이지 | `layout/footer.md` |
| SectionHeader | draft | 거의 모든 섹션 | `layout/section-header.md` |
| AnchorNav | draft | 긴 페이지 내 앵커 메뉴 | `layout/anchor-nav.md` |

### Content

| 이름 | 상태 | 페이지 | 문서 |
|---|---|---|---|
| HeroVideo | draft | `/` 메인 헤로 | `content/hero-video.md` |
| HeroImage | draft | `/intro`, `/worship`, `/care`, `/activity` 서브 헤로 | `content/hero-image.md` |
| ServiceTimeTable | draft | `/`, `/worship` | `content/service-time-table.md` |
| SermonCard | draft | `/`, `/worship` 설교 다시보기 | `content/sermon-card.md` |
| YouTubeEmbed | draft | `/intro` 50주년 영상 등 | `content/youtube-embed.md` |
| BulletinCard | draft | `/activity` 주보 | `content/bulletin-card.md` |
| NewsCard | draft | `/activity` 교회소식 | `content/news-card.md` |
| MinistryGridItem | draft | `/care` 사역 6칸 | `content/ministry-grid-item.md` |
| StaffCard | draft | `/intro` 섬기는 사람들 | `content/staff-card.md` |
| TimelineItem | draft | `/intro` 역사 | `content/timeline-item.md` |
| MapEmbed | draft | `/`, `/intro` 오시는 길 | `content/map-embed.md` |
| WelcomeCTA | draft | `/`, `/care` 새가족 환영 카드 | `content/welcome-cta.md` |
| CampaignBanner | draft | `/` Go & Grow 배너 | `content/campaign-banner.md` |

### Interactive

| 이름 | 상태 | 페이지 | 문서 |
|---|---|---|---|
| Calendar | draft | `/activity` | `interactive/calendar.md` |
| LiveBadge | draft | Header GNB (생방송 상태) | `interactive/live-badge.md` |
| NewcomerForm | draft | `/newcomer`, `/care` | `interactive/newcomer-form.md` |
| SeniorSchoolForm | draft | `/care` 시니어스쿨 | `interactive/senior-school-form.md` |
| LifelongEduForm | draft | `/care` 평생교육원 | `interactive/lifelong-edu-form.md` |
| NewsTabs | draft | `/activity` 영상뉴스/소식/교우/교단 탭 | `interactive/news-tabs.md` |
| ScrollToTop | draft | 전 페이지 | `interactive/scroll-to-top.md` |

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
