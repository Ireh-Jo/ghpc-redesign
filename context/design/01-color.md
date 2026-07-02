# Design — 01. 컬러

> 7개 토큰만 사용. 임의 HEX 금지. 변경 시 `app/globals.css` + `tailwind.config.ts` + 컴포넌트 영향 분석 동시.

## 팔레트 — LOCKED: 메인 색상 3종 (2026-07-02 재잠금)

**2026-07-02 디자이너 확정** (박정민·장진경 협의): 로고색보다 톤다운된 메인 3색.

| 색 | HEX | 매핑 토큰 |
|---|---|---|
| 파랑 | `#002D60` | `--brand-accent` |
| 초록 | `#00634A` | `--brand-support` |
| 빨강 | `#A00711` | `--brand-point` |

> DECISION NEEDED: 빨강(`--brand-point`) 사용처 — 현재 코드에서 미사용. LIVE 인디케이터·긴급 공지 등 후보. 아래 "레드 사용 가이드" 준수 전제.

**구성:** 오프 화이트/뉴트럴 (배경·텍스트) + 메인 3색 (파랑 주조 · 초록 보조 · 빨강 포인트)
**느낌:** 깔끔하고 모던한 화이트 위, 톤다운된 로고 3색을 절제해서 사용

이전 잠금 이력: Logo Brand v2 (2026-05-18, 네이비+크림슨) → 본 재잠금으로 대체.

## 토큰

| 토큰 | HEX | 용도 |
|---|---|---|
| `--brand-bg` | `#FAFAFA` | 페이지 바탕 (off-white, 거의 흰색) |
| `--brand-surface` | `#FFFFFF` | 카드·모달·표면 |
| `--brand-ink` | `#0E1116` | 본문·헤딩 (near-black) |
| `--brand-ink-muted` | `#6B7280` | 보조 텍스트·라벨·메타 (cool gray) |
| `--brand-accent` | `#002D60` | **주조색 (파랑)** — 1차 CTA·링크·강조 |
| `--brand-support` | `#00634A` | **보조색 (초록)** — eyebrow·LIVE 도트·하이라이트 |
| `--brand-point` | `#A00711` | **포인트 (빨강)** — 사용처 미정 (DECISION NEEDED) |
| `--brand-accent-2` | `#0E1116` | 푸터·다크 섹션 배경 |
| `--brand-line` | `#E5E7EB` | 보더·디바이더 |

### 사용 규칙

- 페이지 배경: `--brand-bg` (다크 섹션·헤로 오버레이 제외)
- 카드/모달 배경: `--brand-surface`
- 본문·헤딩 텍스트: `--brand-ink`
- 보조 텍스트: `--brand-ink-muted`
- **1차 CTA / LIVE 배지**: `--brand-accent` — 면적 절제, 키 액션에만
- 푸터·다크 섹션: `--brand-accent-2`
- 보더·디바이더: `--brand-line`

### 레드 사용 가이드

- 한 화면에 레드 면적 합계 **5% 이하** 권장
- **큰 배경에 깔지 말 것** — 점·테두리·작은 칩·CTA 버튼·LIVE 도트만
- 절대 금지: 본문 텍스트 레드, 큰 영역 레드 배경, 그라데이션 레드

## CSS Variables (`app/globals.css`)

```css
/* 실제 정의는 rgb 채널 형식 (alpha 지원) — app/globals.css 참조 */
@layer base {
  :root {
    --brand-bg: 250 250 250;        /* #FAFAFA */
    --brand-surface: 255 255 255;   /* #FFFFFF */
    --brand-ink: 14 17 22;          /* #0E1116 */
    --brand-ink-muted: 107 114 128; /* #6B7280 */
    --brand-accent: 0 45 96;        /* #002D60 파랑 (2026-07-02 확정) */
    --brand-support: 0 99 74;       /* #00634A 초록 (2026-07-02 확정) */
    --brand-point: 160 7 17;        /* #A00711 빨강 (2026-07-02 확정 · 사용처 미정) */
    --brand-accent-2: 14 17 22;     /* #0E1116 */
    --brand-line: 229 231 235;      /* #E5E7EB */
  }
}
```

> DECISION NEEDED: 다크 모드 지원 여부. 1차 오픈은 라이트만 가정 (참고 사이트 모두 라이트). 어드민 영역에서만 다크 옵션 검토 가능.

## Tailwind 매핑 (`tailwind.config.ts`)

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'rgb(var(--brand-bg) / <alpha-value>)',
          surface: 'rgb(var(--brand-surface) / <alpha-value>)',
          ink: 'rgb(var(--brand-ink) / <alpha-value>)',
          'ink-muted': 'rgb(var(--brand-ink-muted) / <alpha-value>)',
          accent: 'rgb(var(--brand-accent) / <alpha-value>)',
          'accent-2': 'rgb(var(--brand-accent-2) / <alpha-value>)',
          support: 'rgb(var(--brand-support) / <alpha-value>)',
          point: 'rgb(var(--brand-point) / <alpha-value>)',
          line: 'rgb(var(--brand-line) / <alpha-value>)',
        },
      },
    },
  },
} satisfies Config;
```

shadcn semantic tokens (`background`/`foreground`/`primary`/...)는 위 brand 토큰 위에 매핑:

```css
:root {
  --background: 0 0% 98%;      /* brand-bg HSL */
  --foreground: 220 22% 7%;    /* brand-ink HSL */
  --primary:   212 100% 19%;   /* brand-accent(#002D60) HSL */
  --primary-foreground: 0 0% 100%;
  --border: 220 13% 91%;
  /* ... */
}
```

> DECISION NEEDED: HSL 변환 값 정밀 산출 (위는 근사치). Tailwind v3.4+에서는 `color-mix()`/직접 HEX도 OK.

## 접근성

- 본문 (`--brand-ink` on `--brand-bg`): 대비비 ≥ **12:1** ✓ WCAG AAA
- 보조 (`--brand-ink-muted` on `--brand-bg`): ≥ **4.5:1** ✓ WCAG AA
- CTA (`white` on `--brand-accent`): ≥ **4.5:1** — 확인 필요 (#C8252C는 경계선)

> DECISION NEEDED: CTA 텍스트 색 (흰색 vs `--brand-bg`) 대비 정밀 측정.

## 금지

- 위 7개 토큰 외 컬러 사용
- shadcn 기본 grayscale을 그대로 노출 (`bg-gray-*` 직접 사용 금지, brand 토큰 거쳐야 함)
- 그라데이션 (헤로 영상 오버레이 `bg-gradient-to-b from-transparent to-black/40` 만 예외)
- 차가운 푸른 톤 그림자 (`shadow-blue-*`)

## 영향 컴포넌트

이 파일 변경 시 갱신 필요:
- `app/globals.css`
- `tailwind.config.ts`
- `context/components/**/*.md`의 색 참조 모든 곳
- `prototypes/` 시안의 시각 대조 (참고용만, 수정 안 함)
