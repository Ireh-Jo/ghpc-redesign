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

서브페이지 상단 히어로 — **풀블리드 웜톤 사진 배경** + 웜 화이트 스크림 (환영 동선 라이트화, 2026-07-05).

> 2026-07-06 변경: 텍스트/사진 좌우 분할 → 풀블리드 배경형. 사용자 피드백 "분할형은 확 와닿지 않음".
> 임팩트는 풀블리드가 담당하되, 오버레이는 **다크가 아니라 brand-bg(웜 화이트) 그라데이션 스크림** —
> 라이트·따뜻함 유지 + 텍스트(ink) 가독성 확보. 데스크탑은 좌→우, 모바일은 하→상 스크림.

## UX 원칙

- 무드 4키워드 중 "따뜻한·환영하는" 담당 — 따뜻함의 대부분은 사진 색온도에서 온다
- 다크 오버레이 금지 — 스크림은 웜 화이트(brand-bg 알파)만. 텍스트는 항상 ink (사진 밝기와 무관)
- 스크림 그라데이션은 가독성 기능 목적 — `guardrails/02-design-consistency.md` 히어로 예외 항목
- 사진이 투명 fixed 헤더 뒤까지 깔림 → 상단에 `brand-bg/90 → transparent` 하향 스크림 추가로 GNB(ink)·로고 가독성 확보 (기능 스크림, 동일 예외)

## 항목 / 타입 / 설명 / 데이터

| 항목 | 타입 | 설명 | 데이터 |
|---|---|---|---|
| eyebrow | text | 상단 라벨 (기본 "— 경향교회") | props.eyebrow |
| 타이틀 | text | 섹션명 (display-lg) | props.title |
| 리드 | text | 선택 — 한 줄 소개 | props.lead |
| 사진 | image | 풀블리드 배경, object-cover + 웜 화이트 스크림 | props.imageSrc / imageAlt |

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

## 엣지케이스

- 이미지 로딩 실패: next/image alt 노출, 레이아웃 유지 (min-h 360/460 확보)
- 모바일 360px: 풀블리드 유지, 스크림 방향만 하→상 전환 (텍스트는 하단 정렬)
- 타이틀 2줄 (긴 섹션명): min-h 위로 자동 확장 (justify-end 유지)

## 접근성

- 사진은 의미 전달용 → alt 필수 (장식 아님)
- 텍스트는 사진 위지만 항상 스크림이 가장 진한 영역(모바일 하단·데스크탑 좌측)에 배치 — ink on brand-bg 대비 유지
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
