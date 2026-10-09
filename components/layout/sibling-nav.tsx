import Link from 'next/link';
import { cn } from '@/lib/utils';
import { findByHref } from '@/lib/nav';

/**
 * 같은 GNB 그룹의 형제 페이지 탭 줄 — 옆 페이지로 갈 때 GNB를 다시 열지 않게 (2026-10-09 사용자 요청).
 * 상세: context/components/layout/sibling-nav.md
 *
 * 그룹 항목이 **전부 독립 페이지(해시 없음)이고 2개 이상**일 때만 그린다 — `헌금 · 행정`, `소식 · 자료`.
 * sticky가 아니다: `/church-admin/apply`의 sticky `AnchorNav`와 같은 자리에 겹치기 때문.
 */
export function SiblingNav({ route }: { route: string }) {
  const found = findByHref(route);
  if (!found) return null;
  const items = found.group.items;
  if (items.length < 2 || items.some((item) => item.href.includes('#'))) return null;

  return (
    <nav aria-label={`${found.group.label} 바로가기`} className="border-b border-brand-line bg-brand-surface">
      <div className="mx-auto flex w-full max-w-container items-center gap-2 overflow-x-auto px-5 py-3 md:px-8">
        <span className="mr-2 shrink-0 whitespace-nowrap text-[12px] font-bold tracking-wide text-brand-ink-muted">
          {found.group.label}
        </span>
        {items.map((item) => {
          const current = item.href === route;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? 'page' : undefined}
              className={cn(
                'btn-round shrink-0 whitespace-nowrap px-3 py-2 text-[13px] font-bold transition-colors duration-200',
                current ? 'bg-brand-ink text-white' : 'text-brand-ink-muted hover:text-brand-ink'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
