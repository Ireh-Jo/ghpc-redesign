---
name: StubPage
category: layout
status: shipped
owner: 이레
depends-on:
  design: [color, typography, spacing]
  components: [layout/container, layout/anchor-nav, layout/side-nav, layout/side-nav-layout, content/hero-image]
  data: []
---

# StubPage — 2차 목차 신설 라우트의 골격

## 목적

2차 목차 승계(2026-08-23)로 새로 생긴 라우트 13종의 뼈대. 콘텐츠 이관 전까지
"페이지가 존재하고, 어디 소속이며, 무엇이 들어올 자리인지"를 보여준다.
메가메뉴에서 링크가 404로 떨어지지 않게 하는 것이 1차 목적이다.

## 입력

| prop | 타입 | 설명 |
|---|---|---|
| `route` | string | 이 페이지의 라우트. `lib/nav.ts`를 역조회해 breadcrumb·제목·현행 URL을 얻는다 |
| `title` | string? | nav에 없는 라우트(`/privacy` 등)이거나 라벨을 다르게 쓸 때 |
| `lead` | string? | 제목 아래 한 줄 |
| `tabs` | string[]? | 뎁스 상한 L3 때문에 페이지 안으로 내린 L4 구분 (예배 실황 6종 등) |
| `children` | ReactNode? | 실제 콘텐츠. 있으면 "준비 중" 블록을 렌더하지 않는다 |

## 동작

1. **앵커형 라우트** — `/education#kids`처럼 여러 GNB 항목이 이 라우트를 가리키면
   그 항목들을 앵커 섹션으로 펼치고 상단에 `AnchorNav`를 단다.
2. **단일 라우트** — `/activity/bulletin`처럼 항목 하나짜리면 준비 중 블록 하나.
3. **현행 사이트 링크** — `lib/nav.ts`의 `legacy` 값이 있으면 "현재 홈페이지에서 보기"를 노출한다.
   **콘텐츠 이관이 끝나면 `legacy`를 지워 링크를 없앤다.**

## 엣지 케이스

- `tabs`는 아직 동작하지 않는다. 동작하는 탭처럼 보이면 리뷰에서 오해를 사므로
  **"예정 구성"이라고 명시**하고 회색 칩으로만 그린다.
- nav에 없는 route를 주면 breadcrumb 없이 `title`만 쓴다 (`/privacy`가 이 경우).

## 2026-10-03 — 사진 히어로 · 좌측 패널

- `heroImage` prop(`{src, srcMobile?, alt, eyebrow?, titleEn?, lead?}`) — 주면 텍스트 히어로 대신 `HeroImage`.
  **디자인팀 배너가 먼저 도착한 스텁**용이다 (첫 사례 `/ministry` 사역). 제목은 `title`/GNB 라벨 그대로.
  이 라우트는 `header.tsx`의 `PHOTO_HERO_ROUTES`에도 넣어야 헤더가 투명·흰 글씨가 된다.
  현행 사이트 링크(`legacy`)는 히어로 아래 띠로 옮긴다.
- 앵커가 2개 이상이면 `SubPage`와 같은 2단 — lg 이상 좌측 `SideNav`, lg 미만 상단 `AnchorNav`
  (서브페이지 B안 확정, `context/04-information-architecture.md`). 패널 소개는 `lead` prop.

## 폐기 조건

각 라우트에 실제 콘텐츠 컴포넌트가 들어가면 그 페이지에서 `StubPage`를 걷어낸다.
전 라우트가 채워지면 이 컴포넌트를 삭제한다.
