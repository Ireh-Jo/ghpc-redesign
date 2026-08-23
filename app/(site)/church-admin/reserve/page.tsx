import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';
import { Container } from '@/components/layout/container';
import { ApplyForm } from '@/components/interactive/apply-form';
import { RESERVATION_FORM } from '@/lib/forms/definitions';

export const metadata: Metadata = { title: '시설 예약' };

/**
 * 시설 이용 신청 — 현행 `e교회행정 > 신청서 > 시설이용신청`의 대체.
 *
 * 최종 목표는 달력에서 빈 시간을 보고 잡는 예약 시스템(`context/features/reservation.md`)이지만,
 * 겹침 방지 규칙·신청 마감·장소 목록이 아직 회의 대기라 **1차는 현행과 같은 신청 폼**으로 연다.
 * 달력 UI는 그 결정들이 확정된 뒤 이 페이지 위에 얹는다.
 */
export default function ReservePage() {
  return (
    <StubPage route="/church-admin/reserve" lead="교회 시설 이용을 신청합니다.">
      <section className="border-b border-brand-line py-16 md:py-20">
        <Container>
          <ApplyForm id={RESERVATION_FORM.id} />
        </Container>
      </section>
    </StubPage>
  );
}
