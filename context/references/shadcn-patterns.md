# References — shadcn/ui 패턴 메모

> shadcn/ui 사용 시 본 프로젝트에서 자주 쓸 패턴.

## 설치

```bash
npx shadcn-ui@latest init
# 옵션: New York / RSC: yes / TypeScript / CSS variables / Tailwind 위치 자동
```

## 핵심 원칙

1. **컴포넌트는 복사 방식.** node_modules가 아닌 `components/ui/`에 코드 생성.
2. **우리 디자인 토큰에 맞춰 수정 OK.** 단, `context/design/01-color.md` 의 CSS 변수에 맞게 base 변수만 조정. 컴포넌트 코드 직접 패치는 최소화.
3. **우리 컴포넌트(primitives)는 shadcn 위에 한 번 더 래퍼.** shadcn `Button`을 직접 import하지 말고 `@/components/primitives/Button` 거쳐 사용 — 디자인 변경 시 한 곳만 수정.

## 변수 매핑

shadcn의 semantic 변수 → 우리 brand 토큰:

```css
:root {
  --background: 220 14% 98%;        /* brand-bg */
  --foreground: 220 41% 17%;        /* brand-ink */
  --card: 0 0% 100%;                /* brand-surface */
  --card-foreground: 220 41% 17%;
  --popover: 0 0% 100%;
  --popover-foreground: 220 41% 17%;
  --primary: 357 67% 47%;           /* brand-accent */
  --primary-foreground: 0 0% 100%;
  --secondary: 220 13% 91%;
  --secondary-foreground: 220 41% 17%;
  --muted: 220 13% 91%;
  --muted-foreground: 220 9% 46%;   /* brand-ink-muted */
  --accent: 220 13% 91%;
  --accent-foreground: 220 41% 17%;
  --destructive: 357 67% 47%;       /* accent와 통합 (1차) */
  --destructive-foreground: 0 0% 100%;
  --border: 220 13% 91%;            /* brand-line */
  --input: 220 13% 91%;
  --ring: 357 67% 47%;
  --radius: 0.75rem;                /* 12px = rounded-xl */
}
```

> DECISION NEEDED: HSL 변환 정밀값. 위는 근사. tweakcn 등 도구로 정확 변환.

## 자주 쓸 컴포넌트

- `button` — 모든 액션
- `input`, `textarea`, `select`, `checkbox`, `radio-group` — 폼
- `form` — react-hook-form 통합
- `card` — 콘텐츠 컨테이너
- `dialog` — 모달
- `popover` — 드롭다운
- `sheet` — 모바일 메뉴
- `tabs` — 활동 페이지 소식 탭
- `tooltip` — 정보 표시
- `toast` (`sonner`) — 알림
- `badge` — LIVE 배지·메타
- `separator` — 디바이더
- `skeleton` — 로딩 상태

## 안 쓸 컴포넌트 (1차 오픈 범위 밖)

- `command` (kbar 스타일 검색) — 오버스펙
- `data-table` — 어드민 옵션 B 결정 후
- `calendar` — react-day-picker 직접 사용 (커스텀 폭 넓음)
- `carousel` — 자동재생 금지 정책, 필요 시 embla 직접

## 변형 패턴 (cva)

```ts
// components/primitives/button.tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium ...',
  {
    variants: {
      variant: {
        default: 'bg-brand-accent text-white hover:bg-brand-accent/90',
        ghost: 'hover:bg-brand-line',
        link: 'underline-offset-4 hover:underline text-brand-ink',
      },
      size: {
        default: 'h-10 px-6',
        sm: 'h-9 px-4',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);
```

## RSC vs Client

- `card`, `badge`, `separator`, `skeleton` 등 시각적인 것은 **RSC OK** (no 'use client')
- `button`, `dialog`, `popover`, `tabs`, `form` 등 상태/이벤트 있는 것은 **'use client'** 필요
- shadcn 생성 코드에 이미 표시되어 있음
