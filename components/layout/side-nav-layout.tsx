import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Container } from './container';

/**
 * 서브페이지 본문 2단 골격 — 좌 `SideNav`(lg 이상만) / 우 섹션들. 상세: context/components/layout/side-nav-layout.md
 *
 * 2026-10-03 B안 확정으로 `SubPage`와 `/education`이 같이 쓴다. 두 곳의 폭·간격이 갈라지지 않도록 값은 여기만 둔다.
 * `SideNav`(`'use client'`)와 파일을 나눈 이유: 같은 파일이면 `sideSectionClass`가 클라이언트 참조가 되어
 * 서버 컴포넌트에서 호출할 수 없다.
 */
export function SideNavLayout({ nav, children }: { nav: ReactNode; children: ReactNode }) {
  return (
    <Container>
      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-16">
        <aside className="hidden py-20 lg:block">{nav}</aside>
        {/* min-w-0 — 표·가로 스크롤 콘텐츠가 그리드 열을 밀어내지 않게 */}
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}

/**
 * 우측 섹션 클래스. lg 미만은 상단 `AnchorNav`가 떠 있어 `scroll-mt`가 크고, lg 이상은 헤더만 있어 작다.
 * 마지막 섹션은 아래 경계선을 뺀다 — 바로 다음 블록(바로가기 카드 등)이 위 경계선을 갖는다.
 */
export function sideSectionClass(isLast: boolean) {
  return cn(
    'scroll-mt-32 py-16 md:scroll-mt-36 md:py-20 lg:scroll-mt-24',
    !isLast && 'border-b border-brand-line'
  );
}
