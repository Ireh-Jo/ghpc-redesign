import type { Metadata } from 'next';
import { HeroImage } from '@/components/content/hero-image';
import { AnchorNav } from '@/components/layout/anchor-nav';
import { Container } from '@/components/layout/container';
import { EduChapter } from '@/components/content/edu-chapter';
import { EDU_DEPTS } from '@/lib/education';
import { EduPrinciples } from '../_principles';

// 비교용 시범 화면 — 검색에 잡히지 않게 한다 (A안 `/education`이 정본)
export const metadata: Metadata = { title: '교육 (C안)', robots: { index: false, follow: false } };

/**
 * 교육 페이지 **C안** (`/education/c`) — 부서마다 배너 + 그 부서의 하위 메뉴가 좌측에 따라온다.
 *
 * ── 2026-09-27 시범 (사용자 제안) ──
 * B안이 "페이지 전체에 좌측 패널 1개(부서 목록)"라면, C안은 **부서 = 챕터**다.
 * 주일학교 배너 → 좌측 `소개 / 미취학부(영아부…) / 초등부(초등1부…) / 주요 시설 / 주요 행사`,
 * 중·고등부 배너가 나오면 좌측이 중·고등부 메뉴로 바뀐다. 구성: `components/content/edu-chapter.tsx`.
 *
 * 부서 간 이동은 상단 부서 탭(`AnchorNav`)이 **모든 폭에서** 맡는다 — 좌측 패널이 부서 안쪽 메뉴라서.
 * 채택되면 A안 자리로 옮기고, 탈락하면 이 폴더와 `EduChapter`를 지운다.
 */
const ANCHORS = EDU_DEPTS.map((dept) => ({ id: dept.id, label: dept.title }));

export default function EducationPageC() {
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

      <AnchorNav items={ANCHORS} />

      <Container>
        {EDU_DEPTS.map((dept) => (
          <EduChapter key={dept.id} dept={dept} />
        ))}
      </Container>

      <div className="border-t border-brand-line">
        <EduPrinciples />
      </div>
    </>
  );
}
