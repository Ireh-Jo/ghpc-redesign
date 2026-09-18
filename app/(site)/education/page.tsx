import type { Metadata } from 'next';
import { HeroImage } from '@/components/content/hero-image';
import { AnchorNav } from '@/components/layout/anchor-nav';
import { Container } from '@/components/layout/container';
import { FadeIn } from '@/components/layout/fade-in';
import { EduDept } from '@/components/content/edu-dept';
import { EDU_DEPTS, EDU_PRINCIPLES, CHURCH_TEL } from '@/lib/education';

export const metadata: Metadata = { title: '교육' };

/**
 * 교육 페이지 (`/education`) — 부서 7종.
 *
 * ── 2026-09-18 ──
 * `StubPage` 껍데기를 걷고 실제 페이지로 만들었다. 조판은 디자인팀 교육 화면 시안(주일학교만 완성),
 * 콘텐츠는 TF 화면안(`docs/meetings/screens/교육.html`) → `lib/education.ts`.
 * 반영 기록·미결: `docs/2026-09-18-교육페이지-시안-반영.md`.
 *
 * **`SubPage`를 쓰지 않는다.** SubPage는 "대메뉴 = 라우트"를 가정해 `sectionKey`의 앵커만 모으는데,
 * 교육은 `예배와 교육` 대메뉴의 **하위 그룹**이라 그 가정에 안 맞는다 (앵커가 `/education#*`인데
 * 섹션 href는 `/worship`). 그래서 히어로 + 앵커바 + 섹션을 직접 조립한다 — 구조가 오히려 단순하다.
 * 앵커 id·순서는 `lib/nav.ts`의 교육 그룹과 **반드시 일치**시킨다 (GNB 링크가 그 id로 들어온다).
 */
const ANCHORS = EDU_DEPTS.map((dept) => ({ id: dept.id, label: dept.title }));

export default function EducationPage() {
  return (
    <>
      <HeroImage
        // 디자인팀 배너 (2026-09-18). 규격·용량: public/hero/README.md
        imageSrc="/hero/education.webp"
        imageSrcMobile="/hero/education-m.jpg"
        imageAlt="파란 하늘을 배경으로 올려다본 경향교회 교육관"
        eyebrow="— 예배와 교육 - 교육"
        title="교육"
        titleEn="GYUNG - HYANG PRESBYTERIAN CHURCH"
        lead="영아부터 어르신까지, 한 말씀 위에서 자라는 사람들"
      />

      <AnchorNav items={ANCHORS} />

      {EDU_DEPTS.map((dept) => (
        <section
          key={dept.id}
          id={dept.id}
          className="scroll-mt-32 border-b border-brand-line py-16 md:scroll-mt-36 md:py-20"
        >
          <Container>
            <FadeIn>
              <EduDept dept={dept} />
            </FadeIn>
          </Container>
        </section>
      ))}

      {/* 교육 방침 — 화면안에서 부서마다 반복되던 공통 블록. 중복 대신 페이지 끝에 한 번만 둔다. */}
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
    </>
  );
}
