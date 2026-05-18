# Design — 01. 컬러

> 7개 토큰만 사용. 임의 HEX 금지. 변경 시 `app/globals.css` + `tailwind.config.ts` + 컴포넌트 영향 분석 동시.

## 팔레트 — LOCKED: Logo Brand v2 (2026-05-18 재잠금)

경향교회 공식 로고(`logo_2022.png`)의 색 + 화이트톤 베이스 (사랑의교회 같은 깔끔한 인상).

**구성:** 오프 화이트 (배경) + 딥 네이비 (글자·다크 섹션) + 크림슨 레드 (CTA·강조)
**느낌:** 깔끔하고 모던한 화이트 위, 신뢰감 있는 네이비, 결정적 순간에만 크림슨

## 토큰

| 토큰 | HEX | 용도 |
|---|---|---|
| `--brand-bg` | `#F8F9FB` | 페이지 바탕 (off-white, 거의 흰색) |
| `--brand-surface` | `#FFFFFF` | 카드·모달·표면 |
| `--brand-ink` | `#18253F` | 본문·헤딩 (logo navy) |
| `--brand-ink-muted` | `#6B7280` | 보조 텍스트·라벨·메타 (cool gray) |
| `--brand-accent` | `#C8252C` | **1차 CTA·LIVE 인디케이터·강조 배지** (logo crimson) |
| `--brand-accent-2` | `#0E1A33` | 푸터·다크 섹션 배경 (deep navy) |
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
@layer base {
  :root {
    --brand-bg:        #F8F9FB;
    --brand-surface:   #FFFFFF;
    --brand-ink:       #18253F;
    --brand-ink-muted: #6B7280;
    --brand-accent:    #C8252C;
    --brand-accent-2:  #0E1A33;
    --brand-line:      #E5E7EB;
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
          bg: 'var(--brand-bg)',
          surface: 'var(--brand-surface)',
          ink: 'var(--brand-ink)',
          'ink-muted': 'var(--brand-ink-muted)',
          accent: 'var(--brand-accent)',
          'accent-2': 'var(--brand-accent-2)',
          line: 'var(--brand-line)',
        },
      },
    },
  },
} satisfies Config;
```

shadcn semantic tokens (`background`/`foreground`/`primary`/...)는 위 brand 토큰 위에 매핑:

```css
:root {
  --background: 220 14% 98%;   /* brand-bg HSL */
  --foreground: 220 41% 17%;   /* brand-ink HSL */
  --primary:   357 67% 47%;    /* brand-accent HSL */
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
