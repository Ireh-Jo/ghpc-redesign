import { ArrowDown, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { FadeIn } from '@/components/layout/fade-in';
import {
  CHURCH_TEL,
  EDU_GOALS,
  EDU_HEADLINE,
  EDU_PRINCIPLES,
  EDU_ROADMAP,
  EDU_STEPS,
} from '@/lib/education';

/**
 * 교육 개요 — 부서 목록 앞. 실천 원리 · 교육목표 · 교육방법 3단계 · 성장 로드맵.
 * 출처: 김창진 목사 원고 (2026-10-09). 상세: context/components/content/edu-overview.md
 *
 * 전에는 페이지 끝의 "교육 방침" 3카드였다 — 원고가 목표·방법·로드맵까지 줘서 위로 올려 합쳤다.
 */
export function EduOverview() {
  return (
    <section aria-labelledby="edu-overview-title" className="border-b border-brand-line bg-brand-bg py-16 md:py-20">
      <Container>
        <FadeIn>
          <p className="text-[12px] font-bold tracking-[0.2em] text-brand-accent">EDUCATION</p>
          <h2
            id="edu-overview-title"
            className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight text-brand-ink md:text-[34px]"
          >
            {EDU_HEADLINE}
          </h2>

          {/* 실천 원리 */}
          <Block title="실천 원리">
            <ul className="grid gap-3 md:grid-cols-3 md:gap-4">
              {EDU_PRINCIPLES.map((principle, i) => (
                <li key={principle.title} className="rounded-2xl bg-brand-accent px-6 py-6 text-white md:px-7">
                  <span aria-hidden className="text-[13px] font-extrabold text-white/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 text-[22px] font-extrabold tracking-tight md:text-[24px]">{principle.title}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/80">{principle.body}</p>
                </li>
              ))}
            </ul>
          </Block>

          {/* 교육목표 */}
          <Block title="교육목표">
            <ul className="grid gap-3 md:grid-cols-3 md:gap-4">
              {EDU_GOALS.map((goal) => (
                <li key={goal.label} className="rounded-2xl border border-brand-line bg-brand-surface px-6 py-5">
                  <p className="text-[13px] font-bold text-brand-accent">{goal.label}</p>
                  <p className="mt-1.5 text-[18px] font-bold leading-snug text-brand-ink md:text-[19px]">
                    {goal.title}
                  </p>
                </li>
              ))}
            </ul>
          </Block>

          {/* 교육방법 — 3단계, 화살표로 잇는다 (모바일은 세로) */}
          <Block title="교육방법">
            <ol className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-0">
              {EDU_STEPS.map((step, i) => (
                <li key={step.title} className="flex flex-col md:flex-1 md:flex-row md:items-center">
                  <div className="flex-1 rounded-2xl border border-brand-line bg-brand-surface px-6 py-5">
                    <p className="text-[12px] font-bold tracking-[0.12em] text-brand-accent">STEP {i + 1}</p>
                    <p className="mt-1 text-[18px] font-bold text-brand-ink md:text-[19px]">{step.title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-brand-ink-muted">{step.body}</p>
                  </div>
                  {i < EDU_STEPS.length - 1 && (
                    <span aria-hidden className="flex justify-center py-1 text-brand-ink-muted md:px-3 md:py-0">
                      <ArrowDown className="h-5 w-5 md:hidden" />
                      <ArrowRight className="hidden h-5 w-5 md:block" />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Block>

          {/* 성장 로드맵 — 9단계, 각 칸은 그 부서 섹션으로. 모바일은 가로 스크롤 */}
          <Block title="성장 로드맵">
            <ol className="-mx-5 flex overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
              {EDU_ROADMAP.map((node) => (
                <li key={node.dept} className="min-w-[104px] flex-1">
                  <a
                    href={node.href}
                    className="group block border-t-[3px] border-brand-line pr-3 pt-3 transition-colors duration-200 hover:border-brand-accent"
                  >
                    <span className="block text-[13px] font-bold text-brand-accent">{node.dept}</span>
                    <span className="mt-0.5 block text-[18px] font-extrabold tracking-tight text-brand-ink md:text-[19px]">
                      {node.verb}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </Block>

          <p className="mt-10 text-[14px] leading-relaxed text-brand-ink-muted">
            부서 문의는 담당교역자 또는 부서 임원에게 해주세요. 교회 대표전화{' '}
            <a href={`tel:${CHURCH_TEL.replace(/-/g, '')}`} className="link-wipe font-bold text-brand-ink">
              {CHURCH_TEL}
            </a>
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 md:mt-12">
      <h3 className="mb-4 text-[15px] font-bold tracking-wide text-brand-ink-muted md:mb-5">{title}</h3>
      {children}
    </div>
  );
}
