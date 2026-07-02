/**
 * 다크 표어 배너 — 큰 인용 카피 + 배경 이미지(solid 오버레이).
 * 상세: context/components/content/campaign-banner.md
 */
export function CampaignBanner({
  eyebrow,
  quote,
  verseRef,
  imageSrc,
}: {
  eyebrow: string;
  quote: React.ReactNode;
  verseRef: string;
  imageSrc: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-ink py-24 text-white md:py-40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-brand-ink/70" />
      <div className="relative mx-auto w-full max-w-container px-5 text-center md:px-8">
        <p className="mb-6 text-[11px] font-bold tracking-[0.5em] text-brand-support md:mb-8 md:text-xs">{eyebrow}</p>
        <h2 className="display-lg mx-auto mb-6 max-w-5xl md:mb-8">{quote}</h2>
        <p className="text-base text-white/65 md:text-xl">{verseRef}</p>
      </div>
    </section>
  );
}
