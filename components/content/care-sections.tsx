import {
  ArrowUpRight,
  CircleDot,
  Coffee,
  FileText,
  Goal,
  HeartHandshake,
  MapPin,
  Palette,
  PlayCircle,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  Volleyball,
  type LucideIcon,
} from 'lucide-react';
import { ContentTabs } from '@/components/interactive/content-tabs';
import {
  CLUBS,
  DISTRICT_INTRO,
  DISTRICT_STUDY,
  DISTRICT_TYPES,
  EVANGELISM,
  type BirthTable,
  type Club,
} from '@/lib/care';

/**
 * 목양(`/care`) 섹션 본문 — 구역모임 · 전도회 · 동호회. `SubPage`의 `overrides`로 꽂는다.
 * 데이터: `lib/care.ts` (교역자 원고 `사역1(소모임)`, 2026-10-09). 상세: context/components/content/care-sections.md
 */

const DISTRICT_ICONS: Record<(typeof DISTRICT_TYPES)[number]['key'], LucideIcon> = {
  men: UserRound,
  women: UserRound,
  couple: HeartHandshake,
  youth: Sparkles,
};

/** 구역공과 최신 영상 — 페이지가 유튜브 재생목록 RSS에서 읽어 넘긴다. 없으면 재생목록으로 */
export type StudyVideo = { title: string; url: string };

