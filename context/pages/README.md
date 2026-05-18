# Pages — 페이지별 조립도

> 각 페이지가 어떤 컴포넌트로 구성되는지·데이터는 어디서 오는지·메타데이터.
> 실제 페이지 작업 시작할 때 `01-main.md` ~ `06-newcomer.md` 채운다.

## 파일

| 파일 | 라우트 | 상태 |
|---|---|---|
| `01-main.md` | `/` | draft (미작성) |
| `02-intro.md` | `/intro` | draft (미작성) |
| `03-worship.md` | `/worship` | draft (미작성) |
| `04-care.md` | `/care` | draft (미작성) |
| `05-activity.md` | `/activity` | draft (미작성) |
| `06-newcomer.md` | `/newcomer` | draft (미작성) |

## 페이지 .md frontmatter 템플릿

```yaml
---
name: main
route: /
status: draft
rendering: rsc-isr                 # rsc-static / rsc-isr / rsc-dynamic / spa
revalidate: 60                     # 초. rendering=rsc-isr 일 때
composes:
  layout: [header, footer, container]
  sections:                        # 스크롤 순서대로
    - { name: hero-video, component: content/hero-video }
    - { name: weekly-service, component: content/service-time-table }
    - { name: sermon-replay, component: content/sermon-card }
    - { name: live-banner, component: content/live-banner }
    - { name: campaign, component: content/campaign-banner }
    - { name: welcome-cta, component: content/welcome-cta }
    - { name: directions, component: content/map-embed }
data-sources:
  - { table: services, query: "active=true" }
  - { table: sermons, query: "published=true, limit=3" }
  - { table: events, query: "upcoming live" }
---

# 메인 페이지 `/`

## 목적
...

## 섹션별 상세
...

## SEO / 메타
...

## 측정·이벤트
...
```

## 작성 순서

페이지 작업 시작할 때:
1. `04-information-architecture.md` 에서 섹션 순서 확인
2. `05-content-inventory.md` 에서 들어갈 카피 확인
3. 이 폴더 안에 페이지 `.md` 생성 (frontmatter 채움)
4. `composes` 의 각 컴포넌트가 `context/components/`에 존재하는지 확인 → 없으면 먼저 컴포넌트 `.md` 작성
5. 코드 (`app/(site)/.../page.tsx`) 작성
