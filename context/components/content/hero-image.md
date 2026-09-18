---
name: hero-image
status: wip
category: content
shadcn-base: null
client-component: false
depends-on:
  design: [color, typography, spacing, imagery]
  components: []
  features: []
used-on-pages: [intro, worship, care, activity, newcomer]
---

# HeroImage (`components/content/hero-image.tsx`)

## 목적

서브페이지 상단 히어로 — **풀블리드 사진 + 흰 텍스트** (2026-09-18 전환).

> 2026-07-06 변경: 텍스트/사진 좌우 분할 → 풀블리드 배경형. 사용자 피드백 "분할형은 확 와닿지 않음".
> **2026-09-18 스크림 정책 전환 (사용자 지시).** 전면을 덮던 웜 화이트 스크림이 "안개처럼 뿌옇다"는 판단으로 폐기.
> 사진을 선명하게 두고, **텍스트가 놓이는 쪽만 다크 그라데이션**으로 누른다 (모바일 상→하 · PC 좌→우).
> 텍스트는 ink → **흰색 + 소프트 그림자**. 다크는 히어로 한정이고 **본문은 그대로 라이트**다.
> 2026-07-05 "환영 동선 라이트화"는 본문·컴포넌트에 계속 유효하고, 히어로만 예외가 됐다.

## UX 원칙

- 무드 4키워드 중 "따뜻한·환영하는" 담당 — 따뜻함의 대부분은 사진 색온도에서 온다
- ~~다크 오버레이 금지~~ → **히어로에서는 다크 그라데이션이 정책이다** (2026-09-18). 단 *전면 균일 덮기는 금지* —
  텍스트 쪽에서 시작해 반대편은 완전 투명(`to-transparent`)이어야 사진이 살아 있다
- 텍스트는 흰색(`text-white`, 보조는 `/85~90`) + `drop-shadow` — 사진 밝기와 무관하게 읽히게
- 스크림 그라데이션은 가독성 기능 목적 — `guardrails/02-design-consistency.md` 히어로 예외 항목
- 사진이 투명 fixed 헤더 뒤까지 깔림 → **헤더도 다크 톤**(흰 글씨·흰 로고)으로 전환했다.
  `components/layout/header.tsx`의 `PHOTO_HERO_ROUTES`에 해당 라우트를 넣어야 적용된다 — 새 사진 히어로를
  얹은 라우트는 **거기에도 추가**할 것. 안 넣으면 밝은 사진 위에 검은 GNB가 얹힌다
- PC는 좌→우 그라데이션이 우측 GNB에 닿지 않아 상단 띠(`brand-ink/40 → transparent`)를 `md` 이상에서만 추가

## 항목 / 타입 / 설명 / 데이터

| 항목 | 타입 | 설명 | 데이터 |
|---|---|---|---|
| eyebrow | text | 상단 라벨 (기본 "— 경향교회") | props.eyebrow |
| 타이틀 | text | 섹션명 (display-lg) | props.title |
| 리드 | text | 선택 — 한 줄 소개 | props.lead |
| 사진 | image | 풀블리드 배경, object-cover + 다크 그라데이션(텍스트 쪽) | props.imageSrc / imageAlt |
| 모바일 사진 | image | 선택 — 768px 미만 전용 크롭. 주면 `<picture>`로 **한 장만** 내려받는다 | props.imageSrcMobile |
| 영문 표기 | text | 선택 — 제목·리드 아래 작은 영문 (`GYUNG - HYANG PRESBYTERIAN CHURCH`). 2026-09-18 예배 시안 | props.titleEn |

`eyebrow`·`title`은 기본적으로 `SubPage`가 GNB 라벨에서 만든다. **시안 문구가 GNB와 다를 때만**
페이지에서 `heroImage.eyebrow` / `heroImage.title`로 덮는다 (예: `/worship` = 아이브로우 "예배와 교육 - 예배" · 제목 "예배").

### 배너 파일 규칙 (2026-09-15 · 디자인팀 전달분)

- 위치 `public/hero/`, 이름은 **라우트 키**: `worship.webp`(PC) · `worship-m.webp`(모바일).
  나머지 넷은 `intro` · `care` · `activity` · `newcomer`.
- 크기: PC **2000×625~3840×1080** · 모바일 **750×899**(세로 사진 기준 · 표시 375×440).
  2026-09-18 재전달분부터 모바일은 **세로 크롭**으로 온다 (`public/hero/README.md` 참조)
- 포맷 webp 우선(없으면 jpg). `<picture>` 경로는 Next 이미지 최적화를 타지 않으므로
  **PC 400KB · 모바일 150KB 이하**로 받아야 한다 (`guardrails/05-performance.md` LCP).

