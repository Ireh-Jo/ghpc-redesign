import type { Metadata } from 'next';
import { HeroImage } from '@/components/content/hero-image';
import { AnchorNav } from '@/components/layout/anchor-nav';
import { FadeIn } from '@/components/layout/fade-in';
import { SideNav } from '@/components/layout/side-nav';
import { SideNavLayout, sideSectionClass } from '@/components/layout/side-nav-layout';
import { EduDept } from '@/components/content/edu-dept';
import { EDU_DEPTS, CHURCH_TEL } from '@/lib/education';
import { EduPrinciples } from './_principles';

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
 *
 * ── 2026-10-03: 좌측 sticky 패널(B안) 확정 ──
 * 2026-09-27 A(상단 탭)·B(좌측 패널)·C(부서별 배너 + 부서별 메뉴) 비교 끝에 B안으로 확정했다.
 * 2단 골격은 `SubPage`와 같은 `SideNavLayout`을 쓴다. lg 미만은 상단 `AnchorNav` 그대로.
 * 교육 방침은 앵커 섹션이 아니라서 2단 밖에 전체 폭으로 둔다.
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

      <AnchorNav items={ANCHORS} className="lg:hidden" />

      <SideNavLayout
        nav={
          <SideNav
            title="교육"
            lead="영아부터 어르신까지, 부서별 예배와 모임을 안내합니다."
            items={ANCHORS}
            cta={{ label: '부서 문의', detail: CHURCH_TEL, href: `tel:${CHURCH_TEL.replace(/-/g, '')}` }}
          />
        }
      >
        {EDU_DEPTS.map((dept, i) => (
          <section key={dept.id} id={dept.id} className={sideSectionClass(i === EDU_DEPTS.length - 1)}>
            <FadeIn>
              <EduDept dept={dept} />
            </FadeIn>
          </section>
        ))}
      </SideNavLayout>

      <div className="border-t border-brand-line">
        <EduPrinciples />
      </div>
    </>
  );
}
