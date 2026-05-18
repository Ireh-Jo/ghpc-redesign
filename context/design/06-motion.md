# Design — 06. 모션

> 절제. 페이드·호버만. 패럴랙스·GSAP·풀스크린 Lottie 금지.

## 허용되는 모션

| 종류 | 사양 | 용도 |
|---|---|---|
| 호버 색 전환 | `transition-colors duration-200 ease-out` | 버튼·링크·카드 |
| 호버 그림자 | `transition-shadow duration-200 ease-out` | 카드 |
| 스크롤 진입 페이드인 | opacity 0 → 1, translateY 8px → 0, 400ms ease-out, **한 번만** | 섹션·카드 그룹 |
| 드롭다운 펼침 | shadcn 기본 (Radix Popover) | GNB·메뉴 |
| 모바일 메뉴 슬라이드 | translateX, 250ms ease-out | 햄버거 풀스크린 |
| 헤로 영상 자연 루프 | 영상 자체 | 메인 헤로 |

## 페이드인 패턴

```tsx
// IntersectionObserver 기반 once
'use client';
import { useEffect, useRef, useState } from 'react';

export function FadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500 ease-out',
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}
    >
      {children}
    </div>
  );
}
```

> `prefers-reduced-motion` 대응: media query로 transition 0ms 강제.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 금지

- 패럴랙스 스크롤 (스크롤 잭킹 위험)
- 풀스크린 Lottie 애니메이션
- 자동재생 캐러셀 (`Embla` 사용 시 autoplay 비활성)
- 스크롤 시 헤더가 사라졌다 나타나는 효과 (sticky만)
- 무거운 GSAP/Three.js 도입
- 클릭 시 풀스크린 모달 위에 추가 애니메이션 레이어

## 라이브러리

기본은 **CSS transition만으로 충분**. 필요 시:
- `framer-motion` — 단, 페이지에 하나 이상의 컴포넌트가 필요할 때만 (`guardrails/03-tech-constraints.md`)
- `tailwindcss-animate` (shadcn이 이미 도입)
