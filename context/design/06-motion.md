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
| 카드 호버 리프트 | `-translate-y-1` + 그림자 `sm→md`, 200ms ease-out | 퀵메뉴 타일·카드 (2026-09-16 메인 시안) |
| 썸네일 호버 줌 | `scale-[1.03~1.04]`, 300ms ease-out, 컨테이너 `overflow-hidden` | 설교 썸네일 (`VideoArchive`·`WeeklySermons`) |
| 화살표 슬라이드인 | `opacity 0→1` + `translate-x-1`, 200ms | 목록 행 호버 (`NoticeList`) |
| 수동 캐러셀 전환 | `translateX`, 500ms ease-out | 메인 배너(`MainBanner`) · 모바일 말씀 스냅 스크롤 |

| 색 채우기 (fill wipe) | 자식 span `scale-y-0 → 1`(origin bottom) 또는 `scale-x-0 → 1`(origin left), 300~450ms ease-out | 퀵메뉴 타일·새가족 칩·공지 행 밑선 |
| 밑줄 와이프 | `.link-wipe` — `::after` `scaleX` 0→1, 300ms `cubic-bezier(.4,1,.8,1)`, 뗄 때는 반대쪽으로 걷힘 | 텍스트 링크 |
| 카드 뒤집기 | `rotateX(180deg)` 500ms ease-out + `preserve-3d`/`backface-visibility:hidden` | 관련 기관 6칸 (`RelatedOrgs`) **만** |

> 위 7종은 2026-09-16 메인 시안 반영 때 추가했다 (뒤 3종은 사용자 요청 — 참고: 사랑의교회 메인).
> 전부 `motion-reduce`에서 꺼진다. 뒤집기는 회전을 끄고 **색 반전만** 남긴다(뒷면은 숨김).
> **자동 재생은 여전히 금지** — 배너는 좌우 버튼/점으로만 넘어간다 (아래 금지 목록).
>
> 뒤집기는 **정보 밀도가 낮은 작은 타일에만** 쓴다. 본문·목록·표에 쓰면 hover 없는 터치 환경에서
> 뒷면 내용에 영원히 도달할 수 없다 — 뒷면은 항상 **앞면의 보조 정보**여야 하고, 링크 목적지는 앞면만으로 알 수 있어야 한다.

## 공용 유틸 — 같은 효과를 두 번 짜지 않는다 (2026-09-16)

움직임은 `app/globals.css`의 유틸이 갖고, **색·크기·조판만 Tailwind 클래스로** 준다.
새 효과가 필요하면 이 표에 **먼저 등재**하고 유틸을 만든 뒤 쓴다 (컴포넌트 안에서 즉흥으로 만들지 않는다).

| 효과 | 유틸 | 쓰는 법 |
|---|---|---|
| 색 채우기 (아래→위) | `.fill-wipe .fill-wipe-up` | 부모 `group relative overflow-hidden` + `<span aria-hidden className="fill-wipe fill-wipe-up bg-brand-ink" />`, 내용은 `relative` |
| 색 채우기 (좌→우) | `.fill-wipe .fill-wipe-right` | 위와 같고 방향만 다름 |
| 밑줄 와이프 | `.link-wipe` | 텍스트 링크에 클래스 하나 |
| 카드 뒤집기 | `.flip-scene` / `.flip-card` / `.flip-face` / `.flip-back` | `group flip-scene` > `flip-card` > 앞면 `flip-face` + 뒷면 `flip-face flip-back` |
| 모서리 | `.btn-round` | 버튼·탭·작은 타일 10px (`03-spacing.md`) |

- 네 유틸 모두 `prefers-reduced-motion`에서 **끝까지 멈춘다** (globals.css의 전용 미디어쿼리).
  개별 컴포넌트에 `motion-reduce:`를 또 붙일 필요가 없다.
- 유틸을 쓰지 않는 인라인 호버(예: `group-hover:scale-110`)에는 반드시 `motion-reduce:transform-none`을 붙인다.
  안 붙이면 `.claude/hooks/design-guard.mjs`가 경고한다.
- 지금 쓰는 곳: 퀵메뉴 타일(`fill-wipe-up`) · 새가족 칩(`fill-wipe-right`) · 관련 기관(`flip-*`) ·
  말씀 "지난 예배 다시보기"(`link-wipe`).

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
