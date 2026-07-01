'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV, LIVE_URL } from '@/lib/nav';

/**
 * 모바일 풀스크린 메뉴 (다크). 햄버거에서 열림.
 * 데스크탑 메가메뉴와 동일한 lib/nav.ts 구조를 1뎁스 아코디언 없이 평면 노출.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] overflow-y-auto bg-brand-ink text-white lg:hidden',
        open ? 'block' : 'hidden'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <span className="text-base font-bold tracking-tight">경향교회</span>
        <button type="button" className="-mr-2 p-2 text-white" aria-label="메뉴 닫기" onClick={onClose}>
          <X className="h-7 w-7" />
        </button>
      </div>

      <nav className="flex flex-col px-5 py-8">
        {NAV.map((section) => (
          <div key={section.key} className="border-b border-white/10 py-5">
            <Link
              href={section.href}
              onClick={onClose}
              className={cn(
                'text-2xl font-bold leading-tight',
                section.highlight && 'text-brand-support'
              )}
            >
              {section.label}
            </Link>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {section.children?.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={onClose}
                    className="text-sm text-white/55 hover:text-white"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <a
          href={LIVE_URL}
          target="_blank"
          rel="noopener"
          className="btn-square mt-8 inline-flex items-center justify-center gap-2 bg-brand-accent px-5 py-4 text-sm font-semibold tracking-widest text-white"
        >
          생방송 보기
        </a>
      </nav>
    </div>
  );
}
