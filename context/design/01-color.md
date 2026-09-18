# Design — 01. 컬러

> 7개 토큰만 사용. 임의 HEX 금지. 변경 시 `app/globals.css` + `tailwind.config.ts` + 컴포넌트 영향 분석 동시.

## 팔레트 — LOCKED: 메인 색상 3종 (2026-07-02 재잠금)

**2026-07-02 디자이너 확정** (박정민·장진경 협의): 로고색보다 톤다운된 메인 3색.

| 색 | HEX | 매핑 토큰 |
|---|---|---|
| 파랑 | `#002D60` | `--brand-accent` |
| 초록 | `#00634A` | `--brand-support` |
| 빨강 | `#A00711` | `--brand-point` |

> DECISION NEEDED: 빨강(`--brand-point`) 사용처 — LIVE 인디케이터·긴급 공지 등 후보. 아래 "레드 사용 가이드" 준수 전제.
> **잠정 사용 (2026-07-05):** 폼 에러 메시지·필수 표시(`*`) 텍스트 — shadcn `--destructive`를 brand-point로 매핑.
> 근거: `form-handling.md`의 "에러는 brand-accent(당시 크림슨)" 지정이 7-02 재잠금으로 파랑이 되어 의도 상실 → 원래 의도(빨강) 유지. 작은 면적만이라 레드 가이드 부합.

**구성:** 오프 화이트/뉴트럴 (배경·텍스트) + 메인 3색 (파랑 주조 · 초록 보조 · 빨강 포인트)
**느낌:** 깔끔하고 모던한 화이트 위, 톤다운된 로고 3색을 절제해서 사용

이전 잠금 이력: Logo Brand v2 (2026-05-18, 네이비+크림슨) → 본 재잠금으로 대체.

## 토큰

> **2026-09-19 부분 되돌림 (사용자 확정): 바탕·보더는 중립, 글자는 웜 유지.**
> 2026-07-05 워밍에서 바탕이 노랑으로 기울어(`#FAF9F7` = R250 G249 B247) "베이지처럼 보인다"는 판단.
> **`bg` → `#FAFAFA` · `line` → `#E7E7E7`** 로 R=G=B에 맞췄다. 흰 카드·표가 더 떠 보인다.
> `ink`·`ink-muted`는 **웜 그대로** — 웜 near-black은 누렇게 보이지 않고 무드 1번("따뜻한")을 지탱한다.
>
> **완전 화이트(`#FFFFFF`)로 가지 않은 이유:** 이 사이트는 `bg`/`surface` 교대로 섹션·표 헤더·카드를
> 구분한다 (메인의 말씀↔퀵메뉴, 예배 표의 헤더↔본문, 교육의 섹션↔카드). 단차가 0이 되면 그 리듬이
> 사라져 보더로만 구분해야 하고, 선이 늘어 오히려 답답해진다.
>
> 참고 — 워밍 이전(2026-07-05 전) 값: bg `#FAFAFA` · ink `#0E1116` · ink-muted `#6B7280` ·
> accent-2 `#0E1116` · line `#E5E7EB`. 즉 bg·line은 그 값 근처로 돌아온 셈이고, 글자만 웜으로 남았다.

| 토큰 | HEX | 용도 |
|---|---|---|
| `--brand-bg` | `#FBFBFB` | 페이지 바탕 (**중립** off-white · 2026-09-19) |
| `--brand-surface` | `#FFFFFF` | 카드·모달·표면 |
| `--brand-subtle` | `#F4F4F4` | **옅은 면** — 표 헤더·행 호버·비활성 탭·빈 칸 (2026-09-19 신설) |
| `--brand-ink` | `#141210` | 본문·헤딩 (warm near-black) |
| `--brand-ink-muted` | `#78716C` | 보조 텍스트·라벨·메타 (warm gray, stone-500) |
| `--brand-accent` | `#002D60` | **주조색 (파랑)** — 1차 CTA·링크·강조 |
| `--brand-support` | `#00634A` | **보조색 (초록)** — eyebrow·LIVE 도트·하이라이트 |
| `--brand-point` | `#A00711` | **포인트 (빨강)** — 폼 에러·필수 표시 (잠정, 2026-07-05) · 그 외 사용처 미정 (DECISION NEEDED) |
| `--brand-accent-2` | `#141210` | 푸터·다크 섹션 배경 (= ink) |
| `--brand-line` | `#E7E7E7` | 보더·디바이더 (**중립** · 2026-09-19) |

### 사용 규칙

> **바탕 3단 구조 (2026-09-19 확정).** 밝기 순서가 곧 위계다.
>
> | 토큰 | 값 | 쓰는 자리 |
> |---|---|---|
> | `surface` | `#FFFFFF` | 카드·표 본문 — 콘텐츠가 올라앉는 면 |
> | `bg` | `#FBFBFB` | 페이지 바탕·섹션 교대 |
> | `subtle` | `#F4F4F4` | **카드·표 안쪽**의 옅은 면 (표 헤더·행 호버·비활성 탭·빈 날짜 칸) |
>
> - `bg`를 흰색으로 만들면 섹션 교대가 사라진다 — 밝게 하려면 **중립 쪽으로** 조정한다
> - 카드 **안쪽**의 면에는 `bg`를 쓰지 않는다. 페이지 바탕 밝기를 바꾸면 그 깊이가 같이 날아간다 →
>   그 자리는 `subtle`이 담당한다 (2026-09-19에 `bg`를 밝히면서 표 헤더·호버가 묻혀 생긴 규칙)
> - 흰 카드 위 **호버**도 `subtle`. `hover:bg-brand-bg`는 이제 보이지 않는다

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
    --brand-bg: 251 251 251;        /* #FBFBFB neutral (2026-09-19) */
    --brand-surface: 255 255 255;   /* #FFFFFF */
    --brand-subtle: 244 244 244;    /* #F4F4F4 옅은 면 (2026-09-19) */
    --brand-ink: 20 18 16;          /* #141210 warm near-black (2026-07-05 워밍) */
    --brand-ink-muted: 120 113 108; /* #78716C warm gray (2026-07-05 워밍) */
    --brand-accent: 0 45 96;        /* #002D60 파랑 (2026-07-02 확정) */
    --brand-support: 0 99 74;       /* #00634A 초록 (2026-07-02 확정) */
    --brand-point: 160 7 17;        /* #A00711 빨강 (2026-07-02 확정 · 사용처 미정) */
    --brand-accent-2: 20 18 16;     /* #141210 (= ink) */
    --brand-line: 231 231 231;      /* #E7E7E7 neutral (2026-09-19) */
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