export function CareDistrict({ latest }: { latest: StudyVideo | null }) {
  return (
    <div>
      <p className="max-w-2xl text-[15px] leading-relaxed text-brand-ink-muted md:text-base">{DISTRICT_INTRO}</p>

      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {DISTRICT_TYPES.map((type) => {
          const Icon = DISTRICT_ICONS[type.key];
          return (
            <li key={type.key} className="rounded-2xl border border-brand-line bg-brand-surface px-4 py-5 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-accent/5 text-brand-accent">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-3 text-[15px] font-bold text-brand-ink md:text-base">{type.name}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-brand-ink-muted">{type.desc}</p>
            </li>
          );
        })}
      </ul>

      {/* 구역공과 — 영상은 유튜브 재생목록 최신편 자동, PDF는 현행 게시판 */}
      <div className="mt-10 rounded-2xl bg-brand-accent/5 p-6 md:mt-12 md:p-8">
        <h3 className="text-[19px] font-bold text-brand-ink md:text-[22px]">구역공과 자료</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-brand-ink-muted md:text-[15px]">
          매주 올라오는 영상과 PDF 자료를 확인하세요.
        </p>
        {latest && (
          <p className="mt-5 text-[15px] font-bold text-brand-ink md:text-base">
            <span className="mr-2 text-[12px] font-bold tracking-[0.12em] text-brand-accent">이번 주</span>
            {latest.title}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <ExternalButton
            href={latest?.url ?? DISTRICT_STUDY.playlistUrl}
            icon={PlayCircle}
            label="영상 보기"
            primary
          />
          <ExternalButton href={DISTRICT_STUDY.pdfBoardUrl} icon={FileText} label="PDF 보기" />
          <ExternalButton href={DISTRICT_STUDY.playlistUrl} label="지난 영상 전체" />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-brand-ink-muted">
          PDF는 현재 홈페이지 구역공과 게시판에서 열립니다.
        </p>
      </div>
    </div>
  );
}

export function CareEvangelism() {
  return (
    <ContentTabs
      label="전도회 구분"
      tabs={EVANGELISM.map((group) => ({
        id: group.id,
        label: group.label,
        content: (
          <div>
            <p className="max-w-2xl text-[15px] leading-relaxed text-brand-ink-muted md:text-base">{group.desc}</p>
            <div
              className={
                group.tables.length > 1
                  ? `mt-6 grid gap-4 ${group.tables.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2'}`
                  : 'mt-6 max-w-sm'
              }
            >
              {group.tables.map((table) => (
                <BirthYearTable key={table.range} table={table} />
              ))}
            </div>
          </div>
        ),
      }))}
    />
  );
}

/** 출생 구간 → 기관 번호 표 한 열 */
function BirthYearTable({ table }: { table: BirthTable }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-line">
      <table className="w-full border-collapse text-[14px]">
        <caption className="bg-brand-subtle px-4 py-2.5 text-left text-[12px] font-bold tracking-wide text-brand-accent">
          {table.range}
        </caption>
        <thead>
          <tr className="border-y border-brand-line bg-brand-surface">
            <th scope="col" className="w-16 px-3 py-2 text-center text-[12px] font-bold text-brand-ink-muted">
              기관
            </th>
            <th scope="col" className="px-3 py-2 text-left text-[12px] font-bold text-brand-ink-muted">
              출생연도
            </th>
          </tr>
        </thead>
        <tbody className="bg-brand-surface">
          {table.rows.map(([no, birth]) => (
            <tr key={no} className="border-t border-brand-line first:border-t-0">
              <td className="px-3 py-1.5 text-center font-bold tabular-nums text-brand-ink">{no}</td>
              <td className="px-3 py-1.5 text-brand-ink/85">{birth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CLUB_ICONS: Record<Club['key'], LucideIcon> = {
  futsal: Goal,
  basketball: Volleyball,
  baseball: Trophy,
  tabletennis: CircleDot,
  coffee: Coffee,
  sketch: Palette,
};

export function CareClubs() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 md:gap-4">
      {CLUBS.map((club) => {
        const Icon = CLUB_ICONS[club.key];
        return (
          <li key={club.name} className="flex flex-col rounded-2xl border border-brand-line bg-brand-surface p-5 md:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-accent/5 text-brand-accent">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-[18px] font-bold text-brand-ink md:text-[19px]">{club.name}</p>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-brand-ink-muted md:text-[15px]">{club.desc}</p>

            <ul className="mt-4 space-y-1.5">
              {club.schedule.map((row) => (
                <li key={row.join()} className="flex flex-wrap gap-1.5">
                  {row.map((chip) => (
                    <span key={chip} className="rounded-lg bg-brand-subtle px-2.5 py-1 text-[13px] font-bold text-brand-ink">
                      {chip}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 text-[13px] text-brand-ink-muted md:text-[14px]">
              <div className="flex gap-2">
                <dt className="flex shrink-0 items-center gap-1 font-bold text-brand-ink">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  장소
                </dt>
                <dd>{club.place}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="flex shrink-0 items-center gap-1 font-bold text-brand-ink">
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  대상
                </dt>
                <dd>{club.target}</dd>
              </div>
            </dl>

            {/* 신청 링크가 오면 `applyHref` — 원고·현행 사이트 모두 없어 "준비 중" (사용자 지시) */}
            <div className="mt-auto pt-5">
              {club.applyHref ? (
                <ExternalButton href={club.applyHref} label="동호회 신청하기" primary />
              ) : (
                <span
                  aria-disabled="true"
                  className="btn-round inline-flex cursor-not-allowed items-center gap-1.5 border border-brand-line bg-brand-subtle px-4 py-2.5 text-[13px] font-bold text-brand-ink-muted"
                >
                  동호회 신청하기
                  <span className="text-[11px] font-medium">준비 중</span>
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ExternalButton({
  href,
  label,
  icon: Icon,
  primary,
}: {
  href: string;
  label: string;
  icon?: LucideIcon;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        primary
          ? 'btn-round inline-flex items-center gap-1.5 bg-brand-accent px-4 py-2.5 text-[13px] font-bold text-white transition-colors duration-200 hover:bg-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2'
          : 'btn-round inline-flex items-center gap-1.5 border border-brand-line bg-brand-surface px-4 py-2.5 text-[13px] font-bold text-brand-ink transition-colors duration-200 hover:border-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2'
      }
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden />}
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">(새 창으로 열림)</span>
    </a>
  );
}
