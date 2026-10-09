import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { FaqAccordion } from '@/components/content/faq-accordion';
import type { EduDept as Dept, EduGroupItem, EduLink } from '@/lib/education';

/**
 * 교육 페이지 부서 섹션 — 6개 부서가 데이터만 바꿔 쓴다.
 * 근거 시안: 디자인팀 교육 화면 (2026-09-18, 주일학교만 완성). 상세: context/components/content/edu-dept.md
 *
 * 2026-10-09 교역자 원고 반영 — 하위 부서 카드에 **부서별 특징**(김창진 원고)이 붙으면 4열 요약 카드 대신
 * 2열 카드로 펼친다 · 주일학교 **공통 프로그램** 칩 · 새소식반 **성경 구절** · 바로가기에 사이트 안 링크와 "준비 중".
 * 청년회(지회 구성표)는 목양으로 옮겨 이 컴포넌트에서 뺐다.
 *
 * 블록은 **데이터에 있는 것만** 렌더한다 — 빈 제목만 남는 자리를 만들지 않는다.
 */
export function EduDept({ dept }: { dept: Dept }) {
  const { no, en, title, lead, links, intro, verses, groups, common, facts, bullets, events, faq, notes } =
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
              <li key={link.label}>
                <DeptLink link={link} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div aria-hidden className="mt-6 h-px w-full bg-brand-line" />

      {/* ── 성경 구절 (새소식반) ── */}
      {verses && verses.length > 0 && (
        <figure className="mt-8 space-y-3 border-l-2 border-brand-accent pl-5">
          {verses.map((verse) => (
            <blockquote key={verse.ref} className="text-[15px] leading-[1.75] text-brand-ink md:text-base">
              “{verse.text}”
              <cite className="ml-1.5 text-[13px] not-italic text-brand-ink-muted">{verse.ref}</cite>
            </blockquote>
          ))}
        </figure>
      )}

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

      {/* ── 하위 부서 카드 그룹 ── */}
      {groups?.map((group) => {
        // 특징 목록이 하나라도 있으면 2열로 펼친다 — 4열 요약 카드에는 목록이 안 들어간다
        const detailed = group.items.some((item) => item.features?.length);
        return (
          <div key={group.label} className="mt-10 md:mt-12">
            <h3 className="text-[19px] font-bold text-brand-ink md:text-[22px]">{group.label}</h3>
            {detailed ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:mt-5 md:gap-4">
                {group.items.map((item) => (
                  <GroupCardDetailed key={item.name} item={item} />
                ))}
              </ul>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-4 md:gap-4">
                {group.items.map((item) => (
                  <GroupCard key={item.name} item={item} />
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {/* ── 공통 프로그램 (주일학교) ── */}
      {common && (
        <div className="mt-10 rounded-2xl border border-brand-line bg-brand-subtle px-5 py-5 md:mt-12 md:px-6">
          <h3 className="text-[15px] font-bold text-brand-ink md:text-base">{common.title}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {common.items.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-brand-line bg-brand-surface px-3 py-1.5 text-[13px] font-bold text-brand-ink md:text-[14px]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

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

const PILL =
  'btn-round inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2';

/** 바로가기 알약 — 외부(새 창) · 사이트 안 · 준비 중(href 없음) 세 갈래 */
function DeptLink({ link }: { link: EduLink }) {
  if (!link.href) {
    return (
      <span
        aria-disabled="true"
        className={`${PILL} cursor-not-allowed border border-brand-line bg-brand-subtle text-brand-ink-muted`}
      >
        {link.label}
        <span className="text-[11px] font-medium">준비 중</span>
      </span>
    );
  }
  if (link.href.startsWith('/')) {
    return (
      <Link href={link.href} className={`${PILL} bg-brand-accent text-white hover:bg-brand-ink`}>
        {link.label}
      </Link>
    );
  }
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${PILL} bg-brand-accent text-white hover:bg-brand-ink`}
    >
      {link.label}
      <ArrowUpRight className="h-3.5 w-3.5" />
      <span className="sr-only">(새 창으로 열림)</span>
    </a>
  );
}

/** 하위 부서 요약 카드 (특징 목록 없음) — 4열 */
function GroupCard({ item }: { item: EduGroupItem }) {
  return (
    <li className="rounded-2xl border border-brand-accent/10 bg-brand-accent/[0.04] px-4 py-5 text-center transition-colors duration-200 hover:bg-brand-accent/[0.08]">
      <p className="text-[15px] font-bold text-brand-ink md:text-base">{item.name}</p>
      {item.meta && <p className="mt-1.5 text-[13px] leading-relaxed text-brand-ink-muted">{item.meta}</p>}
      {item.place && <p className="mt-0.5 text-[13px] text-brand-ink-muted">{item.place}</p>}
    </li>
  );
}

/** 하위 부서 카드 + "우리 부서의 특징" — 2열 (2026-10-09 김창진 원고) */
function GroupCardDetailed({ item }: { item: EduGroupItem }) {
  return (
    <li className="flex flex-col rounded-2xl border border-brand-line bg-brand-surface p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[18px] font-bold text-brand-ink md:text-[20px]">{item.name}</p>
        {item.place && (
          <span className="shrink-0 rounded-lg bg-brand-accent/5 px-2.5 py-1 text-[12px] font-bold text-brand-accent md:text-[13px]">
            {item.place}
          </span>
        )}
      </div>
      {item.meta && (
        <p className="mt-1 text-[14px] leading-relaxed text-brand-ink-muted md:text-[15px]">{item.meta}</p>
      )}
      {item.features?.length ? (
        <ul className="mt-4 space-y-2 border-t border-brand-line pt-4">
          {item.features.map((feature) => (
            <li key={feature} className="flex gap-2 text-[14px] leading-snug text-brand-ink/85 md:text-[15px]">
              <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              {feature}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 border-t border-brand-line pt-4 text-[13px] text-brand-ink-muted">
          부서 프로그램 안내 준비 중
        </p>
      )}
    </li>
  );
}
