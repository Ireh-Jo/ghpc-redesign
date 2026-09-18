import { ArrowUpRight } from 'lucide-react';
import type { ServiceTable } from '@/lib/worship-services';

/**
 * 예배·모임 시간표. 데스크탑은 표, 모바일(md 미만)은 카드 목록으로 **다른 마크업**을 렌더한다.
 * 시안을 375px에 그대로 압축하면 본문이 10~11px까지 떨어지기 때문 (검토서 §3-2).
 * 스펙: `context/components/content/service-time-table.md`
 *
 * ── 2026-09-18 예배 시안 반영 ──
 * - 제목 오른쪽에 **바로가기 버튼**(`table.links`) — 네이버 카페 등 외부 링크
 * - 제목 레벨을 `headingLevel`로 고를 수 있다. 섹션 h2를 숨긴 화면(`SubPage`의 `bareSections`)에서는
 *   이 제목이 그 섹션의 h2가 돼야 제목 계층이 안 끊긴다
 * - **표 자체는 시안 그대로** — 상단 굵은 선 + 각진 셀. (전역 라운드 언어의 예외: 표는 심플하게 간다.
 *   2026-09-18에 라운드 카드로 바꿨다가 사용자 지시로 원복)
 */
export function ServiceTimeTable({
  table,
  headingLevel = 'h3',
}: {
  table: ServiceTable;
  headingLevel?: 'h2' | 'h3';
}) {
  const { title, columns, groups, rows, note, links } = table;
  const [head, ...rest] = columns;
  const cell = (row: Record<string, string>, key: string) => row[key]?.trim() || '—';
  const Heading = headingLevel;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 md:mb-5">
        <Heading className="text-[20px] font-bold text-brand-ink md:text-[26px]">{title}</Heading>
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

      {/* 데스크탑 — 표. 시안(2026-09-15·18)이 상단 굵은 선 + 각진 표라 그 형태를 유지한다.
         2026-09-18에 라운드 카드로 바꿔 봤지만 "시안대로 심플하게"로 되돌렸다 (사용자 지시). */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse border-t-2 border-brand-ink text-center text-[15px]">
          <thead>
            {groups && (
              <tr className="bg-brand-subtle">
                {groups.map((group, i) => (
                  <th
                    key={`${group.label}-${i}`}
                    scope={group.span > 1 ? 'colgroup' : 'col'}
                    colSpan={group.span}
                    className="border-b border-l border-brand-line px-4 py-3 font-bold tracking-[0.15em] text-brand-ink first:border-l-0"
                  >
                    {group.label}
                  </th>
                ))}
              </tr>
            )}
            <tr className="bg-brand-subtle">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="border-b border-l border-brand-line px-4 py-3 font-bold tracking-[0.3em] text-brand-ink first:border-l-0"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={cell(row, head.key)}
                className="transition-colors duration-200 hover:bg-brand-subtle/60"
              >
                <th
                  scope="row"
                  className="border-b border-brand-line px-4 py-3.5 font-medium text-brand-ink"
                >
                  {cell(row, head.key)}
                </th>
                {rest.map((column) => (
                  <td
                    key={column.key}
                    className="border-b border-l border-brand-line px-4 py-3.5 text-brand-ink"
                  >
                    {cell(row, column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 — 카드 목록 */}
      <ul className="grid gap-px border-y border-brand-line bg-brand-line md:hidden">
        {rows.map((row) => (
          <li key={cell(row, head.key)} className="bg-brand-surface px-4 py-4">
            <p className="text-[15px] font-bold text-brand-ink">{cell(row, head.key)}</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[14px]">
              {rest.map((column, i) => (
                <div key={column.key} className="contents">
                  <dt className="text-brand-ink-muted">
                    {groupLabelFor(groups, i + 1)}
                    {column.label}
                  </dt>
                  <dd className="text-brand-ink">{cell(row, column.key)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {note && <p className="mt-3 text-[13px] leading-relaxed text-brand-ink-muted">{note}</p>}
    </div>
  );
}

/**
 * 모바일 카드에서는 2단 헤더를 펼칠 수 없으므로 그룹명을 라벨 앞에 붙인다.
 * (`예배 시간` / `성경공부 · 모임 시간`)
 */
function groupLabelFor(groups: ServiceTable['groups'], columnIndex: number) {
  if (!groups) return '';
  let cursor = 0;
  for (const group of groups) {
    if (columnIndex < cursor + group.span) return group.label ? `${group.label} ` : '';
    cursor += group.span;
  }
  return '';
}
