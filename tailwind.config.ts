import type { Config } from 'tailwindcss';

/**
 * 색·간격 토큰은 context/design/* 가 단일 출처.
 * 색 값(rgb 채널)은 app/globals.css 의 CSS 변수로 정의 → 여기선 매핑만.
 * ⚠️ 현재 brand 값은 F안 임시 팔레트(담임목사 시안 확정 전). 확정 시 globals.css 변수만 교체.
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── 브랜드 토큰 (context/design/01-color.md) ──
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
        // ── shadcn/ui semantic 토큰 (brand 위에 매핑) ──
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      fontFamily: {
        // TODO: next/font 로컬 호스팅(var(--font-pretendard)) 전환 — context/design/02-typography.md.
        // 현재는 globals.css 의 CDN import 사용.
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px', // context/design/03-spacing.md
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
