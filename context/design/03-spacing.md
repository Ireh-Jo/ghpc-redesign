# Design — 03. 간격·그리드·컨테이너

> 8px 베이스 그리드. Tailwind 기본값 활용. 임의 px 금지.

## 컨테이너

- 최대 너비: `max-w-[1200px] mx-auto`
- 좌우 패딩: `px-5 md:px-8` (20px → 32px)
- 한 페이지 안에서 컨테이너 너비 변동 없음 (히어로도 텍스트는 컨테이너 안)

```tsx
// components/layout/container.tsx
export function Container({ children, className }: ...) {
  return (
    <div className={cn('mx-auto w-full max-w-[1200px] px-5 md:px-8', className)}>
      {children}
    </div>
  );
}
```

## 섹션 간격

- 섹션 ↔ 섹션 (세로): `py-20 md:py-28` (80px → 112px)
- 짧은 섹션(배너·CTA): `py-12 md:py-16`
- 페이지 첫 섹션과 헤더 사이: 헤더 sticky 높이 만큼 `pt` 보정

## 카드·요소 내부 간격

| 영역 | 패딩 |
|---|---|
| 카드 (`Card` primitive) | `p-6 md:p-8` |
| 카드 내부 텍스트 블록 간격 | `space-y-3` |
| 폼 필드 사이 | `space-y-4` |
| 그리드 컴포넌트 간격 | `gap-6 md:gap-8` |
| 인라인 요소 (아이콘+텍스트) | `gap-2` |
| 버튼 내부 (아이콘+텍스트) | `gap-2` (`h-10` 버튼 기준) |

## 그리드

기본 3컬럼 데스크탑 / 2컬럼 태블릿 / 1컬럼 모바일:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
```

6칸 그리드 (사역):
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
```

## 라운드·그림자

> **2026-09-16 확정 — 전역 라운드.** 디자인팀 메인 시안(`홈페이지 메인 디자인 전달용.ai`)이
> 카드·타일·버튼을 전부 둥근 모서리로 그렸고, 사용자가 **메인만이 아니라 전역 전환**으로 확정했다.
> F안 임시 룩의 직각(`.btn-square` 2px)은 폐기하고 `.btn-round`(10px)로 바꿨다 —
> 이 문서가 원래 정의하던 라운드 체계로 돌아온 것이다. 서브페이지도 이 값을 따른다.

| 토큰 | 클래스 | 용도 |
|---|---|---|
| `rounded-md` | `rounded-md` (6px) | 인풋·작은 버튼 |
| **10px** | `.btn-round` (`app/globals.css`) | 버튼·탭·작은 타일·알약 — 구 `.btn-square` 자리 |
| `rounded-xl` | `rounded-xl` (12px) | 퀵메뉴 타일·중간 컨테이너 |
| `rounded-2xl` | `rounded-2xl` (16px) | 카드·썸네일·큰 컨테이너 |
| `rounded-full` | `rounded-full` | 아바타·dot·pill·원형 버튼 |

그림자:
- 카드: `shadow-sm` 또는 `shadow-none + border border-brand-line` (선호: 보더)
- 호버 상승: `hover:shadow-md transition-shadow`
- **금지:** 차가운 푸른 그림자(blue cast). `box-shadow` HSL의 hue가 200~250 회피

## 반응형 브레이크포인트 (Tailwind 기본)

- `sm` 640px
- `md` 768px — 태블릿
- `lg` 1024px — 데스크탑 기준
- `xl` 1280px

**모바일 기준은 360px.** 가로 스크롤 없어야 함 (`guardrails/02-design-consistency.md`).

## 클릭 영역 (접근성)

- 모든 버튼·링크의 클릭 영역 ≥ **44×44px**
- 작은 텍스트 링크는 `inline-block` + `py-1` 같은 hit area 패딩
- 아이콘 버튼: `h-10 w-10` 기본 (40×40 이상 hit padding 포함)
