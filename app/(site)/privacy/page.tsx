import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = { title: '개인정보 처리방침' };

/**
 * 개인정보 처리방침 — **초안**. 폼의 동의 문구가 링크할 곳이라 오픈 전 필수.
 *
 * 여기 적힌 수집 항목·목적·보유기간은 실제 구현된 폼
 * (`lib/schemas/newcomer.ts` · `lib/schemas/apply.ts` · `lib/schemas/reservation.ts`)에서 뽑았다.
 * 폼 필드를 바꾸면 이 페이지도 같이 고쳐야 한다.
 *
 * > DECISION NEEDED: 개인정보 보호책임자(이름·직위·연락처) — 교회 지정 필요.
 * > DECISION NEEDED: 보유 기간 — 아래는 "목적 달성 후 1년" 기본값. 교회 내부 규정 확인 필요.
 * > DECISION NEEDED: 처리위탁·국외 이전 고지 — Supabase(DB)·Vercel(호스팅) 리전 확정 후 확정.
 * > 위 3건이 확정되기 전에는 **이 페이지를 최종본으로 공표하지 않는다.**
 */

const COLLECTED = [
  {
    form: '새가족 등록',
    items: '이름, 연락처, 소속(연령대), 알게 된 경로(선택), 남기실 말씀(선택)',
    purpose: '새가족 안내 연락',
    period: '수집일로부터 1년',
  },
  {
    form: '영상 제작 신청',
    items: '신청자 이름, 연락처, 소속 기관, 담당 교역자',
    purpose: '영상 제작 일정 협의',
    period: '제작 완료 후 1년',
  },
  {
    form: '3대 후원회원 작정',
    items: '이름, 연락처, 교구, 직분, 작정 금액',
    purpose: '후원 작정 등록 및 안내',
    period: '작정 종료 후 1년',
  },
  {
    form: '평생교육원 수강신청',
    items: '이름, 연락처, 이메일(선택), 교구(지역), 수강생 구분, 신청 강의',
    purpose: '수강 신청 접수 및 개강 안내',
    period: '학기 종료 후 1년',
  },
  {
    form: '시설 이용 신청',
    items: '제출자 이름, 연락처, 이용기관, 담당 교역자',
    purpose: '시설 예약 확인 및 연락',
    period: '이용일로부터 1년',
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-brand-line bg-brand-surface pb-14 pt-28 md:pb-20 md:pt-40">
        <Container>
          <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-support md:text-xs">
            — 경향교회
          </p>
          <h1 className="display-lg text-brand-ink">개인정보 처리방침</h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
            경향교회는 홈페이지에서 수집하는 개인정보를 아래와 같이 처리합니다.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4 text-xl font-bold md:text-2xl">1. 수집하는 항목과 이용 목적</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="border-y border-brand-line text-[13px] text-brand-ink-muted">
                      <th className="py-3 pr-4 font-medium">신청 종류</th>
                      <th className="py-3 pr-4 font-medium">수집 항목</th>
                      <th className="py-3 pr-4 font-medium">이용 목적</th>
                      <th className="py-3 font-medium">보유 기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COLLECTED.map((row) => (
                      <tr key={row.form} className="border-b border-brand-line align-top">
                        <td className="py-4 pr-4 font-medium text-brand-ink">{row.form}</td>
                        <td className="py-4 pr-4 leading-relaxed text-brand-ink-muted">{row.items}</td>
                        <td className="py-4 pr-4 leading-relaxed text-brand-ink-muted">{row.purpose}</td>
                        <td className="py-4 leading-relaxed text-brand-ink-muted">{row.period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-brand-ink-muted">
                주민등록번호·계좌번호 등 고유식별정보와 민감정보는 수집하지 않습니다.
                회원가입 절차가 없으므로 로그인 계정 정보도 수집하지 않습니다.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold md:text-2xl">2. 보유 기간과 파기</h2>
              <p className="text-[15px] leading-relaxed text-brand-ink-muted">
                수집 목적이 달성되면 위 표의 보유 기간이 지난 뒤 지체 없이 파기합니다.
                전자적 파일은 복구할 수 없는 방법으로 삭제합니다.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold md:text-2xl">3. 제3자 제공</h2>
              <p className="text-[15px] leading-relaxed text-brand-ink-muted">
                수집한 개인정보를 제3자에게 제공하지 않습니다. 법령에 따른 요구가 있는 경우에만 예외로 합니다.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold md:text-2xl">4. 정보주체의 권리</h2>
              <p className="text-[15px] leading-relaxed text-brand-ink-muted">
                본인의 개인정보에 대해 열람·정정·삭제·처리정지를 요구할 수 있습니다.
                교회 사무실(02-3663-0333)로 연락하시면 처리해 드립니다.
              </p>
            </div>

            <div className="border-l-2 border-brand-point pl-4">
              <h2 className="mb-3 text-base font-bold">아직 확정되지 않은 항목</h2>
              <ul className="space-y-2 text-[14px] leading-relaxed text-brand-ink-muted">
                <li>· 개인정보 보호책임자(이름·직위·연락처) — 교회 지정 대기</li>
                <li>· 보유 기간 — 위 값은 기본안이며 교회 내부 규정 확인 후 확정</li>
                <li>· 처리위탁 및 국외 이전 고지 — 데이터베이스·호스팅 서비스 리전 확정 후 기재</li>
              </ul>
              <p className="mt-3 text-[13px] text-brand-ink-muted">
                위 항목이 확정되기 전까지 이 페이지는 준비 중인 초안입니다.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
