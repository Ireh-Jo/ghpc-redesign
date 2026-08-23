import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';
import { Container } from '@/components/layout/container';
import { AnchorNav } from '@/components/layout/anchor-nav';
import { ApplyForm } from '@/components/interactive/apply-form';
import { APPLY_FORMS } from '@/lib/forms/definitions';

export const metadata: Metadata = { title: '신청 · 서식' };

/**
 * 현행 `e교회행정 > 신청서`의 폼 3종을 한 페이지 앵커로 모은 곳 (2026-08-23 배치).
 * 시설이용신청은 예약시스템 진입점이라 `/reserve`로 분리했고,
 * 기관회계보고는 신청서가 아니라 자료 다운로드라 `/activity/resources`로 옮겼다.
 */
export default function ApplyPage() {
  return (
    <StubPage
      route="/activity/apply"
      lead="교회 기관·부서에서 사용하는 신청서입니다. 시설 이용은 별도 페이지에서 신청해주세요."
    >
      <AnchorNav items={APPLY_FORMS.map((f) => ({ id: f.anchor, label: f.title }))} />

      {APPLY_FORMS.map((def) => (
        <section
          key={def.anchor}
          id={def.anchor}
          className="scroll-mt-32 border-b border-brand-line py-16 md:scroll-mt-36 md:py-20"
        >
          <Container>
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">{def.title}</h2>
            {def.lead && (
              <p className="mb-8 text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
                {def.lead}
              </p>
            )}
            <ApplyForm id={def.id} />
          </Container>
        </section>
      ))}
    </StubPage>
  );
}
