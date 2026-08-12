'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV, LIVE_URL, type NavSection } from '@/lib/nav';

/**
 * 모바일 풀스크린 메뉴 (다크). 햄버거에서 열림.
 *
 * ── 드릴다운 2단 (2026-08-12 결정 · `context/04-information-architecture.md` § GNB 상호작용) ──
 * 1단: 대메뉴 5개만. 2단: 탭한 대메뉴의 하위만 화면 전체 + `← 전체메뉴`.
 * 데스크탑 B안("올린 대메뉴 하나만 펼침")을 hover 없는 모바일로 옮긴 형태다.
 * 아코디언(그 자리에서 펼치기)은 『목양과 사역』처럼 하위가 11개 넘는 메뉴에서
 * 한 번 펼치면 화면을 꽉 채워 폐기했다.
 *
 * 대메뉴 행은 데스크탑과 같이 **이동하지 않는다** — 하위 화면을 여는 컨트롤. 새가족만 CTA로 `/newcomer` 도달.
 * `새가족`은 맨 아래 유지 + highlight 색 (최상단 배치안 철회, 2026-08-12).
 *
 * dialog 시맨틱 + 포커스 트랩 — 열리면 닫기 버튼으로 포커스, 닫히면 연 요소로 복귀.
 * 뎁스 이동 시에도 포커스를 따라 옮긴다 (들어가면 뒤로 버튼, 나오면 눌렀던 대메뉴 행).
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const backBtnRef = useRef<HTMLButtonElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  /** 뎁스에서 빠져나올 때 포커스를 되돌릴 대메뉴 행 */
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const restoreKeyRef = useRef<string | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const section: NavSection | undefined = NAV.find((s) => s.key === openKey);

  const close = useCallback(() => {
    onClose();
    setOpenKey(null);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // 닫히면 1단으로 리셋 — 다시 열었을 때 지난번 하위 화면이 남아 있지 않게
  useEffect(() => {
    if (!open) setOpenKey(null);
  }, [open]);

  // lg 이상으로 리사이즈되면 닫기 — 오버레이는 lg:hidden으로 사라지는데 body 스크롤 잠금만 남는 문제 방지
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) close();
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreRef.current?.focus();
    };
  }, [open]);

  // 뎁스가 바뀌면 포커스도 따라 옮긴다 — 화면만 바뀌고 포커스는 사라진(body로 빠진) 상태 방지.
  // 렌더 완료 후여야 하므로 rAF가 아니라 effect에서 처리한다 (1단 행은 2단에 있는 동안 unmount 상태).
  useEffect(() => {
    if (!open) return;
    if (openKey) {
      backBtnRef.current?.focus();
      return;
    }
    const key = restoreKeyRef.current;
    if (key) {
      rowRefs.current[key]?.focus();
      restoreKeyRef.current = null;
    }
  }, [open, openKey]);

  const back = () => {
    restoreKeyRef.current = openKey;
    setOpenKey(null);
  };

  return (
    <div
      ref={panelRef}
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="전체 메뉴"
      className={cn(
        'fixed inset-0 z-[60] overflow-y-auto bg-brand-ink text-white lg:hidden',
        open ? 'block' : 'hidden'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        {section ? (
          <button
            ref={backBtnRef}
            type="button"
            onClick={back}
            className="-ml-2 inline-flex items-center gap-2 p-2 text-[13px] font-medium tracking-widest text-white/70"
          >
            <ArrowLeft className="h-5 w-5" />
            전체메뉴
          </button>
        ) : (
          <span className="text-base font-bold tracking-tight">경향교회</span>
        )}
        <button
          ref={closeBtnRef}
          type="button"
          className="-mr-2 p-2 text-white"
          aria-label="메뉴 닫기"
          onClick={close}
        >
          <X className="h-7 w-7" />
        </button>
      </div>

      {section ? (
        /* ── 2단 — 이 대메뉴의 하위만 ── */
        <div key={section.key} className="px-5 py-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4">
          <h2
            className={cn(
              'text-2xl font-bold leading-tight',
              section.highlight ? 'text-brand-support' : 'text-white'
            )}
          >
            {section.label}
          </h2>
          {section.tagline && <p className="mt-2 text-sm text-white/50">{section.tagline}</p>}

          <ul className="mt-7 flex flex-col border-t border-white/10">
            {section.children?.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={close}
                  className="flex items-center justify-between border-b border-white/10 py-4 text-[15px] text-white/85"
                >
                  {child.label}
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
                </Link>
              </li>
            ))}
          </ul>

          {/* 대메뉴 자체는 이동하지 않지만, 새가족은 진입 동선 보증을 위해 루트로 가는 CTA를 둔다 */}
          {section.highlight && (
            <Link
              href={section.href}
              onClick={close}
              className="btn-square mt-7 inline-flex items-center justify-center gap-2 bg-brand-support px-5 py-4 text-sm font-semibold tracking-widest text-white"
            >
              새가족 안내 바로가기
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      ) : (
        /* ── 1단 — 대메뉴 5개 ── */
        <nav className="flex flex-col px-5 py-8" aria-label="주 메뉴">
          {NAV.map((s) => (
            <button
              key={s.key}
              ref={(el) => {
                rowRefs.current[s.key] = el;
              }}
              type="button"
              onClick={() => setOpenKey(s.key)}
              className="flex items-center justify-between border-b border-white/10 py-5 text-left"
            >
              <span
                className={cn(
                  'text-2xl font-bold leading-tight',
                  s.highlight ? 'text-brand-support' : 'text-white'
                )}
              >
                {s.label}
              </span>
              <ChevronRight className="h-6 w-6 shrink-0 text-white/35" />
            </button>
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
      )}
    </div>
  );
}
