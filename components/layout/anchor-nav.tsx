'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type AnchorNavItem = { id: string; label: string };

/**
 * 서브페이지 상단 sticky 섹션 바로가기. Header 바로 아래 고정, 스크롤 위치에 따라
 * 현재 섹션 자동 하이라이트. 상세: context/components/layout/anchor-nav.md
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
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={activeId === item.id ? 'true' : undefined}
            className={cn(
              'btn-square shrink-0 whitespace-nowrap px-3 py-2 text-[12px] font-bold tracking-wide transition-colors duration-200',
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
