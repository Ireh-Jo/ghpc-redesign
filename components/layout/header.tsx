'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from './container';
import { MobileNav } from './mobile-nav';
import { NAV, LIVE_URL } from '@/lib/nav';

/**
 * 전역 헤더(GNB) + 메가메뉴.
 *
 * ── 상호작용 잠금 (2026-08-12 · 디자이너 합의, `context/04-information-architecture.md` § GNB 상호작용) ──
 * - **B안**: hover/focus한 대메뉴 **하나만** 펼친다 (5개 동시 노출 = 폐기된 A안).
 * - **대메뉴는 링크가 아니다.** 패널을 여는 컨트롤(button)일 뿐이라 클릭해도 이동하지 않는다.
 *   하위 항목이 전부 해당 페이지 앵커(`/worship#times` …)라 1클릭 도달성은 유지된다.
 *   구분은 색·커서로 — 대메뉴는 hover 색 변화 없음(cursor-default), 하위 링크만 accent로 반응.
 * - 새가족 패널만 `/newcomer` 루트로 가는 CTA를 따로 둔다 (새신자 동선 보증).
 *
 * 패널은 각 대메뉴 <li> 안에 넣는다 — DOM 순서가 [대메뉴 → 그 하위 링크]가 돼야
 * 키보드 Tab이 자기 패널로 들어간다 (공용 패널 하나면 마지막 메뉴만 도달 가능).
 * 닫힌 패널은 `invisible`(visibility:hidden) — 포커스 대상에서 빠진다.
 *
 * - 모바일: 햄버거 → 드릴다운 2단(MobileNav).
 * - 톤 분기 (2026-07-05 환영 동선 라이트화): `/`(다크 영상 헤로)만 다크 톤 —
 *   투명 → 스크롤·메가 오픈 시 다크 솔리드. 서브페이지는 라이트 헤로라 라이트 톤.
 * 메뉴 항목은 lib/nav.ts 단일 출처.
 */
