import { cn } from '@/lib/utils';

/**
 * 메인 헤로 — 다크 풀블리드 영상/이미지 + 헤드라인 + 예배시간 바.
 * 상세: context/components/content/hero-video.md
 */
export type HeroServiceTime = {
  label: string;
  time: string;
  /** LIVE 펄스 도트 표시 (다음 예배 등 강조 1개만) */
  emphasize?: boolean;
  /** 좁은 화면에서 숨김(공간 우선순위 낮은 항목) */
  hideOnMobile?: boolean;
};

export function HeroVideo({
  eyebrow,
  title,
  subtitle,
  verse,
  verseRef,
  videoSrc,
  posterSrc,
  mobileImageSrc,
  mobileImageAlt,
  serviceTimes,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  verse: string;
  verseRef: string;
  videoSrc: string;
  posterSrc: string;
  mobileImageSrc: string;
  mobileImageAlt: string;
  serviceTimes: HeroServiceTime[];
}) {
  return (
    <section className="relative flex h-[100svh] max-h-[1000px] min-h-[640px] flex-col overflow-hidden bg-brand-ink md:h-screen">
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        poster={posterSrc}
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      {/* 모바일 — 데이터/배터리 고려해 정지 이미지 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={mobileImageSrc} alt={mobileImageAlt} className="absolute inset-0 h-full w-full object-cover md:hidden" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/35 via-brand-ink/55 to-brand-ink/95" />

      <div className="relative mx-auto w-full max-w-container px-5 pt-24 md:px-8 md:pt-32">
        <p className="text-[11px] font-medium tracking-[0.4em] text-white/70 md:text-xs">{eyebrow}</p>
      </div>

      <div className="relative mx-auto flex w-full max-w-container flex-1 flex-col justify-center px-5 text-white md:px-8">
        <h1 className="display-xl mb-2 text-white md:mb-3">{title}</h1>
        <p className="display-md mb-8 font-light text-white/85 md:mb-10">{subtitle}</p>
        <p className="max-w-md text-[15px] leading-relaxed text-white/70 md:text-lg">
          &ldquo;{verse}&rdquo;
          <br className="hidden md:block" />
          <span className="text-white/50">— {verseRef}</span>
        </p>
      </div>

      <div className="relative w-full border-t border-white/15 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-container grid-cols-3 gap-3 px-5 py-4 text-white md:grid-cols-5 md:gap-6 md:px-8 md:py-5">
          {serviceTimes.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                'leading-tight',
                i === 0 && 'flex items-center gap-3 md:col-span-2',
                s.hideOnMobile && 'hidden md:block'
              )}
            >
              {i === 0 && (
                <span className="relative mt-0.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-brand-support opacity-75" />
                  <span className="relative inline-flex h-2 w-2 bg-brand-support" />
                </span>
              )}
              <div>
                <p className="text-[10px] font-medium tracking-[0.3em] text-white/55">{s.label}</p>
                <p className="text-sm font-bold md:text-base">{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
