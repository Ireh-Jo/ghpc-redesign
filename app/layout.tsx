import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '경향교회',
    template: '%s · 경향교회',
  },
  description: '경향교회 — 1973년부터, 세계를 품은 교회. 자유로이, 함께 예배하라.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
