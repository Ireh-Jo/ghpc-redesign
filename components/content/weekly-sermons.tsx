'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { FadeIn } from '@/components/layout/fade-in';
import type { ArchiveVideo } from '@/lib/worship-videos';

/**
 * 메인 "말씀" 섹션 — 최근 설교 3편.
 * 근거 시안: 디자인팀 `홈페이지 메인 디자인 전달용.ai`·`… 모바일.ai` (2026-09-16).
 * 상세: context/components/content/weekly-sermons.md
 *
 * - PC는 3열 그리드, 모바일은 시안대로 **한 장씩 스냅 스크롤 + 좌우 원형 버튼**.
 *   DOM은 하나만 두고(`flex … md:grid`) 스크롤 컨테이너를 md에서 해제한다 — 스크린리더가 두 번 읽지 않도록.
 * - 자동 재생(오토 슬라이드)은 하지 않는다 (`context/design/06-motion.md` 금지 항목).
 * - 썸네일은 **16:9**다. 시안 카드는 1.46:1이었는데 유튜브 썸네일을 그 비율에 담으면 원본의
 *   검은 띠가 남는다 — 영상 비율에 맞추는 쪽이 깔끔해서 16:9로 갔다 (2026-09-16).
 * - 카드는 유튜브 원본으로 나간다 (`SermonCard`와 같은 동작). 사이트 안에서 이어 보려는 사람을 위해
 *   머리 오른쪽에 `/worship#live`(예배 실황 아카이브) 링크를 따로 뒀다 — 시안에 없는 추가분.
 */
/**
 * 썸네일 한 장.
 * 유튜브 `hqdefault`는 4:3이라 **위아래에 검은 여백**이 들어간다 (2026-09-16 사용자 지적).
 * 16:9 원본인 `maxresdefault`를 먼저 쓰고, 없는 영상(저화질 업로드)만 `hqdefault`로 내려간다.
 * 이때는 컨테이너가 16:9라 `object-cover`가 검은 띠를 정확히 잘라낸다 (4:3 → 16:9 크롭 = 상하 12.5%씩).
 */
function Thumbnail({ videoId }: { videoId: string }) {
  const [fallback, setFallback] = useState(false);
  return (
    <Image
      src={`https://i.ytimg.com/vi/${videoId}/${fallback ? 'hqdefault' : 'maxresdefault'}.jpg`}
      alt=""
      fill
      sizes="(min-width: 768px) 380px, 100vw"
      onError={() => setFallback(true)}
      className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
    />
  );
}

export function WeeklySermons({
  sermons,
  eyebrow = '— 이번주',
  title = '말씀',
  lead = '실시간으로 어디서든 예배의 자리에 함께 하세요',
}: {
  sermons: ArchiveVideo[];
  eyebrow?: string;
  title?: string;
  lead?: string;
}) {
  const scroller = useRef<HTMLUListElement>(null);

  /** 모바일 캐러셀 — 카드 한 장 너비만큼 이동 */
  const scrollByCard = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth) + 20), behavior: 'smooth' });
  };

  return (
    <section className="bg-brand-bg py-16 md:py-24">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            lead={lead}
            action={
              <Link
                href="/worship#live"
                className="link-wipe hidden items-center gap-1.5 text-[13px] font-bold tracking-wide text-brand-ink-muted transition-colors duration-200 hover:text-brand-accent md:inline-flex"
              >
                지난 예배 다시보기 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
        </FadeIn>

        <ul
          ref={scroller}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-12 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {sermons.map((sermon, i) => (
            <li key={sermon.videoId} className="w-full shrink-0 snap-center md:w-auto">
              <FadeIn delay={i * 80}>
                <a
                  href={`https://www.youtube.com/watch?v=${sermon.videoId}`}
                  target="_blank"
                  rel="noopener"
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-4"
                >
                  <span className="relative block aspect-video overflow-hidden rounded-2xl bg-brand-accent shadow-sm transition-shadow duration-200 group-hover:shadow-md">
                    <Thumbnail videoId={sermon.videoId} />
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center bg-brand-ink/15 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-surface/90">
                        <Play className="ml-0.5 h-5 w-5 fill-brand-ink text-brand-ink" />
                      </span>
                    </span>
                  </span>

                  <span className="mt-4 block text-[13px] text-brand-ink-muted md:mt-5">
                    {sermon.date}
                    {sermon.scripture && ` · ${sermon.scripture}`}
                  </span>
                  <span className="mt-1.5 block text-[19px] font-bold leading-snug text-brand-ink transition-colors duration-200 group-hover:text-brand-accent md:text-[21px]">
                    {sermon.title}
                  </span>
                  {sermon.speaker && (
                    <span className="mt-1.5 block text-[14px] text-brand-ink-muted">
                      {sermon.speaker}
                    </span>
                  )}
                </a>
              </FadeIn>
            </li>
          ))}
        </ul>

        {/* 모바일 전용 좌우 버튼 — 시안의 회색 원형 2개 */}
        <div className="mt-6 flex items-center justify-end gap-3 md:hidden">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="이전 설교"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-line text-brand-ink transition-colors duration-200 hover:bg-brand-accent hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="다음 설교"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-line text-brand-ink transition-colors duration-200 hover:bg-brand-accent hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <Link
          href="/worship#live"
          className="link-wipe mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-brand-ink-muted md:hidden"
        >
          지난 예배 다시보기 <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Container>
    </section>
  );
}
