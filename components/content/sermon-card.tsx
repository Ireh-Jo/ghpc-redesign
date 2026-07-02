import { ArrowRight, ArrowUpRight, Play } from 'lucide-react';

/**
 * "이번 주 말씀" 섹션 — 메인 설교 1편(영상) + 지난 설교 리스트.
 * 상세: context/components/content/sermon-card.md
 */
export type PastSermon = { date: string; title: string; preacher: string };

export function SermonCard({
  youtubeUrl,
  featuredWatchUrl,
  featuredThumbnailSrc,
  featuredMeta,
  featuredTitle,
  featuredPreacher,
  pastSermons,
}: {
  youtubeUrl: string;
  featuredWatchUrl: string;
  featuredThumbnailSrc: string;
  featuredMeta: string;
  featuredTitle: string;
  featuredPreacher: string;
  pastSermons: PastSermon[];
}) {
  return (
    <section className="bg-brand-bg py-20 md:py-28">
      <div className="mx-auto w-full max-w-container px-5 md:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <p className="mb-4 text-[11px] font-bold tracking-[0.4em] text-brand-accent md:text-xs">— 이번 주</p>
            <h2 className="display-lg">
              이번 주
              <br />
              말씀.
            </h2>
          </div>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.25em] text-brand-ink transition-colors hover:text-brand-accent"
          >
            전체 설교 <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <a href={featuredWatchUrl} target="_blank" rel="noopener" className="group block md:col-span-8">
            <div className="relative mb-6 aspect-video overflow-hidden bg-brand-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredThumbnailSrc}
                alt="이번 주 설교 썸네일 (임시)"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-95 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="btn-square flex h-[68px] w-[68px] items-center justify-center bg-brand-accent transition-transform group-hover:scale-110">
                  <Play className="h-7 w-7 text-white" style={{ marginLeft: 3 }} />
                </div>
              </div>
              <span className="btn-square absolute left-4 top-4 bg-brand-surface px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-brand-ink">
                주일 · 대예배
              </span>
            </div>
            <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-brand-ink-muted">{featuredMeta}</p>
            <h3 className="display-md mb-3 transition-colors group-hover:text-brand-accent">{featuredTitle}</h3>
            <p className="text-base text-brand-ink-muted">{featuredPreacher}</p>
          </a>

          <div className="flex flex-col md:col-span-4">
            <p className="mb-5 border-b-2 border-brand-ink pb-3 text-[11px] font-bold tracking-[0.4em] text-brand-ink-muted md:text-xs">
              — 지난 설교
            </p>
            {pastSermons.map((s) => (
              <a
                key={`${s.date}-${s.title}`}
                href={youtubeUrl}
                target="_blank"
                rel="noopener"
                className="group -mx-2 block border-b border-brand-line px-2 py-5 transition-colors hover:bg-brand-surface"
              >
                <p className="mb-2 text-[10px] font-bold tracking-[0.3em] text-brand-ink-muted">{s.date}</p>
                <h4 className="mb-1.5 whitespace-pre-line text-lg font-bold leading-snug transition-colors group-hover:text-brand-accent">
                  {s.title}
                </h4>
                <p className="text-sm text-brand-ink-muted">{s.preacher}</p>
              </a>
            ))}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener"
              className="mt-5 inline-flex items-center gap-2 self-start text-[12px] font-bold tracking-[0.25em] text-brand-accent"
            >
              더보기 <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
