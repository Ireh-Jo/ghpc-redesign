import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Container } from './container';
import { AnchorNav } from './anchor-nav';
import { HeroImage } from '@/components/content/hero-image';
import { NAV } from '@/lib/nav';

/**
 * 서브페이지 골격 (준비 중 플레이스홀더).
 * GNB 메뉴 구조(lib/nav.ts)를 단일 출처로, 각 하위 항목을 앵커 섹션으로 렌더.
 * → 메가메뉴/버튼의 #앵커 링크가 전부 해소됨 (404 제거).
 * 실제 콘텐츠는 content 컴포넌트로 순차 교체. (조립도: context/pages/*)
 * `overrides`로 특정 앵커(hash id)의 placeholder 본문만 실제 콘텐츠로 교체 가능.
 * `heroImage`가 있으면 사진 분할 히어로(HeroImage), 없으면 텍스트 히어로.
 * 섹션이 길어지는 것에 대한 대응은 아코디언이 아니라 sticky `AnchorNav`(섹션 바로가기) —
 * 이유는 context/components/layout/anchor-nav.md 참조.
 */
export function SubPage({
  sectionKey,
  overrides,
  heroImage,
}: {
  sectionKey: string;
  overrides?: Record<string, ReactNode>;
  heroImage?: { src: string; alt: string; lead?: string };
}) {
  const section = NAV.find((n) => n.key === sectionKey);
  if (!section) notFound();

  const anchorItems = (section.children ?? [])
    .map((child) => ({
      id: child.href.includes('#') ? child.href.split('#')[1] : undefined,
      label: child.label,
    }))
    .filter((item): item is { id: string; label: string } => !!item.id);

  return (
    <>
      {/* 서브 헤로 (라이트 — 2026-07-05 환영 동선 라이트화) — fixed 헤더 높이만큼 pt 보정 */}
      {heroImage ? (
        <HeroImage
          title={section.label}
          lead={heroImage.lead}
          imageSrc={heroImage.src}
          imageAlt={heroImage.alt}
        />
      ) : (
        <section className="border-b border-brand-line bg-brand-surface pb-14 pt-28 md:pb-20 md:pt-40">
          <Container>
            <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-support md:text-xs">
              — 경향교회
            </p>
            <h1 className="display-lg text-brand-ink">{section.label}</h1>
          </Container>
        </section>
      )}

      <AnchorNav items={anchorItems} />

      {section.children?.map((child) => {
        const id = child.href.includes('#') ? child.href.split('#')[1] : undefined;
        return (
          <section
            key={child.href}
            id={id}
            className="scroll-mt-32 border-b border-brand-line py-16 md:scroll-mt-36 md:py-20"
          >
            <Container>
              <h2 className="mb-3 text-2xl font-bold md:text-3xl">{child.label}</h2>
              {(id && overrides?.[id]) ?? (
                <p className="text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
                  준비 중입니다. 콘텐츠는 순차적으로 채워집니다.
                </p>
              )}
            </Container>
          </section>
        );
      })}
    </>
  );
}
