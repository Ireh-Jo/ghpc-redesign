import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Container } from './container';
import { AnchorNav } from './anchor-nav';
import { HeroImage } from '@/components/content/hero-image';
import { NAV, type NavItem } from '@/lib/nav';

/**
 * 서브페이지 골격 (준비 중 플레이스홀더).
 * GNB 메뉴 구조(`lib/nav.ts`)를 단일 출처로 렌더한다.
 *
 * ── 2단 그룹 승계 (2026-08-23) ──
 * 하위 항목이 `groups[].items[]`로 바뀌면서 두 종류가 섞이게 됐다.
 * - **자기 페이지 앵커**(`/care#deacons`) → 여기서 앵커 섹션으로 렌더. AnchorNav 대상.
 * - **다른 라우트**(`/ministry#stars`, `/activity/bulletin`) → 앵커 섹션으로 만들면 안 된다
 *   (그 페이지에 없는 내용을 여기 있는 것처럼 보이게 하므로). 그룹별 **바로가기 카드**로 묶는다.
 *
 * 실제 콘텐츠는 content 컴포넌트로 순차 교체. (조립도: `context/pages/*`)
 * `overrides`로 특정 앵커(hash id)의 placeholder 본문만 실제 콘텐츠로 교체 가능.
 * `heroImage`가 있으면 사진 분할 히어로(HeroImage), 없으면 텍스트 히어로.
 * 섹션이 길어지는 것에 대한 대응은 아코디언이 아니라 sticky `AnchorNav`(섹션 바로가기) —
 * 이유는 `context/components/layout/anchor-nav.md` 참조.
 */
export function SubPage({
  sectionKey,
  overrides,
  heroImage,
  bareSections,
  hideOutboundGroups,
}: {
  sectionKey: string;
  overrides?: Record<string, ReactNode>;
  /**
   * 사진 히어로. `eyebrow`·`title`·`titleEn`은 시안 문구가 GNB 라벨과 다를 때만 넘긴다
   * (예: `/worship`은 GNB가 "예배와 교육"인데 시안 제목은 "예배" — 2026-09-18).
   */
  heroImage?: {
    src: string;
    srcMobile?: string;
    alt: string;
    lead?: string;
    eyebrow?: string;
    title?: string;
    titleEn?: string;
  };
  /**
   * 다른 페이지로 나가는 그룹 카드 중 **숨길 그룹 라벨** 목록.
   * 그 그룹이 독립 페이지로 완성돼서 이 페이지에 바로가기를 둘 이유가 없어졌을 때 쓴다
   * (예: `/worship`의 "교육" 그룹 — `/education`이 완성돼 2026-09-18에 내렸다). GNB 링크는 그대로 남는다.
   */
  hideOutboundGroups?: string[];
  /**
   * 섹션 h2를 숨길 앵커 id 목록. override가 자기 제목(표 제목 등)을 갖고 있어
   * 같은 문구가 두 번 나오는 경우에만 쓴다 — 이때 override 쪽 제목을 h2로 올릴 것.
   */
  bareSections?: string[];
}) {
  const section = NAV.find((n) => n.key === sectionKey);
  if (!section) notFound();

  /** 이 페이지 자신의 앵커인가 (`/care#deacons` on `/care`) */
  const ownAnchor = (item: NavItem) =>
    item.href.startsWith(`${section.href}#`) ? item.href.split('#')[1] : undefined;

  const anchors = section.groups
    .flatMap((g) => g.items)
    .map((item) => ({ id: ownAnchor(item), label: item.label, item }))
    .filter((a): a is { id: string; label: string; item: NavItem } => !!a.id);

  const outboundGroups = section.groups
    .map((g) => ({ label: g.label, items: g.items.filter((i) => !ownAnchor(i)) }))
    .filter((g) => g.items.length > 0 && !hideOutboundGroups?.includes(g.label));

  return (
    <>
      {/* 서브 헤로 (라이트 — 2026-07-05 환영 동선 라이트화) — fixed 헤더 높이만큼 pt 보정 */}
      {heroImage ? (
        <HeroImage
          eyebrow={heroImage.eyebrow}
          title={heroImage.title ?? section.label}
          titleEn={heroImage.titleEn}
          lead={heroImage.lead}
          imageSrc={heroImage.src}
          imageSrcMobile={heroImage.srcMobile}
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

      <AnchorNav items={anchors.map(({ id, label }) => ({ id, label }))} />

      {anchors.map(({ id, label }) => (
        <section
          key={id}
          id={id}
          className="scroll-mt-32 border-b border-brand-line py-16 md:scroll-mt-36 md:py-20"
        >
          <Container>
            {!bareSections?.includes(id) && (
              <h2 className="mb-3 text-2xl font-bold md:text-3xl">{label}</h2>
            )}
            {overrides?.[id] ?? (
              <p className="text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
                준비 중입니다. 콘텐츠는 순차적으로 채워집니다.
              </p>
            )}
          </Container>
        </section>
      ))}

      {/* 다른 페이지로 나가는 항목 — 그룹별 카드. 여기에 내용이 있는 것처럼 보이지 않게 링크로만 둔다 */}
      {outboundGroups.map((group) => (
        <section key={group.label} className="border-b border-brand-line py-16 md:py-20">
          <Container>
            <h2 className="mb-6 text-2xl font-bold md:text-3xl">{group.label}</h2>
            <ul className="grid gap-px bg-brand-line sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col justify-between gap-4 bg-brand-surface p-6 transition-colors hover:bg-brand-subtle"
                  >
                    <span>
                      <span className="block text-[17px] font-bold text-brand-ink">{item.label}</span>
                      {item.desc && (
                        <span className="mt-1.5 block text-[13px] leading-relaxed text-brand-ink-muted">
                          {item.desc}
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
      ))}
    </>
  );
}
