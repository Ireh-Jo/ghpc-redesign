'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type AnchorNavItem = { id: string; label: string };

/**
 * 서브페이지 상단 sticky 섹션 바로가기. Header 바로 아래 고정, 스크롤 위치에 따라
 * 현재 섹션 자동 하이라이트. 상세: context/components/layout/anchor-nav.md
 *
 * 2026-09-18: **첫 탭은 섹션이 아니라 페이지 맨 위로** 스크롤한다 (상단 배너 노출).
 * 같은 규칙이 GNB에도 적용돼 있다 — `lib/nav.ts`의 `resolveItemHref`.
 */
export function AnchorNav({ items }: { items: AnchorNavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActiveId(topMost.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="섹션 바로가기"
      className="sticky top-16 z-40 border-b border-brand-line bg-brand-surface/95 backdrop-blur-sm md:top-20"
    >
      <div className="mx-auto flex w-full max-w-container gap-2 overflow-x-auto px-5 py-3 md:px-8">
        {items.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            // 첫 탭은 **페이지 맨 위**로 — 첫 섹션 앵커로 가면 상단 배너가 헤더 위로 밀려 안 보인다
            // (2026-09-18 사용자 지시, GNB도 같은 규칙: `lib/nav.ts`의 `resolveItemHref`).
            // href는 그대로 둬서 JS가 없어도 섹션으로는 이동한다.
            onClick={
              i === 0
                ? (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // 주소창에 해시를 남기지 않는다 — 새로고침하면 다시 맨 위에서 시작
                    history.replaceState(null, '', window.location.pathname);
                  }
                : undefined
            }
            aria-current={activeId === item.id ? 'true' : undefined}
            className={cn(
              'btn-round shrink-0 whitespace-nowrap px-3 py-2 text-[12px] font-bold tracking-wide transition-colors duration-200',
              activeId === item.id ? 'bg-brand-ink text-white' : 'text-brand-ink-muted hover:text-brand-ink'
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