/** 그룹 수 → 열 클래스. Tailwind가 정적 스캔하므로 `grid-cols-${n}` 보간을 쓰지 않는다 */
const GROUP_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // 메인만 다크 헤로 위에 얹힘 — 나머지는 라이트 배경 위
  const dark = usePathname() === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveKey(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // 펼쳐진 패널이 있으면 헤더도 솔리드 — 패널 뒤로 히어로가 비치지 않게
  const megaOpen = activeKey !== null;
  const isSolid = scrolled || megaOpen;

  const closeMega = () => setActiveKey(null);

  return (
    <>
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        isSolid
          ? dark
            ? 'bg-brand-ink/95 backdrop-blur-md border-b border-white/10'
            : 'bg-brand-surface/95 backdrop-blur-md border-b border-brand-line'
          : 'border-b border-transparent'
      )}
      onMouseLeave={closeMega}
      onBlur={(e) => {
        // 키보드 탭아웃으로 포커스가 헤더 밖으로 나가면 메가메뉴 닫기 (focusout 버블링)
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMega();
      }}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center" aria-label="경향교회 홈">
          {/* 톤별 로고 스왑 — 다크 헤더(메인)는 흰 글자(logo.png), 라이트는 검정 글자(logo_black.png).
             디자인팀 SVG 로고 받으면 교체 예정. */}
          <Image
            src={dark ? '/logo.png' : '/logo_black.png'}
            alt="경향교회"
            width={965}
            height={329}
            priority
            className="h-9 w-auto md:h-11"
          />
        </Link>

        <nav className="hidden lg:block" aria-label="주 메뉴">
          <ul className="flex items-center gap-8">
            {NAV.map((section) => {
              const open = activeKey === section.key;
              return (
                // li에 relative를 주지 않는다 — 패널의 absolute 기준이 fixed header가 돼야 전체 폭으로 펼쳐진다
                <li key={section.key}>
                  <button
                    type="button"
                    // 클릭 핸들러를 일부러 두지 않는다 — "눌러도 아무 일 없음"이 결정사항(2026-08-12).
                    // 여는 건 마우스 hover / 키보드 focus, 닫는 건 헤더 밖으로 나가기 또는 Esc.
                    onMouseEnter={() => setActiveKey(section.key)}
                    onFocus={() => setActiveKey(section.key)}
                    aria-expanded={open}
                    aria-controls={`mega-${section.key}`}
                    className={cn(
                      'relative cursor-default py-1 text-[13px] tracking-widest',
                      dark ? 'text-white' : 'text-brand-ink',
                      section.highlight ? 'font-bold' : 'font-medium',
                      'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-brand-support after:transition-transform after:duration-200',
                      open ? 'after:scale-x-100' : 'after:scale-x-0'
                    )}
                  >
                    {section.label}
                  </button>

                  {/* ── 메가메뉴 패널 — 이 대메뉴 하나만 (B안) ── */}
                  <div
                    id={`mega-${section.key}`}
                    className={cn(
                      'absolute inset-x-0 top-full transition-all duration-200',
                      // 두 톤 다 불투명 — 반투명이면 뒤 히어로 사진·큰 타이틀이 비쳐 가독성 저하
                      // (라이트는 2026-07-06 피드백, 다크는 2026-08-12 B안 전환 때 같은 이유로 통일)
                      dark ? 'bg-brand-ink' : 'border-b border-brand-line bg-brand-surface',
                      open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1.5 opacity-0'
                    )}
                  >
                    <Container
                      className={cn('flex min-h-[200px] gap-12 py-10', dark ? 'text-white' : 'text-brand-ink')}
                    >
                      {/* 좌측 — 대메뉴 이름. 링크가 아니므로 hover 반응 없음 */}
                      <div
                        className={cn(
                          'w-56 shrink-0 border-r pr-8',
                          dark ? 'border-white/15' : 'border-brand-line'
                        )}
                      >
                        <p
                          className={cn(
                            'text-lg font-bold tracking-tight',
                            section.highlight
                              ? 'text-brand-support'
                              : dark
                                ? 'text-white'
                                : 'text-brand-ink'
                          )}
                        >
                          {section.label}
                        </p>
                        {section.tagline && (
                          <p
                            className={cn(
                              'mt-2 text-[12px] leading-relaxed',
                              dark ? 'text-white/55' : 'text-brand-ink-muted'
                            )}
                          >
                            {section.tagline}
                          </p>
                        )}
                        {section.highlight && (
                          <Link
                            href={section.href}
                            onClick={closeMega}
                            className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.2em] text-brand-support"
                          >
                            새가족 안내 바로가기 <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>

                      {/* 우측 — L2 그룹별 열. 이쪽만 링크라 hover 시 색이 바뀐다 */}
                      <div
                        className={cn(
                          'grid flex-1 content-start gap-x-10',
                          GROUP_COLS[section.groups.length] ?? 'grid-cols-3'
                        )}
                      >
                        {section.groups.map((group) => (
                          <div key={group.label}>
                            <p
                              className={cn(
                                'mb-4 text-[12px] font-bold tracking-[0.2em]',
                                dark ? 'text-white/45' : 'text-brand-ink-muted'
                              )}
                            >
                              {group.label}
                            </p>
                            <ul className="flex flex-col gap-3 text-[13px]">
                              {group.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    onClick={closeMega}
                                    className={cn(
                                      'transition-colors',
                                      // 라이트 패널에서 ink-muted는 가독성 부족 (2026-07-06 피드백) — 본문 ink 사용
                                      dark
                                        ? 'text-white/65 hover:text-brand-support'
                                        : 'text-brand-ink hover:text-brand-accent'
                                    )}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </Container>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noopener"
            className={cn(
              'inline-flex items-center gap-2 text-[12px] font-medium tracking-widest',
              dark ? 'text-white' : 'text-brand-ink'
            )}
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
          className={cn('-mr-2 p-2 lg:hidden', dark ? 'text-white' : 'text-brand-ink')}
          aria-label="메뉴 열기"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-7 w-7" />
        </button>
      </Container>

    </header>

    {/* MobileNav는 header 밖에 — header의 backdrop-filter가 fixed 기준을 가로채지 않도록 */}
    <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
