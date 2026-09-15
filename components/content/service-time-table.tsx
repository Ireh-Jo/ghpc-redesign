import type { ServiceTable } from '@/lib/worship-services';

/**
 * 예배·모임 시간표. 데스크탑은 표, 모바일(md 미만)은 카드 목록으로 **다른 마크업**을 렌더한다.
 * 시안을 375px에 그대로 압축하면 본문이 10~11px까지 떨어지기 때문 (검토서 §3-2).
 * 스펙: `context/components/content/service-time-table.md`
 */
export function ServiceTimeTable({ table }: { table: ServiceTable }) {
  const { title, columns, groups, rows, note } = table;
  const [head, ...rest] = columns;
  const cell = (row: Record<string, string>, key: string) => row[key]?.trim() || '—';

  return (
    <div>
      <h3 className="mb-4 text-[18px] font-bold text-brand-ink md:mb-5 md:text-[22px]">{title}</h3>

      {/* 데스크탑 — 표 */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse border-t-2 border-brand-ink text-center text-[15px]">
          <thead>
            {groups && (
              <tr className="bg-brand-bg">
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
            <tr className="bg-brand-bg">
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
                className="transition-colors duration-200 hover:bg-brand-bg/60"
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
