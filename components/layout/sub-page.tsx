import { notFound } from 'next/navigation';
import { Container } from './container';
import { NAV } from '@/lib/nav';

/**
 * 서브페이지 골격 (준비 중 플레이스홀더).
 * GNB 메뉴 구조(lib/nav.ts)를 단일 출처로, 각 하위 항목을 앵커 섹션으로 렌더.
 * → 메가메뉴/버튼의 #앵커 링크가 전부 해소됨 (404 제거).
 * 실제 콘텐츠는 content 컴포넌트로 순차 교체. (조립도: context/pages/*)
 * ⚠️ F안 임시 룩.
 */
export function SubPage({ sectionKey }: { sectionKey: string }) {
  const section = NAV.find((n) => n.key === sectionKey);
  if (!section) notFound();

  return (
    <>
      {/* 서브 헤로 (다크) — fixed 헤더 높이만큼 pt 보정 */}
      <section className="bg-brand-ink pb-14 pt-28 text-white md:pb-20 md:pt-40">
        <Container>
          <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-support md:text-xs">
            — 경향교회
          </p>
          <h1 className="display-lg text-white">{section.label}</h1>
        </Container>
      </section>

      {section.children?.map((child) => {
        const id = child.href.includes('#') ? child.href.split('#')[1] : undefined;
        return (
          <section
            key={child.href}
            id={id}
            className="scroll-mt-24 border-b border-brand-line py-16 md:py-20"
          >
            <Container>
              <h2 className="mb-3 text-2xl font-bold md:text-3xl">{child.label}</h2>
              <p className="text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
                준비 중입니다. 콘텐츠는 순차적으로 채워집니다.
              </p>
            </Container>
          </section>
        );
      })}
    </>
  );
}
