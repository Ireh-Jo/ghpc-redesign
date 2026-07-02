import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * 새가족 환영 — 다크 임팩트 섹션 + 1차/2차 CTA.
 * 상세: context/components/content/welcome-cta.md
 */
export function WelcomeCTA({
  eyebrow,
  title,
  body,
  imageSrc,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  imageSrc: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
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
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-brand-ink/70" />
      <div className="relative mx-auto w-full max-w-container px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="mb-6 text-[11px] font-bold tracking-[0.5em] text-brand-support md:text-xs">{eyebrow}</p>
          <h2 className="display-xl mb-6 md:mb-8">{title}</h2>
          <p className="mb-10 max-w-xl text-base leading-relaxed text-white/75 md:text-xl">{body}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={primaryHref}
              className="btn-square inline-flex items-center gap-2 bg-brand-accent px-7 py-4 text-sm font-bold tracking-widest text-white transition-colors hover:bg-white hover:text-brand-ink"
            >
              {primaryLabel} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="btn-square inline-flex items-center gap-2 border border-white/40 px-7 py-4 text-sm font-bold tracking-widest text-white transition-colors hover:bg-white/10"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
