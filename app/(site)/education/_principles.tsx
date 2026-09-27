import { Container } from '@/components/layout/container';
import { FadeIn } from '@/components/layout/fade-in';
import { EDU_PRINCIPLES, CHURCH_TEL } from '@/lib/education';

/**
 * 교육 방침 + 부서 문의 — 화면안에서 부서마다 반복되던 공통 블록. 페이지 끝에 한 번만 둔다.
 * A안(`/education`)·B안(`/education/b`)이 같은 블록을 쓰도록 2026-09-27에 뺐다.
 */
export function EduPrinciples() {
  return (
    <section className="border-b border-brand-line bg-brand-bg py-16 md:py-20">
      <Container>
        <FadeIn>
          <p className="text-[12px] font-bold tracking-[0.2em] text-brand-accent">
            EDUCATION PRINCIPLES
          </p>
          <h2 className="mt-3 text-[26px] font-extrabold tracking-tight text-brand-ink md:text-[34px]">
            교육 방침
          </h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
            모든 부서가 같은 기준 위에서 가르치고 배웁니다.
          </p>

          <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
            {EDU_PRINCIPLES.map((principle, i) => (
              <li
                key={principle.title}
                className="rounded-2xl border border-brand-line bg-brand-surface p-6 md:p-7"
              >
                <span
                  aria-hidden
                  className="text-[18px] font-extrabold leading-none text-brand-accent/40"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-4 text-[18px] font-bold text-brand-ink md:text-[20px]">
                  {principle.title}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-brand-ink-muted md:text-[15px]">
                  {principle.body}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[14px] leading-relaxed text-brand-ink-muted md:mt-10">
            부서 문의는 담당교역자 또는 부서 임원에게 해주세요. 교회 대표전화{' '}
            <a
              href={`tel:${CHURCH_TEL.replace(/-/g, '')}`}
              className="link-wipe font-bold text-brand-ink"
            >
              {CHURCH_TEL}
            </a>
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
