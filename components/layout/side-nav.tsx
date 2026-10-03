'use client';

import { ArrowRight, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scrollToPageTop, useActiveSection } from '@/lib/active-section';

export type SideNavItem = { id: string; label: string };

/**
 * 본문 왼쪽 열에 붙어서 따라오는 섹션 바로가기 패널 — `AnchorNav`의 세로판.
 * 상세: context/components/layout/side-nav.md
 *
 * 레퍼런스처럼 "큰 이미지 → 좌측 메뉴가 따라오고 우측 콘텐츠" 구조. 2026-09-27 B안 시범 → **2026-10-03 확정**,
 * 모든 서브페이지(`SubPage`·`/education`)에 적용.
 * sticky는 이 패널에 걸려 있고, 부모 `aside`가 본문 높이만큼 늘어나야 따라온다 (그리드 기본 stretch).
 * lg 미만에서는 페이지가 이 패널 대신 `AnchorNav`를 띄운다.
 */
export function SideNav({
  eyebrow,
  title,
  lead,
  items,
  cta,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  items: SideNavItem[];
  cta?: { label: string; detail?: string; href: string };
}) {
  const activeId = useActiveSection(items.map((item) => item.id));

  return (
    <nav
      aria-label={`${title} 바로가기`}
      className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto"
    >
      {eyebrow && (
        <p className="text-[12px] font-bold tracking-[0.2em] text-brand-accent">{eyebrow}</p>
      )}
      <p className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight text-brand-ink xl:text-[30px]">
        {title}
      </p>
      {lead && (
        <p className="mt-2.5 text-[14px] leading-relaxed text-brand-ink-muted">{lead}</p>
      )}

      {items.length > 1 && (
        <ol className="mt-7 border-t border-brand-ink">
          {items.map((item, i) => {
            const active = activeId === item.id;
            return (
              <li key={item.id} className="border-b border-brand-line">
                <a
                  href={`#${item.id}`}
                  // 첫 항목은 페이지 맨 위로 — AnchorNav·GNB와 같은 규칙
                  onClick={i === 0 ? scrollToPageTop : undefined}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'group flex items-baseline gap-3 py-3.5 text-[15px] leading-snug transition-colors duration-200',
                    active ? 'font-bold text-brand-accent' : 'text-brand-ink-muted hover:text-brand-ink'
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'text-[12px] font-extrabold tabular-nums transition-colors duration-200',
                      active ? 'text-brand-accent' : 'text-brand-ink-muted/60'
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <ArrowRight
                    aria-hidden
                    className={cn(
                      'h-4 w-4 shrink-0 self-center transition-opacity duration-200',
                      active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      )}

      {cta && (
        <a
          href={cta.href}
          // 좁은 열(lg 200px)에서 전화번호가 중간에서 끊기지 않게 라벨·번호를 각각 한 덩어리로 줄바꿈한다
          className="btn-round mt-7 flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-0.5 bg-brand-accent px-4 py-3 text-[14px] font-bold text-white transition-colors duration-200 hover:bg-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <Phone className="h-4 w-4" aria-hidden />
            {cta.label}
          </span>
          {cta.detail && <span className="whitespace-nowrap tabular-nums">{cta.detail}</span>}
        </a>
      )}
    </nav>
  );
}

