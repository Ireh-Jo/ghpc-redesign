import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Container } from './container';
import { AnchorNav } from './anchor-nav';
import { NAV, findByHref, type NavItem } from '@/lib/nav';

/**
 * 2차 목차로 새로 생긴 라우트의 골격 (콘텐츠 이관 전 스텁).
 *
 * `route`로 `lib/nav.ts`를 역조회해서 breadcrumb·제목·앵커 섹션을 자동 구성한다.
 * - `/education`처럼 **여러 GNB 항목이 앵커로 가리키는 라우트** → 그 앵커들을 섹션으로 렌더.
 * - `/activity/bulletin`처럼 **항목 하나짜리 라우트** → 단일 준비중 블록.
 *
 * `tabs`는 뎁스 상한 L3 규칙에 따라 GNB에 올리지 않고 페이지 안으로 내린 L4 구분
 * (예배 실황 6종·영상뉴스 3종·자료실 4종). 아직 동작하지 않으므로 **"예정 구성"으로 명시**한다 —
 * 동작하는 탭처럼 보이면 리뷰에서 오해를 산다.
 *
 * `legacy`(현행 사이트 URL)는 콘텐츠 이관 전까지만 노출한다. 이관 완료 시 `lib/nav.ts`에서 제거.
 */
export function StubPage({
  route,
  title,
  lead,
  tabs,
  children,
}: {
  route: string;
  /** nav에 없는 라우트(예: /privacy)이거나 nav 라벨과 다르게 쓰고 싶을 때 */
  title?: string;
  lead?: string;
  tabs?: string[];
  children?: ReactNode;
}) {
  const found = findByHref(route);
  const heading = title ?? found?.item.label ?? route;

  /** 이 라우트를 앵커로 가리키는 GNB 항목들 (`/education#kids` …) */
  const anchors: { id: string; label: string; item: NavItem }[] = NAV.flatMap((s) =>
    s.groups.flatMap((g) => g.items)
  )
    .filter((i) => i.href.startsWith(`${route}#`))
    .map((i) => ({ id: i.href.split('#')[1], label: i.label, item: i }));

  const parent = found ?? findByHref(`${route}#${anchors[0]?.id ?? ''}`);
  const legacy = found?.item.legacy;

  return (
    <>
      <section className="border-b border-brand-line bg-brand-surface pb-14 pt-28 md:pb-20 md:pt-40">
        <Container>
          {parent && (
            <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-support md:text-xs">
              {parent.section.label} — {parent.group.label}
            </p>
          )}
          <h1 className="display-lg text-brand-ink">{heading}</h1>
          {(lead ?? found?.item.desc) && (
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
              {lead ?? found?.item.desc}
            </p>
          )}

          {legacy && (
            <a
              href={legacy}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-accent"
            >
              현재 홈페이지에서 보기
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </Container>
      </section>

      {anchors.length > 1 && <AnchorNav items={anchors.map(({ id, label }) => ({ id, label }))} />}

      {tabs && tabs.length > 0 && (
        <section className="border-b border-brand-line py-10">
          <Container>
            <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-brand-ink-muted">
              예정 구성 — 이 페이지 안 탭
            </p>
            <ul className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className="btn-square border border-brand-line px-3 py-2 text-[13px] text-brand-ink-muted"
                >
                  {tab}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {children}

      {/* GNB엔 한 줄로만 뜨는 항목의 하위 — 이 페이지가 그 갈림길 역할을 한다 */}
      {found?.item.children && found.item.children.length > 0 && (
        <section className="border-b border-brand-line py-16 md:py-20">
          <Container>
            <ul className="grid gap-px bg-brand-line sm:grid-cols-2">
              {found.item.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="group flex h-full flex-col justify-between gap-6 bg-brand-surface p-6 transition-colors hover:bg-brand-bg md:p-8"
                  >
                    <span>
                      <span className="block text-[19px] font-bold text-brand-ink">{child.label}</span>
                      {child.desc && (
                        <span className="mt-2 block text-[13px] leading-relaxed text-brand-ink-muted">
                          {child.desc}
                        </span>
                      )}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-ink-muted transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {anchors.length > 0
        ? anchors.map(({ id, label, item }) => (
            <section
              key={id}
              id={id}
              className="scroll-mt-32 border-b border-brand-line py-16 md:scroll-mt-36 md:py-20"
            >
              <Container>
                <h2 className="mb-3 text-2xl font-bold md:text-3xl">{label}</h2>
                <p className="text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
                  준비 중입니다. 콘텐츠는 순차적으로 채워집니다.
                </p>
                {item.legacy && (
                  <a
                    href={item.legacy}
                    target="_blank"
                    rel="noopener"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-accent"
                  >
                    현재 홈페이지에서 보기
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </Container>
            </section>
          ))
        : !children && !found?.item.children && (
            <section className="border-b border-brand-line py-16 md:py-20">
              <Container>
                <p className="text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
                  준비 중입니다. 콘텐츠는 순차적으로 채워집니다.
                </p>
              </Container>
            </section>
          )}

      <section className="py-12">
        <Container>
          <Link href="/" className="text-[13px] font-medium text-brand-ink-muted">
            ← 홈으로
          </Link>
        </Container>
      </section>
    </>
  );
}
