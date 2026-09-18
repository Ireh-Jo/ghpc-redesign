import type { Metadata } from 'next';
import { StubPage } from '@/components/layout/stub-page';
import { Container } from '@/components/layout/container';
import { FadeIn } from '@/components/layout/fade-in';
import { ReservationCalendar } from '@/components/interactive/reservation-calendar';
import { ReservationForm } from '@/components/interactive/reservation-form';
import { CLOSE_TIME, MOCK_RESERVATIONS, OPEN_TIME } from '@/lib/reservations';

export const metadata: Metadata = { title: '시설이용신청' };

/**
 * 시설 이용 신청 — 현행 `e교회행정 > 신청서 > 시설이용신청`(`/Board/Index/25484`)의 대체.
 *
 * ── 2026-09-19: 정책 확정 후 달력 + 전용 폼으로 전환 ──
 * 정책 단일 출처: `context/features/reservation.md` §결정 잠금.
 * 승인 단계가 없어져 **신청 = 확정**이고, 달력이 곧 결과 화면이다.
 *
 * ⚠️ Supabase·Turnstile 키가 없어 **접수는 아직 막혀 있다** (서버 액션이 접수 불가를 반환).
 * 달력 데이터도 목업이다 — 연결되면 공개 뷰 `reservations_public`에서 읽는다.
 */

/** 현행 페이지의 주의사항·문의 — 문구와 번호를 그대로 옮겼다 (2026-09-19 확인) */
const NOTICES = [
  '최소 이용일 3일 전에 신청해 주시기 바랍니다. (당일 신청은 시스템에서 접수되지 않습니다)',
  '이용이 중복될 경우 먼저 신청한 부서가 이용 가능합니다 — 달력에서 빈 시간을 확인해주세요.',
  '시설 이용 후 반드시 소등(냉·난방)하여 주시고 주변을 깨끗하게 정돈해 주시기 바랍니다.',
  '이용 시 각종 기물이 훼손되거나 분실되지 않도록 주의해 주시기 바랍니다.',
];

const CONTACTS = [
  { label: '경비실 (출입문)', value: '070-7586-4411 · 02-3663-0333 내선 600' },
  { label: '기계실 (에어컨·전기)', value: '070-7586-4391 · 02-3663-0333 내선 331' },
];

export default function ReservePage() {
  return (
    <StubPage route="/church-admin/reserve" lead="교회 시설 이용을 신청합니다.">
      {/* ── 달력 ── */}
      <section className="border-b border-brand-line py-16 md:py-20">
        <Container>
          <FadeIn>
            <h2 className="text-[22px] font-bold text-brand-ink md:text-[26px]">예약 현황</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-brand-ink-muted">
              먼저 신청한 예약이 그 시간을 차지합니다. 비어 있는 시간을 확인하고 아래에서 신청해주세요.
              이용 가능 시간은 {OPEN_TIME}~{CLOSE_TIME}입니다.
            </p>
            <div className="mt-7">
              <ReservationCalendar reservations={MOCK_RESERVATIONS} />
            </div>
            <p className="mt-4 text-[13px] text-brand-ink-muted">
              ※ 지금 달력에 보이는 예약은 화면 확인용 예시 데이터입니다. 실제 예약 연결 전입니다.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── 주의사항 · 문의 ── */}
      <section className="border-b border-brand-line bg-brand-bg py-14 md:py-16">
        <Container>
          <FadeIn>
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <h2 className="text-[19px] font-bold text-brand-ink md:text-[22px]">
                  시설 신청·이용 시 주의사항
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {NOTICES.map((notice) => (
                    <li
                      key={notice}
                      className="flex gap-2.5 text-[14px] leading-relaxed text-brand-ink/85"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent"
                      />
                      {notice}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-[19px] font-bold text-brand-ink md:text-[22px]">문의</h2>
                <dl className="mt-4 grid gap-3">
                  {CONTACTS.map((contact) => (
                    <div
                      key={contact.label}
                      className="rounded-2xl border border-brand-line bg-brand-surface px-5 py-4"
                    >
                      <dt className="text-[13px] font-bold text-brand-accent">{contact.label}</dt>
                      <dd className="mt-1 text-[15px] text-brand-ink">{contact.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-[13px] leading-relaxed text-brand-ink-muted">
                  근무시간(오전 9:30~오후 5:30) 이후에는 경비실에만 연락 가능합니다.
                </p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── 신청 폼 ── */}
      <section className="border-b border-brand-line py-16 md:py-20">
        <Container>
          <FadeIn>
            <h2 className="text-[22px] font-bold text-brand-ink md:text-[26px]">
              교회시설 이용 신청서
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-brand-ink-muted">
              신청하면 승인 절차 없이 달력에 바로 표시됩니다. 취소는 신청 때 정한 비밀번호로 직접 하실 수 있고,
              내용을 바꾸려면 취소 후 다시 신청해주세요.
            </p>
            <div className="mt-8 max-w-3xl">
              <ReservationForm reservations={MOCK_RESERVATIONS} />
            </div>
          </FadeIn>
        </Container>
      </section>
    </StubPage>
  );
}
