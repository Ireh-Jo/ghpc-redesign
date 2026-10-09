import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { HeroImage } from '@/components/content/hero-image';
import { AnchorNav } from '@/components/layout/anchor-nav';
import { FadeIn } from '@/components/layout/fade-in';
import { SideNav } from '@/components/layout/side-nav';
import { SideNavLayout, sideSectionClass } from '@/components/layout/side-nav-layout';
import {
  MinistryGts,
  MinistryKids,
  MinistryMission,
  MinistrySchool,
  MinistryStars,
  MinistryWelfare,
} from '@/components/content/ministry-sections';
import { NAV } from '@/lib/nav';

export const metadata: Metadata = { title: '사역' };

/**
 * 사역 (`/ministry`) — `목양과 사역 > 사역` 기관 6곳.
 *
 * ── 2026-10-09 교역자 원고 반영 ──
 * `StubPage` 껍데기를 걷고 실제 페이지로 만들었다 (원고 사역2·3·4 → `lib/ministry.ts`).
 * `/education`처럼 대메뉴의 **하위 그룹**이라 `SubPage`를 쓰지 않고 히어로 + 2단(`SideNavLayout`)을 직접 조립한다.
 * 앵커 목록은 `lib/nav.ts`의 `사역` 그룹에서 읽는다 — GNB 링크(`/ministry#stars` …)와 어긋나지 않게.
 *
 * 디자인팀 배너 (2026-10-03). 아이브로우는 `예배와 교육 - 예배/교육`과 같은 꼴로 `목양과 사역 - 사역`.
 * 리드는 시안이 교육 배너와 같은 문장이라 이 페이지의 기존 소개 문구를 쓴다 (2026-10-03 사용자 지시).
 */
const SECTIONS: Record<string, ReactNode> = {
  stars: <MinistryStars />,
  gts: <MinistryGts />,
  mission: <MinistryMission />,
  welfare: <MinistryWelfare />,
  school: <MinistrySchool />,
  childcare: <MinistryKids />,
};

const ANCHORS = (NAV.find((s) => s.key === 'care')?.groups.find((g) => g.label === '사역')?.items ?? [])
  .filter((item) => item.href.startsWith('/ministry#'))
  .map((item) => ({ id: item.href.split('#')[1], label: item.label }));

export default function MinistryPage() {
  return (
    <>
      <HeroImage
        imageSrc="/hero/ministry.webp"
        imageSrcMobile="/hero/ministry-m.jpg"
        imageAlt="푸른 하늘 아래 올려다본 경향교회 원통형 건물과 교회 이름"
        eyebrow="— 목양과 사역 - 사역"
        title="사역"
        titleEn="GYUNG - HYANG PRESBYTERIAN CHURCH"
        lead="경향교회가 함께하는 기관과 사역들."
      />

      <AnchorNav items={ANCHORS} className="lg:hidden" />

      <SideNavLayout nav={<SideNav title="사역" lead="경향교회가 함께하는 기관과 사역들." items={ANCHORS} />}>
        {ANCHORS.map(({ id, label }, i) => (
          <section key={id} id={id} className={sideSectionClass(i === ANCHORS.length - 1)}>
            <h2 className="mb-6 text-[26px] font-extrabold leading-tight tracking-tight text-brand-ink md:text-[34px]">
              {label}
            </h2>
            <FadeIn>
              {SECTIONS[id] ?? (
                <p className="text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
                  준비 중입니다. 콘텐츠는 순차적으로 채워집니다.
                </p>
              )}
            </FadeIn>
          </section>
        ))}
      </SideNavLayout>
    </>
  );
}
