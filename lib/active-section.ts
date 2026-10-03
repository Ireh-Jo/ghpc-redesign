'use client';

import { useEffect, useState, type MouseEvent } from 'react';

/**
 * 섹션 바로가기 공용 동작 — `AnchorNav`(상단 가로 탭)와 `SideNav`(좌측 패널)가 함께 쓴다.
 * 두 곳이 다르게 움직이면 안 되므로 복사하지 않고 여기 둔다 (2026-09-27 SideNav 도입 때 분리).
 */

/** 뷰포트 중앙 띠(`-45% 0 -45% 0`)에 걸린 섹션 id. 상세: context/components/layout/anchor-nav.md */
export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? '');
  // 배열은 렌더마다 새로 만들어지므로 내용으로 의존성을 건다
  const key = ids.join('|');

  useEffect(() => {
    const sections = key
      .split('|')
      .map((id) => document.getElementById(id))
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
  }, [key]);

  return activeId;
}

/**
 * 첫 항목 클릭 = **페이지 맨 위로** (상단 배너 노출, 2026-09-18 사용자 지시).
 * GNB도 같은 규칙이다 — `lib/nav.ts`의 `resolveItemHref`.
 * href는 그대로 둬서 JS가 없어도 섹션으로는 이동한다.
 */
export function scrollToPageTop(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // 주소창에 해시를 남기지 않는다 — 새로고침하면 다시 맨 위에서 시작
  history.replaceState(null, '', window.location.pathname);
}
