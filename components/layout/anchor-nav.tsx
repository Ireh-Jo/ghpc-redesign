'use client';

import { cn } from '@/lib/utils';
import { scrollToPageTop, useActiveSection } from '@/lib/active-section';

export type AnchorNavItem = { id: string; label: string };

/**
 * 서브페이지 상단 sticky 섹션 바로가기. Header 바로 아래 고정, 스크롤 위치에 따라
 * 현재 섹션 자동 하이라이트. 상세: context/components/layout/anchor-nav.md
 *
 * 2026-09-18: **첫 탭은 섹션이 아니라 페이지 맨 위로** 스크롤한다 (상단 배너 노출).
 * 같은 규칙이 GNB에도 적용돼 있다 — `lib/nav.ts`의 `resolveItemHref`.
 *
 * 2026-09-27: 추적·맨 위 스크롤 로직을 `lib/active-section.ts`로 뺐다 — `SideNav`(좌측 패널)와 공유.
 * `className`은 B안(`/education/b`)이 lg 이상에서 이 탭을 숨길 때 쓴다.
 */
export function AnchorNav({ items, className }: { items: AnchorNavItem[]; className?: string }) {
  const activeId = useActiveSection(items.map((item) => item.id));

  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="섹션 바로가기"
      className={cn(
        'sticky top-16 z-40 border-b border-brand-line bg-brand-surface/95 backdrop-blur-sm md:top-20',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-container gap-2 overflow-x-auto px-5 py-3 md:px-8">
        {items.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            // 첫 탭은 **페이지 맨 위**로 — 첫 섹션 앵커로 가면 상단 배너가 헤더 위로 밀려 안 보인다
            onClick={i === 0 ? scrollToPageTop : undefined}
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