## Props

```ts
interface HeroImageProps {
  eyebrow?: string;      // 기본 "— 경향교회"
  title: string;
  lead?: string;
  imageSrc: string;
  imageAlt: string;
}
```

## 사진 촬영·선정 가이드 (디자인팀용) ★

> 현재 들어있는 사진은 전부 **unsplash 예시** — 자리·톤·구도의 가이드다. 같은 느낌으로 교체하면 된다.

**공통 규칙** (`context/design/05-imagery.md` · `guardrails/02-design-consistency.md`):
- **얼굴이 식별되는 인물 사진 금지** — 뒷모습·실루엣·손·풍경은 OK
- **색온도 따뜻하게** — 골든아워(해 뜨고/지기 1시간), 실내는 전등 켠 따뜻한 조명. 푸르스름한 형광등 톤 회피
- 밝은 사진 위주 (어두운 사진은 라이트 히어로와 안 어울림)
- 가로 사진, 최소 1600px 폭 권장

**페이지별 권장 소재:**

| 페이지 | 권장 소재 | 피할 것 |
|---|---|---|
| 교회소개 `/intro` | 본당·예배당 내부 (따뜻한 조명, 빈 좌석), 건물 외관 골든아워 | 어두운 야간 사진 |
| 예배와 교육 `/worship` | 예배 중 조명·역광 실루엣, 찬양 손 (얼굴 X) | 정면 회중 얼굴 |
| 목양과 사역 `/care` | 소그룹 테이블(손·성경책·커피), 봉사 손길 | 식별 가능한 얼굴 |
| 교회 활동 `/activity` | 행사 분위기(보케 조명·현수막·야외), 계절감 | 특정 개인 클로즈업 |
| 새가족 `/newcomer` | 열린 문·입구·햇살, 환영 느낌의 밝은 공간 | 위압적 건물 로우앵글 |

## 인터랙션

없음 (정적).

## 모바일 조판 결정 (2026-09-18)

| 항목 | 값 | 이유 |
|---|---|---|
| 높이 | `min-h-[440px]` (기존 360) | 세로 사진 원본이 거의 전부 들어온다 |
| 크롭 기준 | `object-bottom` (PC는 가운데) | 피사체(건물)가 사진 아래쪽 30%에 있다 |
| 텍스트 | **가운데 정렬 · 흰색** (PC는 좌측 하단) | 제목이 아래면 피사체와 겹치고, 완전 상단이면 헤더에 붙어 보인다 (2026-09-18 피드백) |
| 스크림 | 상→하 다크 (`from-brand-ink/55` → `transparent`) | 위쪽만 눌러 흰 글씨를 받치고, 아래 건물은 손대지 않는다 |

> 디자인팀 전달 조건: **모바일 크롭은 위쪽 1/2을 비우고(하늘·여백) 피사체를 아래쪽에 둔다.**
> 반대로 오면(피사체가 위) 텍스트와 겹친다 — 그때는 이 결정을 라우트별 옵션으로 쪼갠다.

## 엣지케이스

- 이미지 로딩 실패: next/image alt 노출, 레이아웃 유지 (min-h 440/460 확보)
- 모바일 440px: 풀블리드 유지 · 다크 스크림 **상→하** · 텍스트 **가운데 정렬(흰색)** · 크롭 기준 `object-bottom`
- 타이틀 2줄 (긴 섹션명): min-h 위로 자동 확장 (justify-end 유지)

## 접근성

- 사진은 의미 전달용 → alt 필수 (장식 아님)
- 텍스트는 항상 스크림이 진한 영역(**모바일 상단~가운데**·데스크탑 좌측)에 배치 — 흰 글씨 + 그림자로 대비 확보.
  임시 placeholder처럼 **밝은 사진에서도** 읽히는지 반드시 눈으로 확인할 것 (2026-09-18 `/activity`가 그런 경우)
- 스크림 div는 `aria-hidden` (장식)

## 데이터 소스

props 정적 전달 (페이지별 `page.tsx`). 추후 어드민에서 교체 가능하게 하려면 Supabase Storage + 설정 테이블 (미정).

## 사용 예

```tsx
<SubPage
  sectionKey="intro"
  heroImage={{ src: '...', alt: '본당 내부', lead: '1973년부터 가양동에서.' }}
/>
```

## 미정 사항

- [ ] 실제 교회 사진으로 교체 (디자인팀 — 위 촬영 가이드 참조)
- [ ] 어드민에서 히어로 사진 교체 기능 필요 여부
