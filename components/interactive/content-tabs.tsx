'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * 범용 탭 — 버튼 줄 + 선택된 패널 하나. 상세: context/components/interactive/content-tabs.md
 *
 * 패널 내용(`content`)은 서버 컴포넌트가 렌더해서 넘긴다 — 이 컴포넌트만 클라이언트다.
 * 숨긴 패널도 DOM에 남긴다(`hidden`): 검색엔진·페이지 내 찾기가 표 내용을 볼 수 있게.
 * 탭 모양은 `VideoArchive` 분류 탭과 같다 (활성 = `bg-brand-ink text-white`).
 */
export function ContentTabs({
  label,
  tabs,
}: {
  /** 스크린리더용 그룹 이름 (예: "전도회 구분") */
  label: string;
  tabs: { id: string; label: string; content: ReactNode }[];
}) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '');
  const baseId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  // ← → Home End — WAI-ARIA Tabs 패턴 (포커스와 선택이 함께 움직인다)
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const next =
      e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
      : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActiveId(tabs[next].id);
    buttons.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
        {tabs.map((tab, i) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'btn-round px-4 py-2.5 text-[14px] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2',
                active
                  ? 'bg-brand-ink text-white'
                  : 'border border-brand-line bg-brand-surface text-brand-ink-muted hover:text-brand-ink'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== activeId}
          tabIndex={0}
          className="mt-6 focus-visible:outline-none"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
