import { cn } from '@/lib/utils';

/**
 * 섹션 머리 — 아이브로우 + 큰 제목 (+ 옆에 붙는 리드 문구 / 오른쪽 액션).
 * 근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai` (2026-09-16) — 말씀·공지사항·새가족이 같은 형태다.
 * 상세: context/components/layout/section-header.md
 *
 * 시안의 리드("실시간으로 어디서든…")는 제목 **오른쪽 아래 baseline**에 붙는다.
 * 모바일에서는 그 자리가 없어 제목 아래로 내린다 (시안 모바일도 같은 처리).
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  rule = false,
  className,
}: {
  /** 예: `— 이번주` (대시 포함해서 넘긴다) */
  eyebrow?: string;
  title: string;
  /** 제목 옆에 붙는 한 줄 설명 */
  lead?: string;
  /** 오른쪽 끝 액션 (더보기 링크 등) */
  action?: React.ReactNode;
  /** 제목 아래 굵은 구분선 (공지사항 섹션) */
  rule?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      {eyebrow && (
        <p className="mb-2 text-[13px] text-brand-ink-muted md:mb-3 md:text-sm">{eyebrow}</p>
      )}

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <h2 className="text-[38px] font-extrabold leading-none tracking-tight text-brand-ink md:text-[56px]">
            {title}
          </h2>
          {lead && (
            <p className="text-[15px] leading-relaxed text-brand-ink-muted md:text-base">{lead}</p>
          )}
        </div>
        {action && <div className="ml-auto shrink-0">{action}</div>}
      </div>

      {rule && <div className="mt-5 h-[2px] w-full bg-brand-ink md:mt-6" />}
    </div>
  );
}
