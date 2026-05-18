# Design — 02. 타이포그래피

> **Pretendard Variable 단독.** 세리프 미사용. 스케일 표 안의 값만 사용.

## 폰트 — LOCKED

- **Pretendard Variable** (단독)
- fallback: `-apple-system`, `system-ui`, `sans-serif`
- 영문/숫자에 별도 폰트 적용 안 함 (Pretendard가 영문도 양호)

### 로드 방법

**1순위 — `next/font` 로컬 호스팅** (성능 우선):

```ts
// app/layout.tsx
import localFont from 'next/font/local';

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});
```

`tailwind.config.ts`:
```ts
fontFamily: {
  sans: ['var(--font-pretendard)', 'Pretendard Variable', 'Pretendard',
         '-apple-system', 'system-ui', 'sans-serif'],
}
```

**2순위 — CDN** (개발 초기 임시):
```html
<link rel="stylesheet" as="style" crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

> DECISION NEEDED: 로컬 호스팅 vs CDN. Vercel + dynamic subset CDN이 충분히 빠를 수 있음. LCP 측정 후 결정.

## 스케일

| 토큰 | 모바일 | 데스크탑 (md+) | weight | 용도 | Tailwind 매핑 |
|---|---|---|---|---|---|
| `display` | 36px / 1.15 | 64px / 1.1 | 700 | 헤로 메인 카피 | `text-[36px] md:text-[64px] leading-[1.15] md:leading-[1.1] font-bold` |
| `h1` | 28px / 1.2 | 44px / 1.15 | 700 | 페이지 타이틀 | `text-[28px] md:text-[44px] leading-tight font-bold` |
| `h2` | 22px / 1.3 | 32px / 1.2 | 700 | 섹션 헤더 | `text-[22px] md:text-[32px] leading-snug font-bold` |
| `h3` | 18px / 1.4 | 22px / 1.3 | 600 | 카드/서브섹션 | `text-[18px] md:text-[22px] leading-snug font-semibold` |
| `body` | 15px / 1.65 | 16px / 1.7 | 400 | 본문 | `text-[15px] md:text-base leading-relaxed` |
| `small` | 13px / 1.5 | 14px / 1.5 | 400 | 캡션·메타 | `text-[13px] md:text-sm leading-normal` |

### 권장 패턴

```tsx
// 컴포넌트로 추출 권장 (components/ui/typography.tsx)
<h1 className="text-[28px] md:text-[44px] leading-tight font-bold text-brand-ink">
```

## 한국어 타이포 디테일

- 자간 (`letter-spacing`): 본문 `tracking-tight` 살짝 조이는 정도 (-0.01em). 헤딩은 기본.
- 줄간격: 한국어는 영문보다 line-height 여유 필요 — 위 스케일 값 준수
- 단어 잘림: `word-break: keep-all`을 본문에 적용 (`prose-break-keep-all` 유틸 또는 base style)

```css
body {
  word-break: keep-all;
  overflow-wrap: anywhere;
}
```

## 금지

- Noto Serif KR, Nanum Myeongjo 등 세리프 로드
- Pretendard 외 sans serif 추가 로드
- 스케일 표 외 폰트 사이즈 (`text-[14px]` 같은 임의값) — 위 토큰 매핑으로만
- `font-weight: 500` 단독 사용 — 권장은 400/600/700 3단계
- 페이지마다 다른 헤딩 스케일

## 영향 컴포넌트

- `app/layout.tsx` 루트 폰트
- `app/globals.css`의 `body` `word-break`
- shadcn 컴포넌트의 base text size (필요 시 오버라이드)
