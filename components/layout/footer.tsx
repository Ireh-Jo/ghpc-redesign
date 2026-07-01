import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Container } from './container';
import { NAV, YOUTUBE_URL } from '@/lib/nav';

/** 전역 푸터 (다크). 메뉴 링크는 lib/nav.ts 공유. */
export function Footer() {
  return (
    <footer className="bg-brand-accent-2 text-white/70">
      <Container className="pb-10 pt-16 md:pt-24">
        <div className="mb-10 border-b border-white/10 pb-12 md:mb-14 md:pb-16">
          <h2 className="display-xl mb-3 text-white">경향교회.</h2>
          <p className="text-sm tracking-widest text-white/55 md:text-base">
            1973년부터 · 세계를 품은 교회
          </p>
        </div>

        <div className="mb-12 grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-white/45">— 2026년 표어</p>
            <p className="mb-2 text-xl font-bold leading-snug text-white md:text-2xl">
              &ldquo;네 입을 크게 열라
              <br />
              내가 채우리라&rdquo;
            </p>
            <p className="text-sm text-white/50">시편 81:10 · Go &amp; Grow</p>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-white/45">— 메뉴</p>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={item.highlight ? 'font-semibold text-brand-support' : 'hover:text-white'}
                  >
                    {item.label}
                    {item.highlight && ' →'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-white/45">— 연락처</p>
            <ul className="space-y-2.5 text-sm leading-relaxed">
              <li>
                서울특별시 강서구 가양동
                <br />
                [도로명 주소]
              </li>
              <li>02-2668-6633</li>
              <li>info@ghpc.or.kr</li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center border border-white/15 transition-colors hover:border-brand-accent hover:bg-brand-accent"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center border border-white/15 transition-colors hover:border-brand-accent hover:bg-brand-accent"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/ghpc1/"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center border border-white/15 transition-colors hover:border-brand-accent hover:bg-brand-accent"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© 2026 경향교회. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white">
              개인정보처리방침
            </Link>
            <span className="text-white/15">·</span>
            <Link href="#" className="hover:text-white">
              이용약관
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
