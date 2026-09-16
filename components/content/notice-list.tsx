import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { FadeIn } from '@/components/layout/fade-in';
import type { Notice } from '@/lib/notices';

/**
 * 메인 공지사항 — 제목만 나열하는 4줄 목록 (관리자 영역).
 * 근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai`·`… 모바일.ai` (2026-09-16).
 * 데이터: `lib/notices.ts` (Supabase `posts` 이관 예정) · 상세: context/components/content/notice-list.md
 *
 * 시안에는 날짜가 없다 — 데이터에 `date`가 있으면 오른쪽에 보조로 붙이고, 없으면 제목만 렌더한다.
 * 시안 모바일에만 있던 어두운 알약 버튼은 "더보기"로 확정하고 PC에도 같이 뒀다 (전체 목록 진입점이 없으면 막다른 길).
 */
export function NoticeList({
  notices,
  moreHref = '/church-admin/notice',
}: {
  notices: Notice[];
  /** "더보기"가 향할 전체 목록 */
  moreHref?: string;
}) {
  if (notices.length === 0) return null;

  return (
    <section className="bg-brand-bg py-16 md:py-24">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="— 이번주"
            title="공지사항"
            rule
            action={
              <Link
                href={moreHref}
                className="btn-round inline-flex items-center gap-1.5 bg-brand-ink px-4 py-2.5 text-[13px] font-bold text-white transition-colors duration-200 hover:bg-brand-accent"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                더보기
              </Link>
            }
          />
        </FadeIn>

        <FadeIn delay={80}>
          <ul>
            {notices.map((notice) => (
              <li key={notice.id} className="relative border-b border-brand-line">
                <Link
                  href={notice.href}
                  className="group flex items-center gap-4 py-5 transition-colors duration-200 md:py-6"
                >
                  {/* 아래 선이 왼쪽에서 accent로 덧그어진다 (색 채우기 계열 · 06-motion 등재) */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-[2px] origin-left scale-x-0 bg-brand-accent transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:hidden"
                  />
                  {/* 모바일은 긴 제목을 두 줄까지 풀어 준다 — 잘라 버리면 무슨 공지인지 알 수 없다 */}
                  <span className="line-clamp-2 min-w-0 flex-1 text-[16px] font-bold text-brand-ink transition-colors duration-200 group-hover:text-brand-accent md:truncate md:text-[17px]">
                    {notice.title}
                  </span>
                  {notice.date && (
                    <span className="shrink-0 text-[13px] text-brand-ink-muted">{notice.date}</span>
                  )}
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-brand-accent opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
      </Container>
    </section>
  );
}
