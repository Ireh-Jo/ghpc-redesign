import type { Metadata } from 'next';
import { HeroImage } from '@/components/content/hero-image';
import { AnchorNav } from '@/components/layout/anchor-nav';
import { Container } from '@/components/layout/container';
import { FadeIn } from '@/components/layout/fade-in';
import { SideNav } from '@/components/layout/side-nav';
import { EduDept } from '@/components/content/edu-dept';
import { EDU_DEPTS, CHURCH_TEL } from '@/lib/education';
import { EduPrinciples } from '../_principles';

// 비교용 시범 화면 — 검색에 잡히지 않게 한다 (A안 `/education`이 정본)
export const metadata: Metadata = { title: '교육 (B안)', robots: { index: false, follow: false } };

/**
 * 교육 페이지 **B안** (`/education/b`) — 좌측 sticky 패널 + 우측 콘텐츠.
 *
 * ── 2026-09-27 시범 ──
 * 외부 제안(레퍼런스 `feedbluetiger.imweb.me`): 큰 주제 이미지 → 더 내리면 좌측 서브메뉴가 따라오고
 * 우측에 콘텐츠. A안(`/education`, 상단 가로 탭)과 나란히 비교하려고 **데이터·섹션 컴포넌트는 그대로**
 * 두고 배치만 바꿨다. 채택되면 A안 자리로 옮기고, 탈락하면 이 폴더와 `SideNav`를 지운다.
 *
 * - lg(1024) 이상: 좌측 `SideNav`(제목·소개·부서 목록·대표전화) + 우측 부서 섹션
 * - lg 미만: 좌측 열을 둘 폭이 없어 A안과 같은 가로 탭(`AnchorNav`)
 * - 교육 방침은 2단이 끝난 뒤 전체 폭 (A안과 같은 블록)
 */
const ANCHORS = EDU_DEPTS.map((dept) => ({ id: dept.id, label: dept.title }));

export default function EducationPageB() {
  return (
    <>
      <HeroImage
        imageSrc="/hero/education.webp"
        imageSrcMobile="/hero/education-m.jpg"
        imageAlt="파란 하늘을 배경으로 올려다본 경향교회 교육관"
        eyebrow="— 예배와 교육 - 교육"
        title="교육"
        titleEn="GYUNG - HYANG PRESBYTERIAN CHURCH"
        lead="영아부터 어르신까지, 한 말씀 위에서 자라는 사람들"
      />

      <AnchorNav items={ANCHORS} className="lg:hidden" />

      <Container>
        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-16">
          <aside className="hidden py-20 lg:block">
            <SideNav
              eyebrow="EDUCATION"
              title="교육"
              lead="영아부터 어르신까지, 부서별 예배와 모임을 안내합니다."
              items={ANCHORS}
              cta={{ label: '부서 문의', detail: CHURCH_TEL, href: `tel:${CHURCH_TEL.replace(/-/g, '')}` }}
            />
          </aside>

          <div>
            {EDU_DEPTS.map((dept, i) => (
              <section
                key={dept.id}
                id={dept.id}
                className={`scroll-mt-32 py-16 md:scroll-mt-36 md:py-20 lg:scroll-mt-24 ${
                  i < EDU_DEPTS.length - 1 ? 'border-b border-brand-line' : ''
                }`}
              >
                <FadeIn>
                  <EduDept dept={dept} />
                </FadeIn>
              </section>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-brand-line">
        <EduPrinciples />
      </div>
    </>
  );
}
