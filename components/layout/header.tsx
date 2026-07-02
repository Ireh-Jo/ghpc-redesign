'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from './container';
import { MobileNav } from './mobile-nav';
import { NAV, LIVE_URL } from '@/lib/nav';

/**
 * 전역 헤더(GNB) + 사랑의교회식 메가메뉴.
 * - 데스크탑: GNB hover 시 전체 폭 패널이 펼쳐지고 5개 메뉴 트리가 한 번에 노출.
 * - 모바일: 햄버거 → 풀스크린 메뉴(MobileNav).
 * - 헤로 위에선 투명, 스크롤·메가 오픈 시 다크 솔리드.
 * 메뉴 항목은 lib/nav.ts 단일 출처.
 * ⚠️ 다크 미니멀 비주얼은 F안 임시 룩(담임목사 시안 확정 전).
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const isSolid = scrolled || megaOpen;

  // 메가메뉴는 데스크탑(lg) 전용 hover. 모바일이거나 모바일 메뉴가 열려 있으면 비활성화
  // (MobileNav가 header의 자식이라, 가드 없으면 모바일에서 hover 시 megaOpen 토글 → 배경 깜빡임)
  const openMega = () => {
    if (mobileOpen) return;
    if (typeof window !== 'undefined' && window.matchMedia('(min-width:1024px)').matches) {
      setMegaOpen(true);
    }
  };
  const closeMega = () => {
    setMegaOpen(false);
    setActiveKey(null);
  };

  return (
    <>
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        isSolid
          ? 'bg-brand-ink/95 backdrop-blur-md border-b border-white/10'
          : 'border-b border-transparent'
      )}
      onMouseEnter={openMega}
      onMouseLeave={closeMega}
      onBlur={(e) => {
        // 키보드 탭아웃으로 포커스가 헤더 밖으로 나가면 메가메뉴 닫기 (focusout 버블링)
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMega();
      }}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center" aria-label="경향교회 홈">
          {/* 컬러 원본 로고. 다크 헤더에선 글자가 잘 안 보임 —
             디자인팀 다크 배경용(화이트/SVG) 로고 받으면 교체 예정. */}
          <Image
            src="/logo.png"
            alt="경향교회"
            width={965}
            height={329}
            priority
            className="h-9 w-auto md:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onMouseEnter={() => setActiveKey(item.key)}
              onFocus={() => {
                setMegaOpen(true);
                setActiveKey(item.key);
              }}
              aria-expanded={megaOpen}
              aria-controls="mega-menu"
              className={cn(
                'relative py-1 text-[13px] tracking-widest text-white transition-colors',
                item.highlight ? 'font-bold' : 'font-medium',
                'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-brand-support after:transition-transform after:duration-200',
                activeKey === item.key ? 'after:scale-x-100' : 'after:scale-x-0'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-[12px] font-medium tracking-widest text-white"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping bg-brand-support opacity-75" />
              <span className="relative inline-flex h-2 w-2 bg-brand-support" />
            </span>
            생방송
          </a>
        </div>

        <button
          type="button"
          className="-mr-2 p-2 text-white lg:hidden"
          aria-label="메뉴 열기"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-7 w-7" />
        </button>
      </Container>

      {/* ── 메가메뉴 패널 (데스크탑) ── */}
      <div
        id="mega-menu"
        className={cn(
          'absolute inset-x-0 top-full hidden bg-brand-ink/95 backdrop-blur-md transition-all duration-200 lg:block',
          megaOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-1.5 opacity-0'
        )}
      >
        <Container className="grid grid-cols-5 gap-x-8 gap-y-4 py-9 text-white">
          {NAV.map((section) => (
            <div key={section.key}>
              <Link
                href={section.href}
                className={cn(
                  'mb-4 block border-b pb-3 text-sm font-bold tracking-widest transition-colors',
                  section.highlight
                    ? 'border-brand-support/30 text-brand-support hover:text-white'
                    : 'border-white/15 text-white hover:text-brand-support'
                )}
              >
                {section.label}
              </Link>
              <ul className="space-y-2.5 text-[13px]">
                {section.children?.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className="text-white/65 transition-colors hover:text-brand-support"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {section.highlight && (
                <Link
                  href={section.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.2em] text-brand-support"
                >
                  등록하기 <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </Container>
      </div>
    </header>

    {/* MobileNav는 header 밖에 — header의 backdrop-filter가 fixed 기준을 가로채지 않도록 */}
    <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
