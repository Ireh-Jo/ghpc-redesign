import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { FadeIn } from '@/components/layout/fade-in';
import { RELATED_ORGS } from '@/lib/related-orgs';

/**
 * 관련 기관 — 메인 하단 "바른 신앙, 따뜻한 사랑이 있는 공동체" 6칸.
 * 근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai`·`… 모바일.ai` (2026-09-16).
 * 데이터: `lib/related-orgs.ts` · 상세: context/components/content/related-orgs.md
 *
 * 시안에서는 이 블록이 푸터 안에 있었지만 **푸터는 이번 범위 밖**(2026-09-16 사용자 판단)이라
 * 새가족 섹션 아래 페이지 섹션으로 뒀다. 나중에 시안 푸터를 적용할 때 이 컴포넌트를 그대로 옮기면 된다.
 *
 * ── 모션: 카드 뒤집기 (2026-09-16 사용자 요청) ──
 * hover/포커스 시 X축 180° 회전 — 앞면 기관명, 뒷면 한 줄 소개 + 바로가기.
 * `prefers-reduced-motion`에서는 회전을 끄고 **색 반전만** 남긴다 (뒷면은 숨긴다).
 */

/** 링크(=group) 공통 — 뒤집기 원근은 여기서 잡는다 */
const LINK =
  'group flip-scene block h-[88px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 md:h-[104px]';

/** 앞/뒤 두 면. 뒤집기 움직임은 `flip-*` 유틸(app/globals.css)이 갖고, 여기선 색·조판만 정한다 */
function Faces({ name, desc }: { name: string; desc: string }) {
  return (
    <span className="flip-card">
      <span className="flip-face flex items-center justify-center rounded-xl bg-brand-line/70 px-3 text-center text-[14px] font-bold leading-snug text-brand-ink transition-colors duration-200 motion-reduce:group-hover:bg-brand-accent motion-reduce:group-hover:text-white md:text-[16px]">
        {name}
      </span>
      <span className="flip-face flip-back flex flex-col items-center justify-center gap-1 rounded-xl bg-brand-accent px-3 text-center text-white">
        <span className="text-[13px] text-white/75 md:text-[14px]">{desc}</span>
        <span className="inline-flex items-center gap-1 text-[14px] font-bold md:text-[15px]">
          바로가기 <ArrowUpRight className="h-4 w-4" />
        </span>
      </span>
    </span>
  );
}

export function RelatedOrgs() {
  return (
    <section className="bg-brand-bg py-16 md:py-24">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="— 바른 신앙, 따뜻한 사랑이 있는"
            title="공동체"
            lead="경향교회와 함께하는 기관들"
          />
        </FadeIn>

        <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-3 md:gap-5">
          {RELATED_ORGS.map((org, i) => (
            <li key={org.name}>
              <FadeIn delay={i * 50}>
                {org.external ? (
                  <a href={org.href} target="_blank" rel="noopener" className={LINK}>
                    <Faces name={org.name} desc={org.desc} />
                    <span className="sr-only">(새 창으로 열림)</span>
                  </a>
                ) : (
                  <Link href={org.href} className={LINK}>
                    <Faces name={org.name} desc={org.desc} />
                  </Link>
                )}
              </FadeIn>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
