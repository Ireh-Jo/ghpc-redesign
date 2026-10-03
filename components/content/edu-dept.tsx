import { ArrowUpRight } from 'lucide-react';
import { FaqAccordion } from '@/components/content/faq-accordion';
import type { EduDept as Dept } from '@/lib/education';

/**
 * 교육 페이지 부서 섹션 — 7개 부서가 데이터만 바꿔 쓴다.
 * 근거 시안: 디자인팀 교육 화면 (2026-09-18, 주일학교만 완성) + TF 화면안 콘텐츠
 * (`docs/meetings/screens/교육.html`). 상세: context/components/content/edu-dept.md
 *
 * 블록은 **데이터에 있는 것만** 렌더한다 — 빈 제목만 남는 자리를 만들지 않는다.
 * 제목은 h2다 (`SubPage`의 섹션 h2를 `bareSections`로 숨기고 이 제목이 대신한다).
 */
export function EduDept({ dept }: { dept: Dept }) {
  const { no, en, title, lead, links, intro, groups, facts, roster, bullets, events, faq, notes } =
    dept;

  return (
    <div>
      {/* ── 머리 ── */}
      <p className="text-[12px] font-bold tracking-[0.2em] text-brand-accent">
        {no} {en}
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-2xl">
          <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-brand-ink md:text-[34px]">
            {title}
          </h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-brand-ink-muted md:text-base">
            {lead}
          </p>
        </div>
        {links && links.length > 0 && (
          <ul className="flex flex-wrap items-center gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-round inline-flex items-center gap-1.5 bg-brand-accent px-3.5 py-2 text-[13px] font-bold text-white transition-colors duration-200 hover:bg-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
                >
                  {link.label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="sr-only">(새 창으로 열림)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div aria-hidden className="mt-6 h-px w-full bg-brand-line" />

      {/* ── 소개 카드 (시안의 연블루 박스) ── */}
      <div
        className={`mt-8 grid gap-6 rounded-2xl bg-brand-accent/5 p-6 md:gap-8 md:p-8 ${
          intro.photoSlots ? 'md:grid-cols-2' : ''
        }`}
      >
        <div>
          <p className="text-[14px] font-bold text-brand-accent md:text-[15px]">
            {no} {intro.title}
          </p>
          <p className="mt-3.5 text-[15px] leading-[1.75] text-brand-ink/85 md:text-base">
            {intro.body}
          </p>
        </div>
        {intro.photoSlots ? (
          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            {Array.from({ length: intro.photoSlots }).map((_, i) => (
              <li
                key={i}
                className="flex aspect-[4/3] items-center justify-center rounded-xl bg-brand-line/70 text-[13px] text-brand-ink-muted"
              >
                활동사진
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* ── 부서 카드 그룹 ── */}
      {groups?.map((group) => (
        <div key={group.label} className="mt-10 md:mt-12">
          <h3 className="text-[19px] font-bold text-brand-ink md:text-[22px]">{group.label}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-4 md:gap-4">
            {group.items.map((item) => (
              <li
                key={item.name}
                className="rounded-2xl border border-brand-accent/10 bg-brand-accent/[0.04] px-4 py-5 text-center transition-colors duration-200 hover:bg-brand-accent/[0.08]"
              >
                <p className="text-[15px] font-bold text-brand-ink md:text-base">{item.name}</p>
                {item.meta && (
                  <p className="mt-1.5 text-[13px] leading-relaxed text-brand-ink-muted">
                    {item.meta}
                  </p>
                )}
                {item.place && (
                  <p className="mt-0.5 text-[13px] text-brand-ink-muted">{item.place}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* ── 정보 리스트 ── */}
      {facts && (
        <div className="mt-10 md:mt-12">
          {facts.title && (
            <h3 className="mb-4 text-[19px] font-bold text-brand-ink md:mb-5 md:text-[22px]">
              {facts.title}
            </h3>
          )}
          {/* `gap-px + bg-line` 격자 대신 **카드 나열** — 항목 수가 열 수로 안 나뉠 때 빈 칸이
             회색으로 드러나는 문제가 있었다 (2026-09-18 주요 시설 3개 / 2열) */}
          <dl className="grid gap-3 sm:grid-cols-2 md:gap-4">
            {facts.items.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-brand-line bg-brand-surface px-5 py-4"
              >
                <dt className="text-[13px] font-bold tracking-wide text-brand-accent">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-brand-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* ── 지회 구성표 (청년회) ── */}
      {roster && (
        <div className="mt-10 md:mt-12">
          <h3 className="mb-4 text-[19px] font-bold text-brand-ink md:mb-5 md:text-[22px]">
            {roster.title}
          </h3>
          <dl className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {roster.items.map((item) => (
              <div
                key={item.label}
                className="flex items-baseline justify-between gap-3 rounded-xl border border-brand-line bg-brand-surface px-4 py-3"
              >
                <dt className="text-[15px] font-bold text-brand-ink">{item.label}</dt>
                <dd className="text-[14px] text-brand-ink-muted">{item.value}</dd>
              </div>
            ))}
          </dl>
          {roster.note && (
            <p className="mt-3 text-[13px] leading-relaxed text-brand-ink-muted">{roster.note}</p>
          )}
        </div>
      )}

      {/* ── 특징·혜택 ── */}
      {bullets && (
        <div className="mt-10 md:mt-12">
          <h3 className="mb-4 text-[19px] font-bold text-brand-ink md:mb-5 md:text-[22px]">
            {bullets.title}
          </h3>
          <ul className="space-y-2.5">
            {bullets.items.map((item) => (
              <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-brand-ink/85">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 주요 행사 ── */}
      {events && events.length > 0 && (
        <div className="mt-10 md:mt-12">
          <h3 className="mb-4 text-[19px] font-bold text-brand-ink md:mb-5 md:text-[22px]">
            주요 행사
          </h3>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {events.map((event, i) => (
              <li
                key={event}
                className="group flex items-center gap-3 rounded-2xl border border-brand-line bg-brand-surface px-4 py-4 transition-colors duration-200 hover:border-brand-accent/40"
              >
                <span
                  aria-hidden
                  className="text-[18px] font-extrabold leading-none text-brand-accent/40 transition-colors duration-200 group-hover:text-brand-accent/70"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[14px] font-bold leading-snug text-brand-ink md:text-[15px]">
                  {event}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── FAQ ── */}
      {faq && faq.length > 0 && (
        <div className="mt-10 md:mt-12">
          <h3 className="mb-4 text-[19px] font-bold text-brand-ink md:mb-5 md:text-[22px]">
            자주 묻는 질문
          </h3>
          <FaqAccordion items={faq} />
        </div>
      )}

      {/* ── 각주 ── */}
      {notes && notes.length > 0 && (
        <ul className="mt-8 space-y-1.5 border-t border-brand-line pt-5">
          {notes.map((note) => (
            <li key={note} className="text-[13px] leading-relaxed text-brand-ink-muted">
              · {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
